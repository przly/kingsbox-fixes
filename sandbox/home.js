// Entry for /home/. Import order mirrors the production bundles:
// vendor.js (globals) -> bundle.js (scripts/**/*.js + components/**/*.js, built by vite.config.js)
import './vendor-globals';
import './home-globals';
import 'virtual:kingsbox-bundle';
