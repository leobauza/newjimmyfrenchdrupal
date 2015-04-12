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
      imagesLoaded = require('imagesloaded'),
      Status = {
        any: 0,
        home: 0,
        about: 0,
        project: 0
      };

  /**
   * Elements
   */
  var $mainContent = $('.main-content'),
      $body = $('body');

  var Router = Flyweight.Router.extend({
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

        if (Status.home === 0) {
          new Svg();
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
          Status.home = 1;
        }

        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          $mainContent.html(params.html);
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
          new Svg();
        });

      },

      about: function () {

        if (Status.about === 0) {
          new Forms();
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
          Status.about = 1;
        }

        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          $mainContent.html(params.html);
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
          var forms = new Forms();
        });

        // $body.removeClass('node-type-project');
        // $mainContent.removeClass('-internal');
        // var forms = new Forms();
      },

      project: function () {

        if (Status.project === 0) {
          $body.addClass('node-type-project');
          $mainContent.addClass('-internal');
          Status.project = 1;
        }

        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          $mainContent.html(params.html);
          $body.addClass('node-type-project');
          $mainContent.addClass('-internal');
        });

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
