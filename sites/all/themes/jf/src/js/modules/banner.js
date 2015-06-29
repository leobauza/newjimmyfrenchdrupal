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

      var self = (typeof e === 'object')? e.data.context : this,
          $banner = $('.banner'),
          height = $banner.height();

      $('body').removeClass('banner-on');

      $banner.css({
        'margin-top': -(height) + 'px'
      });

      setTimeout(function () {
        $banner.remove();
      }, 550); // remove in case of resize

      self.state = 0;

    },
    events: {
      'click .banner .dismiss': 'closeBanner'
    }

  });

  module.exports = Banner;

})(jQuery);
