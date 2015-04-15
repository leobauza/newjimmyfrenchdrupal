(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Forms = Flyweight.Module.extend({

    name: 'Forms',
    el: '.info__form',
    debug: true,

    initialize: function () {
      var data = $(this.el).data();
      this.formName = data.form;

    },

    submit: function (e) {

      e.preventDefault();

      var _this = e.data.context,
          form = $(this),
          postData = form.serialize(),
          nid = Drupal.settings.forms[_this.formName];

      $.post("/webform_ajax/" + nid, postData, function (data) {

        console.log(data);

      });

    },

    onDelegated: function (e) {
    },

    events: {
      'submit form' : 'submit'
    }

  });

  module.exports = Forms;

})(jQuery);
