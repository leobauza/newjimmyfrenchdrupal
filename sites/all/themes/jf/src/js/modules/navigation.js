(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Navigation = Flyweight.Module.extend({

    name: 'Navigation',
    // el: '.site__hero',
    debug: true,

    initialize: function () {

      var _this = this;

      this.baseUrl = window.location.protocol + "//" + window.location.host + '/';

      this.where = Flyweight.history.getFragment();

      this.markIgnored([
        '.nav-tabs a',
        '.icon--grid'
      ]);

      // window.addEventListener('popstate', function (e) {
      //   _this.loadPage.apply(_this, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        _this.loadPage.apply(_this, [e]);
      });

    },
    // click only
    processClick: function (e) {

      if ($(this).hasClass('-ignored')) {
        return;
      }

      e.preventDefault();
      var _this = e.data.context,
          href = $(this).attr('href'),
          where = Flyweight.history.getFragment(href);

      if (_this.where === where) {
        return;
      }

      // console.log("i am going to:", where);
      // console.log("i am at:", _this.where);

      $.get(_this.baseUrl + href, function (data) {

        var $data = $(data);
        var $main = $data.filter('.main-content');

        // replace main content
        //$('.main-content').html($main.html());

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });

        $(document).trigger('clickEvent', {
          html: $main.html()
        });

      }, 'html');

    },
    // browser buttons
    loadPage: function (e) {
      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          _this = this;

      $.get(_this.baseUrl + href, function (data) {
        var $data = $(data);
        var $main = $data.filter('.main-content');
        // replace main content
        // $('.main-content').html($main.html());

        $(document).trigger('backEvent', {
          html: $main.html()
        });

        _this.where = where;
        // Flyweight.history.navigate(href, { trigger: true });
      }, 'html');

    },

    markIgnored: function (selectors) {
      // find all links that should'd be ajaxyfied
      $.each(selectors, function (i, selector) {
        $(selector).addClass('-ignored');
      });
    },

    navOverlay: function (e) {

      // console.log(e.data.context);
      var $overlay = $('.overlay'),
          $items = $('.overlay .overlay__item'),
          width = $items.width(),
          height = $items.height(),
          posX = 0,
          posY = 0,
          timeout = 0,
          bodyHeight = $('body').height();

      $overlay.height(bodyHeight);

      $.each($items, function (k, v) {
        setTimeout(function () {
          $(v).css({
            top: posY,
            left: posX
          });
          if (posX < width*2) {
            posX += width;
          } else {
            posX = 0;
            posY += height;
          }
        }, timeout);

        timeout += 100;


      });

      console.log($items.width());

    },

    onDelegated: function (e) {
      // hi
    },

    events: {
      'click a' : 'processClick',
      'click .nav__toggle' : 'navOverlay'
    }

  });

  module.exports = Navigation;

})(jQuery);
