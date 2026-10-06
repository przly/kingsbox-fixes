// Entry for /section-header/. Import order mirrors the production bundles:
// vendor.js (globals) -> scripts/01_default.js -> components/**/*.js
import './vendor-globals';
import './cookie-globals';
import './default-excerpt';
import '../source/components/02-molecules/card/card';
import '../source/components/02-molecules/section-header/section-header';
import '../source/components/02-molecules/advance-cookie-banner/advance-cookie-banner';
