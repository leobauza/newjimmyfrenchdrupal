/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */
(function ($) {
  "use strict";

  var Flyweight, Svg, Forms, Router, Navigation;

  if (typeof require === 'function') {
    Flyweight = require('libs/flyweight');
    Svg = require('modules/svg');
    Forms = require('modules/forms');
    Navigation = require('modules/navigation');
  }

  /**
   * Elements
   */
  var $mainContent = $('.main-content'),
      $body = $('body');

    Router = Flyweight.Router.extend({
      routes: {
        '': 'home',
        '*any': 'any',
        'about': 'about',
        'project/:name' : 'project'
      },

      any: function () {
        //get the page if you are not ON the page
      },

      home: function () {
        // $body.removeClass('node-type-project');
        // $mainContent.removeClass('-internal');
        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          console.log(params);
          var svg = new Svg();
        });

      },

      about: function () {
        // $body.removeClass('node-type-project');
        // $mainContent.removeClass('-internal');
        // var forms = new Forms();
      },

      project: function () {
        // $body.addClass('node-type-project');
        // $mainContent.addClass('-internal');
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
