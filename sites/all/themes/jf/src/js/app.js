/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */

"use strict";

var Flyweight, Svg, Forms, Router, Navigation;

if (typeof require === 'function') {
  Flyweight = require('./libs/flyweight.js');
  Svg = require('./modules/svg');
  Forms = require('./modules/forms');
  Navigation = require('./modules/navigation');
}

var svg = new Svg(),
    forms = new Forms();

Router = Flyweight.Router.extend({
    routes: {
      '*any': 'any',
      'about': 'about'
    },

    any: function () {
      //get the page if you are not ON the page
      console.log("run standard page change code?");
    },

    about: function () {
      console.log("specific code for about page");
    }

  });

  var router = new Router();

  Flyweight.history.start({
    router: router
  });

  if (Flyweight.history._usePushState) {
    var nav = new Navigation();
  }

  // jQuery('.info__toggle').click(function (e) {
  //   e.preventDefault();
  //   var href = jQuery(this).attr('href');
  //   Flyweight.history.navigate(href, { trigger: true });
  // });

  // $('h1').click(function (e) {
  //   Flyweight.history.navigate('foo/bar/', {trigger: true});
  // });
