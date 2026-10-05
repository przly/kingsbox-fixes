// Entry for /about-module/. Import order mirrors the production bundles:
// vendor.js (globals) -> scripts/01_default.js -> components/**/*.js
import './vendor-globals';
import './about-globals';
import './cookie-globals';
import './default-excerpt';
import '../source/components/01-atoms/mod-counter/mod-counter';
import '../source/components/02-molecules/card/card';
import '../source/components/03-modules/about-module/about-module';
import '../source/components/02-molecules/advance-cookie-banner/advance-cookie-banner';
