/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */

"use strict";

var Svg, Forms;

if (typeof require === 'function') {
  Svg = require('./modules/svg');
  Forms = require('./modules/forms');
}

var svg = new Svg(),
    forms = new Forms();
