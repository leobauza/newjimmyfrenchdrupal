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
      this.transitioning = false;
      this.land = true;
      this.where = Flyweight.history.getFragment();
      this.cache = {
        count: 0,
        locs: []
      };

      this.markIgnored(['.nav-tabs a', '#admin-menu a', '.nav__toggle', '.footer__social a', '.info__social a', '.info__section a']);

      // window.addEventListener('popstate', function (e) {
      //   self.loadPage.apply(self, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        if (self.land === true) {
          self.land = false;
          return;
        }
        self.browserEvent.apply(self, [e]);
      });

    },

    /**
     * Changes the page called by processClick() or browserEvent()
     * @param  {string} href  The destination path
     * @param  {string} where The destination
     * @return {null}       null
     */
    pageChange: function (href, where) {

      var self = this,
          route = where.split('/')[0],
          transitionClasses = {
            next: 'next',
            slideOut: 'slide-out'
          };

      if (self.land === true) { self.land = false; }

      // Start Transitioning
      $('body').addClass('loading');
      self.transitioning = true;
      $('html,body').animate({ scrollTop: 0 }, 500);
      // check if destination equals previous location
      self.cache.locs[self.cache.count] = self.where; // set cache to determine direction
      if (where === self.cache.locs[self.cache.count - 1]) {
        transitionClasses.next = 'inverse-next';
        transitionClasses.slideOut = 'inverse-slide-out';
        if (self.cache.count !== 0) { self.cache.count -= 1; }
      } else {
        self.cache.count += 1;
      }

      /**
       * Request new page
       */
      $.get(this.baseUrl + href, function (data) {

        var $data = $(data),
            $incomingMain = $data.filter('.main-content'),
            $original = $('.main-content'),
            $clone = $('.main-content').clone()
              .addClass(transitionClasses.next)
              .html($incomingMain.html()),
            T = 750;

        /**
         * Prepare original for departure
         * and append clone for arrival
         */
        $original.after($clone).addClass('prepare');

        /**
         * Add right class for internals on clone
         */
        if (route === 'project') {
          $clone.addClass('-internal');
        } else {
          $clone.removeClass('-internal');
        }

        /**
         * Delay classes by .1s for CSS animations to work
         */
        var slideClassesTimeout = setTimeout(function () {
          $clone.addClass('slide-in');
          $original.addClass(transitionClasses.slideOut);
        }, 100);

        /**
         * Delay pageChange() until CSS animations finish (_site.scss)
         */
        var pageChangeTimeout = setTimeout(function () {
          $original.remove();
          $clone.removeClass(transitionClasses.next + ' slide-in');
          // popstate changes address bar prematurely (normalize that)
          $(document).trigger('pageChange', { route: route });
        }, T);

        self.transitioning = false;
        document.title = $data.filter('title').text();
        self.where = where; // set location on Navigation object
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

      if (self.where === where || self.transitioning === true) { return; }
      self.pageChange(href, where);

    },

    // browser buttons
    browserEvent: function (e) {

      var where = Flyweight.history.getFragment(),
          href = where,
          self = this;

      if (self.transitioning === true) { return; }
      self.pageChange(href, where);

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