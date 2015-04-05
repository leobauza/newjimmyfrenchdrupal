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
        '.nav-tabs a'
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
        $('.main-content').html($main.html());

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });
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
        $('.main-content').html($main.html());

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });
      }, 'html');

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

    events: {
      'click a' : 'processClick'
    }

  });

  module.exports = Navigation;

})(jQuery);