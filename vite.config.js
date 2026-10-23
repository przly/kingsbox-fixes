import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sass from 'sass';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const bundlePath = resolve(root, 'source/css/bundle.css');
const jsBundleId = 'virtual:kingsbox-bundle';

const findFiles = (dir, extension) =>
  readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return findFiles(path, extension);
      return entry.name.endsWith(extension) ? [path] : [];
    });

// Mirrors config/css.config.js from the Kingsbox repo: style.scss and every component .scss are
// compiled on their own and concatenated into one bundle.css. Vite's own Sass pipeline is not used
// because it rewrites url() paths, which breaks the inline SVG icons and the font paths.
const buildCss = () => {
  const files = [resolve(root, 'source/scss/style.scss'), ...findFiles(resolve(root, 'source/components'), '.scss')];
  const css = files.map((file) => sass.compile(file, { logger: sass.Logger.silent }).css).join('\n');

  mkdirSync(dirname(bundlePath), { recursive: true });
  writeFileSync(bundlePath, css);
};

const kingsboxCss = () => ({
  name: 'kingsbox-css',
  buildStart() {
    buildCss();
  },
  configureServer(server) {
    const rebuild = (file) => {
      if (!file.endsWith('.scss')) return;

      try {
        buildCss();
      } catch (error) {
        server.config.logger.error(`\n[scss] ${error.message}\n`);
      }
    };

    server.watcher.on('add', rebuild).on('change', rebuild).on('unlink', rebuild);
  },
});

// Mirrors bundle:user:js from config/task-bundle.config.js in the Kingsbox repo: source/scripts and every
// component .js are concatenated into one scope, because the files share top-level functions and constants.
// Only /home/ uses it; the other pages import the few component scripts they need one by one.
const kingsboxJs = () => ({
  name: 'kingsbox-js',
  resolveId(id) {
    return id === jsBundleId ? `\0${jsBundleId}` : null;
  },
  load(id) {
    if (id !== `\0${jsBundleId}`) return null;

    const files = [...findFiles(resolve(root, 'source/scripts'), '.js'), ...findFiles(resolve(root, 'source/components'), '.js')];
    files.forEach((file) => this.addWatchFile(file));

    return files.map((file) => readFileSync(file, 'utf8')).join('\n');
  },
  handleHotUpdate({ file, server }) {
    const bundle = server.moduleGraph.getModuleById(`\0${jsBundleId}`);
    if (!bundle || !file.endsWith('.js') || !file.startsWith(resolve(root, 'source'))) return;

    server.moduleGraph.invalidateModule(bundle);
    server.ws.send({ type: 'full-reload' });
  },
});

export default defineConfig({
  plugins: [kingsboxCss(), kingsboxJs()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        'about-module': resolve(root, 'about-module/index.html'),
        'section-header': resolve(root, 'section-header/index.html'),
        'faq-module': resolve(root, 'faq-module/index.html'),
        'wishlist-button': resolve(root, 'wishlist-button/index.html'),
        'copy-cart-link': resolve(root, 'copy-cart-link/index.html'),
        'free-shipping': resolve(root, 'free-shipping/index.html'),
        'load-more': resolve(root, 'load-more/index.html'),
        'side-cart': resolve(root, 'side-cart/index.html'),
        home: resolve(root, 'home/index.html'),
      },
    },
  },
  server: {
    port: 3020,
    open: true,
  },
});
