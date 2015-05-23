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
      Land = 0,
      Router;

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

      home: function () {

        if (Land === 0) {
          console.log(Land);
          var svg = new Svg();
          Land = 1; // capture when we land in a non-ajaxy way
        } else {
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
        }
        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          console.log(params);
          var svg = new Svg();
        });

      },

      about: function () {

        if (Land === 0 ) {
          Land = 1; // capture when we land in a non-ajaxy way
        }
        $body.removeClass('node-type-project');
        $mainContent.removeClass('-internal');
        var forms = new Forms();

      },

      project: function () {

        if (Land === 0 ) {
          Land = 1; // capture when we land in a non-ajaxy way
        }
        $body.addClass('node-type-project');
        $mainContent.addClass('-internal');

      },

      any: function (a) {
        //get the page if you are not ON the page
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
