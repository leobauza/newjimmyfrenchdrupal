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

    },

    moveItems: function (item, key, row) {

      var self = this,
          horizontal = key,
          vertical = self.itemsHeight * row;

      // horizontal move is either 0, 1, or 2 times 33.33333%
      if (key % 3 === 0 && key > 2) {
        horizontal = 0;
      } else if ((key - 1) % 3 === 0  && key > 2) {
        horizontal = 1;
      } else if ((key - 2) % 3 === 0  && key > 2) {
        horizontal = 2;
      }

      $(item).css({
        top: vertical + 'px',
        left: (33.3333 * horizontal) + '%'
      });

    },

    openMenu: function (target, $items) {

      var self = this,
          time = 0,
          row = 0;

      /**
       * Move this to a util for multi-step animations
       */
      $('.overlay').addClass('pre');
      setTimeout(function () {
        $('.overlay').addClass('open');
      }, 100);

      $(target).addClass('open');

      $.each($items, function (key, item) {

        setTimeout(function () {
          if (key % 3 === 0 && key !== 0) { row += 1; }
          self.moveItems(item, key, row);
          // after the last one set the menu to open
          if (key + 1 === $items.length) {
            self.menu = 1;
          }

        }, time);

        time += self.delay; // delay each item moving in

      });


    },

    closeMenu: function (target, $items) {

      var self = this,
          time = 0,
          $reverseItems = $items.get().reverse(); // in reverse!

      $.each($reverseItems, function (key, item) {

        setTimeout(function () {
          $(item).css({
            top: '100%',
            left: '100%'
          });

          // reset after last item is out
          if (key + 1 === $items.length) {
            $('.overlay').removeClass('open');
            $(target).removeClass('open');
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

      self.itemsHeight = $items.height();

      if (self.menu === 0) {
        self.openMenu(this, $items);
      } else if (self.menu === 1){
        self.closeMenu(this, $items);
      } else {
        console.log("transition period");
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