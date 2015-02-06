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