/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */
(function ($) {
  "use strict";

  var Flyweight = require('libs/flyweight'),
      Menu = require('modules/menu'),
      Svg = require('modules/svg'),
      Forms = require('modules/forms'),
      Navigation = require('modules/navigation');

  var Land = 0, // landing marker
      svg, // homepage svg
      form,
      menu,
      Router;

  /**
   * Elements
   */
  var $body = $('body'),
      $footer = $('.site__footer .container');

  /**
   * Listen to page changes for HTML
   */
  $(document).on('pageChange', function (e, params) {

    switch (params.route) {
      case 'about':
        if (typeof form === 'object' && 'initialize' in form) {
          form.delegateEvents(); // form initiated just need to delegate the submit button again
        } else {
          form = new Forms();
        }
        break;

      case 'project':
        break;

      default:
        if (typeof svg === 'object' && 'initialize' in svg) {
          svg.initialize();
        } else {
          svg = new Svg();
        }
        break;
    }

    $body.addClass('loading--done');
    var loadingDoneTimeout = setTimeout(function () {
      $body.removeClass('loading loading--done'); // class added navigation.pageChange()
    }, 750);
    /**
     * So this stupid thing...
     * The contextual links won't work because if you land on a page without
     * contextual links then the behaviour isn't available for you to attach
     * ie. landing on the homepage which has no contextual links anywhere means
     * the module never loaded its crap in the first place. Great...
     */
    Drupal.attachBehaviors('.main-content'); // make contextual links work again (and other modules js)

  });

  Router = Flyweight.Router.extend({
    routes: {
      '': 'home',
      'about': 'about',
      'project/:name' : 'project',
      '*any': 'any'
    },

    any: function () {

      if (Land === 0) {
        menu = new Menu();
      } else {
        if (menu.menu === 1) { menu.closeMenu(); }
      }

    },

    home: function () {

      if (Land === 0) {
        svg = new Svg();
        Land = 1; // capture when we land in a non-ajaxy way
        $('.nav__toggle').addClass('home');
      } else {
        $body.removeClass('node-type-project');
      }

      $footer.removeClass().addClass('container -home');

    },

    about: function () {

      if (Land === 0 ) {
        form = new Forms();
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.removeClass('node-type-project');
      }

      $footer.removeClass().addClass('container -information');

    },

    project: function () {

      if (Land === 0 ) {
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.addClass('node-type-project');
      }

      $footer.removeClass().addClass('container');

    }

  });

  var router = new Router();

  Flyweight.history.start({
    router: router
  });

  if (Flyweight.history._usePushState) {
    var nav = new Navigation();
  }

})(jQuery);
