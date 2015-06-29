(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Svg = Flyweight.Module.extend({

    name: 'Svg',
    el: '.site__hero',

    initialize: function () {
      var $hero = $(this.el),
          $paths = $(this.el + ' path');

      if (!$paths) { return; }

      // potentially going to need to
      // make this happen after hero image
      // has loaded...
      // https://github.com/desandro/imagesloaded
      // or lazy load the hero image
      // also create load bar at the top...
      this.prepare($paths, $hero);

    },

    prepare: function ($paths, $hero) {

      var _this = this,
          count = $paths.length;

      $.each($paths, function (k, v) {
        var length = v.getTotalLength();

        // Set up the starting positions
        v.style.strokeDasharray = length + ' ' + length;
        v.style.strokeDashoffset = length;

        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        v.getBoundingClientRect();

        if (k + 1 === count) {
          $hero.addClass('animate');
          _this.draw($paths, $hero, count);
        }

      });


    },

    draw: function ($paths, $hero, count) {
      $.each($paths, function (k, v) {
        // console.log(k); // 1293 paths!!!
        // Go!
        v.style.transition = v.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
        v.style.strokeDashoffset = '0';

      });

      setTimeout(function () {
        $hero.addClass('finished');
      }, 2000);

    },

    events: {}

  });

  module.exports = Svg;

})(jQuery);
