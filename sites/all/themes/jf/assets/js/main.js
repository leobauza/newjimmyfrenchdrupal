(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      Navigation = require('modules/navigation'),
      Land = 0, // landing marker
      svg = {}, // homepage svg
      form = {},
      html = '', // ajaxed html
      menu,
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
    /**
     * So this stupid thing...
     * The contextual links won't work because if you land on a page without
     * contextual links then the behaviour isn't available for you to attach
     * ie. landing on the homepage which has no contextual links anywhere means
     * the module never loaded its crap in the first place. Great...
     */
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
      'about': 'about',
      'project/:name' : 'project',
      '*any': 'any'
    },

    any: function () {

      if (Land === 0) {
        menu = new Menu();
      }

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

},{"libs/flyweight":2,"modules/forms":3,"modules/menu":4,"modules/navigation":5,"modules/svg":6}],2:[function(require,module,exports){
/**
 * The Flyweight Class
 */
/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
"use strict";

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
  for (var i = 0; i < m.length; i += 1) {
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
    if (!type) { type = 'log'; }
    // if msgs turned on
    if (this.debug) {
      console[type](msg);
    }
  };

  var ns = Flyweight.ns = function (nsString) {
    var
      parts = nsString.split('.'),
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
   * Module
   * [Static Constructor] Flyweight.Module.extend is a way to create modules
   * with shared properties.
   */
  var Module = Flyweight.Module = function(element, options) {

    if(!(this instanceof Module)) { return new Module(); }

    if (typeof this.name !== 'string') {
      Flyweight.msg('Module must have a name property', 'error');
      return;
    }

    Flyweight.msg('Creating a module named: ' + this.name, 'warn');
    var el = element || this.el || document,
        _this = this,
        moduleOptions = this.options || {};

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
      $.each(events, function(eventTarget, method) {
        var parts = eventTarget.split(' '),
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
   * Router
   * Adapted from RouterRouter
   * by Jason Garber (http://sixtwothree.org)
   * Source code available at: https://github.com/jgarber623/RouterRouter
   */
  var Router = Flyweight.Router = function (options) {

    if(!(this instanceof Router)) { return new Router(); }
    this.options = typeof options !== "undefined" ? options : this;

    if (this.options.routes) {
      this.routes = this.options.routes;
    }

    this.location = window.location;
    this._bindRoutes();

  };

  var isType = function(obj, name) {
    return Object.prototype.toString.call(obj) === "[object " + name + "]";
  };

  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g,
      namedParam = /(\(\?)?:\w+/g,
      optionalParam = /\((.*?)\)/g,
      splatParam = /\*\w+/g,
      routeStripper = /^[#\/]|\s+$/g,
      rootStripper = /^\/+|\/+$/g,
      pathStripper = /#.*$/,
      trailingSlash = /\/$/;

  $.extend(Router.prototype, {
    _bindRoutes: function() {
      if (this.routes) {
        var route,
            routes = []; //Object.keys(this.routes);

        $.each(this.routes, function (k, v) {
          routes.push(k);
        });

        while (typeof (route = routes.pop()) !== "undefined") {
          this.route(route, this.routes[route]);
        }
      }
    },

    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return $.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    },

    _getFragment: function(fragment) {
      return fragment.replace(routeStripper, "").replace(trailingSlash, "");
    },

    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, function(match, optional) {
        return optional ? match : "([^/?]+)";
      }).replace(splatParam, "([^?]*?)");
      return new RegExp("^" + route + "(?:\\?([\\s\\S]*))?$");
    },

    route: function(route, name, callback) {
      if (!isType(route, "RegExp")) {
        route = this._routeToRegExp(route);
      }
      if (isType(name, "Function")) {
        callback = name;
        name = "";
      }
      if (!callback) {
        callback = this.options[name];
      }
      var fragment = this._getFragment(this.location.pathname);
      if (route.test(fragment)) {
        var args = this._extractParameters(route, fragment);
        if (isType(callback, "Function")) {
          callback.apply(this, args);
        }
      }
      return this;
    }

  });


  /**
   * History
   * Adapted from RouterRouter
   * by Jason Garber (http://sixtwothree.org)
   * Source code available at: https://github.com/jgarber623/RouterRouter
   */
  var History = Flyweight.History = function() {

    // hmmm?
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }

  };

  History.started = false;

  $.extend(History.prototype, {

    navigate: function (fragment, options) {

      if (!History.started) { return false; }
      if (!options || options === true) { options = {trigger: !!options}; }

      fragment = this.getFragment(fragment || '');

      var root = this.root;

      if (fragment === '' || fragment.charAt(0) === '?') {
        root = root.slice(0, -1) || '/';
      }

      var url = root + fragment;

      fragment = decodeURI(fragment.replace(pathStripper, ''));

      if (this.fragment === fragment) { return; }

      this.fragment = fragment;

      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
      }

      if (options.trigger) { return this.loadUrl(fragment); }

    },

    checkUrl: function (e) {

      var current = this.getFragment();

      if (current === this.fragment) {
        return false;
      }

      this.loadUrl();

    },

    // atRoot: function() {
    //   var path = this.location.pathname.replace(/[^\/]$/, '$&/');
    //   return path === this.root && !this.getSearch();
    // },

    getFragment: function(fragment) {
      if (fragment === null || fragment === undefined) {
        fragment = this.getPath();
      }
      return fragment.replace(routeStripper, '');
    },

    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    getPath: function() {
      var path = decodeURI(this.location.pathname + this.getSearch());
      var root = this.root.slice(0, -1);
      if (!path.indexOf(root)) { path = path.slice(root.length); }
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    start: function(options) {
      if (History.started) { throw new Error('Flyweight.history has already been started'); }
      History.started = true;

      var _this = this;

      // initial configuration
      this.options          = $.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsPushState  = true; //!!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();
      this.router           = this.options.router;

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Add a cross-platform `addEventListener` shim for older browsers.
      // Don't really need this...
      var addEventListener = window.addEventListener || function (eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // We only care about browsers with popstate
      // other browsers work the old fashioned page refresh way
      if (this._usePushState) {
        addEventListener('popstate', function (e) {
          _this.checkUrl.apply(_this, [e]);
        }, false);
      } else {
        return false;
      }

    },

    loadUrl: function (fragment) {

      var _this = this;
      fragment = this.fragment = this.getFragment(fragment);

      $.each(this.router.routes, function (route, callback) {

        var _route;
        if (!isType(route, "RegExp")) {
          _route = _this.router._routeToRegExp(route);
        }
        if (_route.test(_this.fragment)) {
          _this.router.route(route, callback);
        }

      });

    }

  });

  // Create the default Flyweight.history.
  Flyweight.history = new History();

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

  Module.extend = Router.extend = extend;

  return Flyweight;

});

},{}],3:[function(require,module,exports){
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

},{"../libs/flyweight":2}],4:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Menu = Flyweight.Module.extend({

    name: 'Menu',
    // el: '.site__hero',
    debug: true,
    options: {
      menu: 0, // menu state 0 === closed
      delay: 100 // delay between items sliding in
    },

    initialize: function () {

      var self = this;

    },

    moveItems: function (item, key, row) {

      var self = this,
          horizontal = key,
          vertical = self.itemsHeight * row;

      // horizontal move is either 0, 1, or 2 times 33.33333%
      if (key % 3 === 0 && key > 2) {
        horizontal = 0;
      } else if ((key - 1) % 3 === 0  && key > 2) {
        horizontal = 1;
      } else if ((key - 2) % 3 === 0  && key > 2) {
        horizontal = 2;
      }

      $(item).css({
        top: vertical + 'px',
        left: (33.3333 * horizontal) + '%'
      });

    },

    openMenu: function (target, $items) {

      var self = this,
          time = 0,
          row = 0;

      /**
       * Move this to a util for multi-step animations
       */
      $('.overlay').addClass('pre');
      setTimeout(function () {
        $('.overlay').addClass('open');
      }, 100);

      $(target).addClass('open');

      $.each($items, function (key, item) {

        setTimeout(function () {
          if (key % 3 === 0 && key !== 0) { row += 1; }
          self.moveItems(item, key, row);
          // after the last one set the menu to open
          if (key + 1 === $items.length) {
            self.menu = 1;
          }

        }, time);

        time += self.delay; // delay each item moving in

      });


    },

    closeMenu: function (target, $items) {

      var self = this,
          time = 0,
          $reverseItems = $items.get().reverse(); // in reverse!

      $.each($reverseItems, function (key, item) {

        setTimeout(function () {
          $(item).css({
            top: '100%',
            left: '100%'
          });

          // reset after last item is out
          if (key + 1 === $items.length) {
            $('.overlay').removeClass('open pre');
            $(target).removeClass('open');
            self.menu = 0;
          }

        }, time);

        time += self.delay;

      });


    },

    toggleMenu: function (e) {

      e.preventDefault();

      var $items = $('.overlay__item'),
          self = e.data.context,
          time = 0,
          row = 0;

      self.itemsHeight = $items.height();

      if (self.menu === 0) {
        self.openMenu(this, $items);
      } else if (self.menu === 1){
        self.closeMenu(this, $items);
      } else {
        console.log("transition period");
      }

      self.menu = 2; //transition period cancels all clicks

    },

    onDelegated: function (e) {
      // hi
    },

    events: {
      'click .nav__toggle' : 'toggleMenu'
    }

  });

  module.exports = Menu;

})(jQuery);
},{"../libs/flyweight":2}],5:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Navigation = Flyweight.Module.extend({

    name: 'Navigation',
    // el: '.site__hero',
    debug: true,

    initialize: function () {

      var _this = this;

      this.baseUrl = window.location.protocol + "//" + window.location.host + '/';

      this.where = Flyweight.history.getFragment();

      this.markIgnored(['.nav-tabs a', '#admin-menu a', '.nav__toggle']);

      // window.addEventListener('popstate', function (e) {
      //   _this.loadPage.apply(_this, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        _this.browserEvent.apply(_this, [e]);
      });

    },

    pageChange: function (href, where) {

      var _this = this,
          route = where.split('/')[0];

      $('body').addClass('loading');
      $.get(this.baseUrl + href, function (data) {

        var $data = $(data);
        var $main = $data.filter('.main-content');

        // control replacing the main content from the router
        $(document).trigger('pageChange', {
          html: $main.html(),
          route: route
        });

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });

      }, 'html');

    },

    // click only
    processClick: function (e) {

      if ($(this).hasClass('-ignored')) {
        return;
      }

      e.preventDefault();
      var _this = e.data.context,
          href = $(this).attr('href'),
          where = Flyweight.history.getFragment(href);

      if (_this.where === where) {
        return;
      }

      _this.pageChange(href, where);

    },

    // browser buttons
    browserEvent: function (e) {

      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          _this = this;

      this.pageChange(href, where);

    },

    markIgnored: function (selectors) {
      // find all links that should'd be ajaxyfied
      setTimeout(function () {
        $.each(selectors, function (i, selector) {
          $(selector).addClass('-ignored');
        });
      }, 1000); // find a better way to wait for the admin menu to load...

    },

    onDelegated: function (e) {
      // hi
    },

    events: {
      'click a' : 'processClick'
    }

  });

  module.exports = Navigation;

})(jQuery);
},{"../libs/flyweight":2}],6:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Svg = Flyweight.Module.extend({

    name: 'Svg',
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

    events: {}

  });

  module.exports = Svg;

})(jQuery);

},{"../libs/flyweight":2}]},{},[1]);
