(function ($) {

  "use strict";

  var Flyweight = require('../libs/flyweight');

  var Navigation = Flyweight.Module.extend({

    name: 'Navigation',
    options: {
      banner: {} // passing in the banner to close on page change
    },
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
      this.ignoreList = [
        '.nav-tabs a',
        '#admin-menu a',
        '.nav__toggle',
        '.footer__social a',
        '.info__social a',
        '.info__section a',
        '.content__header a',
        '.content__rows a',
        '.banner a'];
      this.markIgnored();

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

      // close banner if there is one
      if (self.banner.hasOwnProperty('state') && self.banner.state === 1) {
        self.banner.closeBanner();
      }

      if (route === '') {
        $('.nav__toggle').addClass('home');
      } else {
        $('.nav__toggle').removeClass('home');
      }

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

        /**
         * Mark ignored links of incoming page
         */
        self.markIgnored();

        self.transitioning = false;
        document.title = $data.filter('title').text();
        self.where = where; // set location on Navigation object
        Flyweight.history.navigate(href, { trigger: true });

      }, 'html').fail(function (x, e) {
        console.log(x.status);
      });

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

      // if its transitioning return...
      if (self.transitioning === true) { return; }

      var mobi = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
      // if it is NOT mobile pageChange
      if (!mobi()) {
        self.pageChange(href, where);
      } else {
        location.href = "/" + href;
        return;
      }

    },

    markIgnored: function (arr) {
      // find all links that should'd be ajaxyfied
      var selectors = arr || this.ignoreList;
      setTimeout(function () {
        $.each(selectors, function (i, selector) {
          var $selector = $(selector);
          if (!$selector.hasClass('-ignored')) {
            $selector.addClass('-ignored');
          }
        });
      }, 1000); // find a better way to wait for the admin menu to load...

    },

    events: {
      'click a' : 'processClick'
    }

  });

  module.exports = Navigation;

})(jQuery);