(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Menu = Flyweight.Module.extend({

    name: 'Menu',
    // el: '.site__hero',
    debug: true,
    options: {
      menu: 0, // menu state 0 === closed
      delay: 100, // delay between items sliding in
      banner: {}
    },

    initialize: function () {

      var self = this,
          winWidth = $(window).width();

      self.toggle = '.nav__toggle';
      self.items = $('.overlay__item');
      self.mobilewidth = 700; // used to be 959


      $(window).resize(function () {
        var newWinWidth = $(window).width();

        if (winWidth === newWinWidth) {
          return;
        }

        if (self.menu === 1) { self.closeMenu(); }

        winWidth = newWinWidth;

      });

    },

    multiStepAnimation: function (conf) {

      var count = 0;

      (function loop () {

        $(conf.selector)[conf.method](conf.steps[count]);
        count += 1;

        if (count < conf.steps.length) {
          setTimeout(function () {
            loop();
          }, conf.timeout);
        }

      })();

    },

    moveItems: function (item, key, row) {

      var self = this,
          horizontal = key,
          vertical = self.itemsHeight * row,
          winWidth = $(window).width(),
          thewidth = self.mobilewidth, //used to be 959
          itemsAcross = (winWidth <= thewidth)? 2 : 3,
          multiplier = (winWidth <= thewidth)? 50 : 33.3333,
          rowKey = (winWidth <= thewidth)? 1 : 2;

      // horizontal move is either 0, 1, or 2 times 33.33333% or 50%
      if (key % itemsAcross === 0 && key > rowKey) {
        horizontal = 0;
      } else if ((key - 1) % itemsAcross === 0  && key > rowKey) {
        horizontal = 1;
      } else if ((key - 2) % itemsAcross === 0  && key > rowKey) {
        horizontal = 2;
      }

      $(item).css({
        top: vertical + 'px',
        left: (multiplier * horizontal) + '%'
      });

    },

    openMenu: function () {

      var self = this,
          time = 0,
          row = 0,
          target = self.toggle,
          $items = self.items,
          winWidth = $(window).width(),
          thewidth = self.mobilewidth,
          itemsAcross = (winWidth <= thewidth)? 2 : 3,
          $mainHeight = $('.main-content').height();

      self.multiStepAnimation({
        selector: '.overlay',
        steps: ['pre', 'open'],
        timeout: 100,
        method: 'addClass'
      });

      self.multiStepAnimation({
        selector: target,
        steps: ['pre', 'open'],
        timeout: 250,
        method: 'addClass'
      });

      $('.overlay__background').height($mainHeight);

      $.each($items, function (key, item) {

        setTimeout(function () {
          if (key % itemsAcross === 0 && key !== 0) { row += 1; }
          self.moveItems(item, key, row);
          // after the last one set the menu to open
          if (key + 1 === $items.length) {
            self.menu = 1;
          }

        }, time);

        time += self.delay; // delay each item moving in

      });


    },

    closeMenu: function () {

      var self = this,
          time = 0,
          target = self.toggle,
          $items = self.items,
          $reverseItems = $items.get().reverse(); // in reverse!

      $('.overlay__background').height(0);

      $.each($reverseItems, function (key, item) {

        setTimeout(function () {

          $(item).css({
            top: '100%',
            left: '100%'
          });

          // reset after last item is out
          if (key + 1 === $items.length) {

            self.multiStepAnimation({
              selector: '.overlay',
              steps: ['open', 'pre'],
              timeout: 500,
              method: 'removeClass'
            });
            self.multiStepAnimation({
              selector: target,
              steps: ['open', 'pre'],
              timeout: 250,
              method: 'removeClass'
            });

            self.menu = 0;

          }

        }, time);

        time += self.delay;

      });


    },

    toggleMenu: function (e) {

      e.preventDefault();

      var $items = $('.overlay__item'),
          self = e.data.context,
          time = 0,
          row = 0;

      // close banner if there is one
      if (self.banner.hasOwnProperty('state') && self.banner.state === 1) {
        self.banner.closeBanner();
      }

      if ($(this).hasClass('home')) {
        var animHeight = $('.site__hero').height();
        $('html,body').animate({ scrollTop: animHeight }, 500);
        return;
      }

      self.itemsHeight = $items.height();

      if (self.menu === 0) {
        self.openMenu();
      } else if (self.menu === 1){
        self.closeMenu();
      }

      self.menu = 2; //transition period cancels all clicks

    },

    blurImageHelper: function (e) {

      /**
       * repeated in two places...see navigation...fix
       */
      var mobi = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
      if (mobi()) {
        return;
      }

      var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
          if (ua.indexOf('chrome') > -1) {
            // don't disable chrome
          } else {
            return; //disable safari for now
          }
        }


      var $this = $(this),
          styles = {
            top: $this.css('top'),
            left: $this.css('left')
          },
          self = e.data.context,
          data = $this.data(),
          w = $this.width(),
          h = $this.height();

      if (!data.state || data.state === false) {

        $this.css({
          width: w + 'px',
          height: h + 'px'
        }).addClass('hover-helper');
        data.state = true;

      } else {

        $this.removeClass('hover-helper');
        setTimeout(function () {
          if (styles.top !== 'auto' && styles.left !== 'auto') {
            $this.attr('style', '').css({
              top: styles.top,
              left: styles.left
            });
          } else {
            $this.attr('style', '');
          }
        }, 500);
        data.state = false;

      }

    },

    events: {
      'click .nav__toggle' : 'toggleMenu',
      'mouseenter .grid__item' : 'blurImageHelper',
      'mouseleave .grid__item' : 'blurImageHelper',
      'mouseenter .overlay__item' : 'blurImageHelper',
      'mouseleave .overlay__item' : 'blurImageHelper'
    }

  });

  module.exports = Menu;

})(jQuery);