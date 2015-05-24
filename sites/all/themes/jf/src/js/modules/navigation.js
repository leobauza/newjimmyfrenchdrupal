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

      this.markIgnored(['.nav-tabs a', '#admin-menu a']);

      // window.addEventListener('popstate', function (e) {
      //   _this.loadPage.apply(_this, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        _this.browserEvent.apply(_this, [e]);
      });

    },

    pageChange: function (href, where) {

      var _this = this,
          route = where.split('/')[0];

      $('body').addClass('loading');
      $.get(this.baseUrl + href, function (data) {

        var $data = $(data);
        var $main = $data.filter('.main-content');

        // control replacing the main content from the router
        $(document).trigger('pageChange', {
          html: $main.html(),
          route: route
        });

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });

      }, 'html');

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

      _this.pageChange(href, where);

    },

    // browser buttons
    browserEvent: function (e) {

      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          _this = this;

      this.pageChange(href, where);

    },

    markIgnored: function (selectors) {
      // find all links that should'd be ajaxyfied
      setTimeout(function () {
        $.each(selectors, function (i, selector) {
          $(selector).addClass('-ignored');
        });
      }, 1000); // find a better way to wait for the admin menu to load...

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