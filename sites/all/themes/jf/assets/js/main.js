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
      Banner = require('modules/banner');

  var Land = 0, // landing marker
      svg, // homepage svg
      form,
      menu,
      banner,
      Router;

  /**
   * Elements
   */
  var $body = $('body'),
      $footer = $('.site__footer .container');

  /**
   * Listen to page changes for HTML
   */
  $(document).on('pageChange', function (e, params) {

    switch (params.route) {
      case 'about':
        if (typeof form === 'object' && 'initialize' in form) {
          form.delegateEvents(); // form initiated just need to delegate the submit button again
        } else {
          form = new Forms();
        }
        break;

      case 'project':
        break;

      default:
        if (typeof svg === 'object' && 'initialize' in svg) {
          svg.initialize();
        } else {
          svg = new Svg();
        }
        break;
    }

    $body.addClass('loading--done');
    var loadingDoneTimeout = setTimeout(function () {
      $body.removeClass('loading loading--done'); // class added navigation.pageChange()
    }, 750);
    /**
     * So this stupid thing...
     * The contextual links won't work because if you land on a page without
     * contextual links then the behaviour isn't available for you to attach
     * ie. landing on the homepage which has no contextual links anywhere means
     * the module never loaded its crap in the first place. Great...
     */
    Drupal.attachBehaviors('.main-content'); // make contextual links work again (and other modules js)

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
        banner = new Banner();
        menu = new Menu(document, {
          banner: banner
        });
      } else {
        if (menu.menu === 1) { menu.closeMenu(); }
        // if (banner.state === 1) { banner.closeBanner(); }
      }

    },

    home: function () {

      if (Land === 0) {
        svg = new Svg();
        Land = 1; // capture when we land in a non-ajaxy way
        $('.nav__toggle').addClass('home');
      } else {
        $body.removeClass('node-type-project');
      }

      $footer.removeClass().addClass('container -home');

    },

    about: function () {

      if (Land === 0 ) {
        form = new Forms();
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.removeClass('node-type-project');
      }

      $footer.removeClass().addClass('container -information');

    },

    project: function () {

      if (Land === 0 ) {
        Land = 1; // capture when we land in a non-ajaxy way
      } else {
        $body.addClass('node-type-project');
      }

      $footer.removeClass().addClass('container');

    }

  });

  var router = new Router();

  Flyweight.history.start({
    router: router
  });

  if (Flyweight.history._usePushState) {
    var nav = new Navigation(document, {
      banner: banner // pass the banner to close on page change
    });
  }

})(jQuery);

},{"libs/flyweight":2,"modules/banner":3,"modules/forms":4,"modules/menu":5,"modules/navigation":6,"modules/svg":7}],2:[function(require,module,exports){
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

  var Flyweight = require('../libs/flyweight');

  var Banner = Flyweight.Module.extend({

    name: 'Banner',
    initialize: function () {

      var self = this;
      if ($('.banner').length) {
        self.state = 1; // only if it exists!!!
      } else {
        self.state = 0;
      }

    },
    closeBanner: function (e) {

      if (typeof e === 'object') {
        e.preventDefault();
      }

      var self = (typeof e === 'object')? e.data.context : this,
          $banner = $('.banner'),
          height = $banner.height();

      $('body').removeClass('banner-on');

      $banner.css({
        'margin-top': -(height) + 'px'
      });

      setTimeout(function () {
        $banner.remove();
      }, 550); // remove in case of resize

      self.state = 0;

    },
    events: {
      'click .banner .dismiss': 'closeBanner'
    }

  });

  module.exports = Banner;

})(jQuery);

},{"../libs/flyweight":2}],4:[function(require,module,exports){
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

},{"../libs/flyweight":2}],5:[function(require,module,exports){
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
      delay: 100, // delay between items sliding in
      banner: {}
    },

    initialize: function () {

      var self = this,
          winWidth = $(window).width();

      self.toggle = '.nav__toggle';
      self.items = $('.overlay__item');
      self.mobilewidth = 700; // used to be 959


      $(window).resize(function () {
        var newWinWidth = $(window).width();

        if (winWidth === newWinWidth) {
          return;
        }

        if (self.menu === 1) { self.closeMenu(); }

        winWidth = newWinWidth;

      });

    },

    multiStepAnimation: function (conf) {

      var count = 0;

      (function loop () {

        $(conf.selector)[conf.method](conf.steps[count]);
        count += 1;

        if (count < conf.steps.length) {
          setTimeout(function () {
            loop();
          }, conf.timeout);
        }

      })();

    },

    moveItems: function (item, key, row) {

      var self = this,
          horizontal = key,
          vertical = self.itemsHeight * row,
          winWidth = $(window).width(),
          thewidth = self.mobilewidth, //used to be 959
          itemsAcross = (winWidth <= thewidth)? 2 : 3,
          multiplier = (winWidth <= thewidth)? 50 : 33.3333,
          rowKey = (winWidth <= thewidth)? 1 : 2;

      // horizontal move is either 0, 1, or 2 times 33.33333% or 50%
      if (key % itemsAcross === 0 && key > rowKey) {
        horizontal = 0;
      } else if ((key - 1) % itemsAcross === 0  && key > rowKey) {
        horizontal = 1;
      } else if ((key - 2) % itemsAcross === 0  && key > rowKey) {
        horizontal = 2;
      }

      $(item).css({
        top: vertical + 'px',
        left: (multiplier * horizontal) + '%'
      });

    },

    openMenu: function () {

      var self = this,
          time = 0,
          row = 0,
          target = self.toggle,
          $items = self.items,
          winWidth = $(window).width(),
          thewidth = self.mobilewidth,
          itemsAcross = (winWidth <= thewidth)? 2 : 3,
          $mainHeight = $('.main-content').height();

      self.multiStepAnimation({
        selector: '.overlay',
        steps: ['pre', 'open'],
        timeout: 100,
        method: 'addClass'
      });

      self.multiStepAnimation({
        selector: target,
        steps: ['pre', 'open'],
        timeout: 250,
        method: 'addClass'
      });

      $('.overlay__background').height($mainHeight);

      $.each($items, function (key, item) {

        setTimeout(function () {
          if (key % itemsAcross === 0 && key !== 0) { row += 1; }
          self.moveItems(item, key, row);
          // after the last one set the menu to open
          if (key + 1 === $items.length) {
            self.menu = 1;
          }

        }, time);

        time += self.delay; // delay each item moving in

      });


    },

    closeMenu: function () {

      var self = this,
          time = 0,
          target = self.toggle,
          $items = self.items,
          $reverseItems = $items.get().reverse(); // in reverse!

      $('.overlay__background').height(0);

      $.each($reverseItems, function (key, item) {

        setTimeout(function () {

          $(item).css({
            top: '100%',
            left: '100%'
          });

          // reset after last item is out
          if (key + 1 === $items.length) {

            self.multiStepAnimation({
              selector: '.overlay',
              steps: ['open', 'pre'],
              timeout: 500,
              method: 'removeClass'
            });
            self.multiStepAnimation({
              selector: target,
              steps: ['open', 'pre'],
              timeout: 250,
              method: 'removeClass'
            });

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

      // close banner if there is one
      if (self.banner.hasOwnProperty('state') && self.banner.state === 1) {
        self.banner.closeBanner();
      }

      if ($(this).hasClass('home')) {
        var animHeight = $('.site__hero').height();
        $('html,body').animate({ scrollTop: animHeight }, 500);
        return;
      }

      self.itemsHeight = $items.height();

      if (self.menu === 0) {
        self.openMenu();
      } else if (self.menu === 1){
        self.closeMenu();
      }

      self.menu = 2; //transition period cancels all clicks

    },

    blurImageHelper: function (e) {

      /**
       * repeated in two places...see navigation...fix
       */
      var mobi = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
      if (mobi()) {
        return;
      }

      var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') != -1) {
          if (ua.indexOf('chrome') > -1) {
            // don't disable chrome
          } else {
            // return; //disable safari for now
          }
        }


      var $this = $(this),
          styles = {
            top: $this.css('top'),
            left: $this.css('left')
          },
          self = e.data.context,
          data = $this.data(),
          w = $this.width(),
          h = $this.height();

      if (!data.state || data.state === false) {

        if ($this.hasClass('hover-helper')) { return; }
        console.log(e, this);
        $this.addClass('hover-helper');
        $this.find('.item__title').width(w).height(h);
        data.state = true;

      } else if (data.state === true) {

        $this.removeClass('hover-helper');
        setTimeout(function () {
          $this.find('.item__title').attr('style', '');
          // if (styles.top !== 'auto' && styles.left !== 'auto') {
          //   $this.attr('style', '').css({
          //     top: styles.top,
          //     left: styles.left
          //   });
          // } else {
          //   $this.attr('style', '');
          // }
        }, 500);
        data.state = false;

      }

    },

    events: {
      'click .nav__toggle' : 'toggleMenu',
      'mouseenter .grid__item' : 'blurImageHelper',
      'mouseleave .grid__item' : 'blurImageHelper',
      'mouseenter .overlay__item' : 'blurImageHelper',
      'mouseleave .overlay__item' : 'blurImageHelper'
    }

  });

  module.exports = Menu;

})(jQuery);
},{"../libs/flyweight":2}],6:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight = require('../libs/flyweight');

  var Navigation = Flyweight.Module.extend({

    name: 'Navigation',
    options: {
      banner: {} // passing in the banner to close on page change
    },
    initialize: function () {

      var self = this;
      this.baseUrl = window.location.protocol + "//" + window.location.host + '/';
      this.transitioning = false;
      this.land = true;
      this.where = Flyweight.history.getFragment();
      this.cache = {
        count: 0,
        locs: []
      };
      this.ignoreList = [
        '.nav-tabs a',
        '#admin-menu a',
        '.nav__toggle',
        '.footer__social a',
        '.info__social a',
        '.info__section a',
        '.content__header a',
        '.content__rows a',
        '.banner a'];
      this.markIgnored();

      // window.addEventListener('popstate', function (e) {
      //   self.loadPage.apply(self, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        if (self.land === true) {
          self.land = false;
          return;
        }
        self.browserEvent.apply(self, [e]);
      });

    },

    /**
     * Changes the page called by processClick() or browserEvent()
     * @param  {string} href  The destination path
     * @param  {string} where The destination
     * @return {null}       null
     */
    pageChange: function (href, where) {

      var self = this,
          route = where.split('/')[0],
          transitionClasses = {
            next: 'next',
            slideOut: 'slide-out'
          };

      // close banner if there is one
      if (self.banner.hasOwnProperty('state') && self.banner.state === 1) {
        self.banner.closeBanner();
      }

      if (route === '') {
        $('.nav__toggle').addClass('home');
      } else {
        $('.nav__toggle').removeClass('home');
      }

      if (self.land === true) { self.land = false; }

      // Start Transitioning
      $('body').addClass('loading');
      self.transitioning = true;
      $('html,body').animate({ scrollTop: 0 }, 500);
      // check if destination equals previous location
      self.cache.locs[self.cache.count] = self.where; // set cache to determine direction
      if (where === self.cache.locs[self.cache.count - 1]) {
        transitionClasses.next = 'inverse-next';
        transitionClasses.slideOut = 'inverse-slide-out';
        if (self.cache.count !== 0) { self.cache.count -= 1; }
      } else {
        self.cache.count += 1;
      }

      /**
       * Request new page
       */
      $.get(this.baseUrl + href, function (data) {

        var $data = $(data),
            $incomingMain = $data.filter('.main-content'),
            $original = $('.main-content'),
            $clone = $('.main-content').clone()
              .addClass(transitionClasses.next)
              .html($incomingMain.html()),
            T = 750;

        /**
         * Prepare original for departure
         * and append clone for arrival
         */
        $original.after($clone).addClass('prepare');

        /**
         * Add right class for internals on clone
         */
        if (route === 'project') {
          $clone.addClass('-internal');
        } else {
          $clone.removeClass('-internal');
        }

        /**
         * Delay classes by .1s for CSS animations to work
         */
        var slideClassesTimeout = setTimeout(function () {
          $clone.addClass('slide-in');
          $original.addClass(transitionClasses.slideOut);
        }, 100);

        /**
         * Delay pageChange() until CSS animations finish (_site.scss)
         */
        var pageChangeTimeout = setTimeout(function () {
          $original.remove();
          $clone.removeClass(transitionClasses.next + ' slide-in');
          // popstate changes address bar prematurely (normalize that)
          $(document).trigger('pageChange', { route: route });
        }, T);

        /**
         * Mark ignored links of incoming page
         */
        self.markIgnored();

        self.transitioning = false;
        document.title = $data.filter('title').text();
        self.where = where; // set location on Navigation object
        Flyweight.history.navigate(href, { trigger: true });

      }, 'html').fail(function (x, e) {
        console.log(x.status);
      });

    },

    // click only
    processClick: function (e) {

      if ($(this).hasClass('-ignored')) { return; }

      e.preventDefault();
      var self = e.data.context,
          href = $(this).attr('href'),
          where = Flyweight.history.getFragment(href);

      if (self.where === where || self.transitioning === true) { return; }
      self.pageChange(href, where);

    },

    // browser buttons
    browserEvent: function (e) {

      var where = Flyweight.history.getFragment(),
          href = where,
          self = this;

      // if its transitioning return...
      if (self.transitioning === true) { return; }

      var mobi = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };
      // if it is NOT mobile pageChange
      if (!mobi()) {
        self.pageChange(href, where);
      } else {
        location.href = "/" + href;
        return;
      }

    },

    markIgnored: function (arr) {
      // find all links that should'd be ajaxyfied
      var selectors = arr || this.ignoreList;
      setTimeout(function () {
        $.each(selectors, function (i, selector) {
          var $selector = $(selector);
          if (!$selector.hasClass('-ignored')) {
            $selector.addClass('-ignored');
          }
        });
      }, 1000); // find a better way to wait for the admin menu to load...

    },

    events: {
      'click a' : 'processClick'
    }

  });

  module.exports = Navigation;

})(jQuery);
},{"../libs/flyweight":2}],7:[function(require,module,exports){
(function ($) {

  "use strict";

  var Flyweight;

  if (typeof require === 'function' && typeof Flyweight !== 'function') {
    Flyweight = require('../libs/flyweight');
  }

  var Svg = Flyweight.Module.extend({

    name: 'Svg',
    el: '.site__hero',

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
        // console.log(k); // 1293 paths!!!
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
