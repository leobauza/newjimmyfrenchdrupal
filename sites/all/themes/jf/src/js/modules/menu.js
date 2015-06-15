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
      delay: 100 // delay between items sliding in
    },

    initialize: function () {

      var self = this;

      self.toggle = '.nav__toggle';
      self.items = $('.overlay__item');
      self.mobilewidth = 700; // used to be 959

      $(window).resize(function () {
        if (self.menu === 1) { self.closeMenu(); }
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
          itemsAcross = (winWidth <= thewidth)? 2 : 3;

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

    onDelegated: function (e) {
      // hi
    },

    events: {
      'click .nav__toggle' : 'toggleMenu'
    }

  });

  module.exports = Menu;

})(jQuery);