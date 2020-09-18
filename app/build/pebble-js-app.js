/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }
	
	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;
	
	  // For Android (WebView-based) pkjs, print stacktrace for uncaught errors:
	  if (typeof window !== 'undefined' && window.addEventListener) {
	    window.addEventListener('error', function(event) {
	      if (event.error && event.error.stack) {
	        console.error('' + event.error + '\n' + event.error.stack);
	      }
	    });
	  }
	
	})(Pebble);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var UI = __webpack_require__(3);
	
	
	var leagues = new UI.Menu({
	  backgroundColor: 'white',
	  textColor: 'black',
	  highlightBackgroundColor: 'cadet-blue',
	  highlightTextColor: 'white',
	  sections: [{
	    title: 'Leagues',
	    items: [{
	      title: 'NFL',
	      icon: 'american_football.png'
	    }, {
	      title: 'MLB',
	      icon: 'baseball.png'
	    }, {
	      title: 'NHL',
	      icon: 'hockey_puck.png'
	    }, {
	      title: 'NBA',
	      icon: 'basketball.png'
	    }]
	  }]
	});
	
	
	leagues.on('select', function(e) {
	  getSportsData(e.item.title);
	});
	
	leagues.show();
	
	//this function receives 'sport' which is a string variable. It should be the title of a menu item like Hockey
	function getSportsData(sport) {
	  var APIURL = '';
	  if (sport == "NFL") {
	    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';
	  } else if (sport == "NHL") {
	    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard';
	  } else if (sport == "MLB") {
	    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard';
	  } else if (sport == "NBA") {
	    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard';
	  } else if (sport == "Soccer") {
	    APIURL = 'http://site.api.espn.com/apis/site/v2/sports/soccer/:league/scoreboard';
	    //if the sport is hockey, we set the API URL to the hockey API.
	    //find APIs here: https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b
	
	  } else {
	    console.log('need to add support for more sports!');
	  }
	
	  //now this part is a little high level, but we are basically going to request data from the API
	  //we will do this using an HTTP GET request
	  //this function is built right into javascript and made available by the pebble sdk and runtime environment
	  //the syntax is pretty tricky so don't think too hard about the section until you are ready
	  //the important thing is that the 'sportsData' object will be where the sport data is stored!
	  var req = new XMLHttpRequest();
	  req.open('GET', APIURL, true);
	  req.onload = function(e) {
	      if (req.readyState == 4) {
	        // 200 - HTTP OK
	          if(req.status == 200) {
	              var sportsData = JSON.parse(req.responseText); //<-right here
	              //console.log(JSON.stringify(sportsData)); // let's log it to console to see what came from the API
	              var games = sportsData.events; // after exploring a bit I found that games are actually an array inside this events object
	              var fullname = sportsData.name;
	              var date = sportsData;
	              // for (var i = 0; i < games.length; i++){
	              //this will loop through each game and show it's short name in the console
	              //console.log(games[i].shortName);
	              //there is a lot more data to explore but we can get to that later
	              showGamesMenu(sport, games);
	              }
	            }
	          }
	      req.send();
	}
	
	function showGamesMenu(sport, games){
	  var gameMenuItems = [];
	  for (var i = 0; i < games.length; i++){
	   var gameMenuItem = {
	     title: games[i].shortName,
	     subtitle: games[i].competitions[0].competitors[1].score + " to " + games[i].competitions[0].competitors[0].score
	   }
	   gameMenuItems.push(gameMenuItem);
	  }
	  var gameMenu = new UI.Menu({
	    backgroundColor: 'white',
	    textColor: 'black',
	    highlightBackgroundColor: 'cadet-blue',
	    highlightTextColor: 'white',
	    sections: [{
	      title: sport,
	      items: gameMenuItems
	    }]
	  });
	
	  gameMenu.show();
	
	}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var UI = {};
	
	UI.Vector2 = __webpack_require__(4);
	UI.Window = __webpack_require__(5);
	UI.Card = __webpack_require__(16);
	UI.Menu = __webpack_require__(17);
	UI.Rect = __webpack_require__(19);
	UI.Line = __webpack_require__(21);
	UI.Circle = __webpack_require__(22);
	UI.Radial = __webpack_require__(23);
	UI.Text = __webpack_require__(24);
	UI.TimeText = __webpack_require__(25);
	UI.Image = __webpack_require__(26);
	UI.Inverter = __webpack_require__(27);
	UI.Vibe = __webpack_require__(28);
	UI.Light = __webpack_require__(29);
	
	module.exports = UI;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Vector2 from three.js
	 * https://github.com/mrdoob/three.js
	 *
	 * @author mr.doob / http://mrdoob.com/
	 * @author philogb / http://blog.thejit.org/
	 * @author egraether / http://egraether.com/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 */
	
	/**
	 * Create a new vector with given dimensions.
	 * @param x
	 * @param y
	 */
	var Vector2 = function ( x, y ) {
	
	  this.x = x || 0;
	  this.y = y || 0;
	
	};
	
	Vector2.prototype = {
	
	  constructor: Vector2,
	
	  set: function ( x, y ) {
	
	    this.x = x;
	    this.y = y;
	
	    return this;
	
	  },
	
	  copy: function ( v ) {
	
	    this.x = v.x;
	    this.y = v.y;
	
	    return this;
	
	  },
	
	  clone: function () {
	
	    return new Vector2( this.x, this.y );
	
	  },
	
	  add: function ( v1, v2 ) {
	
	    this.x = v1.x + v2.x;
	    this.y = v1.y + v2.y;
	
	    return this;
	
	  },
	
	  addSelf: function ( v ) {
	
	    this.x += v.x;
	    this.y += v.y;
	
	    return this;
	
	  },
	
	  sub: function ( v1, v2 ) {
	
	    this.x = v1.x - v2.x;
	    this.y = v1.y - v2.y;
	
	    return this;
	
	  },
	
	  subSelf: function ( v ) {
	
	    this.x -= v.x;
	    this.y -= v.y;
	
	    return this;
	
	  },
	
	  multiplyScalar: function ( s ) {
	
	    this.x *= s;
	    this.y *= s;
	
	    return this;
	
	  },
	
	  divideScalar: function ( s ) {
	
	    if ( s ) {
	
	      this.x /= s;
	      this.y /= s;
	
	    } else {
	
	      this.set( 0, 0 );
	
	    }
	
	    return this;
	
	  },
	
	
	  negate: function() {
	
	    return this.multiplyScalar( -1 );
	
	  },
	
	  dot: function ( v ) {
	
	    return this.x * v.x + this.y * v.y;
	
	  },
	
	  lengthSq: function () {
	
	    return this.x * this.x + this.y * this.y;
	
	  },
	
	  length: function () {
	
	    return Math.sqrt( this.lengthSq() );
	
	  },
	
	  normalize: function () {
	
	    return this.divideScalar( this.length() );
	
	  },
	
	  distanceTo: function ( v ) {
	
	    return Math.sqrt( this.distanceToSquared( v ) );
	
	  },
	
	  distanceToSquared: function ( v ) {
	
	    var dx = this.x - v.x, dy = this.y - v.y;
	    return dx * dx + dy * dy;
	
	  },
	
	
	  setLength: function ( l ) {
	
	    return this.normalize().multiplyScalar( l );
	
	  },
	
	  equals: function( v ) {
	
	    return ( ( v.x === this.x ) && ( v.y === this.y ) );
	
	  }
	
	};
	
	if (true) {
	  module.exports = Vector2;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Emitter = __webpack_require__(8);
	var Vector2 = __webpack_require__(4);
	var Feature = __webpack_require__(9);
	var Accel = __webpack_require__(11);
	var WindowStack = __webpack_require__(12);
	var Propable = __webpack_require__(14);
	var Stage = __webpack_require__(15);
	var simply = __webpack_require__(13);
	
	var buttons = [
	  'back',
	  'up',
	  'select',
	  'down',
	];
	
	var configProps = [
	  'fullscreen',
	  'style',
	  'scrollable',
	  'paging',
	  'backgroundColor',
	];
	
	var statusProps = [
	  'status',
	  'separator',
	  'color',
	  'backgroundColor',
	];
	
	var actionProps = [
	  'action',
	  'up',
	  'select',
	  'back',
	  'backgroundColor',
	];
	
	var accessorProps = configProps;
	
	var nestedProps = [
	  'action',
	  'status',
	];
	
	var defaults = {
	  status: false,
	  backgroundColor: 'black',
	  scrollable: false,
	  paging: Feature.round(true, false),
	};
	
	var nextId = 1;
	
	var checkProps = function(def) {
	  if (!def) return;
	  if ('fullscreen' in def) {
	    console.warn('`fullscreen` has been deprecated by `status` which allows settings\n\t' +
	                 'its color and separator in a similar manner to the `action` property.\n\t' +
	                 'Remove usages of `fullscreen` to enable usage of `status`.', 2);
	  }
	};
	
	var Window = function(windowDef) {
	  checkProps(windowDef);
	  this.state = myutil.shadow(defaults, windowDef || {});
	  this.state.id = nextId++;
	  this._buttonInit();
	  this._items = [];
	  this._dynamic = true;
	  this._size = new Vector2();
	  this.size(); // calculate and set the size
	};
	
	Window._codeName = 'window';
	
	util2.copy(Emitter.prototype, Window.prototype);
	
	util2.copy(Propable.prototype, Window.prototype);
	
	util2.copy(Stage.prototype, Window.prototype);
	
	Propable.makeAccessors(accessorProps, Window.prototype);
	
	Propable.makeNestedAccessors(nestedProps, Window.prototype);
	
	Window.prototype._id = function() {
	  return this.state.id;
	};
	
	Window.prototype._prop = function(def, clear, pushing) {
	  checkProps(def);
	  Stage.prototype._prop.call(this, def, clear, pushing);
	};
	
	Window.prototype._hide = function(broadcast) {
	  if (broadcast === false) { return; }
	  simply.impl.windowHide(this._id());
	};
	
	Window.prototype.hide = function() {
	  WindowStack.remove(this, true);
	  return this;
	};
	
	Window.prototype._show = function(pushing) {
	  this._prop(this.state, true, pushing || false);
	  this._buttonConfig({});
	  if (this._dynamic) {
	    Stage.prototype._show.call(this, pushing);
	  }
	};
	
	Window.prototype.show = function() {
	  WindowStack.push(this);
	  return this;
	};
	
	Window.prototype._insert = function() {
	  if (this._dynamic) {
	    Stage.prototype._insert.apply(this, arguments);
	  }
	};
	
	Window.prototype._remove = function() {
	  if (this._dynamic) {
	    Stage.prototype._remove.apply(this, arguments);
	  }
	};
	
	Window.prototype._clearStatus = function() {
	  statusProps.forEach(Propable.unset.bind(this.state.status));
	};
	
	Window.prototype._clearAction = function() {
	  actionProps.forEach(Propable.unset.bind(this.state.action));
	};
	
	Window.prototype._clear = function(flags_) {
	  var flags = myutil.toFlags(flags_);
	  if (myutil.flag(flags, 'action')) {
	    this._clearAction();
	  }
	  if (myutil.flag(flags, 'status')) {
	    this._clearStatus();
	  }
	  if (flags_ === true || flags_ === undefined) {
	    Propable.prototype._clear.call(this);
	  }
	};
	
	Window.prototype._action = function(actionDef) {
	  if (this === WindowStack.top()) {
	    simply.impl.windowActionBar(actionDef);
	  }
	};
	
	Window.prototype._status = function(statusDef) {
	  if (this === WindowStack.top()) {
	    simply.impl.windowStatusBar(statusDef);
	  }
	};
	
	var isBackEvent = function(type, subtype) {
	  return ((type === 'click' || type === 'longClick') && subtype === 'back');
	};
	
	Window.prototype.onAddHandler = function(type, subtype) {
	  if (isBackEvent(type, subtype)) {
	    this._buttonAutoConfig();
	  }
	  if (type === 'accelData') {
	    Accel.autoSubscribe();
	  }
	};
	
	Window.prototype.onRemoveHandler = function(type, subtype) {
	  if (!type || isBackEvent(type, subtype)) {
	    this._buttonAutoConfig();
	  }
	  if (!type || type === 'accelData') {
	    Accel.autoSubscribe();
	  }
	};
	
	Window.prototype._buttonInit = function() {
	  this._button = {
	    config: {},
	    configMode: 'auto',
	  };
	  for (var i = 0, ii = buttons.length; i < ii; i++) {
	    var button = buttons[i];
	    if (button !== 'back') {
	      this._button.config[buttons[i]] = true;
	    }
	  }
	};
	
	/**
	 * The button configuration parameter for {@link simply.buttonConfig}.
	 * The button configuration allows you to enable to disable buttons without having to register or unregister handlers if that is your preferred style.
	 * You may also enable the back button manually as an alternative to registering a click handler with 'back' as its subtype using {@link simply.on}.
	 * @typedef {object} simply.buttonConf
	 * @property {boolean} [back] - Whether to enable the back button. Initializes as false. Simply.js can also automatically register this for you based on the amount of click handlers with subtype 'back'.
	 * @property {boolean} [up] - Whether to enable the up button. Initializes as true. Note that this is disabled when using {@link simply.scrollable}.
	 * @property {boolean} [select] - Whether to enable the select button. Initializes as true.
	 * @property {boolean} [down] - Whether to enable the down button. Initializes as true. Note that this is disabled when using {@link simply.scrollable}.
	 */
	
	/**
	 * Changes the button configuration.
	 * See {@link simply.buttonConfig}
	 * @memberOf simply
	 * @param {simply.buttonConfig} buttonConf - An object defining the button configuration.
	 */
	Window.prototype._buttonConfig = function(buttonConf, auto) {
	  if (buttonConf === undefined) {
	    var config = {};
	    for (var i = 0, ii = buttons.length; i < ii; ++i) {
	      var name = buttons[i];
	      config[name] = this._button.config[name];
	    }
	    return config;
	  }
	  for (var k in buttonConf) {
	    if (buttons.indexOf(k) !== -1) {
	      if (k === 'back') {
	        this._button.configMode = buttonConf.back && !auto ? 'manual' : 'auto';
	      }
	      this._button.config[k] = buttonConf[k];
	    }
	  }
	  if (simply.impl.windowButtonConfig) {
	    return simply.impl.windowButtonConfig(this._button.config);
	  }
	};
	
	Window.prototype.buttonConfig = function(buttonConf) {
	  this._buttonConfig(buttonConf);
	};
	
	Window.prototype._buttonAutoConfig = function() {
	  if (!this._button || this._button.configMode !== 'auto') {
	    return;
	  }
	  var singleBackCount = this.listenerCount('click', 'back');
	  var longBackCount = this.listenerCount('longClick', 'back');
	  var useBack = singleBackCount + longBackCount > 0;
	  if (useBack !== this._button.config.back) {
	    this._button.config.back = useBack;
	    return this._buttonConfig(this._button.config, true);
	  }
	};
	
	Window.prototype.size = function() {
	  var state = this.state;
	  var size = this._size.copy(Feature.resolution());
	  if ('status' in state && state.status !== false) {
	    size.y -= Feature.statusBarHeight();
	  } else if ('fullscreen' in state && state.fullscreen === false) {
	    size.y -= Feature.statusBarHeight();
	  }
	  if ('action' in state && state.action !== false) {
	    size.x -= Feature.actionBarWidth();
	  }
	  return size;
	};
	
	Window.prototype._toString = function() {
	  return '[' + this.constructor._codeName + ' ' + this._id() + ']';
	};
	
	Window.prototype._emit = function(type, subtype, e) {
	  e.window = this;
	  var klass = this.constructor;
	  if (klass) {
	    e[klass._codeName] = this;
	  }
	  if (this.emit(type, subtype, e) === false) {
	    return false;
	  }
	};
	
	Window.prototype._emitShow = function(type) {
	  return this._emit(type, null, {});
	};
	
	Window.emit = function(type, subtype, e) {
	  var wind = WindowStack.top();
	  if (wind) {
	    return wind._emit(type, subtype, e);
	  }
	};
	
	/**
	 * Simply.js button click event. This can either be a single click or long click.
	 * Use the event type 'click' or 'longClick' to subscribe to these events.
	 * @typedef simply.clickEvent
	 * @property {string} button - The button that was pressed: 'back', 'up', 'select', or 'down'. This is also the event subtype.
	 */
	
	Window.emitClick = function(type, button) {
	  var e = {
	    button: button,
	  };
	  return Window.emit(type, button, e);
	};
	
	module.exports = Window;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 * util2.js by Meiguro - MIT License
	 */
	
	var util2 = (function(){
	
	var util2 = {};
	
	util2.noop = function() {};
	
	util2.count = function(o) {
	  var i = 0;
	  for (var k in o) { ++i; }
	  return i;
	};
	
	util2.copy = function(a, b) {
	  b = b || (a instanceof Array ? [] : {});
	  for (var k in a) { b[k] = a[k]; }
	  return b;
	};
	
	util2.toInteger = function(x) {
	  if (!isNaN(x = parseInt(x))) { return x; }
	};
	
	util2.toNumber = function(x) {
	  if (!isNaN(x = parseFloat(x))) { return x; }
	};
	
	util2.toString = function(x) {
	  return typeof x === 'object' ? JSON.stringify.apply(this, arguments) : '' + x;
	};
	
	util2.toArray = function(x) {
	  if (x instanceof Array) { return x; }
	  if (x[0]) { return util2.copy(x, []); }
	  return [x];
	};
	
	util2.trim = function(s) {
	  return s ? s.toString().trim() : s;
	};
	
	util2.last = function(a) {
	  return a[a.length-1];
	};
	
	util2.inherit = function(child, parent, proto) {
	  child.prototype = Object.create(parent.prototype);
	  child.prototype.constructor = child;
	  if (proto) {
	    util2.copy(proto, child.prototype);
	  }
	  return child.prototype;
	};
	
	var chunkSize = 128;
	
	var randomBytes = function(chunkSize) {
	  var z = [];
	  for (var i = 0; i < chunkSize; ++i) {
	    z[i] = String.fromCharCode(Math.random() * 256);
	  }
	  return z.join('');
	};
	
	util2.randomString = function(regex, size, acc) {
	  if (!size) {
	    return '';
	  }
	  if (typeof regex === 'string') {
	    regex = new RegExp('(?!'+regex+')[\\s\\S]', 'g');
	  }
	  acc = acc || '';
	  var buf = randomBytes(chunkSize);
	  if (buf) {
	    acc += buf.replace(regex, '');
	  }
	  if (acc.length >= size) {
	    return acc.substr(0, size);
	  } else {
	    return util2.randomString(regex, size, acc);
	  }
	};
	
	var varpat = new RegExp("^([\\s\\S]*?)\\$([_a-zA-Z0-9]+)", "m");
	
	util2.format = function(text, table) {
	  var m, z = '';
	  while ((m = text.match(varpat))) {
	    var subtext = m[0], value = table[m[2]];
	    if (typeof value === 'function') { value = value(); }
	    z += value !== undefined ? m[1] + value.toString() : subtext;
	    text = text.substring(subtext.length);
	  }
	  z += text;
	  return z;
	};
	
	if (true) {
	  module.exports = util2;
	}
	
	return util2;
	
	})();


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	
	var myutil = {};
	
	myutil.shadow = function(a, b) {
	  for (var k in a) {
	    if (typeof b[k] === 'undefined') {
	      b[k] = a[k];
	    }
	  }
	  return b;
	};
	
	myutil.defun = function(fn, fargs, fbody) {
	  if (!fbody) {
	    fbody = fargs;
	    fargs = [];
	  }
	  return new Function('return function ' + fn + '(' + fargs.join(', ') + ') {' + fbody + '}')();
	};
	
	myutil.slog = function() {
	  var args = [];
	  for (var i = 0, ii = arguments.length; i < ii; ++i) {
	    args[i] = util2.toString(arguments[i]);
	  }
	  return args.join(' ');
	};
	
	myutil.toObject = function(key, value) {
	  if (typeof key === 'object') {
	    return key;
	  }
	  var obj = {};
	  obj[key] = value;
	  return obj;
	};
	
	myutil.flag = function(flags) {
	  if (typeof flags === 'boolean') {
	    return flags;
	  }
	  for (var i = 1, ii = arguments.length; i < ii; ++i) {
	    if (flags[arguments[i]]) {
	      return true;
	    }
	  }
	  return false;
	};
	
	myutil.toFlags = function(flags) {
	  if (typeof flags === 'string') {
	    flags = myutil.toObject(flags, true);
	  } else {
	    flags = !!flags;
	  }
	  return flags;
	};
	
	/**
	 * Returns an absolute path based on a root path and a relative path.
	 */
	myutil.abspath = function(root, path) {
	  if (!path) {
	    path = root;
	  }
	  if (path.match(/^\/\//)) {
	    var m = root && root.match(/^(\w+:)\/\//);
	    path = (m ? m[1] : 'http:') + path;
	  }
	  if (root && !path.match(/^\w+:\/\//)) {
	    path = root + path;
	  }
	  return path;
	};
	
	/**
	 *  Converts a name to a C constant name format of UPPER_CASE_UNDERSCORE.
	 */
	myutil.toCConstantName = function(x) {
	  x = x.toUpperCase();
	  x = x.replace(/[- ]/g, '_');
	  return x;
	};
	
	module.exports = myutil;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	
	var Emitter = function() {
	  this._events = {};
	};
	
	Emitter.prototype.wrapHandler = function(handler) {
	  return handler;
	};
	
	Emitter.prototype._on = function(type, subtype, handler) {
	  var typeMap = this._events || ( this._events = {} );
	  var subtypeMap = typeMap[type] || ( typeMap[type] = {} );
	  (subtypeMap[subtype] || ( subtypeMap[subtype] = [] )).push({
	    id: handler,
	    handler: this.wrapHandler(handler),
	  });
	};
	
	Emitter.prototype._off = function(type, subtype, handler) {
	  if (!type) {
	    this._events = {};
	    return;
	  }
	  var typeMap = this._events;
	  if (!handler && subtype === 'all') {
	    delete typeMap[type];
	    return;
	  }
	  var subtypeMap = typeMap[type];
	  if (!subtypeMap) { return; }
	  if (!handler) {
	    delete subtypeMap[subtype];
	    return;
	  }
	  var handlers = subtypeMap[subtype];
	  if (!handlers) { return; }
	  var index = -1;
	  for (var i = 0, ii = handlers.length; i < ii; ++i) {
	    if (handlers[i].id === handler) {
	      index = i;
	      break;
	    }
	  }
	  if (index === -1) { return; }
	  handlers.splice(index, 1);
	};
	
	Emitter.prototype.on = function(type, subtype, handler) {
	  if (!handler) {
	    handler = subtype;
	    subtype = 'all';
	  }
	  this._on(type, subtype, handler);
	  if (Emitter.onAddHandler) {
	    Emitter.onAddHandler(type, subtype, handler);
	  }
	  if (this.onAddHandler) {
	    this.onAddHandler(type, subtype, handler);
	  }
	};
	
	Emitter.prototype.off = function(type, subtype, handler) {
	  if (!handler) {
	    handler = subtype;
	    subtype = 'all';
	  }
	  this._off(type, subtype, handler);
	  if (Emitter.onRemoveHandler) {
	    Emitter.onRemoveHandler(type, subtype, handler);
	  }
	  if (this.onRemoveHandler) {
	    this.onRemoveHandler(type, subtype, handler);
	  }
	};
	
	Emitter.prototype.listeners = function(type, subtype) {
	  if (!subtype) {
	    subtype = 'all';
	  }
	  var typeMap = this._events;
	  if (!typeMap) { return; }
	  var subtypeMap = typeMap[type];
	  if (!subtypeMap) { return; }
	  return subtypeMap[subtype];
	};
	
	Emitter.prototype.listenerCount = function(type, subtype) {
	  var listeners = this.listeners(type, subtype);
	  return listeners ? listeners.length : 0;
	};
	
	Emitter.prototype.forEachListener = function(type, subtype, callback) {
	  var typeMap = this._events;
	  if (!typeMap) { return; }
	  var subtypeMap;
	  if (typeof callback === 'function') {
	    var handlers = this.listeners(type, subtype);
	    if (!handlers) { return; }
	    for (var i = 0, ii = handlers.length; i < ii; ++i) {
	      callback.call(this, type, subtype, handlers[i]);
	    }
	  } else if (typeof subtype === 'function') {
	    callback = subtype;
	    subtypeMap = typeMap[type];
	    if (!subtypeMap) { return; }
	    for (subtype in subtypeMap) {
	      this.forEachListener(type, subtype, callback);
	    }
	  } else if (typeof type === 'function') {
	    callback = type;
	    for (type in typeMap) {
	      this.forEachListener(type, callback);
	    }
	  }
	};
	
	var emitToHandlers = function(type, handlers, e) {
	  if (!handlers) { return; }
	  for (var i = 0, ii = handlers.length; i < ii; ++i) {
	    var handler = handlers[i].handler;
	    if (handler.call(this, e, type, i) === false) {
	      return false;
	    }
	  }
	  return true;
	};
	
	Emitter.prototype.emit = function(type, subtype, e) {
	  if (!e) {
	    e = subtype;
	    subtype = null;
	  }
	  e.type = type;
	  if (subtype) {
	    e.subtype = subtype;
	  }
	  var typeMap = this._events;
	  if (!typeMap) { return; }
	  var subtypeMap = typeMap[type];
	  if (!subtypeMap) { return; }
	  var hadSubtype = emitToHandlers.call(this, type, subtypeMap[subtype], e);
	  if (hadSubtype === false) {
	    return false;
	  }
	  var hadAll = emitToHandlers.call(this, type, subtypeMap.all, e);
	  if (hadAll === false) {
	    return false;
	  }
	  if (hadSubtype || hadAll) {
	    return true;
	  }
	};
	
	module.exports = Emitter;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var Vector2 = __webpack_require__(4);
	var Platform = __webpack_require__(10);
	
	var Feature = module.exports;
	
	Feature.platform = function(map, yes, no) {
	  var v = map[Platform.version()] || map.unknown;
	  var rv;
	  if (v && yes !== undefined) {
	    rv = typeof yes === 'function' ? yes(v) : yes;
	  } else if (!v && no !== undefined) {
	    rv = typeof no === 'function' ? no(v) : no;
	  }
	  return rv !== undefined ? rv : v;
	};
	
	Feature.makePlatformTest = function(map) {
	  return function(yes, no) {
	    return Feature.platform(map, yes, no);
	  };
	};
	
	Feature.blackAndWhite = Feature.makePlatformTest({
	  aplite: true,
	  basalt: false,
	  chalk: false,
	  diorite: true,
	  emery: false,
	});
	
	Feature.color = Feature.makePlatformTest({
	  aplite: false,
	  basalt: true,
	  chalk: true,
	  diorite: false,
	  emery: true,
	});
	
	Feature.rectangle = Feature.makePlatformTest({
	  aplite: true,
	  basalt: true,
	  chalk: false,
	  diorite: true,
	  emery: true,
	});
	
	Feature.round = Feature.makePlatformTest({
	  aplite: false,
	  basalt: false,
	  chalk: true,
	  diorite: false,
	  emery: false,
	});
	
	Feature.microphone = Feature.makePlatformTest({
	  aplite: false,
	  basalt: true,
	  chalk: true,
	  diorite: true,
	  emery: true,
	});
	
	Feature.resolution = Feature.makePlatformTest({
	  aplite: new Vector2(144, 168),
	  basalt: new Vector2(144, 168),
	  chalk: new Vector2(180, 180),
	  diorite: new Vector2(144, 168),
	  emery: new Vector2(200, 228),
	});
	
	Feature.actionBarWidth = function() {
	  return Feature.rectangle(30, 40);
	};
	
	Feature.statusBarHeight = function() {
	  return 16;
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var Platform = module.exports;
	
	Platform.version = function() {
	  if (Pebble.getActiveWatchInfo) {
	    return Pebble.getActiveWatchInfo().platform;
	  } else {
	    return 'aplite';
	  }
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var Emitter = __webpack_require__(8);
	
	var Accel = new Emitter();
	
	module.exports = Accel;
	
	var WindowStack = __webpack_require__(12);
	var Window = __webpack_require__(5);
	var simply = __webpack_require__(13);
	
	var state;
	
	Accel.init = function() {
	  if (state) {
	    Accel.off();
	  }
	
	  state = Accel.state = {
	    rate: 100,
	    samples: 25,
	    subscribe: false,
	    subscribeMode: 'auto',
	    listeners: [],
	  };
	};
	
	Accel.onAddHandler = function(type, subtype) {
	  if (type === 'data') {
	    Accel.autoSubscribe();
	  }
	};
	
	Accel.onRemoveHandler = function(type, subtype) {
	  if (!type || type === 'accelData') {
	    Accel.autoSubscribe();
	  }
	};
	
	var accelDataListenerCount = function() {
	  var count = Accel.listenerCount('data');
	  var wind = WindowStack.top();
	  if (wind) {
	    count += wind.listenerCount('accelData');
	  }
	  return count;
	};
	
	Accel.autoSubscribe = function() {
	  if (state.subscribeMode !== 'auto') { return; }
	  var subscribe = (accelDataListenerCount() > 0);
	  if (subscribe !== state.subscribe) {
	    return Accel.config(subscribe, true);
	  }
	};
	
	/**
	 * The accelerometer configuration parameter for {@link simply.accelConfig}.
	 * The accelerometer data stream is useful for applications such as gesture recognition when accelTap is too limited.
	 * However, keep in mind that smaller batch sample sizes and faster rates will drastically impact the battery life of both the Pebble and phone because of the taxing use of the processors and Bluetooth modules.
	 * @typedef {object} simply.accelConf
	 * @property {number} [rate] - The rate accelerometer data points are generated in hertz. Valid values are 10, 25, 50, and 100. Initializes as 100.
	 * @property {number} [samples] - The number of accelerometer data points to accumulate in a batch before calling the event handler. Valid values are 1 to 25 inclusive. Initializes as 25.
	 * @property {boolean} [subscribe] - Whether to subscribe to accelerometer data events. {@link simply.accelPeek} cannot be used when subscribed. Simply.js will automatically (un)subscribe for you depending on the amount of accelData handlers registered.
	 */
	
	/**
	 * Changes the accelerometer configuration.
	 * See {@link simply.accelConfig}
	 * @memberOf simply
	 * @param {simply.accelConfig} accelConf - An object defining the accelerometer configuration.
	 */
	Accel.config = function(opt, auto) {
	  if (arguments.length === 0) {
	    return {
	      rate: state.rate,
	      samples: state.samples,
	      subscribe: state.subscribe,
	    };
	  } else if (typeof opt === 'boolean') {
	    opt = { subscribe: opt };
	  }
	  for (var k in opt) {
	    if (k === 'subscribe') {
	      state.subscribeMode = opt[k] && !auto ? 'manual' : 'auto';
	    }
	    state[k] = opt[k];
	  }
	  return simply.impl.accelConfig(Accel.config());
	};
	
	/**
	 * Peeks at the current accelerometer values.
	 * @memberOf simply
	 * @param {simply.eventHandler} callback - A callback function that will be provided the accel data point as an event.
	 */
	Accel.peek = function(callback) {
	  if (state.subscribe) {
	    throw new Error('Cannot use accelPeek when listening to accelData events');
	  }
	  return simply.impl.accelPeek.apply(this, arguments);
	};
	
	/**
	 * Simply.js accel tap event.
	 * Use the event type 'accelTap' to subscribe to these events.
	 * @typedef simply.accelTapEvent
	 * @property {string} axis - The axis the tap event occurred on: 'x', 'y', or 'z'. This is also the event subtype.
	 * @property {number} direction - The direction of the tap along the axis: 1 or -1.
	 */
	
	Accel.emitAccelTap = function(axis, direction) {
	  var e = {
	    axis: axis,
	    direction: direction,
	  };
	  if (Window.emit('accelTap', axis, e) === false) {
	    return false;
	  }
	  Accel.emit('tap', axis, e);
	};
	
	/**
	 * Simply.js accel data point.
	 * Typical values for gravity is around -1000 on the z axis.
	 * @typedef simply.accelPoint
	 * @property {number} x - The acceleration across the x-axis.
	 * @property {number} y - The acceleration across the y-axis.
	 * @property {number} z - The acceleration across the z-axis.
	 * @property {boolean} vibe - Whether the watch was vibrating when measuring this point.
	 * @property {number} time - The amount of ticks in millisecond resolution when measuring this point.
	 */
	
	/**
	 * Simply.js accel data event.
	 * Use the event type 'accelData' to subscribe to these events.
	 * @typedef simply.accelDataEvent
	 * @property {number} samples - The number of accelerometer samples in this event.
	 * @property {simply.accelPoint} accel - The first accel in the batch. This is provided for convenience.
	 * @property {simply.accelPoint[]} accels - The accelerometer samples in an array.
	 */
	
	Accel.emitAccelData = function(accels, callback) {
	  var e = {
	    samples: accels.length,
	    accel: accels[0],
	    accels: accels,
	  };
	  if (callback) {
	    return callback(e);
	  }
	  if (Window.emit('accelData', null, e) === false) {
	    return false;
	  }
	  Accel.emit('data', e);
	};
	
	Accel.init();


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Emitter = __webpack_require__(8);
	var simply = __webpack_require__(13);
	
	var WindowStack = function() {
	  this.init();
	};
	
	util2.copy(Emitter.prototype, WindowStack.prototype);
	
	WindowStack.prototype.init = function() {
	  this.off();
	  this._items = [];
	
	};
	
	WindowStack.prototype.top = function() {
	  return util2.last(this._items);
	};
	
	WindowStack.prototype._emitShow = function(item) {
	  item.forEachListener(item.onAddHandler);
	  item._emitShow('show');
	
	  var e = {
	    window: item
	  };
	  this.emit('show', e);
	};
	
	WindowStack.prototype._emitHide = function(item) {
	  var e = {
	    window: item
	  };
	  this.emit('hide', e);
	
	  item._emitShow('hide');
	  item.forEachListener(item.onRemoveHandler);
	};
	
	WindowStack.prototype._show = function(item, pushing) {
	  if (!item) { return; }
	  item._show(pushing);
	  this._emitShow(item);
	};
	
	WindowStack.prototype._hide = function(item, broadcast) {
	  if (!item) { return; }
	  this._emitHide(item);
	  item._hide(broadcast);
	};
	
	WindowStack.prototype.at = function(index) {
	  return this._items[index];
	};
	
	WindowStack.prototype.index = function(item) {
	  return this._items.indexOf(item);
	};
	
	WindowStack.prototype.push = function(item) {
	  if (item === this.top()) { return; }
	  this.remove(item);
	  var prevTop = this.top();
	  this._items.push(item);
	  this._show(item, true);
	  this._hide(prevTop, false);
	  console.log('(+) ' + item._toString() + ' : ' + this._toString());
	};
	
	WindowStack.prototype.pop = function(broadcast) {
	  return this.remove(this.top(), broadcast);
	};
	
	WindowStack.prototype.remove = function(item, broadcast) {
	  if (typeof item === 'number') {
	    item = this.get(item);
	  }
	  if (!item) { return; }
	  var index = this.index(item);
	  if (index === -1) { return item; }
	  var wasTop = (item === this.top());
	  this._items.splice(index, 1);
	  if (wasTop) {
	    var top = this.top();
	    this._show(top);
	    this._hide(item, top && top.constructor === item.constructor ? false : broadcast);
	  }
	  console.log('(-) ' + item._toString() + ' : ' + this._toString());
	  return item;
	};
	
	WindowStack.prototype.get = function(windowId) {
	  var items = this._items;
	  for (var i = 0, ii = items.length; i < ii; ++i) {
	    var wind = items[i];
	    if (wind._id() === windowId) {
	      return wind;
	    }
	  }
	};
	
	WindowStack.prototype.each = function(callback) {
	  var items = this._items;
	  for (var i = 0, ii = items.length; i < ii; ++i) {
	    if (callback(items[i], i) === false) {
	      break;
	    }
	  }
	};
	
	WindowStack.prototype.length = function() {
	  return this._items.length;
	};
	
	WindowStack.prototype.emitHide = function(windowId) {
	  var wind = this.get(windowId);
	  if (wind !== this.top()) { return; }
	  this.remove(wind);
	};
	
	WindowStack.prototype._toString = function() {
	  return this._items.map(function(x){ return x._toString(); }).join(',');
	};
	
	module.exports = new WindowStack();


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	/**
	 * This file provides an easy way to switch the actual implementation used by all the
	 * ui objects.
	 *
	 * simply.impl provides the actual communication layer to the hardware.
	 */
	
	var simply = {};
	
	// Override this with the actual implementation you want to use.
	simply.impl = undefined;
	
	module.exports = simply;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	
	var Propable = function(def) {
	  this.state = def || {};
	};
	
	Propable.unset = function(k) {
	  delete this[k];
	};
	
	Propable.makeAccessor = function(k) {
	  return function(value) {
	    if (arguments.length === 0) {
	      return this.state[k];
	    }
	    this.state[k] = value;
	    this._prop(myutil.toObject(k, value));
	    return this;
	  };
	};
	
	Propable.makeNestedAccessor = function(k) {
	  var _k = '_' + k;
	  return function(field, value, clear) {
	    var nest = this.state[k];
	    if (arguments.length === 0) {
	      return nest;
	    }
	    if (arguments.length === 1 && typeof field === 'string') {
	      return typeof nest === 'object' ? nest[field] : undefined;
	    }
	    if (typeof field === 'boolean') {
	      value = field;
	      field = k;
	    }
	    if (typeof field === 'object') {
	      clear = value;
	      value = undefined;
	    }
	    if (clear) {
	      this._clear(k);
	    }
	    if (field !== undefined && typeof nest !== 'object') {
	      nest = this.state[k] = {};
	    }
	    if (field !== undefined && typeof nest === 'object') {
	      util2.copy(myutil.toObject(field, value), nest);
	    }
	    if (this[_k]) {
	      this[_k](nest);
	    }
	    return this;
	  };
	};
	
	Propable.makeAccessors = function(props, proto) {
	  proto = proto || {};
	  props.forEach(function(k) {
	    proto[k] = Propable.makeAccessor(k);
	  });
	  return proto;
	};
	
	Propable.makeNestedAccessors = function(props, proto) {
	  proto = proto || {};
	  props.forEach(function(k) {
	    proto[k] = Propable.makeNestedAccessor(k);
	  });
	  return proto;
	};
	
	Propable.prototype.unset = function(k) {
	  delete this.state[k];
	};
	
	Propable.prototype._clear = function(k) {
	  if (k === undefined || k === true) {
	    this.state = {};
	  } else if (k !== false) {
	    this.state[k] = {};
	  }
	};
	
	Propable.prototype._prop = function(def) {
	};
	
	Propable.prototype.prop = function(field, value, clear) {
	  if (arguments.length === 0) {
	    return util2.copy(this.state);
	  }
	  if (arguments.length === 1 && typeof field !== 'object') {
	    return this.state[field];
	  }
	  if (typeof field === 'object') {
	    clear = value;
	  }
	  if (clear) {
	    this._clear(true);
	  }
	  var def = myutil.toObject(field, value);
	  util2.copy(def, this.state);
	  this._prop(def);
	  return this;
	};
	
	module.exports = Propable;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var Emitter = __webpack_require__(8);
	var WindowStack = __webpack_require__(12);
	var simply = __webpack_require__(13);
	
	var Stage = function(stageDef) {
	  this.state = stageDef || {};
	  this._items = [];
	};
	
	Stage.RectType = 1;
	Stage.CircleType = 2;
	Stage.RadialType = 6;
	Stage.TextType = 3;
	Stage.ImageType = 4;
	Stage.InverterType = 5;
	
	util2.copy(Emitter.prototype, Stage.prototype);
	
	Stage.prototype._show = function() {
	  this.each(function(element, index) {
	    element._reset();
	    this._insert(index, element);
	  }.bind(this));
	};
	
	Stage.prototype._prop = function() {
	  if (this === WindowStack.top()) {
	    simply.impl.stage.apply(this, arguments);
	  }
	};
	
	Stage.prototype.each = function(callback) {
	  this._items.forEach(callback);
	  return this;
	};
	
	Stage.prototype.at = function(index) {
	  return this._items[index];
	};
	
	Stage.prototype.index = function(element) {
	  return this._items.indexOf(element);
	};
	
	Stage.prototype._insert = function(index, element) {
	  if (this === WindowStack.top()) {
	    simply.impl.stageElement(element._id(), element._type(), element.state, index);
	  }
	};
	
	Stage.prototype._remove = function(element, broadcast) {
	  if (broadcast === false) { return; }
	  if (this === WindowStack.top()) {
	    simply.impl.stageRemove(element._id());
	  }
	};
	
	Stage.prototype.insert = function(index, element) {
	  element.remove(false);
	  this._items.splice(index, 0, element);
	  element.parent = this;
	  this._insert(this.index(element), element);
	  return this;
	};
	
	Stage.prototype.add = function(element) {
	  return this.insert(this._items.length, element);
	};
	
	Stage.prototype.remove = function(element, broadcast) {
	  var index = this.index(element);
	  if (index === -1) { return this; }
	  this._remove(element, broadcast);
	  this._items.splice(index, 1);
	  delete element.parent;
	  return this;
	};
	
	module.exports = Stage;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Emitter = __webpack_require__(8);
	var WindowStack = __webpack_require__(12);
	var Propable = __webpack_require__(14);
	var Window = __webpack_require__(5);
	var simply = __webpack_require__(13);
	
	var textProps = [
	  'title',
	  'subtitle',
	  'body',
	];
	
	var textColorProps = [
	  'titleColor',
	  'subtitleColor',
	  'bodyColor',
	];
	
	var imageProps = [
	  'icon',
	  'subicon',
	  'banner',
	];
	
	var actionProps = [
	  'up',
	  'select',
	  'back',
	];
	
	var configProps = [
	  'style',
	  'backgroundColor'
	];
	
	var accessorProps = textProps.concat(textColorProps).concat(imageProps).concat(configProps);
	var clearableProps = textProps.concat(imageProps);
	
	var defaults = {
	  status: true,
	  backgroundColor: 'white',
	};
	
	var Card = function(cardDef) {
	  Window.call(this, myutil.shadow(defaults, cardDef || {}));
	  this._dynamic = false;
	};
	
	Card._codeName = 'card';
	
	util2.inherit(Card, Window);
	
	util2.copy(Emitter.prototype, Card.prototype);
	
	Propable.makeAccessors(accessorProps, Card.prototype);
	
	Card.prototype._prop = function() {
	  if (this === WindowStack.top()) {
	    simply.impl.card.apply(this, arguments);
	  }
	};
	
	Card.prototype._clear = function(flags_) {
	  var flags = myutil.toFlags(flags_);
	  if (flags === true) {
	    clearableProps.forEach(Propable.unset.bind(this.state));
	  }
	  Window.prototype._clear.call(this, flags_);
	};
	
	module.exports = Card;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Emitter = __webpack_require__(8);
	var Platform = __webpack_require__(18);
	var WindowStack = __webpack_require__(12);
	var Window = __webpack_require__(5);
	var simply = __webpack_require__(13);
	
	var defaults = {
	  status: true,
	  backgroundColor: 'white',
	  textColor: 'black',
	  highlightBackgroundColor: 'black',
	  highlightTextColor: 'white',
	};
	
	var Menu = function(menuDef) {
	  Window.call(this, myutil.shadow(defaults, menuDef || {}));
	  this._dynamic = false;
	  this._sections = {};
	  this._selection = { sectionIndex: 0, itemIndex: 0 };
	  this._selections = [];
	};
	
	Menu._codeName = 'menu';
	
	util2.inherit(Menu, Window);
	
	util2.copy(Emitter.prototype, Menu.prototype);
	
	Menu.prototype._show = function() {
	  Window.prototype._show.apply(this, arguments);
	  this._select();
	};
	
	Menu.prototype._select = function() {
	  if (this === WindowStack.top()) {
	    var select = this._selection;
	    simply.impl.menuSelection(select.sectionIndex, select.itemIndex);
	  }
	};
	
	Menu.prototype._numPreloadItems = (Platform.version() === 'aplite' ? 5 : 50);
	
	Menu.prototype._prop = function(state, clear, pushing) {
	  if (this === WindowStack.top()) {
	    this._resolveMenu(clear, pushing);
	    this._resolveSection(this._selection);
	  }
	};
	
	Menu.prototype.action = function() {
	  throw new Error("Menus don't support action bars.");
	};
	
	Menu.prototype.buttonConfig = function() {
	  throw new Error("Menus don't support changing button configurations.");
	};
	
	Menu.prototype._buttonAutoConfig = function() {};
	
	Menu.prototype._getMetaSection = function(sectionIndex) {
	  return (this._sections[sectionIndex] || ( this._sections[sectionIndex] = {} ));
	};
	
	Menu.prototype._getSections = function() {
	  var sections = this.state.sections;
	  if (sections instanceof Array) {
	    return sections;
	  }
	  if (typeof sections === 'number') {
	    sections = new Array(sections);
	    return (this.state.sections = sections);
	  }
	  if (typeof sections === 'function') {
	    this.sectionsProvider = this.state.sections;
	    delete this.state.sections;
	  }
	  if (this.sectionsProvider) {
	    sections = this.sectionsProvider.call(this);
	    if (sections) {
	      this.state.sections = sections;
	      return this._getSections();
	    }
	  }
	  return (this.state.sections = []);
	};
	
	Menu.prototype._getSection = function(e, create) {
	  var sections = this._getSections();
	  var section = sections[e.sectionIndex];
	  if (section) {
	    return section;
	  }
	  if (this.sectionProvider) {
	    section = this.sectionProvider.call(this, e);
	    if (section) {
	      return (sections[e.sectionIndex] = section);
	    }
	  }
	  if (!create) { return; }
	  return (sections[e.sectionIndex] = {});
	};
	
	Menu.prototype._getItems = function(e, create) {
	  var section = this._getSection(e, create);
	  if (!section) {
	    if (e.sectionIndex > 0) { return; }
	    section = this.state.sections[0] = {};
	  }
	  if (section.items instanceof Array) {
	    return section.items;
	  }
	  if (typeof section.items === 'number') {
	    return (section.items = new Array(section.items));
	  }
	  if (typeof section.items === 'function') {
	    this._sections[e.sectionIndex] = section.items;
	    delete section.items;
	  }
	  var itemsProvider = this._getMetaSection(e.sectionIndex).items || this.itemsProvider;
	  if (itemsProvider) {
	    var items = itemsProvider.call(this, e);
	    if (items) {
	      section.items = items;
	      return this._getItems(e, create);
	    }
	  }
	  return (section.items = []);
	};
	
	Menu.prototype._getItem = function(e, create) {
	  var items = this._getItems(e, create);
	  var item = items[e.itemIndex];
	  if (item) {
	    return item;
	  }
	  var itemProvider = this._getMetaSection(e.sectionIndex).item || this.itemProvider;
	  if (itemProvider) {
	    item = itemProvider.call(this, e);
	    if (item) {
	      return (items[e.itemIndex] = item);
	    }
	  }
	  if (!create) { return; }
	  return (items[e.itemIndex] = {});
	};
	
	Menu.prototype._resolveMenu = function(clear, pushing) {
	  var sections = this._getSections(this);
	  if (this === WindowStack.top()) {
	    simply.impl.menu(this.state, clear, pushing);
	    return true;
	  }
	};
	
	Menu.prototype._resolveSection = function(e, clear) {
	  var section = this._getSection(e);
	  if (!section) { return; }
	  section = myutil.shadow({
	    textColor: this.state.textColor, 
	    backgroundColor: this.state.backgroundColor
	  }, section);
	  section.items = this._getItems(e);
	  if (this === WindowStack.top()) {
	    simply.impl.menuSection.call(this, e.sectionIndex, section, clear);
	    var select = this._selection;
	    if (select.sectionIndex === e.sectionIndex) {
	      this._preloadItems(select);
	    }
	    return true;
	  }
	};
	
	Menu.prototype._resolveItem = function(e) {
	  var item = this._getItem(e);
	  if (!item) { return; }
	  if (this === WindowStack.top()) {
	    simply.impl.menuItem.call(this, e.sectionIndex, e.itemIndex, item);
	    return true;
	  }
	};
	
	Menu.prototype._preloadItems = function(e) {
	  var select = util2.copy(e);
	  select.itemIndex = Math.max(0, select.itemIndex - Math.floor(this._numPreloadItems / 2));
	  for (var i = 0; i < this._numPreloadItems; ++i) {
	    this._resolveItem(select);
	    select.itemIndex++;
	  }
	};
	
	Menu.prototype._emitSelect = function(e) {
	  this._selection = e;
	  var item = this._getItem(e);
	  switch (e.type) {
	    case 'select':
	      if (item && typeof item.select === 'function') {
	        if (item.select(e) === false) {
	          return false;
	        }
	      }
	      break;
	    case 'longSelect':
	      if (item && typeof item.longSelect === 'function') {
	        if (item.longSelect(e) === false) {
	          return false;
	        }
	      }
	      break;
	    case 'selection':
	      var handlers = this._selections;
	      this._selections = [];
	      if (item && typeof item.selected === 'function') {
	        if (item.selected(e) === false) {
	          return false;
	        }
	      }
	      for (var i = 0, ii = handlers.length; i < ii; ++i) {
	        if (handlers[i](e) === false) {
	          break;
	        }
	      }
	      break;
	  }
	};
	
	Menu.prototype.sections = function(sections) {
	  if (typeof sections === 'function') {
	    delete this.state.sections;
	    this.sectionsProvider = sections;
	    this._resolveMenu();
	    return this;
	  }
	  this.state.sections = sections;
	  this._resolveMenu();
	  return this;
	};
	
	Menu.prototype.section = function(sectionIndex, section) {
	  if (typeof sectionIndex === 'object') {
	    sectionIndex = sectionIndex.sectionIndex || 0;
	  } else if (typeof sectionIndex === 'function') {
	    this.sectionProvider = sectionIndex;
	    return this;
	  }
	  var menuIndex = { sectionIndex: sectionIndex };
	  if (!section) {
	    return this._getSection(menuIndex);
	  }
	  var sections = this._getSections();
	  var prevLength = sections.length;
	  sections[sectionIndex] = util2.copy(section, sections[sectionIndex]);
	  if (sections.length !== prevLength) {
	    this._resolveMenu();
	  }
	  this._resolveSection(menuIndex, typeof section.items !== 'undefined');
	  return this;
	};
	
	Menu.prototype.items = function(sectionIndex, items) {
	  if (typeof sectionIndex === 'object') {
	    sectionIndex = sectionIndex.sectionIndex || 0;
	  } else if (typeof sectionIndex === 'function') {
	    this.itemsProvider = sectionIndex;
	    return this;
	  }
	  if (typeof items === 'function') {
	    this._getMetaSection(sectionIndex).items = items;
	    return this;
	  }
	  var menuIndex = { sectionIndex: sectionIndex };
	  if (!items) {
	    return this._getItems(menuIndex);
	  }
	  var section = this._getSection(menuIndex, true);
	  section.items = items;
	  this._resolveSection(menuIndex, true);
	  return this;
	};
	
	Menu.prototype.item = function(sectionIndex, itemIndex, item) {
	  if (typeof sectionIndex === 'object') {
	    item = itemIndex || item;
	    itemIndex = sectionIndex.itemIndex;
	    sectionIndex = sectionIndex.sectionIndex || 0;
	  } else if (typeof sectionIndex === 'function') {
	    this.itemProvider = sectionIndex;
	    return this;
	  }
	  if (typeof itemIndex === 'function') {
	    item = itemIndex;
	    itemIndex = null;
	  }
	  if (typeof item === 'function') {
	    this._getMetaSection(sectionIndex).item = item;
	    return this;
	  }
	  var menuIndex = { sectionIndex: sectionIndex, itemIndex: itemIndex };
	  if (!item) {
	    return this._getItem(menuIndex);
	  }
	  var items = this._getItems(menuIndex, true);
	  var prevLength = items.length;
	  items[itemIndex] = util2.copy(item, items[itemIndex]);
	  if (items.length !== prevLength) {
	    this._resolveSection(menuIndex);
	  }
	  this._resolveItem(menuIndex);
	  return this;
	};
	
	Menu.prototype.selection = function(sectionIndex, itemIndex) {
	  var callback;
	  if (typeof sectionIndex === 'function') {
	    callback = sectionIndex;
	    sectionIndex = undefined;
	  }
	  if (callback) {
	    this._selections.push(callback);
	    simply.impl.menuSelection();
	  } else {
	    this._selection = {
	      sectionIndex: sectionIndex,
	      itemIndex: itemIndex,
	    };
	    this._select();
	  }
	};
	
	Menu.emit = Window.emit;
	
	Menu.emitSection = function(sectionIndex) {
	  var menu = WindowStack.top();
	  if (!(menu instanceof Menu)) { return; }
	  var e = {
	    menu: menu,
	    sectionIndex: sectionIndex
	  };
	  e.section = menu._getSection(e);
	  if (Menu.emit('section', null, e) === false) {
	    return false;
	  }
	  menu._resolveSection(e);
	};
	
	Menu.emitItem = function(sectionIndex, itemIndex) {
	  var menu = WindowStack.top();
	  if (!(menu instanceof Menu)) { return; }
	  var e = {
	    menu: menu,
	    sectionIndex: sectionIndex,
	    itemIndex: itemIndex,
	  };
	  e.section = menu._getSection(e);
	  e.item = menu._getItem(e);
	  if (Menu.emit('item', null, e) === false) {
	    return false;
	  }
	  menu._resolveItem(e);
	};
	
	Menu.emitSelect = function(type, sectionIndex, itemIndex) {
	  var menu = WindowStack.top();
	  if (!(menu instanceof Menu)) { return; }
	  var e = {
	    menu: menu,
	    sectionIndex: sectionIndex,
	    itemIndex: itemIndex,
	  };
	  e.section = menu._getSection(e);
	  e.item = menu._getItem(e);
	  switch (type) {
	    case 'menuSelect': type = 'select'; break;
	    case 'menuLongSelect': type = 'longSelect'; break;
	    case 'menuSelection': type = 'selection'; break;
	  }
	  if (Menu.emit(type, null, e) === false) {
	    return false;
	  }
	  menu._emitSelect(e);
	};
	
	module.exports = Menu;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var Platform = __webpack_require__(10);
	
	module.exports = Platform;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var StageElement = __webpack_require__(20);
	
	var defaults = {
	  backgroundColor: 'white',
	  borderColor: 'clear',
	  borderWidth: 1,
	};
	
	var Rect = function(elementDef) {
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.RectType;
	};
	
	util2.inherit(Rect, StageElement);
	
	module.exports = Rect;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var Vector2 = __webpack_require__(4);
	var myutil = __webpack_require__(7);
	var WindowStack = __webpack_require__(12);
	var Propable = __webpack_require__(14);
	var simply = __webpack_require__(13);
	
	var elementProps = [
	  'position',
	  'size',
	  'backgroundColor',
	  'borderColor',
	  'borderWidth',
	];
	
	var accessorProps = elementProps;
	
	var nextId = 1;
	
	var StageElement = function(elementDef) {
	  this.state = elementDef || {};
	  this.state.id = nextId++;
	  if (!this.state.position) {
	    this.state.position = new Vector2();
	  }
	  if (!this.state.size) {
	    this.state.size = new Vector2();
	  }
	  this._queue = [];
	};
	
	var Types = [
	  'NoneType',
	  'RectType',
	  'LineType',
	  'CircleType',
	  'RadialType',
	  'TextType',
	  'ImageType',
	  'InverterType',
	];
	
	Types.forEach(function(name, index) {
	  StageElement[name] = index;
	});
	
	util2.copy(Propable.prototype, StageElement.prototype);
	
	Propable.makeAccessors(accessorProps, StageElement.prototype);
	
	StageElement.prototype._reset = function() {
	  this._queue = [];
	};
	
	StageElement.prototype._id = function() {
	  return this.state.id;
	};
	
	StageElement.prototype._type = function() {
	  return this.state.type;
	};
	
	StageElement.prototype._prop = function(elementDef) {
	  if (this.parent === WindowStack.top()) {
	    simply.impl.stageElement(this._id(), this._type(), this.state);
	  }
	};
	
	StageElement.prototype.index = function() {
	  if (!this.parent) { return -1; }
	  return this.parent.index(this);
	};
	
	StageElement.prototype.remove = function(broadcast) {
	  if (!this.parent) { return this; }
	  this.parent.remove(this, broadcast);
	  return this;
	};
	
	StageElement.prototype._animate = function(animateDef, duration) {
	  if (this.parent === WindowStack.top()) {
	    simply.impl.stageAnimate(this._id(), this.state,
	        animateDef, duration || 400, animateDef.easing || 'easeInOut');
	  }
	};
	
	StageElement.prototype.animate = function(field, value, duration) {
	  if (typeof field === 'object') {
	    duration = value;
	  }
	  var animateDef = myutil.toObject(field, value);
	  this.queue(function() {
	    this._animate(animateDef, duration);
	    util2.copy(animateDef, this.state);
	  });
	  if (!this.state.animating) {
	    this.dequeue();
	  }
	  return this;
	};
	
	StageElement.prototype.queue = function(callback) {
	  this._queue.push(callback);
	};
	
	StageElement.prototype.dequeue = function() {
	  var callback = this._queue.shift();
	  if (callback) {
	    this.state.animating = true;
	    callback.call(this, this.dequeue.bind(this));
	  } else {
	    this.state.animating = false;
	  }
	};
	
	StageElement.emitAnimateDone = function(id) {
	  var wind = WindowStack.top();
	  if (!wind || !wind._dynamic) { return; }
	  wind.each(function(element) {
	    if (element._id() === id) {
	      element.dequeue();
	      return false;
	    }
	  });
	};
	
	module.exports = StageElement;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Propable = __webpack_require__(14);
	var StageElement = __webpack_require__(20);
	
	var accessorProps = [
	  'strokeColor',
	  'strokeWidth',
	  'position2',
	];
	
	var defaults = {
	  strokeColor: 'white',
	  strokeWidth: 1,
	};
	
	var Line = function(elementDef) {
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.LineType;
	};
	
	util2.inherit(Line, StageElement);
	
	Propable.makeAccessors(accessorProps, Line.prototype);
	
	module.exports = Line;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Propable = __webpack_require__(14);
	var StageElement = __webpack_require__(20);
	
	var accessorProps = [
	  'radius',
	];
	
	var defaults = {
	  backgroundColor: 'white',
	  borderColor: 'clear',
	  borderWidth: 1,
	};
	
	var Circle = function(elementDef) {
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.CircleType;
	};
	
	util2.inherit(Circle, StageElement);
	
	Propable.makeAccessors(accessorProps, Circle.prototype);
	
	module.exports = Circle;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Propable = __webpack_require__(14);
	var StageElement = __webpack_require__(20);
	
	var accessorProps = [
	  'radius',
	  'angle',
	  'angle2',
	];
	
	var defaults = {
	  backgroundColor: 'white',
	  borderColor: 'clear',
	  borderWidth: 1,
	  radius: 0,
	  angle: 0,
	  angle2: 360,
	};
	
	var checkProps = function(def) {
	  if (!def) return;
	  if ('angleStart' in def) {
	    console.warn('`angleStart` has been deprecated in favor of `angle` in order to match\n\t' +
	                 "Line's `position` and `position2`. Please use `angle` intead.");
	  }
	  if ('angleEnd' in def) {
	    console.warn('`angleEnd` has been deprecated in favor of `angle2` in order to match\n\t' +
	                 "Line's `position` and `position2`. Please use `angle2` intead.");
	  }
	};
	
	var Radial = function(elementDef) {
	  checkProps(elementDef);
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.RadialType;
	};
	
	util2.inherit(Radial, StageElement);
	
	Propable.makeAccessors(accessorProps, Radial.prototype);
	
	Radial.prototype._prop = function(def) {
	  checkProps(def);
	  StageElement.prototype._prop.call(this, def);
	};
	
	module.exports = Radial;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Propable = __webpack_require__(14);
	var StageElement = __webpack_require__(20);
	
	var textProps = [
	  'text',
	  'font',
	  'color',
	  'textOverflow',
	  'textAlign',
	  'updateTimeUnits',
	];
	
	var defaults = {
	  backgroundColor: 'clear',
	  borderColor: 'clear',
	  borderWidth: 1,
	  color: 'white',
	  font: 'gothic-24',
	};
	
	var Text = function(elementDef) {
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.TextType;
	};
	
	util2.inherit(Text, StageElement);
	
	Propable.makeAccessors(textProps, Text.prototype);
	
	module.exports = Text;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var Text = __webpack_require__(24);
	
	var TimeText = function(elementDef) {
	  Text.call(this, elementDef);
	  if (this.state.text) {
	    this.text(this.state.text);
	  }
	};
	
	util2.inherit(TimeText, Text);
	
	var formatUnits = {
	  a: 'days',
	  A: 'days',
	  b: 'months',
	  B: 'months',
	  c: 'seconds',
	  d: 'days',
	  H: 'hours',
	  I: 'hours',
	  j: 'days',
	  m: 'months',
	  M: 'minutes',
	  p: 'hours',
	  S: 'seconds',
	  U: 'days',
	  w: 'days',
	  W: 'days',
	  x: 'days',
	  X: 'seconds',
	  y: 'years',
	  Y: 'years',
	};
	
	var getUnitsFromText = function(text) {
	  var units = {};
	  text.replace(/%(.)/g, function(_, code) {
	    var unit = formatUnits[code];
	    if (unit) {
	      units[unit] = true;
	    }
	    return _;
	  });
	  return units;
	};
	
	TimeText.prototype.text = function(text) {
	  if (arguments.length === 0) {
	    return this.state.text;
	  }
	  this.prop({
	    text: text,
	    updateTimeUnits: getUnitsFromText(text),
	  });
	  return this;
	};
	
	module.exports = TimeText;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var Propable = __webpack_require__(14);
	var StageElement = __webpack_require__(20);
	
	var imageProps = [
	  'image',
	  'compositing',
	];
	
	var defaults = {
	  backgroundColor: 'clear',
	  borderColor: 'clear',
	  borderWidth: 1,
	};
	
	var ImageElement = function(elementDef) {
	  StageElement.call(this, myutil.shadow(defaults, elementDef || {}));
	  this.state.type = StageElement.ImageType;
	};
	
	util2.inherit(ImageElement, StageElement);
	
	Propable.makeAccessors(imageProps, ImageElement.prototype);
	
	module.exports = ImageElement;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var util2 = __webpack_require__(6);
	var myutil = __webpack_require__(7);
	var StageElement = __webpack_require__(20);
	
	var Inverter = function(elementDef) {
	  StageElement.call(this, elementDef);
	  this.state.type = StageElement.InverterType;
	};
	
	util2.inherit(Inverter, StageElement);
	
	module.exports = Inverter;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var simply = __webpack_require__(13);
	
	var Vibe = module.exports;
	
	Vibe.vibrate = function(type) {
	  simply.impl.vibe(type);
	};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var simply = __webpack_require__(13);
	
	var Light = module.exports;
	
	Light.on = function() {
	  simply.impl.light('on');
	};
	
	Light.auto = function() {
	  simply.impl.light('auto');
	};
	
	Light.trigger = function() {
	  simply.impl.light('trigger');
	};


/***/ })
/******/ ]);
//# sourceMappingURL=pebble-js-app.js.map