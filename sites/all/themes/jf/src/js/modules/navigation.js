(function ($) {

  "use strict";

  var Flyweight = require('../libs/flyweight');

  var Navigation = Flyweight.Module.extend({

    name: 'Navigation',
    // el: '.site__hero',
    debug: true,

    initialize: function () {

      var self = this;

      this.baseUrl = window.location.protocol + "//" + window.location.host + '/';

      this.where = Flyweight.history.getFragment();
      this.cache = false;

      this.markIgnored(['.nav-tabs a', '#admin-menu a', '.nav__toggle']);

      // window.addEventListener('popstate', function (e) {
      //   self.loadPage.apply(self, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        console.log(e);
        self.browserEvent.apply(self, [e]);
      });

    },

    pageChange: function (href, where) {

      var self = this,
          route = where.split('/')[0];

      $('body').addClass('loading');

      // Request New Page
      $.get(this.baseUrl + href, function (data) {

        var $data = $(data),
            $incomingMain = $data.filter('.main-content'),
            $original = $('.main-content'),
            $clone = $('.main-content').clone().addClass('inverse-next').html($incomingMain.html()),
            T = 750;

        // Add the clone after and add class to slide current out
        $original.after($clone).addClass('prepare');

        // change class for internal pages on incoming page
        if (route === 'project') {
          $clone.addClass('-internal');
        } else {
          $clone.removeClass('-internal');
        }

        // Delay slide-in for CSS animation to work
        var slideClassesTimeout = setTimeout(function () {
          $clone.addClass('slide-in');
          $original.addClass('inverse-slide-out');
        }, 100);

        // Delay pageChange event until after CSS animation finishes (_site.scss)
        var pageChangeTimeout = setTimeout(function () {
          $original.remove();
          $clone.removeClass('inverse-next slide-in');
          // Tell the router when the page actually changes (not just the url in popstate)
          $(document).trigger('pageChange', {
            // html: $main.html(),
            route: route
          });
        }, T);

        // set cache to determine direction
        self.cache = self.where;
        // set location on Navigation object
        self.where = where;
        Flyweight.history.navigate(href, { trigger: true });

      }, 'html');

    },

    // click only
    processClick: function (e) {

      if ($(this).hasClass('-ignored')) { return; }

      e.preventDefault();
      var self = e.data.context,
          href = $(this).attr('href'),
          where = Flyweight.history.getFragment(href);

      if (self.where === where) { return; }

      self.pageChange(href, where);

    },

    // browser buttons
    browserEvent: function (e) {
      console.log("browser event on SAFARI PAGE LOAD");
      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          self = this;

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