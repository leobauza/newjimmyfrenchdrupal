(function ($) {

  "use strict";

  var Flyweight = require('../libs/flyweight');

  var Banner = Flyweight.Module.extend({

    name: 'Banner',
    initialize: function () {

      var self = this;
      if ($('.banner').length) {
        self.state = 1; // only if it exists!!!
      } else {
        self.state = 0;
      }

    },
    closeBanner: function (e) {

      if (typeof e === 'object') {
        e.preventDefault();
      }

      var self = (typeof e === 'object')? e.data.context : this;

      $('body').removeClass('banner-on');
      $('.banner').addClass('closed');

      self.state = 0;

    },
    events: {
      'click .banner .dismiss': 'closeBanner'
    }

  });

  module.exports = Banner;

})(jQuery);
