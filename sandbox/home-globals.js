// Globals the full homepage scripts expect on top of vendor-globals.js.
// Stands in for the rest of the gulp `vendor.js` bundle and for the inline `localData` script of _preview.twig.
import axios from 'axios';
import * as countUp from 'countup.js';
import Cookies from 'js-cookie';
import scrollToSmooth from 'scrolltosmooth';
import easeInOutCubic from 'scrolltosmooth/easings/easeInOutCubic';
import Swiper from 'swiper/bundle';
import { Fancybox } from '@fancyapps/ui';

// Lenis is left out on purpose, as on the other sandbox pages: the page uses the browser's own scroll.
// source/scripts/01_default.js still calls `new Lenis()`, so it gets an empty class.
class Lenis {}

// Data faking for local development
const localData = { siteURL: '', apiURL: '', id: '', lang: '', starterVer: '', captchaSiteKey: '' };

Object.assign(window, { axios, countUp, Cookies, scrollToSmooth, easeInOutCubic, Swiper, Fancybox, Lenis, localData });
