(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Forms = Flyweight.Module.extend({

    name: 'Forms',
    //el: '.info__form', //not great for ajax
    debug: false,

    initialize: function () {

      var data = $('.info__form').data();
      this.formName = data.form;

    },

    submit: function (e) {

      e.preventDefault();

      var _this = e.data.context,
          form = $(this),
          postData = form.serialize(),
          nid = form.data().id;

      $.post("/webform_ajax/" + nid, postData, function (data) {

        console.log(data);

      });

    },

    onDelegated: function (e) {
      this.msg("events have been delegated!", 'warn');
    },

    events: {
      'submit .info__form form' : 'submit',
    }

  });

  module.exports = Forms;

})(jQuery);
