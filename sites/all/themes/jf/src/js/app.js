/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */
(function ($) {
  "use strict";

  var Flyweight = require('libs/flyweight'),
      Svg = require('modules/svg'),
      Forms = require('modules/forms'),
      Navigation = require('modules/navigation'),
      Land = 0, // landing marker
      svg = {}, // homepage svg
      form = {},
      html = '', // ajaxed html
      Router;

  /**
   * Elements
   */
  var $mainContent = $('.main-content'),
      $body = $('body');

  /**
   * Listen to page changes for HTML
   */
  $(document).on('pageChange', function (e, params) {

    html = params.html;
    $(document).trigger('pageSetup', {
      route: params.route
    });
    $('body').removeClass('loading'); // class added navigation.pageChange()
    Drupal.attachBehaviors('.main-content'); // make contextual links work again (and other modules js)

  });

  /**
   * Listen for q to set up the page
   */
  $(document).on('pageSetup', function (e, params) {

    $mainContent.html(html);

    switch (params.route) {
      case 'about':
        if (typeof form === 'object' && 'initialize' in form) {
          form.delegateEvents(); // form initiated just need to delegate the submit button again
          // form.initialize();
        } else {
          form = new Forms();
        }
        break;

      case 'project':
        // nothing yet
        break;

      default:
        if (typeof svg === 'object' && 'initialize' in svg) {
          svg.initialize();
        } else {
          svg = new Svg();
        }
        break;
    }

  });


  Router = Flyweight.Router.extend({
    routes: {
      '': 'home',
      '*any': 'any',
      'about': 'about',
      'project/:name' : 'project'
    },

    home: function () {

      if (Land === 0) {
        svg = new Svg();
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.removeClass('node-type-project');
        $mainContent.removeClass('-internal');
      }

    },

    about: function () {

      if (Land === 0 ) {
        form = new Forms();
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.removeClass('node-type-project');
        $mainContent.removeClass('-internal');
      }

    },

    project: function () {

      if (Land === 0 ) {
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.addClass('node-type-project');
        $mainContent.addClass('-internal');
      }

    },

    any: function (a) {

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
