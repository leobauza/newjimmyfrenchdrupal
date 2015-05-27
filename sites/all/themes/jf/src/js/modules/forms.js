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

        var $data = $.parseJSON(data);
        $('.info__form').html(
          "<h2>" + $data.title + "</h2>" +
          "<p>" + $data.message + "</p>"
        );

      });

    },

    placeHolderFocus: function (e) {

      var $parent = $(this).closest('.form-item');

      $parent.find('label').hide();

    },

    placeHolderBlur: function (e) {

      var $parent = $(this).closest('.form-item'),
          val = $(this).val();

      if (val === '') {
        $parent.find('label').show();
      }

    },

    onDelegated: function (e) {
      this.msg("events have been delegated!", 'warn');
    },

    events: {
      'submit .info__form form' : 'submit',
      'focus .info__form input[type="text"], .info__form textarea' : 'placeHolderFocus',
      'blur .info__form input[type="text"], .info__form textarea' : 'placeHolderBlur'
    }

  });

  module.exports = Forms;

})(jQuery);
