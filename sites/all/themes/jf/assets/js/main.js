(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/imagesloaded.js":[function(require,module,exports){
/*!
 * imagesLoaded v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'eventEmitter/EventEmitter',
      'eventie/eventie'
    ], function( EventEmitter, eventie ) {
      return factory( window, EventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('wolfy87-eventemitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EventEmitter,
      window.eventie
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EventEmitter, eventie ) {

'use strict';

var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ImagesLoaded( elem, options, onAlways ) {
    // coerce ImagesLoaded() without new, to be new ImagesLoaded()
    if ( !( this instanceof ImagesLoaded ) ) {
      return new ImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ImagesLoaded.prototype = new EventEmitter();

  ImagesLoaded.prototype.options = {};

  ImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      var nodeType = elem.nodeType;
      if ( !nodeType || !( nodeType === 1 || nodeType === 9 || nodeType === 11 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.imagesLoaded = function( options, callback ) {
      var instance = new ImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new EventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new EventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ImagesLoaded;

});

},{"eventie":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/node_modules/eventie/eventie.js","wolfy87-eventemitter":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/node_modules/wolfy87-eventemitter/EventEmitter.js"}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/node_modules/eventie/eventie.js":[function(require,module,exports){
/*!
 * eventie v1.0.6
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( window );

},{}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/node_modules/wolfy87-eventemitter/EventEmitter.js":[function(require,module,exports){
/*!
 * EventEmitter v4.2.11 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function () {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

},{}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/app.js":[function(require,module,exports){
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
        console.log("stuff");
      },

      home: function () {

        if (Status.home === 0) {
          new Svg();
          Status.home = 1;
        }

        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          $mainContent.html(params.html);
          $body.removeClass('node-type-project');
          $mainContent.removeClass('-internal');
          // only need a new one ONCE this should reactivate it
          new Svg();
        });

      },

      about: function () {

        if (Status.about === 0) {
          new Forms();
          Status.about = 1;
        }

        $(document)
        .off('backEvent clickEvent')
        .on('backEvent clickEvent', function (e, params) {
          $mainContent.html(params.html);
          $body.removeClass('node-type-project');
          $mainContent.addClass('-internal');
          var forms = new Forms();
        });

      },

      project: function () {

        if (Status.project === 0) {
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

},{"imagesloaded":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/node_modules/imagesloaded/imagesloaded.js","libs/flyweight":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/libs/flyweight.js","modules/forms":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/forms.js","modules/navigation":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/navigation.js","modules/svg":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/svg.js"}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/libs/flyweight.js":[function(require,module,exports){
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

},{}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/forms.js":[function(require,module,exports){
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

},{"../libs/flyweight":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/libs/flyweight.js"}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/navigation.js":[function(require,module,exports){
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

      this.markIgnored([
        '.nav-tabs a',
        '.icon--grid'
      ]);

      // window.addEventListener('popstate', function (e) {
      //   _this.loadPage.apply(_this, [e]);
      // }, false);

      $(window).on('popstate', function (e) {
        e.preventDefault();
        _this.loadPage.apply(_this, [e]);
      });

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

      // console.log("i am going to:", where);
      // console.log("i am at:", _this.where);

      $.get(_this.baseUrl + href, function (data) {

        var $data = $(data);
        var $main = $data.filter('.main-content');

        // replace main content
        //$('.main-content').html($main.html());

        _this.where = where;
        Flyweight.history.navigate(href, { trigger: true });

        $(document).trigger('clickEvent', {
          html: $main.html()
        });

      }, 'html');

    },
    // browser buttons
    loadPage: function (e) {
      // ajax call
      var where = Flyweight.history.getFragment(),
          href = where,
          _this = this;

      $.get(_this.baseUrl + href, function (data) {
        var $data = $(data);
        var $main = $data.filter('.main-content');
        // replace main content
        // $('.main-content').html($main.html());

        $(document).trigger('backEvent', {
          html: $main.html()
        });

        _this.where = where;
        // Flyweight.history.navigate(href, { trigger: true });
      }, 'html');

    },

    markIgnored: function (selectors) {
      // find all links that should'd be ajaxyfied
      $.each(selectors, function (i, selector) {
        $(selector).addClass('-ignored');
      });
    },

    navOverlay: function (e) {

      // console.log(e.data.context);
      var $overlay = $('.overlay'),
          $items = $('.overlay .overlay__item'),
          width = $items.width(),
          height = $items.height(),
          posX = 0,
          posY = 0,
          timeout = 0,
          bodyHeight = $('body').height();

      $overlay.height(bodyHeight);

      $.each($items, function (k, v) {
        setTimeout(function () {
          $(v).css({
            top: posY,
            left: posX
          });
          if (posX < width*2) {
            posX += width;
          } else {
            posX = 0;
            posY += height;
          }
        }, timeout);

        timeout += 100;


      });

      console.log($items.width());

    },

    onDelegated: function (e) {
      // hi
    },

    events: {
      'click a' : 'processClick',
      'click .nav__toggle' : 'navOverlay'
    }

  });

  module.exports = Navigation;

})(jQuery);

},{"../libs/flyweight":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/libs/flyweight.js"}],"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/modules/svg.js":[function(require,module,exports){
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

},{"../libs/flyweight":"/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/libs/flyweight.js"}]},{},["/Users/lbauza/Sites/Personal/jimmyfrench/httpdocs/sites/all/themes/jf/src/js/app.js"]);
