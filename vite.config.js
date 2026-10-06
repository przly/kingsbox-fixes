import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sass from 'sass';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));
const bundlePath = resolve(root, 'source/css/bundle.css');

const findScss = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return findScss(path);
      return entry.name.endsWith('.scss') ? [path] : [];
    });

// Mirrors config/css.config.js from the Kingsbox repo: style.scss and every component .scss are
// compiled on their own and concatenated into one bundle.css. Vite's own Sass pipeline is not used
// because it rewrites url() paths, which breaks the inline SVG icons and the font paths.
const buildCss = () => {
  const files = [resolve(root, 'source/scss/style.scss'), ...findScss(resolve(root, 'source/components'))];
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

export default defineConfig({
  plugins: [kingsboxCss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        'about-module': resolve(root, 'about-module/index.html'),
        'section-header': resolve(root, 'section-header/index.html'),
      },
    },
  },
  server: {
    port: 3020,
    open: true,
  },
});
