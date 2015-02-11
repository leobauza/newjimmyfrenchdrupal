(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Svg = Flyweight.Module.extend({

    name: 'Sample',
    el: '.site__hero',
    debug: true,

    initialize: function () {

      var $hero = $('.site__hero'),
          $path = $('.site__hero path').get(0),
          length = $path.getTotalLength();

      if (!$path) { return; }

      console.log($path);
      // Set up the starting positions
      $path.style.strokeDasharray = length + ' ' + length;
      $path.style.strokeDashoffset = length;

      // Trigger a layout so styles are calculated & the browser
      // picks up the starting position before animating
      $path.getBoundingClientRect();

      // Go!
      $hero.addClass('animate');
      $path.style.transition = $path.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
      $path.style.strokeDashoffset = '0';

    },

    onDelegated: function (e) {

    },

    test: function (e) {
      var _this = e.data.context;
      _this.msg("click svg");
    },

    events: {
      'click svg' : 'test'
    }

  });

  module.exports = new Svg();

})(jQuery);