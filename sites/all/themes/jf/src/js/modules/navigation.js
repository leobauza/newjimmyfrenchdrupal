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

      this.where = Flyweight.history.getFragment();

      this.markIgnored([
        '.nav-tabs a'
      ]);

      window.addEventListener('popstate', function (e) {
        _this.loadPage.apply(_this, [e]);
      }, false);

    },

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

      $.get(href, function (data) {
        // do stuff...
        // console.log("this works");

        // then navigate
        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });
      });

    },

    loadPage: function (e) {
      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          _this = this;

      // console.log("i am going to:", where);
      // console.log("i am at:", this.where);

      $.get(href, function (data) {

        // do stuff...
        // console.log(data);

        // then navigate
        _this.where = where;
      });

    },

    markIgnored: function (selectors) {
      // find all links that should'd be ajaxyfied
      $.each(selectors, function (i, selector) {
        $(selector).addClass('-ignored');
      });
    },

    onDelegated: function (e) {
      // hi
    },

    // test: function (e) {
    //   console.log(this);
    //   console.log("test");
    // },

    events: {
      'click a' : 'processClick'
    }

  });

  module.exports = Navigation;

})(jQuery);