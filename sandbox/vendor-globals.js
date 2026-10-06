// Stands in for the gulp `vendor.js` bundle, which exposes these libraries as globals.
// Only the ones the hero needs are included.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Splitting from 'splitting';

gsap.registerPlugin(ScrollTrigger, CustomEase);

Object.assign(window, { gsap, ScrollTrigger, CustomEase, Splitting });
