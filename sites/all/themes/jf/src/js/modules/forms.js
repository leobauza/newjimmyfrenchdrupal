(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Forms = Flyweight.Module.extend({

    name: 'Forms',
    // el: '.site__hero',
    debug: true,

    initialize: function () {

      console.error('[forms.js][line 19]: this needs to check if there is a form, and get the url for the post request dynamically');

      $('#webform-client-form-11').submit(function (e) {

        e.preventDefault();

        var form = $(this),
            postData = form.serialize(),
            nodeId = '11';

        console.log(postData);

        $.post("http://jimmyfrench.loc/webform_ajax/11", postData, function (data) {

          console.log(data);

        });


      });

    },

    onDelegated: function (e) {
      // hi
    },

    // test: function (e) {
    //   console.log(this);
    //   console.log("test");
    // },

    events: {
      // 'click p, div' : 'test'
    }

  });

  module.exports = Forms;

})(jQuery);