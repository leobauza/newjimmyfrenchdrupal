(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * !! DO NOT EDIT MAIN.JS !!
 * jf/src/app.js outputs to assets/js/main.js
 */

"use strict";

var svg;

if (typeof require === 'function') {
  svg = require('./modules/svg');
}

},{"./modules/svg":3}],2:[function(require,module,exports){
/**
 * The Flyweight Class
 */
/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
  if (!window.console) {
    window.console = {};
  }
  // union of Chrome, FF, IE, and Safari console methods
  var m = [
    "log", "info", "warn", "error", "debug", "trace", "dir", "group",
    "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
    "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
  ];
  // define undefined methods as noops to prevent errors
  var func = function() {};
  for (var i = 0; i < m.length; i++) {
    if (!window.console[m[i]]) {
      window.console[m[i]] = func;
    }
  }
})();

(function (root, factory) {
  //eh i dunno about this.
  if (typeof exports !== 'undefined') {
    factory(root, exports, window.jQuery);
  } else {
    root.Flyweight = factory(root, {}, root.jQuery || root.$);
  }


})(this, function(root, Flyweight, $) {
  /**
   * The Flyweight "class" is just a function that makes sure it is being
   * called using the "new" keyword.
   * It takes one paramater, an optional name that defaults to "App."
   */
  Flyweight = function (name) {
    if(!(this instanceof Flyweight)) {
      return new Flyweight(name);
    }
    this.name = name || 'App';
    this.els = this.els || {};
  };

  // for browserify...
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      //exports = module.exports = Flyweight;
      module.exports = Flyweight;
    }
  }


  Flyweight.debug = false;

  //WRITE A LOG THAT CAN BE TURNED ON AND OFF
  var msg = Flyweight.msg = function (msg, type) {
    if (!type) type = 'log';
    // if msgs turned on
    if (this.debug) {
      console[type](msg);
    }
  };

  var ns = Flyweight.ns = function (ns_string) {
    var
      parts = ns_string.split('.'),
      parent = this,
      i
    ;
    //strip redundant leading global
    if (parts[0] === this.name) {
      parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
      //create a property if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };

  /**
   * Flyweight Prototype
   */
  // $.extend(Flyweight.prototype, {
  //   ns: ns,
  //   msg: msg
  // });

  /**
   * [Static Constructor] Flyweight.module.extend is a way to create modules
   * with shared properties.
   */
  var Module = Flyweight.Module = function(element, options) {

    if(!(this instanceof Module)) return new Module();

    if (typeof this.name !== 'string') {
      Flyweight.msg('Module must have a name property', 'error');
      return;
    }

    Flyweight.msg('Creating a module named: ' + this.name, 'warn');
    var el = element || this.el || document,
        _this = this,
        moduleOptions = this.moduleOptions || {};

    if (!$(el).length) {
      Flyweight.msg('this el is no present, so module won\'t be initialized', 'warn');
      return;
    }

    $.extend(this, moduleOptions, options);
    this.$el = $(el);
    this.initialize();
    this.$el.on(this.name + '.actionsDelegated', $.proxy(this.onDelegated, this));
    this.delegateEvents();
  };

  // Use extend to add to the prototype because....(find a good reason)
  $.extend(Module.prototype, {
    debug: false,
    msg: msg,
    initialize: function () {
      Flyweight.msg('original init in debug mode', 'log');
    },
    onDelegated: function () {
      Flyweight.msg('original onDelegated in debug mode', 'log');
    },
    getName: function () {
      return this.name;
    },
    logName: function () {
      console.log(this.name);
    },
    undelegateEvents: function () {
      Flyweight.msg('undelegateEvents is being fired', 'warn');
      this.$el.off('.delegatedEvents.' + this.name);
      return this;
    },
    delegateEvents: function (events) {
      this.undelegateEvents();
      Flyweight.msg('delegateEvents is being fired', 'warn');
      if (!events && !(events = this.events)) { return; }
      var that = this;

      //sort through events
      $.each(events, function(event_target, method) {
        var parts = event_target.split(' '),
            _event = parts.shift() + '.delegatedEvents.' + that.name,
            _selector = parts.join(' ');
            // _selector = (typeof els[_target] === "string")? els[_target] : els[_target].selector;
        that.$el.on(_event, _selector, {context: that, selector: _selector}, that[method]);
      });
      //creates an event after elements and actions are processed
      // $(document).trigger(key + '.els.processed', els);
      if (!$.isEmptyObject(this.events)) {
        this.$el.trigger(this.name + ".actionsDelegated");
      }

      return this;
    }

  });

  /**
   * Extend ripped off from backbone.js
   */
  var extend = function (protos, statics) {
    var parent = this,
        child;

    if (protos && protos.hasOwnProperty('constructor')) {
      child = protos.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    $.extend(child, parent, statics);

    var Surrogate = function(){
      this.constructor = child;
    };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protos) { $.extend(child.prototype, protos); }
    child.__super__ = parent.prototype;

    return child;

  };

  Module.extend = extend;

  return Flyweight;

});

},{}],3:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Svg = Flyweight.Module.extend({

    name: 'Sample',
    el: '.site__hero',
    debug: true,

    initialize: function () {

      var $hero = $(this.el),
          $paths = $(this.el + ' path');

      if (!$paths) { return; }

      // potentially going to need to
      // make this happen after hero image
      // has loaded...
      // https://github.com/desandro/imagesloaded
      // or lazy load the hero image
      // also create load bar at the top...
      this.prepare($paths, $hero);

    },

    prepare: function ($paths, $hero) {

      var _this = this,
          count = $paths.length;

      $.each($paths, function (k, v) {
        var length = v.getTotalLength();

        // Set up the starting positions
        v.style.strokeDasharray = length + ' ' + length;
        v.style.strokeDashoffset = length;

        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        v.getBoundingClientRect();

        if (k + 1 === count) {
          $hero.addClass('animate');
          _this.draw($paths, $hero, count);
        }

      });


    },

    draw: function ($paths, $hero, count) {
      $.each($paths, function (k, v) {

        // Go!
        v.style.transition = v.style.WebkitTransition = 'stroke-dashoffset 2s ease-in-out';
        v.style.strokeDashoffset = '0';

      });

      setTimeout(function () {
        $hero.addClass('finished');
      }, 2000);

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

  module.exports = new Svg();

})(jQuery);
},{"../libs/flyweight":2}]},{},[1]);
