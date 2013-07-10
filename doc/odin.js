if ("function" != typeof define) var define = require("amdefine")(module);

define("base/class", [], function() {
    /**
	 * @class Class
	 * @brief Base class for all objects
	 */
    function Class() {
        /**
	    * @property Number _id
	    * @brief unique id of this object
	    * @memberof Class
	    */
        this._id = ++id;
        /**
	    * @property String _class
	    * @brief class name of object
	    * @memberof Class
	    */
        this._class = this.constructor.name;
        /**
	    * @property Object _events
	    * @brief event holder of object
	    * @memberof Class
	    */
        this._events = {};
        /**
	    * @property Object _JSON
	    * @brief json cache of object
	    * @memberof Class
	    */
        this._JSON = {};
        /**
	    * @property Number _SERVER_ID
	    * @brief used for transfering data from/to server client
	    * @memberof Class
	    */
        this._SERVER_ID = -1;
    }
    var id = 0, slice = Array.prototype.slice;
    /**
	 * @method clone
	 * @memberof Class
	 * @brief return a copy of this Object
	 * @return Class
	 */
    Class.prototype.clone = function() {
        var clone = new this.constructor();
        clone.copy(this);
        return clone;
    };
    /**
	 * @method copy
	 * @memberof Class
	 * @brief copies other object
	 * @param Class other object to be copied
	 * @return Class
	 */
    Class.prototype.copy = function() {
        return this;
    };
    /**
	 * @method on
	 * @memberof Class
	 * @brief sets function to be called when event name is triggered
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 * @param Object context context of function
	 * @return Class
	 */
    Class.prototype.on = function(name, callback, context) {
        var events = this._events[name] || (this._events[name] = []);
        events.push({
            callback: callback,
            context: context,
            ctx: context || this
        });
        return this;
    };
    /**
	 * @method off
	 * @memberof Class
	 * @brief clears functions assigned to event name
	 * @param string name name of the event
	 * @return Class
	 */
    Class.prototype.off = function(name) {
        var events = this._events[name];
        events && (events.length = 0);
        return this;
    };
    /**
	 * @method trigger
	 * @memberof Class
	 * @brief triggers event
	 * @param String name name of the event
	 * @return Class
	 */
    Class.prototype.trigger = function(name) {
        var events = this._events[name];
        if (!events || !events.length) return this;
        var event, i, il, args = slice.call(arguments, 1);
        for (i = 0, il = events.length; il > i; i++) (event = events[i]).callback.apply(event.ctx, args);
        return this;
    };
    /**
	 * @method listenTo
	 * @memberof Class
	 * @brief listen to another objects event
	 * @param Class obj object to listen to
	 * @param String name name of the event
	 * @param Function callback function to call on event
	 * @param Object ctx context of the function
	 * @return Class
	 */
    Class.prototype.listenTo = function(obj, name, callback, ctx) {
        if (!obj) return this;
        obj.on(name, callback, ctx || this);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Class
	 * @brief returns Class name of Object
	 * @return String
	 */
    Class.prototype.toString = function() {
        return this._class;
    };
    /**
	 * @method toString
	 * @memberof Class
	 * @brief returns id of Object
	 * @return Number
	 */
    Class.prototype.getId = function() {
        return this._id;
    };
    /**
	 * @method toJSON
	 * @memberof Class
	 * @brief returns json version of object
	 * @return Object
	 */
    Class.prototype.toJSON = function() {
        return this._JSON;
    };
    /**
	 * @method fromJSON
	 * @memberof Class
	 * @brief copies json version of object to properties
	 * @return Class
	 */
    Class.prototype.fromJSON = function() {
        return this;
    };
    /**
	* @property Object Class.types
	* @brief holds reference to all extended classes
	* @memberof Class
	*/
    Class.types = {
        Class: Class
    };
    /**
	 * @method Class.extend
	 * @memberof Class
	 * @brief makes child inherit parent
	 */
    Class.extend = function(child, parent) {
        var key, parentProto = parent.prototype, childProto = child.prototype = Object.create(parentProto);
        for (key in parentProto) childProto[key] = parentProto[key];
        childProto.constructor = child;
        Class.types[childProto.constructor.name] = childProto.constructor;
    };
    return Class;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/device", [], function() {
    /**
	 * @class Device
	 * @brief Device info
	 */
    function Device() {
        /**
	    * @property String userAgent
	    * @brief user agent lower case string
	    * @memberof Device
	    */
        this.userAgent = userAgent;
        /**
	    * @property Number pixelRatio
	    * @brief device pixel ratio
	    * @memberof Device
	    */
        this.pixelRatio = 1 / (window.devicePixelRatio || 1);
        /**
	    * @property String browser
	    * @brief browser name
	    * @memberof Device
	    */
        this.browser = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)[1];
        /**
	    * @property Boolean touch
	    * @brief is touch device
	    * @memberof Device
	    */
        this.touch = "ontouchstart" in window;
        /**
	    * @property Boolean mobile
	    * @brief is mobile device
	    * @memberof Device
	    */
        this.mobile = /android|webos|iphone|ipad|ipod|blackberry/i.test(userAgent);
        /**
	    * @property Boolean webgl
	    * @brief webgl on device
	    * @memberof Device
	    */
        this.webgl = "WebGLRenderingContext" in window;
        /**
	    * @property Boolean canvas
	    * @brief canvas on device
	    * @memberof Device
	    */
        this.canvas = "CanvasRenderingContext2D" in window;
        /**
	    * @property Boolean audioMpeg
	    * @brief can play mpeg
	    * @memberof Device
	    */
        this.audioMpeg = !!audio.canPlayType("audio/mpeg");
        /**
	    * @property Boolean audioMpeg
	    * @brief can play ogg
	    * @memberof Device
	    */
        this.audioOgg = !!audio.canPlayType("audio/ogg");
        /**
	    * @property Boolean audioMp4
	    * @brief can play mp4
	    * @memberof Device
	    */
        this.audioMp4 = !!audio.canPlayType("audio/mp4");
        /**
	    * @property Boolean videoWebm
	    * @brief can play video webm
	    * @memberof Device
	    */
        this.videoWebm = !!video.canPlayType("video/webm");
        /**
	    * @property Boolean videoOgg
	    * @brief can play video ogg
	    * @memberof Device
	    */
        this.videoOgg = !!video.canPlayType("video/ogg");
        /**
	    * @property Boolean videoMp4
	    * @brief can play video mp4
	    * @memberof Device
	    */
        this.videoMp4 = !!video.canPlayType("video/mp4");
    }
    var userAgent = navigator.userAgent.toLowerCase(), audio = new Audio(), video = document.createElement("video");
    return new Device();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/dom", [], function() {
    /**
	 * @class Dom
	 * @brief dom functions
	 */
    function Dom() {}
    var createShader, splitter = /\s*[\s,]\s*/;
    /**
	 * @method addEvent
	 * @memberof Dom
	 * @brief adds event to object
	 * @param Object context object to add event to
	 * @param String name event name or list of events separated by a space
	 * @param Function callback event handler function
	 * @param Object ctx context of callback
	 */
    Dom.prototype.addEvent = function(context, name, callback, ctx) {
        var i, il, names = name.split(splitter), scope = ctx || context, afn = function(e) {
            e = e || window.event;
            callback && callback.call(scope, e);
        };
        for (i = 0, il = names.length; il > i; i++) {
            name = names[i];
            context.attachEvent ? context.attachEvent("on" + name, afn) : context.addEventListener(name, afn, !1);
        }
    };
    /**
	 * @method removeEvent
	 * @memberof Dom
	 * @brief removes event from object
	 * @param Object context object to remove event from
	 * @param String name event name or list of events separated by a space
	 * @param Function callback event handler function
	 * @param Object ctx context of callback
	 */
    Dom.prototype.removeEvent = function(context, name, callback, ctx) {
        var i, il, names = name.split(splitter), scope = ctx || context, afn = function(e) {
            e = e || window.event;
            callback && callback.call(scope, e);
        };
        for (i = 0, il = names.length; il > i; i++) {
            name = names[i];
            context.detachEvent ? context.detachEvent("on" + name, afn) : context.removeEventListener(name, afn, !1);
        }
    };
    /**
	 * @method addMeta
	 * @memberof Dom
	 * @brief removes event from object
	 * @param String id id of the element
	 * @param String name meta name
	 * @param String content content of meta
	 */
    Dom.prototype.addMeta = function(id, name, content) {
        var meta = document.createElement("meta"), head = document.getElementsByTagName("head")[0];
        id && (meta.id = id);
        name && (meta.name = name);
        content && (meta.content = content);
        head.insertBefore(meta, head.firstChild);
    };
    /**
	 * @property Object audioContext
	 * @memberof Dom
	 * @brief audio context of dom
	 */
    Dom.prototype.audioContext = function() {
        return window.audioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
    }();
    /**
	 * @method requestAnimFrame
	 * @memberof Dom
	 * @brief request Animation Frame
	 * @param Function callback function to be called
	 */
    Dom.prototype.requestAnimFrame = function() {
        var request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
            window.setTimeout(function() {
                callback(Date.now());
            }, 50 / 3);
        };
        return function(callback, element) {
            request.call(window, callback, element);
        };
    }();
    /**
	 * @method cancelAnimFrame
	 * @memberof Dom
	 * @brief cancel Animation Frame
	 */
    Dom.prototype.cancelAnimFrame = function(id) {
        window.clearTimeout(id);
    };
    /**
	 * @method getWebGLContext
	 * @memberof Dom
	 * @brief gets webgl context from canvas
	 * @param HTMLCanvasElement canvas html canvas element
	 * @param Object attributes webgl attributes list
	 */
    Dom.prototype.getWebGLContext = function() {
        var defaultAttributes = {
            alpha: !0,
            antialias: !0,
            depth: !0,
            premultipliedAlpha: !0,
            preserveDrawingBuffer: !1,
            stencil: !0
        }, names = [ "webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d" ];
        return function(canvas, attributes) {
            attributes = attributes ? attributes : defaultAttributes;
            var gl, i = 0;
            for (i; names.length > i; i++) {
                gl = canvas.getContext(names[i], attributes);
                if (gl) break;
            }
            if (!gl) throw Error("Dom.getWebGLContext: WebGL Context Creation Failed");
            return gl;
        };
    }();
    /**
	 * @method get2DContext
	 * @memberof Dom
	 * @brief gets 2d context of canvas
	 * @param HTMLCanvasElement canvas html canvas element
	 */
    Dom.prototype.get2DContext = function(canvas) {
        var gl = canvas.getContext("2d");
        if (!gl) throw Error("Dom.get2DContext: Canvas 2D Context Creation Failed");
        return gl;
    };
    /**
	 * @method createShader
	 * @memberof Dom
	 * @brief creates shader from string
	 * @param Object gl webgl context
	 * @param Object type webgl shader type( gl.FRAGMENT_SHADER or gl.VERTEX_SHADER )
	 * @param String source shader source
	 */
    Dom.prototype.createShader = createShader = function(gl, type, source) {
        var shader;
        if ("fragment" === type) shader = gl.createShader(gl.FRAGMENT_SHADER); else {
            if ("vertex" !== type) throw Error("Dom.createShader: no shader with type " + type);
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error("Dom.createShader: problem compiling shader " + gl.getShaderInfoLog(shader));
        return shader;
    };
    /**
	 * @method createProgram
	 * @memberof Dom
	 * @brief creates program from vertex shader and fragment shader
	 * @param Object gl webgl context
	 * @param String vertex vertex shader source
	 * @param String fragment fragment shader source
	 */
    Dom.prototype.createProgram = function(gl, vertex, fragment) {
        var shader, program = gl.createProgram();
        shader = createShader(gl, "vertex", vertex);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
        shader = createShader(gl, "fragment", fragment);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
        gl.linkProgram(program);
        gl.validateProgram(program);
        gl.useProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Dom.createProgram: problem compiling Program " + gl.getProgramInfoLog(program));
        return program;
    };
    return new Dom();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/objectpool", [], function() {
    /**
	 * @class ObjectPool
	 * @brief Object Pooling Helper
	 */
    function ObjectPool(constuctor) {
        /**
	    * @property Array _pool
	    * @brief array holding inactive objects
	    * @memberof ObjectPool
	    */
        this._pool = [];
        /**
	    * @property Array objects
	    * @brief array holding active objects
	    * @memberof ObjectPool
	    */
        this.objects = [];
        /**
	    * @property Object constuctor
	    * @brief reference to constuctor object
	    * @memberof ObjectPool
	    */
        this.object = constuctor;
    }
    /**
	 * @method set
	 * @memberof ObjectPool
	 * @brief sets constuctor of Object to create
	 * @param Constuctor constuctor
	 */
    ObjectPool.prototype.set = function(constuctor) {
        this.object = constuctor;
    };
    /**
	 * @method create
	 * @memberof ObjectPool
	 * @brief creates new instance of this.object
	 */
    ObjectPool.prototype.create = function() {
        var pool = this._pool, object = pool.length ? pool.pop() : new this.object();
        this.objects.push(object);
        return object;
    };
    /**
	 * @method release
	 * @memberof ObjectPool
	 * @brief all arguments passed are removed, if created through create method they are pooled
	 */
    ObjectPool.prototype.release = function() {
        var object, index, i, objects = this.objects;
        for (i = arguments.length; i--; ) {
            object = arguments[i];
            index = objects.indexOf(object);
            if (-1 !== index) {
                this._pool.push(object);
                objects.splice(index, 1);
            }
        }
    };
    /**
	 * @method clear
	 * @memberof ObjectPool
	 * @brief removes all objects and pools them
	 */
    ObjectPool.prototype.clear = function() {
        var i, objects = this.objects;
        for (i = objects.length; i--; ) this._pool.push(objects[i]);
        objects.length = 0;
    };
    return ObjectPool;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/time", [], function() {
    /**
	 * @class Time
	 * @brief Object to get time information
	 */
    function Time() {
        /**
	    * @property Number _startTime
	    * @brief start time stamp of game
	    * @memberof Time
	    */
        this._startTime = .001 * Date.now();
        /**
	    * @property Number sinceStart
	    * @brief time since start of game
	    * @memberof Time
	    */
        this.sinceStart = 0;
        /**
	    * @property Number time
	    * @brief time that this frame started
	    * @memberof Time
	    */
        this.time = 0;
        /**
	    * @property Number scale
	    * @brief scale at which the time is passing
	    * @memberof Time
	    */
        this.scale = 1;
        /**
	    * @property Number fps
	    * @brief number of frames/second
	    * @memberof Time
	    */
        this.fps = 60;
        /**
	    * @property Number delta
	    * @brief the time in seconds it took to complete the last frame
	    * @memberof Time
	    */
        this.delta = 1 / 60;
    }
    var LOW = 1e-6, HIGH = .1;
    /**
	 * @method update
	 * @memberof Time
	 * @brief called in game.update, updates Time properties
	 */
    Time.prototype.update = function() {
        var frames = 0, time = 0, last = 0, delta = 0, ms = 0, msLast = 0;
        return function() {
            this.time = time = this.now();
            delta = (time - last) * this.scale;
            this.delta = LOW > delta ? LOW : delta > HIGH ? HIGH : delta;
            last = time;
            frames++;
            ms = 1e3 * time;
            if (ms > msLast + 1e3) {
                this.fps = 1e3 * frames / (ms - msLast);
                msLast = ms;
                frames = 0;
            }
        };
    }();
    /**
	 * @method now
	 * @memberof Time
	 * @brief get time in seconds since start of game
	 */
    Time.prototype.now = function() {
        var startTime = Date.now(), w = "undefined" != typeof window ? window : {}, performance = w.performance !== void 0 ? w.performance : {
            now: function() {
                return Date.now() - startTime;
            }
        };
        return function() {
            return .001 * performance.now();
        };
    }();
    /**
	 * @method stamp
	 * @memberof Time
	 * @brief get time stamp in seconds
	 */
    Time.prototype.stamp = function() {
        return .001 * Date.now();
    };
    return new Time();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("base/utils", [], function() {
    /**
	 * @class Utils
	 * @brief helper functions
	 */
    function Utils() {}
    var objProto = Object.prototype, toString = objProto.toString, defineProperty = Object.defineProperty, hasOwnProperty = objProto.hasOwnProperty;
    /**
	 * @method defineProps
	 * @memberof Utils
	 * @brief define properties with getter/setter
	 * @param Object obj object to add property too
	 * @param Object props properties to add
	 */
    Utils.prototype.defineProps = function(obj, props) {
        var key;
        for (key in props) defineProperty(obj, key, props[key]);
    };
    /**
	 * @method has
	 * @memberof Utils
	 * @brief check if Object has property
	 * @param Object obj object to check
	 * @param String key property to check
	 */
    Utils.prototype.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    /**
	 * @method isFunction
	 * @memberof Utils
	 * @brief check if passed argument is a function
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFunction = function(obj) {
        return "function" == typeof obj;
    };
    /**
	 * @method isFinite
	 * @memberof Utils
	 * @brief check if passed argument is finite
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFinite = function(obj) {
        return this.isFinite(obj) && !this.isNaN(parseFloat(obj));
    };
    /**
	 * @method isNaN
	 * @memberof Utils
	 * @brief check if passed argument is NaN
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNaN = function(obj) {
        return this.isNumber(obj) && obj !== +obj;
    };
    /**
	 * @method isBoolean
	 * @memberof Utils
	 * @brief check if passed argument is Boolean
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isBoolean = function(obj) {
        return obj === !0 || obj === !1 || "[object Boolean]" === toString.call(obj);
    };
    /**
	 * @method isNull
	 * @memberof Utils
	 * @brief check if passed argument is null
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNull = function(obj) {
        return void 0 === obj;
    };
    /**
	 * @method isUndefined
	 * @memberof Utils
	 * @brief check if passed argument is undefined
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isUndefined = function(obj) {
        return null === obj;
    };
    /**
	 * @method isArray
	 * @memberof Utils
	 * @brief check if passed argument is an Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArray = function(obj) {
        return "[object Array]" === toString.call(obj);
    };
    /**
	 * @method isArrayLike
	 * @memberof Utils
	 * @brief check if passed argument is Array like
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArrayLike = function(obj) {
        return "object" == typeof obj && "number" == typeof obj.length;
    };
    /**
	 * @method isObject
	 * @memberof Utils
	 * @brief check if passed argument is Object
	 * @return Boolean
	 */
    Utils.prototype.isObject = function(obj) {
        return obj === Object(obj);
    };
    /**
	 * @method isString
	 * @memberof Utils
	 * @brief check if passed argument is String
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isString = function(obj) {
        return "string" == typeof obj;
    };
    /**
	 * @method isNumber
	 * @memberof Utils
	 * @brief check if passed argument is Number
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isNumber = function(obj) {
        return "[object Number]" === toString.call(obj);
    };
    /**
	 * @method isArguments
	 * @memberof Utils
	 * @brief check if passed argument is arguments
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isArguments = function(obj) {
        return "[object Arguments]" === toString.call(obj);
    };
    /**
	 * @method isDate
	 * @memberof Utils
	 * @brief check if passed argument is Date
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isDate = function(obj) {
        return "[object Date]" === toString.call(obj);
    };
    /**
	 * @method isRegExp
	 * @memberof Utils
	 * @brief check if passed argument is RegExp
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isRegExp = function(obj) {
        return "[object RegExp]" === toString.call(obj);
    };
    /**
	 * @method isFloat32Array
	 * @memberof Utils
	 * @brief check if passed argument is Float32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFloat32Array = function(obj) {
        return "[object Float32Array]" === toString.call(obj);
    };
    /**
	 * @method isFloat64Array
	 * @memberof Utils
	 * @brief check if passed argument is Float64Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isFloat64Array = function(obj) {
        return "[object Float64Array]" === toString.call(obj);
    };
    /**
	 * @method isInt32Array
	 * @memberof Utils
	 * @brief check if passed argument is Int32Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt32Array = function(obj) {
        return "[object Int32Array]" === toString.call(obj);
    };
    /**
	 * @method isInt16Array
	 * @memberof Utils
	 * @brief check if passed argument is Int16Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt16Array = function(obj) {
        return "[object Int16Array]" === toString.call(obj);
    };
    /**
	 * @method isInt8Array
	 * @memberof Utils
	 * @brief check if passed argument is Int8Array
	 * @param Object obj Object to test
	 * @return Boolean
	 */
    Utils.prototype.isInt8Array = function(obj) {
        return "[object Int8Array]" === toString.call(obj);
    };
    return new Utils();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mathf", [], function() {
    /**
	 * @class Mathf
	 * @brief collection of common math functions
	 */
    function Mathf() {
        /**
	    * @property Number PI
	    * @brief The infamous 3.1415926535897
	    * @memberof Mathf
	    */
        this.PI = PI;
        /**
	    * @property Number TWO_PI
	    * @brief 2 * PI
	    * @memberof Mathf
	    */
        this.TWO_PI = TWO_PI;
        /**
	    * @property Number HALF_PI
	    * @brief PI / 2
	    * @memberof Mathf
	    */
        this.HALF_PI = HALF_PI;
        /**
	    * @property Number EPSILON
	    * @brief A small number value
	    * @memberof Mathf
	    */
        this.EPSILON = EPSILON;
        /**
	    * @property Number TO_RADS
	    * @brief Degrees to radians conversion constant 
	    * @memberof Mathf
	    */
        this.TO_RADS = TO_RADS;
        /**
	    * @property Number TO_DEGS
	    * @brief Radians to degrees conversion constant 
	    * @memberof Mathf
	    */
        this.TO_DEGS = TO_DEGS;
    }
    var modulo, clamp01, standardRadian, standardAngle, randFloat, random = Math.random, floor = Math.floor, abs = Math.abs, EPSILON = (Math.atan2, 
    1e-6), PI = 3.141592653589793, TWO_PI = 2 * PI, HALF_PI = .5 * PI, TO_RADS = PI / 180, TO_DEGS = 180 / PI;
    Mathf.prototype.acos = Math.acos;
    Mathf.prototype.asin = Math.asin;
    Mathf.prototype.atan = Math.atan;
    Mathf.prototype.atan2 = Math.atan2;
    Mathf.prototype.cos = Math.cos;
    Mathf.prototype.sin = Math.sin;
    Mathf.prototype.tan = Math.tan;
    Mathf.prototype.abs = Math.abs;
    Mathf.prototype.ceil = Math.ceil;
    Mathf.prototype.exp = Math.exp;
    Mathf.prototype.floor = Math.floor;
    Mathf.prototype.log = Math.log;
    Mathf.prototype.max = Math.max;
    Mathf.prototype.min = Math.min;
    Mathf.prototype.pow = Math.pow;
    Mathf.prototype.random = Math.random;
    Mathf.prototype.round = Math.round;
    Mathf.prototype.sqrt = Math.sqrt;
    /**
	 * @method equals
	 * @memberof Mathf
	 * @brief returns if a === b within EPSILON
	 * @param Number a
	 * @param Number b
	 * @param Number EPSILON
	 * @return Boolean
	 */
    Mathf.prototype.equals = function(a, b, e) {
        return (e || EPSILON) >= abs(a - b);
    };
    /**
	 * @method modulo
	 * @memberof Mathf
	 * @brief returns remainder of a / b
	 * @param Number a
	 * @param Number b
	 * @return Number
	 */
    Mathf.prototype.modulo = modulo = function(a, b) {
        var r = a % b;
        return 0 > r * b ? r + b : r;
    };
    /**
	 * @method standardRadian
	 * @memberof Mathf
	 * @brief convertes x to standard radian 0 <= x < 2PI
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.standardRadian = standardRadian = function(x) {
        return modulo(x, TWO_PI);
    };
    /**
	 * @method standardAngle
	 * @memberof Mathf
	 * @brief convertes x to standard angle 0 <= x < 360
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.standardAngle = standardAngle = function(x) {
        return modulo(x, 360);
    };
    /**
	 * @method sign
	 * @memberof Mathf
	 * @brief gets sign of x
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.sign = function(x) {
        return x ? 0 > x ? -1 : 1 : 0;
    };
    /**
	 * @method clamp
	 * @memberof Mathf
	 * @brief clamp x between min and max
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.clamp = function(x, min, max) {
        return min > x ? min : x > max ? max : x;
    };
    /**
	 * @method clampBottom
	 * @memberof Mathf
	 * @brief clamp x between min and Infinity
	 * @param Number x
	 * @param Number min
	 * @return Number
	 */
    Mathf.prototype.clampBottom = function(x, min) {
        return min > x ? min : x;
    };
    /**
	 * @method clampTop
	 * @memberof Mathf
	 * @brief clamp x between -Infinity and max
	 * @param Number x
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.clampTop = function(x, max) {
        return x > max ? max : x;
    };
    /**
	 * @method clamp01
	 * @memberof Mathf
	 * @brief clamp x between 0 and 1
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.clamp01 = clamp01 = function(x) {
        return 0 > x ? 0 : x > 1 ? 1 : x;
    };
    /**
	 * @method lerp
	 * @memberof Mathf
	 * @brief linear interpolation between a and b by t
	 * @param Number a
	 * @param Number b
	 * @param Number t
	 * @return Number
	 */
    Mathf.prototype.lerp = function(a, b, t) {
        return a + (b - a) * clamp01(t);
    };
    /**
	 * @method lerp
	 * @memberof Mathf
	 * @brief linear interpolation between a and b by t makes sure return value is within 0 <= x < 2PI
	 * @param Number a
	 * @param Number b
	 * @param Number t
	 * @return Number
	 */
    Mathf.prototype.lerpAngle = function(a, b, t) {
        return standardRadian(a + (b - a) * clamp01(t));
    };
    /**
	 * @method smoothStep
	 * @memberof Mathf
	 * @brief smooth step
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.smoothStep = function(x, min, max) {
        x = (clamp01(x) - min) / (max - min);
        return x * x * (3 - 2 * x);
    };
    /**
	 * @method smootherStep
	 * @memberof Mathf
	 * @brief smoother step
	 * @param Number x
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.smootherStep = function(x, min, max) {
        x = (clamp01(x) - min) / (max - min);
        return x * x * x * (x * (6 * x - 15) + 10);
    };
    /**
	 * @method pingPong
	 * @memberof Mathf
	 * @brief PingPongs the value t, so that it is never larger than length and never smaller than 0.
	 * @param Number t
	 * @param Number length
	 * @return Number
	 */
    Mathf.prototype.pingPong = function(t, length) {
        length || (length = 1);
        return length - abs(t % (2 * length) - length);
    };
    /**
	 * @method degsToRads
	 * @memberof Mathf
	 * @brief convertes degrees to radians
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.degsToRads = function(x) {
        return standardRadian(x * TO_RADS);
    };
    /**
	 * @method radsToDegs
	 * @memberof Mathf
	 * @brief convertes radians to degrees
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.radsToDegs = function(x) {
        return standardAngle(x * TO_DEGS);
    };
    /**
	 * @method randInt
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.randInt = function(min, max) {
        return floor(randFloat(min, max + 1));
    };
    /**
	 * @method randFloat
	 * @memberof Mathf
	 * @brief returns random number between min and max
	 * @param Number min
	 * @param Number max
	 * @return Number
	 */
    Mathf.prototype.randFloat = randFloat = function(min, max) {
        return min + random() * (max - min);
    };
    /**
	 * @method randChoice
	 * @memberof Mathf
	 * @brief returns random item from array
	 * @param Array array
	 * @return Number
	 */
    Mathf.prototype.randChoice = function(array) {
        return array[floor(random() * array.length)];
    };
    /**
	 * @method isPowerOfTwo
	 * @memberof Mathf
	 * @brief checks if x is a power of 2
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.isPowerOfTwo = function(x) {
        return (x & -x) === x;
    };
    /**
	 * @method toPowerOfTwo
	 * @memberof Mathf
	 * @brief returns x to a power of 2
	 * @param Number x
	 * @return Number
	 */
    Mathf.prototype.toPowerOfTwo = function(x) {
        for (var i = 2; x > i; ) i *= 2;
        return i;
    };
    /**
	 * @method direction
	 * @memberof Mathf
	 * @brief returns direction of x and y
	 * @param Number x
	 * @param Number y
	 * @return Number
	 */
    Mathf.prototype.direction = function(x, y) {
        return abs(x) >= abs(y) ? x > 0 ? "right" : "left" : y > 0 ? "up" : "down";
    };
    return new Mathf();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec2", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec2
	 * @brief 2D vector
	 * @param Number x
	 * @param Number y
	 */
    function Vec2(x, y) {
        /**
	    * @property Number x
	    * @memberof Vec2
	    */
        this.x = x || 0;
        /**
	    * @property Number y
	    * @memberof Vec2
	    */
        this.y = y || 0;
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    Vec2.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Vec2
	 * @brief returns new copy of this
	 * @return Vec2
	 */
    Vec2.prototype.clone = function() {
        return new Vec2(this.x, this.y);
    };
    /**
	 * @method copy
	 * @memberof Vec2
	 * @brief copies other vector
	 * @param Vec2 other vector to be copied
	 * @return Vec2
	 */
    Vec2.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        return this;
    };
    /**
	 * @method set
	 * @memberof Vec2
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec2
	 */
    Vec2.prototype.set = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    /**
	 * @method vadd
	 * @memberof Vec2
	 * @brief adds a + b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
    Vec2.prototype.vadd = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    /**
	 * @method add
	 * @memberof Vec2
	 * @brief adds this + other
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Vec2
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec2
	 */
    Vec2.prototype.sadd = function(s) {
        this.x += s;
        this.y += s;
        return this;
    };
    /**
	 * @method vsub
	 * @memberof Vec2
	 * @brief subtracts a - b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
    Vec2.prototype.vsub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Vec2
	 * @brief subtracts this - other
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    };
    /**
	 * @method ssub
	 * @memberof Vec2
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec2
	 */
    Vec2.prototype.ssub = function(s) {
        this.x -= s;
        this.y -= s;
        return this;
    };
    /**
	 * @method vmul
	 * @memberof Vec2
	 * @brief multiples a * b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
    Vec2.prototype.vmul = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Vec2
	 * @brief multiples this * other
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Vec2
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec2
	 */
    Vec2.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    /**
	 * @method vdiv
	 * @memberof Vec2
	 * @brief divides a / b saves it in this
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Vec2
	 */
    Vec2.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec2
	 * @brief divides this / other
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.div = function(other) {
        var x = other.x, y = other.y;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec2
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec2
	 */
    Vec2.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        return this;
    };
    /**
	 * @method vdot
	 * @memberof Vec2
	 * @brief gets dot product of a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
    Vec2.vdot = Vec2.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y;
    };
    /**
	 * @method dot
	 * @memberof Vec2
	 * @brief gets dot product of this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
    Vec2.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y;
    };
    /**
	 * @method vlerp
	 * @memberof Vec2
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
    Vec2.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Vec2
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec2 other
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
    Vec2.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        return this;
    };
    /**
	 * @method vslerp
	 * @memberof Vec2
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
    Vec2.prototype.vslerp = function() {
        var start = new Vec2(), end = new Vec2(), vec = new Vec2(), relative = new Vec2();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Vec2
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec2 other
	 * @param Number t between 0 and 1
	 * @return Vec2
	 */
    Vec2.prototype.slerp = function() {
        var start = new Vec2(), end = new Vec2(), vec = new Vec2(), relative = new Vec2();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method vcross
	 * @memberof Vec2
	 * @brief cross product between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
    Vec2.vcross = Vec2.prototype.vcross = function(a, b) {
        return a.x * b.y - a.y * b.x;
    };
    /**
	 * @method cross
	 * @memberof Vec2
	 * @brief cross product between this vector and other vector
	 * @param Vec2 other
	 * @return Number
	 */
    Vec2.prototype.cross = function(other) {
        return this.x * other.y - this.y * other.x;
    };
    /**
	 * @method applyMat2
	 * @memberof Vec2
	 * @brief multiply this vector by Mat2
	 * @param Mat2 m
	 * @return Vec2
	 */
    Vec2.prototype.applyMat2 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
        this.x = x * me[0] + y * me[2];
        this.y = x * me[1] + y * me[3];
        return this;
    };
    /**
	 * @method applyMat32
	 * @memberof Vec2
	 * @brief multiply this vector by Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
    Vec2.prototype.applyMat32 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
        this.x = x * me[0] + y * me[2] + me[4];
        this.y = x * me[1] + y * me[3] + me[5];
        return this;
    };
    /**
	 * @method applyMat3
	 * @memberof Vec2
	 * @brief multiply this vector by Mat3
	 * @param Mat3 m
	 * @return Vec2
	 */
    Vec2.prototype.applyMat3 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
        this.x = x * me[0] + y * me[3] + me[6];
        this.y = x * me[1] + y * me[4] + me[7];
        return this;
    };
    /**
	 * @method applyMat4
	 * @memberof Vec2
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
    Vec2.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y;
        this.x = x * me[0] + y * me[4] + me[8] + me[12];
        this.y = x * me[1] + y * me[5] + me[9] + me[13];
        return this;
    };
    /**
	 * @method applyProj
	 * @memberof Vec2
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec2
	 */
    Vec2.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, d = 1 / (x * me[3] + y * me[7] + me[11] + me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + me[13]) * d;
        return this;
    };
    /**
	 * @method applyQuat
	 * @memberof Vec2
	 * @brief multiply this vector by quaternion
	 * @param Quat q
	 * @return Vec2
	 */
    Vec2.prototype.applyQuat = function(q) {
        var x = this.x, y = this.y, qx = q.x, qy = q.y, qz = q.z, qw = q.w, ix = qw * x + qy - qz * y, iy = qw * y + qz * x - qx, iz = qw + qx * y - qy * x, iw = -qx * x - qy * y - qz;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        return this;
    };
    /**
	 * @method getPositionMat32
	 * @memberof Vec2
	 * @brief gets position from Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
    Vec2.prototype.getPositionMat32 = function(m) {
        var me = m.elements;
        this.x = me[4];
        this.y = me[5];
        return this;
    };
    /**
	 * @method getPositionMat4
	 * @memberof Vec2
	 * @brief gets position from Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
    Vec2.prototype.getPositionMat4 = function(m) {
        var me = m.elements;
        this.x = me[12];
        this.y = me[13];
        return this;
    };
    /**
	 * @method getScaleMat32
	 * @memberof Vec2
	 * @brief gets scale from Mat32
	 * @param Mat32 m
	 * @return Vec2
	 */
    Vec2.prototype.getScaleMat32 = function(m) {
        var sx = (m.elements, this.set(m[0], m[1]).len()), sy = this.set(m[2], m[3]).len();
        this.x = sx;
        this.y = sy;
        return this;
    };
    /**
	 * @method getScaleMat3
	 * @memberof Vec2
	 * @brief gets scale from Mat3
	 * @param Mat3 m
	 * @return Vec2
	 */
    Vec2.prototype.getScaleMat3 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[3], me[4], me[5]).len();
        this.x = sx;
        this.y = sy;
        return this;
    };
    /**
	 * @method getScaleMat4
	 * @memberof Vec2
	 * @brief gets scale from Mat4
	 * @param Mat4 m
	 * @return Vec2
	 */
    Vec2.prototype.getScaleMat4 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[4], me[5], me[6]).len();
        this.x = sx;
        this.y = sy;
        return this;
    };
    /**
	 * @method lenSq
	 * @memberof Vec2
	 * @brief gets squared length of this
	 * @return Number
	 */
    Vec2.prototype.lenSq = function() {
        var x = this.x, y = this.y;
        return x * x + y * y;
    };
    /**
	 * @method len
	 * @memberof Vec2
	 * @brief gets length of this
	 * @return Number
	 */
    Vec2.prototype.len = function() {
        var x = this.x, y = this.y;
        return sqrt(x * x + y * y);
    };
    /**
	 * @method norm
	 * @memberof Vec2
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec2
	 */
    Vec2.prototype.norm = function() {
        var x = this.x, y = this.y, l = x * x + y * y;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        return this;
    };
    /**
	 * @method negate
	 * @memberof Vec2
	 * @brief negates x and y values
	 * @return Vec2
	 */
    Vec2.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    /**
	 * @method perpL
	 * @memberof Vec2
	 * @brief gets perpendicular vector on the left side
	 * @return Vec2
	 */
    Vec2.prototype.perpL = function() {
        var x = this.x, y = this.y;
        this.x = -y;
        this.y = x;
        return this;
    };
    /**
	 * @method perpR
	 * @memberof Vec2
	 * @brief gets perpendicular vector on the right side
	 * @return Vec2
	 */
    Vec2.prototype.perpR = function() {
        var x = this.x, y = this.y;
        this.x = y;
        this.y = -x;
        return this;
    };
    /**
	 * @method abs
	 * @memberof Vec2
	 * @brief gets absolute values of vector
	 * @return Vec2
	 */
    Vec2.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        return this;
    };
    /**
	 * @method rotate
	 * @memberof Vec2
	 * @brief rotates vector by angle
	 * @param Number a angle to rotate by
	 * @return Vec2
	 */
    Vec2.prototype.rotate = function(a) {
        var x = this.x, y = this.y, c = cos(a), s = sin(a);
        this.x = x * c - y * s;
        this.y = x * s + y * c;
        return this;
    };
    /**
	 * @method rotateAround
	 * @memberof Vec2
	 * @brief rotates vector around vector by angle
	 * @param Number a angle to rotate by
	 * @param Vec2 v vector to rotate around
	 * @return Vec2
	 */
    Vec2.prototype.rotateAround = function(a, v) {
        return this.sub(v).rotate(a).add(v);
    };
    /**
	 * @method min
	 * @memberof Vec2
	 * @brief returns min values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.min = function(other) {
        var x = other.x, y = other.y;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec2
	 * @brief returns max values from this and other vector
	 * @param Vec2 other
	 * @return Vec2
	 */
    Vec2.prototype.max = function(other) {
        var x = other.x, y = other.y;
        this.x = x > this.x ? x : this.x;
        this.y = y > this.y ? y : this.y;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Vec2
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec2 min
	 * @param Vec2 max
	 * @return Vec2
	 */
    Vec2.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
        return this;
    };
    /**
	 * @method distSq
	 * @memberof Vec2
	 * @brief gets squared distance between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
    Vec2.distSq = Vec2.prototype.distSq = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y;
        return x * x + y * y;
    };
    /**
	 * @method dist
	 * @memberof Vec2
	 * @brief gets distance between a vector and b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @return Number
	 */
    Vec2.dist = Vec2.prototype.dist = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, d = x * x + y * y;
        return 0 !== d ? sqrt(d) : 0;
    };
    /**
	 * @method toString
	 * @memberof Vec2
	 * @brief returns string of this vector - "Vec2( 0, 0 )"
	 * @return String
	 */
    Vec2.prototype.toString = function() {
        return "Vec2( " + this.x + ", " + this.y + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec2
	 * @brief checks if this vector equals other vector
	 * @param Vec2 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec2.prototype.equals = function(other, e) {
        return !(!equals(this.x, other.x, e) || !equals(this.y, other.y, e));
    };
    /**
	 * @method Vec2.equals
	 * @memberof Vec2
	 * @brief checks if a vector equals b vector
	 * @param Vec2 a
	 * @param Vec2 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec2.equals = function(a, b, e) {
        return !(!equals(a.x, b.x, e) || !equals(a.y, b.y, e));
    };
    return Vec2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/aabb2", [ "math/mathf", "math/vec2" ], function(Mathf, Vec2) {
    /**
	 * @class AABB2
	 * @brief 2D axis aligned bounding box
	 * @param Vec2 min
	 * @param Vec2 max
	 */
    function AABB2(min, max) {
        /**
	    * @property Vec2 min
	    * @memberof AABB2
	    */
        this.min = min instanceof Vec2 ? min : new Vec2();
        /**
	    * @property Vec2 max
	    * @memberof AABB2
	    */
        this.max = max instanceof Vec2 ? max : new Vec2();
    }
    var equals = Mathf.equals;
    Math.abs, Math.cos, Math.sin;
    AABB2.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof AABB2
	 * @brief returns new copy of this
	 * @return AABB2
	 */
    AABB2.prototype.clone = function() {
        return new AABB2(this.min.clone(), this.max.clone());
    };
    /**
	 * @method copy
	 * @memberof AABB2
	 * @brief copies other AABB
	 * @param AABB2 other
	 * @return AABB2
	 */
    AABB2.prototype.copy = function(other) {
        var amin = this.min, bmin = other.min, amax = this.max, bmax = other.max;
        amin.x = bmin.x;
        amin.y = bmin.y;
        amax.x = bmax.x;
        amax.y = bmax.y;
        return this;
    };
    /**
	 * @method set
	 * @memberof AABB2
	 * @brief set min and max vectors
	 * @param Vec2 min
	 * @param Vec2 max
	 * @return AABB2
	 */
    AABB2.prototype.set = function(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    };
    /**
	 * @method setFromPoints
	 * @memberof AABB2
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB2
	 */
    AABB2.prototype.setFromPoints = function(points) {
        var v, minx, miny, maxx, maxy, x, y, i = points.length, min = this.min, max = this.max;
        if (i > 0) {
            minx = miny = 1/0;
            maxx = maxy = -1/0;
            for (;i--; ) {
                v = points[i];
                x = v.x;
                y = v.y;
                minx = minx > x ? x : minx;
                miny = miny > y ? y : miny;
                maxx = x > maxx ? x : maxx;
                maxy = y > maxy ? y : maxy;
            }
            min.x = minx;
            min.y = miny;
            max.x = maxx;
            max.y = maxy;
        } else min.x = min.y = max.x = max.y = 0;
        return this;
    };
    /**
	 * @method contains
	 * @memberof AABB2
	 * @brief checks if AABB contains point
	 * @param Vec2 point
	 * @return Boolean
	 */
    AABB2.prototype.contains = function(point) {
        var min = this.min, max = this.max, px = point.x, py = point.y;
        return !(min.x > px || px > max.x || min.y > py || py > max.y);
    };
    /**
	 * @method intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
    AABB2.prototype.intersects = function(other) {
        var aMin = this.min, aMax = this.max, bMin = other.min, bMax = other.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y);
    };
    /**
	 * @method toString
	 * @memberof AABB2
	 * @brief converts AABB to string "AABB2( min: Vec2( -1, -1 ), max: Vec2( 1, 1 ) )"
	 * @return String
	 */
    AABB2.prototype.toString = function() {
        var min = this.min, max = this.max;
        return "AABB2( min: " + min.x + ", " + min.y + ", max: " + max.x + ", " + max.y + " )";
    };
    /**
	 * @method equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @param AABB2 other
	 * @return Boolean
	 */
    AABB2.prototype.equals = function(other) {
        var amin = this.min, amax = this.max, bmin = other.min, bmax = other.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y));
    };
    /**
	 * @method AABB2.intersects
	 * @memberof AABB2
	 * @brief checks if AABB intersects AABB
	 * @param AABB2 a
	 * @param AABB2 b
	 * @return Boolean
	 */
    AABB2.intersects = function(a, b) {
        var aMin = a.min, aMax = a.max, bMin = b.min, bMax = b.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y);
    };
    /**
	 * @method AABB2.equals
	 * @memberof AABB2
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
    AABB2.equals = function(a, b) {
        var amin = a.min, amax = a.max, bmin = b.min, bmax = b.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y));
    };
    return AABB2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec3", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec3
	 * @brief 3D vector
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 */
    function Vec3(x, y, z) {
        /**
	    * @property Number x
	    * @memberof Vec3
	    */
        this.x = x || 0;
        /**
	    * @property Number y
	    * @memberof Vec3
	    */
        this.y = y || 0;
        /**
	    * @property Number z
	    * @memberof Vec3
	    */
        this.z = z || 0;
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    Vec3.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Vec3
	 * @brief returns new copy of this
	 * @return Vec3
	 */
    Vec3.prototype.clone = function() {
        return new Vec3(this.x, this.y, this.z);
    };
    /**
	 * @method copy
	 * @memberof Vec3
	 * @brief copies other vector
	 * @param Vec3 other vector to be copied
	 * @return Vec3
	 */
    Vec3.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    };
    /**
	 * @method set
	 * @memberof Vec3
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec3
	 */
    Vec3.prototype.set = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };
    /**
	 * @method vadd
	 * @memberof Vec3
	 * @brief adds a + b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vadd = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    };
    /**
	 * @method add
	 * @memberof Vec3
	 * @brief adds this + other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Vec3
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.sadd = function(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    };
    /**
	 * @method vsub
	 * @memberof Vec3
	 * @brief subtracts a - b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vsub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Vec3
	 * @brief subtracts this - other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    };
    /**
	 * @method ssub
	 * @memberof Vec3
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.ssub = function(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    };
    /**
	 * @method vmul
	 * @memberof Vec3
	 * @brief multiples a * b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vmul = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Vec3
	 * @brief multiples this * other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Vec3
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    /**
	 * @method vdiv
	 * @memberof Vec3
	 * @brief divides a / b saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y, z = b.z;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        this.z = 0 !== z ? a.z / z : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec3
	 * @brief divides this / other
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.div = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        this.z = 0 !== z ? this.z / z : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec3
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec3
	 */
    Vec3.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    };
    /**
	 * @method vdot
	 * @memberof Vec3
	 * @brief gets dot product of a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.vdot = Vec3.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    };
    /**
	 * @method dot
	 * @memberof Vec3
	 * @brief gets dot product of this vector and other vector
	 * @param Vec3 other
	 * @return Number
	 */
    Vec3.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    };
    /**
	 * @method vlerp
	 * @memberof Vec3
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Vec3
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec3 other
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        return this;
    };
    /**
	 * @method vslerp
	 * @memberof Vec3
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.vslerp = function() {
        var start = new Vec3(), end = new Vec3(), vec = new Vec3(), relative = new Vec3();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Vec3
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec3 other
	 * @param Number t between 0 and 1
	 * @return Vec3
	 */
    Vec3.prototype.slerp = function() {
        var start = new Vec3(), end = new Vec3(), vec = new Vec3(), relative = new Vec3();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method vcross
	 * @memberof Vec3
	 * @brief cross product between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Vec3
	 */
    Vec3.vcross = Vec3.prototype.vcross = function(a, b) {
        var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    /**
	 * @method cross
	 * @memberof Vec3
	 * @brief cross product between this vector and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.cross = function(other) {
        var ax = this.x, ay = this.y, az = this.z, bx = other.x, by = other.y, bz = other.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    };
    /**
	 * @method applyMat3
	 * @memberof Vec3
	 * @brief multiply this vector by Mat3
	 * @param Mat3 m
	 * @return Vec3
	 */
    Vec3.prototype.applyMat3 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z;
        this.x = x * me[0] + y * me[3] + z * me[6];
        this.y = x * me[1] + y * me[4] + z * me[7];
        this.z = x * me[2] + y * me[5] + z * me[8];
        return this;
    };
    /**
	 * @method applyMat4
	 * @memberof Vec3
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z;
        this.x = x * me[0] + y * me[4] + z * me[8] + me[12];
        this.y = x * me[1] + y * me[5] + z * me[9] + me[13];
        this.z = x * me[2] + y * me[6] + z * me[10] + me[14];
        return this;
    };
    /**
	 * @method applyProj
	 * @memberof Vec3
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, d = 1 / (x * me[3] + y * me[7] + z * me[11] + me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + z * me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + z * me[13]) * d;
        this.z = (me[2] * x + me[6] * y + me[10] + z * me[14]) * d;
        return this;
    };
    /**
	 * @method applyQuat
	 * @memberof Vec3
	 * @brief multiply this vector by quaternion
	 * @param Quat q
	 * @return Vec3
	 */
    Vec3.prototype.applyQuat = function(q) {
        var x = this.x, y = this.y, z = this.z, qx = q.x, qy = q.y, qz = q.z, qw = q.w, ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };
    /**
	 * @method getPositionMat4
	 * @memberof Vec3
	 * @brief gets position from Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.getPositionMat4 = function(m) {
        var me = m.elements;
        this.x = me[12];
        this.y = me[13];
        return this;
    };
    /**
	 * @method getScaleMat3
	 * @memberof Vec3
	 * @brief gets scale from Mat3
	 * @param Mat3 m
	 * @return Vec3
	 */
    Vec3.prototype.getScaleMat3 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[3], me[4], me[5]).len(), sz = this.set(me[6], me[7], me[8]).len();
        this.x = sx;
        this.y = sy;
        this.y = sz;
        return this;
    };
    /**
	 * @method getScaleMat4
	 * @memberof Vec3
	 * @brief gets scale from Mat4
	 * @param Mat4 m
	 * @return Vec3
	 */
    Vec3.prototype.getScaleMat4 = function(m) {
        var me = m.elements, sx = this.set(me[0], me[1], me[2]).len(), sy = this.set(me[4], me[5], me[6]).len(), sz = this.set(me[8], me[9], me[10]).len();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    };
    /**
	 * @method lenSq
	 * @memberof Vec3
	 * @brief gets squared length of this
	 * @return Number
	 */
    Vec3.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z;
        return x * x + y * y + z * z;
    };
    /**
	 * @method len
	 * @memberof Vec3
	 * @brief gets length of this
	 * @return Number
	 */
    Vec3.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z;
        return sqrt(x * x + y * y + z * z);
    };
    /**
	 * @method norm
	 * @memberof Vec3
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec3
	 */
    Vec3.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, l = x * x + y * y + z * z;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    };
    /**
	 * @method negate
	 * @memberof Vec3
	 * @brief negates x and y values
	 * @return Vec3
	 */
    Vec3.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    /**
	 * @method abs
	 * @memberof Vec3
	 * @brief gets absolute values of vector
	 * @return Vec3
	 */
    Vec3.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        this.z = abs(this.z);
        return this;
    };
    /**
	 * @method min
	 * @memberof Vec3
	 * @brief returns min values from this and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.min = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        this.z = this.z > z ? z : this.z;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec3
	 * @brief returns max values from this and other vector
	 * @param Vec3 other
	 * @return Vec3
	 */
    Vec3.prototype.max = function(other) {
        var x = other.x, y = other.y, z = other.z;
        this.x = x > this.x ? x : this.x;
        this.y = y > this.y ? y : this.y;
        this.z = z > this.z ? z : this.z;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Vec3
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec3 min
	 * @param Vec3 max
	 * @return Vec3
	 */
    Vec3.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
        this.z = clamp(this.z, min.z, max.z);
        return this;
    };
    /**
	 * @method distSq
	 * @memberof Vec3
	 * @brief gets squared distance between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.distSq = Vec3.prototype.distSq = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z;
        return x * x + y * y + z * z;
    };
    /**
	 * @method dist
	 * @memberof Vec3
	 * @brief gets distance between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
    Vec3.dist = Vec3.prototype.dist = function(a, b) {
        var x = b.x - a.x, y = b.y - a.y, z = b.z - a.z, d = x * x + y * y + z * z;
        return 0 !== d ? sqrt(d) : 0;
    };
    /**
	 * @method toString
	 * @memberof Vec3
	 * @brief returns string of this vector - "Vec3( 0, 0, 0 )"
	 * @return String
	 */
    Vec3.prototype.toString = function() {
        return "Vec3( " + this.x + ", " + this.y + ", " + this.z + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec3
	 * @brief checks if this vector equals other vector
	 * @param Vec3 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec3.prototype.equals = function(other, e) {
        return !(!equals(this.x, other.x, e) || !equals(this.y, other.y, e) || !equals(this.z, other.z, e));
    };
    /**
	 * @method Vec3.equals
	 * @memberof Vec3
	 * @brief checks if a vector equals b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec3.equals = function(a, b, e) {
        return !(!equals(a.x, b.x, e) || !equals(a.y, b.y, e) || !equals(a.z, b.z, e));
    };
    return Vec3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/aabb3", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class AABB3
	 * @brief 3D axis aligned bounding box
	 * @param Vec3 min
	 * @param Vec3 max
	 */
    function AABB3(min, max) {
        /**
	    * @property Vec3 min
	    * @memberof AABB3
	    */
        this.min = min instanceof Vec3 ? min : new Vec3();
        /**
	    * @property Vec3 max
	    * @memberof AABB3
	    */
        this.max = max instanceof Vec3 ? max : new Vec3();
    }
    var equals = Mathf.equals;
    Math.abs, Math.cos, Math.sin;
    AABB3.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof AABB3
	 * @brief returns new copy of this
	 * @return AABB3
	 */
    AABB3.prototype.clone = function() {
        return new AABB3(this.min.clone(), this.max.clone());
    };
    /**
	 * @method copy
	 * @memberof AABB3
	 * @brief copies other AABB
	 * @param AABB3 other
	 * @return AABB3
	 */
    AABB3.prototype.copy = function(other) {
        var amin = this.min, bmin = other.min, amax = this.max, bmax = other.max;
        amin.x = bmin.x;
        amin.y = bmin.y;
        amin.z = bmin.z;
        amax.x = bmax.x;
        amax.y = bmax.y;
        amax.z = bmax.z;
        return this;
    };
    /**
	 * @method set
	 * @memberof AABB3
	 * @brief set min and max vectors
	 * @param Vec3 min
	 * @param Vec3 max
	 * @return AABB3
	 */
    AABB3.prototype.set = function(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    };
    /**
	 * @method setFromPoints
	 * @memberof AABB3
	 * @brief set min and max from array of vectors
	 * @param Array points
	 * @return AABB3
	 */
    AABB3.prototype.setFromPoints = function(points) {
        var v, minx, miny, minz, maxx, maxy, maxz, x, y, z, i = points.length, min = this.min, max = this.max;
        if (il > 0) {
            minx = miny = minz = 1/0;
            maxx = maxy = maxz = -1/0;
            for (;i--; ) {
                v = points[i];
                x = v.x;
                y = v.y;
                z = v.z;
                minx = minx > x ? x : minx;
                miny = miny > y ? y : miny;
                minz = minz > z ? z : minz;
                maxx = x > maxx ? x : maxx;
                maxy = y > maxy ? y : maxy;
                maxz = z > maxz ? z : maxz;
            }
            min.x = minx;
            min.y = miny;
            min.x = minz;
            max.x = maxx;
            max.y = maxy;
            max.x = maxz;
        } else min.x = min.y = min.z = max.x = max.y = max.z = 0;
        return this;
    };
    /**
	 * @method contains
	 * @memberof AABB3
	 * @brief checks if AABB contains point
	 * @param Vec3 point
	 * @return Boolean
	 */
    AABB3.prototype.contains = function(point) {
        var px = (this.min, this.max, point.x), py = point.y, pz = point.z;
        return !(this.min.x > px || px > this.max.x || this.min.y > py || py > this.max.y || this.min.z > pz || pz > this.max.z);
    };
    /**
	 * @method intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
    AABB3.prototype.intersects = function(other) {
        var aMin = this.min, aMax = this.max, bMin = other.min, bMax = other.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z || aMin.z > bMax.z);
    };
    /**
	 * @method toString
	 * @memberof AABB3
	 * @brief converts AABB to string "AABB3( min: Vec2( -1, -1, -1 ), max: Vec2( 1, 1, 1 ) )"
	 * @return String
	 */
    AABB3.prototype.toString = function() {
        var min = this.min, max = this.max;
        return "AABB3( min: " + min.x + ", " + min.y + ", " + min.z + ", max: " + max.x + ", " + max.y + ", " + max.z + " )";
    };
    /**
	 * @method equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @param AABB3 other
	 * @return Boolean
	 */
    AABB3.prototype.equals = function(other) {
        var amin = this.min, amax = this.max, bmin = other.min, bmax = other.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amin.z, bmin.z) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y) && equals(amax.z, bmax.z));
    };
    /**
	 * @method AABB3.intersects
	 * @memberof AABB3
	 * @brief checks if AABB intersects AABB
	 * @param AABB3 a
	 * @param AABB3 b
	 * @return Boolean
	 */
    AABB3.intersects = function(a, b) {
        var aMin = a.min, aMax = a.max, bMin = b.min, bMax = b.max;
        return !(aMax.x < bMin.x || aMax.y < bMin.y || aMax.z < bMin.z || aMin.x > bMax.x || aMin.y > bMax.y || aMin.z > bMax.z);
    };
    /**
	 * @method AABB3.equals
	 * @memberof AABB3
	 * @brief checks if AABB equals AABB
	 * @return Boolean
	 */
    AABB3.equals = function(a, b) {
        var amin = a.min, amax = a.max, bmin = b.min, bmax = b.max;
        return !!(equals(amin.x, bmin.x) && equals(amin.y, bmin.y) && equals(amin.z, bmin.z) && equals(amax.x, bmax.x) && equals(amax.y, bmax.y) && equals(amax.z, bmax.z));
    };
    return AABB3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/color", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Color
	 * @brief color representation
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 */
    function Color(r, g, b, a) {
        /**
	    * @property Number r
	    * @memberof Color
	    */
        this.r = 0;
        /**
	    * @property Number g
	    * @memberof Color
	    */
        this.g = 0;
        /**
	    * @property Number b
	    * @memberof Color
	    */
        this.b = 0;
        /**
	    * @property Number a
	    * @memberof Color
	    */
        this.a = 1;
        this._cache = {
            rgb: "rgb( 0, 0, 0 )",
            rgba: "rgba( 0, 0, 0, 1 )",
            hex: "#000000"
        };
        this.set(r || 0, g || 0, b || 0, void 0 !== a ? a : 1);
    }
    var abs = Math.abs, floor = Math.floor, lerp = (Math.sqrt, Mathf.lerp), equals = Mathf.equals;
    Color.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Color
	 * @brief returns new copy of this
	 * @return Color
	 */
    Color.prototype.clone = function() {
        return new Color(this.r, this.g, this.b, this.a);
    };
    /**
	 * @method copy
	 * @memberof Color
	 * @brief copies other color
	 * @param Color other color to be copied
	 * @return Color
	 */
    Color.prototype.copy = function(other) {
        var cacheA = this._cache, cacheB = other._cache;
        this.r = other.r;
        this.g = other.g;
        this.b = other.b;
        this.a = other.a;
        cacheA.hex = cacheB.hex;
        cacheA.rgb = cacheB.rgb;
        cacheA.rgba = cacheB.rgba;
        return this;
    };
    /**
	 * @method set
	 * @memberof Color
	 * @brief sets rgba values of this color
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 * @return Color
	 */
    Color.prototype.set = function(r, g, b, a) {
        if ("number" == typeof r) this.setArgs(r, g, b, a); else if ("string" == typeof r) this.setString(r); else {
            this.set(0, 0, 0, 1);
            console.warn("Color.set: Invalid input");
        }
        return this;
    };
    /**
	 * @method setString
	 * @memberof Color
	 * @brief sets rgba values of this color from string
	 * @param String string
	 * @return Color
	 */
    Color.prototype.setString = function() {
        function isValidRgb(rgb) {
            return rgb.match(reg1);
        }
        function isValidHex(hex) {
            return reg2.test(hex);
        }
        var hexName, reg1 = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/, reg2 = /#(.)(.)(.)/;
        return function(str) {
            hexName = colorNames[str.toLowerCase()];
            if (isValidHex(str)) this.setHex(str); else if (isValidRgb(str)) this.setRgb(str); else if (hexName) this.setHex(hexName); else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setString: Invalid String");
            }
            return this;
        };
    }();
    /**
	 * @method setArgs
	 * @memberof Color
	 * @brief sets rgba values of this color from r, g, b, a
	 * @param Number r
	 * @param Number g
	 * @param Number b
	 * @param Number a
	 * @return Color
	 */
    Color.prototype.setArgs = function(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this._updateCache();
        return this;
    };
    /**
	 * @method setRgb
	 * @memberof Color
	 * @brief sets rgba values of this color from rgb "rgba( 255, 128, 64, 1 )"
	 * @param String rgb
	 * @return Color
	 */
    Color.prototype.setRgb = function() {
        function isValid(rgb) {
            return rgb.match(reg);
        }
        var reg = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/;
        return function(rgb) {
            rgb = isValid(rgb);
            if (rgb) {
                this.r = Number(rgb[2]) / 255;
                this.g = Number(rgb[4]) / 255;
                this.b = Number(rgb[6]) / 255;
                this.a = Number(rgb[8]) || 1;
            } else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setRgb: Invalid rgb");
            }
            this._updateCache();
            return this;
        };
    }();
    /**
	 * @method setHex
	 * @memberof Color
	 * @brief sets rgba values of this color from hex "#ff8844"
	 * @param String hex
	 * @return Color
	 */
    Color.prototype.setHex = function() {
        function normalizeHex(hex) {
            4 === hex.length && (hex = hex.replace(reg1, str));
            hex.toLowerCase();
            return hex;
        }
        function isValid(hex) {
            return reg2.test(hex);
        }
        var reg1 = /#(.)(.)(.)/, reg2 = /^#(?:[0-9a-f]{3}){1,2}$/i, str = "#$1$1$2$2$3$3";
        return function(hex) {
            if (isValid(hex)) {
                normalizeHex(hex);
                this.r = parseInt(hex.substr(1, 2), 16) / 255;
                this.g = parseInt(hex.substr(3, 2), 16) / 255;
                this.b = parseInt(hex.substr(5, 2), 16) / 255;
                this.a = 1;
            } else {
                this.set(0, 0, 0, 1);
                console.warn("Color.setHex: Invalid hex");
            }
            this._updateCache();
            return this;
        };
    }();
    Color.prototype._updateCache = function() {
        function singleToHex(value) {
            num = floor(255 * value);
            n = parseInt(num).toString(16);
            0 === num ? n = "00" : num > 0 && 15 > num && (n = "0" + n);
            return n;
        }
        var cache, num, n;
        return function() {
            cache = this._cache;
            var hexR = singleToHex(this.r), hexG = singleToHex(this.g), hexB = singleToHex(this.b), rgbR = floor(256 * this.r), rgbG = floor(256 * this.g), rgbB = floor(256 * this.b), rgbA = floor(this.a);
            cache.rgb = "rgb( " + rgbR + ", " + rgbG + ", " + rgbB + " )";
            cache.rgba = "rgba( " + rgbR + ", " + rgbG + ", " + rgbB + ", " + rgbA + " )";
            cache.hex = "#" + hexR + hexG + hexB;
            return this;
        };
    }();
    /**
	 * @method hex
	 * @memberof Color
	 * @brief returns hex value "#ff8844"
	 * @return String
	 */
    Color.prototype.hex = function() {
        return this._cache.hex;
    };
    /**
	 * @method rgb
	 * @memberof Color
	 * @brief returns rgb value "rgb( 255, 128, 64 )"
	 * @return String
	 */
    Color.prototype.rgb = function() {
        return 1 === this.a ? this._cache.rgb : this._cache.rgba;
    };
    /**
	 * @method rgba
	 * @memberof Color
	 * @brief returns rgba value "rgba( 255, 128, 64, 1 )"
	 * @return String
	 */
    Color.prototype.rgba = function() {
        return this._cache.rgba;
    };
    /**
	 * @method smul
	 * @memberof Color
	 * @brief multiples this color by scalar
	 * @param Number s
	 * @return Color
	 */
    Color.prototype.smul = function(s) {
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Color
	 * @brief divides this color by scalar
	 * @param Number s
	 * @return Color
	 */
    Color.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.r *= s;
        this.g *= s;
        this.b *= s;
        this.a *= s;
        return this;
    };
    /**
	 * @method clerp
	 * @memberof Color
	 * @brief linear interpolation between a color and b color by t
	 * @param Color a
	 * @param Color b
	 * @param Number t
	 * @return Color
	 */
    Color.prototype.clerp = function(a, b, t) {
        this.r = lerp(a.r, b.r, t);
        this.g = lerp(a.g, b.g, t);
        this.b = lerp(a.b, b.b, t);
        this.a = lerp(a.a, b.a, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Color
	 * @brief linear interpolation between this color and other color by t
	 * @param Color other
	 * @param Number t
	 * @return Color
	 */
    Color.prototype.lerp = function(other, t) {
        this.r = lerp(this.r, other.r, t);
        this.g = lerp(this.g, other.g, t);
        this.b = lerp(this.b, other.b, t);
        this.a = lerp(this.a, other.a, t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Color
	 * @brief returns absolute values of this color
	 * @return Color
	 */
    Color.prototype.abs = function() {
        this.r = abs(this.r);
        this.g = abs(this.g);
        this.b = abs(this.b);
        this.a = abs(this.a);
        return this;
    };
    /**
	 * @method min
	 * @memberof Color
	 * @brief returns min values from this color and other color
	 * @param Color other
	 * @return Color
	 */
    Color.prototype.min = function(other) {
        var r = other.r, g = other.g, b = other.b, a = other.a;
        this.r = this.r > r ? r : this.r;
        this.g = this.g > g ? g : this.g;
        this.b = this.b > b ? b : this.b;
        this.a = this.a > a ? a : this.a;
        return this;
    };
    /**
	 * @method max
	 * @memberof Color
	 * @brief returns max values from this color and other color
	 * @param Color other
	 * @return Color
	 */
    Color.prototype.max = function(other) {
        var r = other.r, g = other.g, b = other.b, a = other.a;
        this.r = r > this.r ? r : this.r;
        this.g = g > this.g ? g : this.g;
        this.b = b > this.b ? b : this.b;
        this.a = a > this.a ? a : this.a;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Color
	 * @brief clamp this color values by min and max color values
	 * @param Color min
	 * @param Color max
	 * @return Color
	 */
    Color.prototype.clamp = function(min, max) {
        this.r = clamp(this.r, min.r, max.r);
        this.g = clamp(this.g, min.g, max.g);
        this.b = clamp(this.b, min.b, max.b);
        this.a = clamp(this.a, min.a, max.a);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Color
	 * @brief returns String of this color "Color( 1, 0.5, 0.25, 1 )"
	 * @return String
	 */
    Color.prototype.toString = function() {
        return "Color( " + this.r + ", " + this.g + ", " + this.b + ", " + this.a + " )";
    };
    /**
	 * @method equals
	 * @memberof Color
	 * @brief compares this color to other color
	 * @param Color other
	 * @param Number e
	 * @return Boolean
	 */
    Color.prototype.equals = function(other, e) {
        return !!(equals(this.r, other.r, e) && equals(this.g, other.g, e) && equals(this.b, other.b, e) && equals(this.a, other.a, e));
    };
    /**
	 * @method Color.equals
	 * @memberof Color
	 * @brief compares a color to b color
	 * @param Color a
	 * @param Color b
	 * @param Number e
	 * @return Boolean
	 */
    Color.equals = function(a, b, e) {
        return !!(equals(a.r, b.r, e) && equals(a.g, b.g, e) && equals(a.b, b.b, e) && equals(a.a, b.a, e));
    };
    var colorNames = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgrey: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370d8",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#d87093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    };
    return Color;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/line2", [ "math/mathf", "math/vec2" ], function(Mathf, Vec2) {
    /**
	 * @class Line2
	 * @brief 2D line, start and end vectors
	 * @param Vec2 start
	 * @param Vec2 end
	 */
    function Line2(start, end) {
        /**
	    * @property Vec2 start
	    * @memberof Line2
	    */
        this.start = start instanceof Vec2 ? start : new Vec2();
        /**
	    * @property Vec2 end
	    * @memberof Line2
	    */
        this.end = end instanceof Vec2 ? end : new Vec2();
    }
    var sqrt = Math.sqrt, clamp01 = Mathf.clamp01, equals = Mathf.equals;
    Line2.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Line2
	 * @brief returns new copy of this
	 * @return Line2
	 */
    Line2.prototype.clone = function() {
        return new Line2(this.start.clone(), this.end.clone());
    };
    /**
	 * @method copy
	 * @memberof Line2
	 * @brief copies other line
	 * @return Line2
	 */
    Line2.prototype.copy = function(other) {
        var ts = this.start, te = this.end, os = other.start, os = other.end;
        ts.x = os.x;
        ts.y = os.y;
        te.x = oe.x;
        te.y = oe.y;
        return this;
    };
    /**
	 * @method set
	 * @memberof Line2
	 * @brief sets start and end point
	 * @param Vec2 start
	 * @param Vec2 end
	 * @return Line2
	 */
    Line2.prototype.set = function(start, end) {
        var ts = this.start, te = this.end;
        ts.x = start.x;
        ts.y = start.y;
        te.x = end.x;
        te.y = end.y;
        return this;
    };
    /**
	 * @method add
	 * @memberof Line2
	 * @brief adds this start and end to other start and end
	 * @param Line2 other
	 * @return Line2
	 */
    Line2.prototype.add = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
        ts.x += x;
        ts.y += y;
        te.x += x;
        te.y += y;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Line2
	 * @brief adds scalar to this start and end
	 * @param Number s
	 * @return Line2
	 */
    Line2.prototype.sadd = function(s) {
        var ts = this.start, te = this.end;
        ts.x += s;
        ts.y += s;
        te.x += s;
        te.y += s;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Line2
	 * @brief subtracts other start and end from this start and end
	 * @param Line2 other
	 * @return Line2
	 */
    Line2.prototype.sub = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
        ts.x -= x;
        ts.y -= y;
        te.x -= x;
        te.y -= y;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Line2
	 * @brief subtracts scalar from this start and end
	 * @param Number s
	 * @return Line2
	 */
    Line2.prototype.ssub = function(s) {
        var ts = this.start, te = this.end;
        ts.x -= s;
        ts.y -= s;
        te.x -= s;
        te.y -= s;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Line2
	 * @brief multiples this start and end by other start and end
	 * @param Line2 other
	 * @return Line2
	 */
    Line2.prototype.mul = function(other) {
        var ts = this.start, te = this.end, x = other.x, y = other.y;
        ts.x *= x;
        ts.y *= y;
        te.x *= x;
        te.y *= y;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Line2
	 * @brief multiples this start and end by scalar
	 * @param Number s
	 * @return Line2
	 */
    Line2.prototype.smul = function(s) {
        var ts = this.start, te = this.end;
        ts.x *= s;
        ts.y *= s;
        te.x *= s;
        te.y *= s;
        return this;
    };
    /**
	 * @method div
	 * @memberof Line2
	 * @brief divides this start and end by other start and end
	 * @param Line2 other
	 * @return Line2
	 */
    Line2.prototype.div = function(other) {
        var ts = this.start, te = this.end, x = 0 !== other.x ? 1 / other.x : 0, y = 0 !== other.y ? 1 / other.y : 0;
        ts.x *= x;
        ts.y *= y;
        te.x *= x;
        te.y *= y;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Line2
	 * @brief divides this start and end by scalar
	 * @param Number s
	 * @return Line2
	 */
    Line2.prototype.sdiv = function(s) {
        var ts = this.start, te = this.end;
        s = 0 !== s ? 1 / s : 0;
        ts.x *= s;
        ts.y *= s;
        te.x *= s;
        te.y *= s;
        return this;
    };
    /**
	 * @method ldotv
	 * @memberof Line2
	 * @brief returns dot of line and vector
	 * @param Line2 l
	 * @param Vec2 v
	 * @return Number
	 */
    Line2.prototype.ldotv = function(l, v) {
        var start = l.start, end = l.end, x = end.x - start.x, y = end.y - start.y;
        return x * v.x + y * v.y;
    };
    /**
	 * @method dot
	 * @memberof Line2
	 * @brief returns dot of this and vector
	 * @param Vec2 v
	 * @return Number
	 */
    Line2.prototype.dot = function(v) {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return x * v.x + y * v.y;
    };
    /**
	 * @method lenSq
	 * @memberof Line2
	 * @brief returns squared length
	 * @return Number
	 */
    Line2.prototype.lenSq = function() {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return x * x + y * y;
    };
    /**
	 * @method len
	 * @memberof Line2
	 * @brief returns length
	 * @return Number
	 */
    Line2.prototype.len = function() {
        var start = this.start, end = this.end, x = end.x - start.x, y = end.y - start.y;
        return sqrt(x * x + y * y);
    };
    /**
	 * @method center
	 * @memberof Line2
	 * @brief returns center of this line
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.center = function(target) {
        target = target || new Vec2();
        var start = this.start, end = this.end;
        target.x = .5 * (start.x + end.x);
        target.y = .5 * (start.y + end.y);
        return target;
    };
    /**
	 * @method delta
	 * @memberof Line2
	 * @brief returns vector representing this line
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.delta = function(target) {
        target = target || new Vec2();
        var start = this.start, end = this.end;
        target.x = end.x - start.x;
        target.y = end.y - start.y;
        return target;
    };
    /**
	 * @method norm
	 * @memberof Line2
	 * @brief normalizes line
	 * @return Line2
	 */
    Line2.prototype.norm = function() {
        var start = this.start, end = this.end, sx = start.x, sy = start.y, sl = sx * sx + sy * sy, ex = end.x, ey = end.y, el = ex * ex + ey * ey;
        sl = 0 !== sl ? 1 / sqrt(sl) : 0;
        start.x *= sl;
        start.y *= sl;
        el = 0 !== el ? 1 / sqrt(el) : 0;
        end.x *= el;
        end.y *= el;
        return this;
    };
    /**
	 * @method closestPoint
	 * @memberof Line2
	 * @brief returns closest point on line to point
	 * @param Vec2 point
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.closestPoint = function(point, target) {
        target = target || new Vec2();
        var a = this.start, b = this.end, ax = a.x, ay = a.y, bx = b.x, by = b.y, ex = bx - ax, ey = by - ay, dx = point.x - ax, dy = point.y - ay, t = clamp01((ex * dx + ey * dy) / (ex * ex + ey * ey));
        target.x = ex * t + ax;
        target.y = ey * t + ay;
        return target;
    };
    /**
	 * @method intersect
	 * @memberof Line2
	 * @brief checks if this intersects with other and returns intersection point
	 * @param Line2 other
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.prototype.intersect = function(other, target) {
        target = target || new Vec2();
        var pre, post, as = this.start, ae = this.end, asx = as.x, asy = as.y, aex = ae.x, aey = ae.y, bs = other.start, be = other.end, bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y, d = (asx - aex) * (bsy - bey) - (asy - aey) * (bsx - bex);
        if (0 === d) return target;
        pre = asx * aey - asy * aex;
        post = bsx * bey - bsy * bex;
        target.x = (pre * (bsx - bey) - (asx - aex) * post) / d;
        target.y = (pre * (bsy - bey) - (asy - aey) * post) / d;
        return target;
    };
    /**
	 * @method toString
	 * @memberof Line2
	 * @brief returns string of this "Line2( start: Vec2( 0, 0 ), end: Vec2( 0, 1 ) )"
	 * @return String
	 */
    Line2.prototype.toString = function() {
        var start = this.start, end = this.end;
        return "Line2( start: " + start.x + ", " + start.y + ", end: " + end.x + ", " + end.y + " )";
    };
    /**
	 * @method equals
	 * @memberof Line2
	 * @brief checks if this equals other
	 * @param Line2 other
	 * @return Boolean
	 */
    Line2.prototype.equals = function(other) {
        var astart = this.start, aend = this.end, bstart = other.start, bend = other.end;
        return !!(equals(astart.x, bstart.x) && equals(astart.y, bstart.y) && equals(aend.x, bend.x) && equals(aend.y, bend.y));
    };
    /**
	 * @method Line2.equal
	 * @memberof Line2
	 * @brief checks if a equals b
	 * @param Line2 a
	 * @param Line2 b
	 * @return Boolean
	 */
    Line2.equals = function(a, b) {
        var astart = a.start, aend = a.end, bstart = b.start, bend = b.end;
        return !!(equals(astart.x, bstart.x) && equals(astart.y, bstart.y) && equals(aend.x, bend.x) && equals(aend.y, bend.y));
    };
    /**
	 * @method Line2.intersect
	 * @memberof Line2
	 * @brief checks if a intersects with b and returns intersection point
	 * @param Line2 a
	 * @param Line2 b
	 * @param Vec2 target
	 * @return Vec2
	 */
    Line2.intersect = function(a, b, target) {
        target = target || new Vec2();
        var pre, post, as = a.start, ae = a.end, asx = as.x, asy = as.y, aex = ae.x, aey = ae.y, bs = b.start, be = b.end, bsx = bs.x, bsy = bs.y, bex = be.x, bey = be.y, d = (asx - aex) * (bsy - bey) - (asy - aey) * (bsx - bex);
        if (0 === d) return target;
        pre = asx * aey - asy * aex;
        post = bsx * bey - bsy * bex;
        target.x = (pre * (bsx - bey) - (asx - aex) * post) / d;
        target.y = (pre * (bsy - bey) - (asy - aey) * post) / d;
        return target;
    };
    return Line2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat2", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Mat2
	 * @brief Matrix for 2D rotations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m21
	 * @param Number m22
	 */
    function Mat2(m11, m12, m21, m22) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat2
	    */
        this.elements = new Float32Array(4);
        var te = this.elements;
        te[0] = void 0 !== m11 ? m11 : 1;
        te[2] = m12 || 0;
        te[1] = m21 || 0;
        te[3] = void 0 !== m22 ? m22 : 1;
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, atan2 = Math.atan2, lerp = Mathf.lerp, equals = Mathf.equals;
    Mat2.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Mat2
	 * @brief returns new copy of this
	 * @return Mat2
	 */
    Mat2.prototype.clone = function() {
        var te = this.elements;
        return new Mat2(te[0], te[2], te[1], te[3]);
    };
    /**
	 * @method copy
	 * @memberof Mat2
	 * @brief copies other matrix
	 * @return Mat2
	 */
    Mat2.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat2
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m21
	 * @param Number m22
	 * @return Mat2
	 */
    Mat2.prototype.set = function(m11, m12, m21, m22) {
        var te = this.elements;
        te[0] = m11;
        te[2] = m12;
        te[1] = m21;
        te[3] = m22;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat2
	 * @brief sets matrix to identity matrix
	 * @return Mat2
	 */
    Mat2.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat2
	 * @brief sets matrix to zero matrix
	 * @return Mat2
	 */
    Mat2.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat2
	 * @brief mutilples a and b
	 * @param Mat2 a
	 * @param Mat2 b
	 * @return Mat2
	 */
    Mat2.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[2], a21 = ae[1], a22 = ae[3], b11 = be[0], b12 = be[2], b21 = be[1], b22 = be[3];
        te[0] = a11 * b11 + a12 * b21;
        te[2] = a11 * b12 + a12 * b22;
        te[1] = a21 * b11 + a22 * b21;
        te[3] = a21 * b12 + a22 * b22;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat2
	 * @brief mutilples this and other
	 * @param Mat2 other
	 * @return Mat2
	 */
    Mat2.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[2], a21 = ae[1], a22 = ae[3], b11 = be[0], b12 = be[2], b21 = be[1], b22 = be[3];
        ae[0] = a11 * b11 + a12 * b21;
        ae[1] = a11 * b12 + a12 * b22;
        ae[2] = a21 * b11 + a22 * b21;
        ae[3] = a21 * b12 + a22 * b22;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat2
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat2
	 */
    Mat2.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat2
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat2
	 */
    Mat2.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat2
	 * @brief transposes this matrix
	 * @return Mat2
	 */
    Mat2.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[2];
        te[2] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat2
	 * @brief sets the diagonal of matrix
	 * @param Vec2 v
	 * @return Mat2
	 */
    Mat2.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[3] = v.y;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat2
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat2 other
	 * @return Mat2
	 */
    Mat2.prototype.minv = function(other) {
        var te = this.elements, me = other.elements, m11 = me[0], m12 = me[2], m21 = me[1], m22 = me[3], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat2
	 * @brief gets the inverse of this matrix
	 * @return Mat2
	 */
    Mat2.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[2], m21 = te[1], m22 = te[3], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat2
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat2 a
	 * @param Mat2 b
	 * @param Number t
	 * @return Mat2
	 */
    Mat2.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat2
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat2 other
	 * @param Number t
	 * @return Mat2
	 */
    Mat2.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat2
	 * @brief gets absolute values of matrix
	 * @return Mat2
	 */
    Mat2.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        return this;
    };
    /**
	 * @method setRotation
	 * @memberof Mat2
	 * @brief sets rotation of matrix
	 * @param Number a
	 * @return Mat2
	 */
    Mat2.prototype.setRotation = function(a) {
        var te = this.elements, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method getRotation
	 * @memberof Mat2
	 * @brief returns the rotation of the matrix
	 * @return Number
	 */
    Mat2.prototype.getRotation = function() {
        var te = this.elements;
        return atan2(te[1], te[0]);
    };
    /**
	 * @method rotate
	 * @memberof Mat2
	 * @brief rotates the matrix by angle
	 * @param Number angle
	 * @return Mat2
	 */
    Mat2.prototype.rotate = function(angle) {
        var te = this.elements, m11 = te[0], m12 = te[2], m21 = te[1], m22 = te[3], s = sin(angle), c = sin(angle);
        te[0] = m11 * c + m12 * s;
        te[1] = m11 * -s + m12 * c;
        te[2] = m21 * c + m22 * s;
        te[3] = m21 * -s + m22 * c;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat2
	 * @brief returns string value of this "Mat2[ 1, 0, 0, 1 ]"
	 * @return String
	 */
    Mat2.prototype.toString = function() {
        var te = this.elements;
        return "Mat2[ " + te[0] + ", " + te[2] + "]\n" + "     [ " + te[1] + ", " + te[3] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat2
	 * @brief checks if this matrix equals other matrix
	 * @param Mat2 other
	 * @return Boolean
	 */
    Mat2.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]));
    };
    /**
	 * @method Mat2.equals
	 * @memberof Mat2
	 * @brief checks if a matrix equals b matrix
	 * @param Mat2 a
	 * @param Mat2 b
	 * @return Boolean
	 */
    Mat2.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]));
    };
    return Mat2;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat3", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Mat3
	 * @brief Matrix for 3D rotations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 */
    function Mat3(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat3
	    */
        this.elements = new Float32Array(8);
        var te = this.elements;
        te[0] = void 0 !== m11 ? m11 : 1;
        te[3] = m12 || 0;
        te[6] = m13 || 0;
        te[1] = m21 || 0;
        te[4] = void 0 !== m22 ? m22 : 1;
        te[7] = m23 || 0;
        te[2] = m31 || 0;
        te[5] = m32 || 0;
        te[8] = void 0 !== m33 ? m33 : 1;
    }
    var abs = Math.abs, lerp = (Math.sin, Math.cos, Mathf.lerp), equals = Mathf.equals;
    Mat3.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Mat3
	 * @brief returns new copy of this
	 * @return Mat3
	 */
    Mat3.prototype.clone = function() {
        var te = this.elements;
        return new Mat3(te[0], te[3], te[6], te[1], te[4], te[7], te[2], te[5], te[8]);
    };
    /**
	 * @method copy
	 * @memberof Mat3
	 * @brief copies other matrix
	 * @return Mat3
	 */
    Mat3.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat3
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @return Mat3
	 */
    Mat3.prototype.set = function(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        var te = this.elements;
        te[0] = m11;
        te[3] = m12;
        te[6] = m13;
        te[1] = m21;
        te[4] = m22;
        te[7] = m23;
        te[2] = m31;
        te[5] = m32;
        te[8] = m33;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat3
	 * @brief sets matrix to identity matrix
	 * @return Mat3
	 */
    Mat3.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 1;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat3
	 * @brief sets matrix to zero matrix
	 * @return Mat3
	 */
    Mat3.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat3
	 * @brief mutilples a and b
	 * @param Mat3 a
	 * @param Mat3 b
	 * @return Mat3
	 */
    Mat3.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[3], a13 = ae[6], a21 = ae[1], a22 = ae[4], a23 = ae[7], a31 = ae[2], a32 = ae[5], a33 = ae[8], b11 = be[0], b12 = be[3], b13 = be[6], b21 = be[1], b22 = be[4], b23 = be[7], b31 = be[2], b32 = be[5], b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat3
	 * @brief mutilples this and other
	 * @param Mat3 other
	 * @return Mat3
	 */
    Mat3.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[3], a13 = ae[6], a21 = ae[1], a22 = ae[4], a23 = ae[7], a31 = ae[2], a32 = ae[5], a33 = ae[8], b11 = be[0], b12 = be[3], b13 = be[6], b21 = be[1], b22 = be[4], b23 = be[7], b31 = be[2], b32 = be[5], b33 = be[8];
        ae[0] = a11 * b11 + a12 * b21 + a13 * b31;
        ae[3] = a11 * b12 + a12 * b22 + a13 * b32;
        ae[6] = a11 * b13 + a12 * b23 + a13 * b33;
        ae[1] = a21 * b11 + a22 * b21 + a23 * b31;
        ae[4] = a21 * b12 + a22 * b22 + a23 * b32;
        ae[7] = a21 * b13 + a22 * b23 + a23 * b33;
        ae[2] = a31 * b11 + a32 * b21 + a33 * b31;
        ae[5] = a31 * b12 + a32 * b22 + a33 * b32;
        ae[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat3
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat3
	 */
    Mat3.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat3
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat3
	 */
    Mat3.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat3
	 * @brief transposes this matrix
	 * @return Mat3
	 */
    Mat3.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[3];
        te[3] = tmp;
        tmp = te[2];
        te[2] = te[6];
        te[6] = tmp;
        tmp = te[5];
        te[5] = te[7];
        te[7] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat3
	 * @brief sets the diagonal of matrix
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[4] = v.y;
        te[8] = v.z || 1;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat3
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat3 other
	 * @return Mat3
	 */
    Mat3.prototype.minv = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[3], m13 = me[6], m21 = me[1], m22 = me[4], m23 = me[7], m31 = me[2], m32 = me[5], m33 = me[8];
        te[0] = m22 * m33 - m23 * m32;
        te[1] = m23 * m31 - m21 * m33;
        te[2] = m21 * m32 - m22 * m31;
        te[3] = m13 * m32 - m12 * m33;
        te[4] = m11 * m33 - m13 * m31;
        te[5] = m12 * m31 - m11 * m32;
        te[6] = m12 * m23 - m13 * m22;
        te[7] = m13 * m21 - m11 * m23;
        te[8] = m11 * m22 - m12 * m21;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method invMat4
	 * @memberof Mat3
	 * @brief gets the inverse of Mat4 saves it in this
	 * @param Mat4 m
	 * @return Mat3
	 */
    Mat3.prototype.invMat4 = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[4], m13 = me[8], m21 = (me[12], 
        me[1]), m22 = me[5], m23 = me[9], m31 = (me[13], me[2]), m32 = me[6], m33 = me[10];
        me[14], me[3], me[7], me[11], me[15];
        te[0] = m33 * m22 - m32 * m23;
        te[1] = -m33 * m21 + m31 * m23;
        te[2] = m32 * m21 - m31 * m22;
        te[3] = -m33 * m12 + m32 * m13;
        te[4] = m33 * m11 - m31 * m13;
        te[5] = -m32 * m11 + m31 * m12;
        te[6] = m23 * m12 - m22 * m13;
        te[7] = -m23 * m11 + m21 * m13;
        te[8] = m22 * m11 - m21 * m12;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat3
	 * @brief gets the inverse of this matrix
	 * @return Mat3
	 */
    Mat3.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[3], m13 = te[6], m21 = te[1], m22 = te[4], m23 = te[7], m31 = te[2], m32 = te[5], m33 = te[8];
        te[0] = m22 * m33 - m23 * m32;
        te[1] = m23 * m31 - m21 * m33;
        te[2] = m21 * m32 - m22 * m31;
        te[3] = m13 * m32 - m12 * m33;
        te[4] = m11 * m33 - m13 * m31;
        te[5] = m12 * m31 - m11 * m32;
        te[6] = m12 * m23 - m13 * m22;
        te[7] = m13 * m21 - m11 * m23;
        te[8] = m11 * m22 - m12 * m21;
        this.sdiv(m11 * te[0] + m21 * te[3] + m31 * te[6]);
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat3
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat3 a
	 * @param Mat3 b
	 * @param Number t
	 * @return Mat3
	 */
    Mat3.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        te[6] = lerp(ae[6], be[6], t);
        te[7] = lerp(ae[7], be[7], t);
        te[8] = lerp(ae[8], be[8], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat3
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat3 other
	 * @param Number t
	 * @return Mat3
	 */
    Mat3.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        ae[6] = lerp(ae[6], be[6], t);
        ae[7] = lerp(ae[7], be[7], t);
        ae[8] = lerp(ae[8], be[8], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat3
	 * @brief gets absolute values of matrix
	 * @return Mat3
	 */
    Mat3.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        te[6] = abs(te[6]);
        te[7] = abs(te[7]);
        te[8] = abs(te[8]);
        return this;
    };
    /**
	 * @method setRotationQuat
	 * @memberof Mat3
	 * @brief sets rotation of matrix from quaterian
	 * @param Quat q
	 * @return Mat3
	 */
    Mat3.prototype.setRotationQuat = function(q) {
        var te = this.elements, x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
        te[0] = 1 - (yy + zz);
        te[3] = xy - wz;
        te[6] = xz + wy;
        te[1] = xy + wz;
        te[4] = 1 - (xx + zz);
        te[7] = yz - wx;
        te[2] = xz - wy;
        te[5] = yz + wx;
        te[8] = 1 - (xx + yy);
        return this;
    };
    /**
	 * @method rotateAxis
	 * @memberof Mat3
	 * @brief sets rotation axis
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.rotateAxis = function(v) {
        var te = this.elements, vx = v.x, vy = v.y, vz = v.z;
        v.x = vx * te[0] + vy * te[3] + vz * te[6];
        v.y = vx * te[1] + vy * te[4] + vz * te[7];
        v.z = vx * te[2] + vy * te[5] + vz * te[8];
        v.norm();
        return v;
    };
    /**
	 * @method scale
	 * @memberof Mat3
	 * @brief scales matrix by vector
	 * @param Vec3 v
	 * @return Mat3
	 */
    Mat3.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[0] *= x;
        te[3] *= y;
        te[6] *= z;
        te[1] *= x;
        te[4] *= y;
        te[7] *= z;
        te[2] *= x;
        te[5] *= y;
        te[8] *= z;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat3
	 * @brief returns string value of this "Mat3[ 1, 0.... ]"
	 * @return String
	 */
    Mat3.prototype.toString = function() {
        var te = this.elements;
        return "Mat3[" + te[0] + ", " + te[3] + ", " + te[6] + "]\n" + "     [" + te[1] + ", " + te[4] + ", " + te[7] + "]\n" + "     [" + te[2] + ", " + te[5] + ", " + te[8] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat3
	 * @brief checks if this matrix equals other matrix
	 * @param Mat3 other
	 * @return Boolean
	 */
    Mat3.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]));
    };
    /**
	 * @method Mat3.equals
	 * @memberof Mat3
	 * @brief checks if a matrix equals b matrix
	 * @param Mat3 a
	 * @param Mat3 b
	 * @return Boolean
	 */
    Mat3.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]));
    };
    return Mat3;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat32", [ "math/mathf", "math/vec2" ], function(Mathf) {
    /**
	 * @class Mat32
	 * @brief Affine Matrix
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 */
    function Mat32(m11, m12, m13, m21, m22, m23) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat32
	    */
        this.elements = new Float32Array(6);
        var te = this.elements;
        te[0] = void 0 !== m11 ? m11 : 1;
        te[2] = m12 || 1;
        te[4] = m13 || 1;
        te[1] = m21 || 1;
        te[3] = void 0 !== m22 ? m22 : 1;
        te[5] = m23 || 1;
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, equals = Mathf.equals;
    Mat32.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Mat32
	 * @brief returns new copy of this
	 * @return Mat32
	 */
    Mat32.prototype.clone = function() {
        var te = this.elements;
        return new Mat32(te[0], te[2], te[4], te[1], te[3], te[5]);
    };
    /**
	 * @method copy
	 * @memberof Mat32
	 * @brief copies other matrix
	 * @return Mat32
	 */
    Mat32.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat32
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @return Mat32
	 */
    Mat32.prototype.set = function(m11, m12, m13, m21, m22, m23) {
        var te = this.elements;
        te[0] = m11;
        te[2] = m12;
        te[4] = m13;
        te[1] = m21;
        te[3] = m22;
        te[5] = m23;
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat32
	 * @brief sets matrix to identity matrix
	 * @return Mat32
	 */
    Mat32.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 1;
        te[4] = 0;
        te[5] = 0;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat32
	 * @brief sets matrix to zero matrix
	 * @return Mat32
	 */
    Mat32.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat32
	 * @brief mutilples a and b
	 * @param Mat32 a
	 * @param Mat32 b
	 * @return Mat32
	 */
    Mat32.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[2], a13 = ae[4], a21 = ae[1], a22 = ae[3], a23 = ae[5], b11 = be[0], b12 = be[2], b13 = be[4], b21 = be[1], b22 = be[3], b23 = be[5];
        te[0] = a11 * b11 + a12 * b21;
        te[2] = a11 * b12 + a12 * b22;
        te[1] = a21 * b11 + a22 * b21;
        te[3] = a21 * b12 + a22 * b22;
        te[4] = a13 * b11 + a23 * b21 + b13;
        te[5] = a13 * b12 + a23 * b22 + b23;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat32
	 * @brief mutilples this and other
	 * @param Mat32 other
	 * @return Mat32
	 */
    Mat32.prototype.mul = function(other) {
        var ae = this.elements, be = other.elements, a11 = ae[0], a12 = ae[2], a13 = ae[4], a21 = ae[1], a22 = ae[3], a23 = ae[5], b11 = be[0], b12 = be[2], b13 = be[4], b21 = be[1], b22 = be[3], b23 = be[5];
        ae[0] = a11 * b11 + a12 * b21;
        ae[2] = a11 * b12 + a12 * b22;
        ae[1] = a21 * b11 + a22 * b21;
        ae[3] = a21 * b12 + a22 * b22;
        ae[4] = a13 * b11 + a23 * b21 + b13;
        ae[5] = a13 * b12 + a23 * b22 + b23;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat32
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat32
	 */
    Mat32.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat32
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat32
	 */
    Mat32.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat32
	 * @brief transposes this matrix
	 * @return Mat32
	 */
    Mat32.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[2];
        te[2] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat32
	 * @brief sets the diagonal of matrix
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[3] = v.y;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat32
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat32 other
	 * @return Mat32
	 */
    Mat32.prototype.minv = function(other) {
        var te = this.elements, me = other.elements, m11 = me[0], m12 = me[2], m13 = me[4], m21 = me[1], m22 = me[3], m23 = me[5], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        te[4] = (m21 * m23 - m22 * m13) * det;
        te[5] = -(m11 * m23 - m12 * m13) * det;
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat32
	 * @brief gets the inverse of this matrix
	 * @return Mat32
	 */
    Mat32.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[2], m13 = te[4], m21 = te[1], m22 = te[3], m23 = te[5], det = m11 * m22 - m12 * m21;
        det = 0 !== det ? 1 / det : 0;
        te[0] = m22 * det;
        te[1] = -m12 * det;
        te[2] = -m21 * det;
        te[3] = m11 * det;
        te[4] = (m21 * m23 - m22 * m13) * det;
        te[5] = -(m11 * m23 - m12 * m13) * det;
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat32
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat32 a
	 * @param Mat32 b
	 * @param Number t
	 * @return Mat32
	 */
    Mat32.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat32
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat32 other
	 * @param Number t
	 * @return Mat32
	 */
    Mat32.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat32
	 * @brief gets absolute values of matrix
	 * @return Mat32
	 */
    Mat32.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        return this;
    };
    /**
	 * @method setTranslation
	 * @memberof Mat32
	 * @brief sets translation of matrix
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.setTranslation = function(v) {
        var te = this.elements;
        te[4] = v.x;
        te[5] = v.y;
        return this;
    };
    /**
	 * @method setRotation
	 * @memberof Mat32
	 * @brief sets rotation of matrix
	 * @param Number a
	 * @return Mat32
	 */
    Mat32.prototype.setRotation = function(a) {
        var te = this.elements, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method getTranslation
	 * @memberof Mat32
	 * @brief gets translation of matrix
	 * @param Vec2 v
	 * @return Vec2
	 */
    Mat32.prototype.getTranslation = function(v) {
        var te = this.elements;
        v.x = te[4];
        v.y = te[5];
        return v;
    };
    /**
	 * @method getRotation
	 * @memberof Mat32
	 * @brief returns the rotation of the matrix
	 * @return Number
	 */
    Mat32.prototype.getRotation = function() {
        var te = this.elements;
        return atan2(te[1], te[0]);
    };
    /**
	 * @method extractPosition
	 * @memberof Mat32
	 * @brief gets position from this matrix
	 * @param Mat32 m
	 * @return Mat32
	 */
    Mat32.prototype.extractPosition = function(m) {
        var te = this.elements, me = m.elements;
        te[4] = me[4];
        te[5] = me[5];
        return this;
    };
    /**
	 * @method extractRotation
	 * @memberof Mat32
	 * @brief gets rotation from this matrix
	 * @param Mat32 m
	 * @return Mat32
	 */
    Mat32.prototype.extractRotation = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[2], m21 = me[1], m22 = me[3], x = m11 * m11 + m21 * m21, y = m12 * m12 + m22 * m22, sx = 0 !== x ? 1 / sqrt(x) : 0, sy = 0 !== y ? 1 / sqrt(y) : 0;
        te[0] = m11 * sx;
        te[1] = m21 * sx;
        te[2] = m12 * sy;
        te[3] = m22 * sy;
        return this;
    };
    /**
	 * @method lookAt
	 * @memberof Mat32
	 * @brief makes matrix look from eye at target
	 * @param Vec2 eye
	 * @param Vec2 target
	 * @return Mat32
	 */
    Mat32.prototype.lookAt = function(eye, target) {
        var te = this.elements, x = target.x - eye.x, y = target.y - eye.y, a = atan2(y, x) - HALF_PI, c = cos(a), s = sin(a);
        te[0] = c;
        te[1] = s;
        te[2] = -s;
        te[3] = c;
        return this;
    };
    /**
	 * @method translate
	 * @memberof Mat32
	 * @brief translates matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.translate = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[4] = te[0] * x + te[2] * y + te[4];
        te[5] = te[1] * x + te[3] * y + te[5];
        return this;
    };
    /**
	 * @method scale
	 * @memberof Mat32
	 * @brief scales matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[0] *= x;
        te[1] *= x;
        te[4] *= x;
        te[2] *= y;
        te[3] *= y;
        te[5] *= y;
        return this;
    };
    /**
	 * @method rotate
	 * @memberof Mat32
	 * @brief rotates matrix by angle
	 * @param Number angle
	 * @return Mat32
	 */
    Mat32.prototype.rotate = function(angle) {
        var te = this.elements, m11 = te[0], m12 = te[2], m13 = te[4], m21 = te[1], m22 = te[3], m23 = te[5], s = sin(angle), c = sin(angle);
        te[0] = m11 * c - m12 * s;
        te[1] = m11 * s + m12 * c;
        te[2] = m21 * c - m22 * s;
        te[3] = m21 * s + m22 * c;
        te[4] = m13 * c - m23 * s;
        te[5] = m13 * s + m23 * c;
        return this;
    };
    /**
	 * @method skew
	 * @memberof Mat32
	 * @brief skews matrix by vector
	 * @param Vec2 v
	 * @return Mat32
	 */
    Mat32.prototype.skew = function(v) {
        var te = this.elements, x = v.x, y = v.y;
        te[1] += x;
        te[2] += y;
        return this;
    };
    /**
	 * @method orthographic
	 * @memberof Mat32
	 * @brief makes orthographic matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @return Mat32
	 */
    Mat32.prototype.orthographic = function(left, right, top, bottom) {
        var te = this.elements, w = 1 / (right - left), h = 1 / (top - bottom), x = -(right + left) * w, y = -(top + bottom) * h;
        te[0] = 2 * w;
        te[1] = 0;
        te[2] = 0;
        te[3] = 2 * -h;
        te[4] = x;
        te[5] = y;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat32
	 * @brief returns string value of this "Mat32[ 1, 0... ]"
	 * @return Mat32
	 */
    Mat32.prototype.toString = function() {
        var te = this.elements;
        return "Mat32[ " + te[0] + ", " + te[2] + ", " + te[4] + "]\n" + "     [ " + te[1] + ", " + te[3] + ", " + te[5] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat32
	 * @brief checks if this matrix equals other matrix
	 * @param Mat32 other
	 * @return Boolean
	 */
    Mat32.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]));
    };
    /**
	 * @method Mat32.equals
	 * @memberof Mat32
	 * @brief checks if a matrix equals b matrix
	 * @param Mat32 a
	 * @param Mat32 b
	 * @return Boolean
	 */
    Mat32.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]));
    };
    return Mat32;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/mat4", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class Mat4
	 * @brief Matrix for 3D rotations and transformations
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m14
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m24
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @param Number m34
	 * @param Number m41
	 * @param Number m42
	 * @param Number m43
	 * @param Number m44
	 */
    function Mat4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        /**
	    * @property Float32Array elements
	    * @memberof Mat4
	    */
        this.elements = new Float32Array(16);
        var te = this.elements;
        te[0] = void 0 !== m11 ? m11 : 1;
        te[4] = m12 || 0;
        te[8] = m13 || 0;
        te[12] = m14 || 0;
        te[1] = m21 || 0;
        te[5] = void 0 !== m22 ? m22 : 1;
        te[9] = m23 || 0;
        te[13] = m24 || 0;
        te[2] = m31 || 0;
        te[6] = m32 || 0;
        te[10] = void 0 !== m33 ? m33 : 1;
        te[14] = m34 || 0;
        te[3] = m41 || 0;
        te[7] = m42 || 0;
        te[11] = m43 || 0;
        te[15] = void 0 !== m44 ? m44 : 1;
    }
    var abs = Math.abs, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, equals = Mathf.equals, degsToRads = Mathf.degsToRads;
    Mat4.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Mat4
	 * @brief returns new copy of this
	 * @return Mat4
	 */
    Mat4.prototype.clone = function() {
        var te = this.elements;
        return new Mat4(te[0], te[4], te[8], te[12], te[1], te[5], te[9], te[13], te[2], te[6], te[10], te[14], te[3], te[7], te[11], te[15]);
    };
    /**
	 * @method copy
	 * @memberof Mat4
	 * @brief copies other matrix
	 * @return Mat4
	 */
    Mat4.prototype.copy = function(other) {
        var te = this.elements, me = other.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
        return this;
    };
    /**
	 * @method set
	 * @memberof Mat4
	 * @brief sets matrix elements
	 * @param Number m11
	 * @param Number m12
	 * @param Number m13
	 * @param Number m14
	 * @param Number m21
	 * @param Number m22
	 * @param Number m23
	 * @param Number m24
	 * @param Number m31
	 * @param Number m32
	 * @param Number m33
	 * @param Number m34
	 * @param Number m41
	 * @param Number m42
	 * @param Number m43
	 * @param Number m44
	 * @return Mat4
	 */
    Mat4.prototype.set = function(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        var te = this.elements;
        te[0] = m11;
        te[4] = m12;
        te[8] = m13;
        te[12] = m14;
        te[1] = m21;
        te[5] = m22;
        te[9] = m23;
        te[13] = m24;
        te[2] = m31;
        te[6] = m32;
        te[10] = m33;
        te[14] = m34;
        te[3] = m41;
        te[7] = m42;
        te[11] = m43;
        te[15] = m44;
        return this;
    };
    /**
	 * @method fromMat42
	 * @memberof Mat4
	 * @brief sets matrix from Mat32
	 * @param Mat32 m
	 * @return Mat4
	 */
    Mat4.prototype.fromMat32 = function(m) {
        var te = this.elements, me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[4] = me[2];
        te[5] = me[3];
        te[12] = me[4];
        te[13] = me[5];
        return this;
    };
    /**
	 * @method identity
	 * @memberof Mat4
	 * @brief sets matrix to identity matrix
	 * @return Mat4
	 */
    Mat4.prototype.identity = function() {
        var te = this.elements;
        te[0] = 1;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 1;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[10] = 1;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    };
    /**
	 * @method zero
	 * @memberof Mat4
	 * @brief sets matrix to zero matrix
	 * @return Mat4
	 */
    Mat4.prototype.zero = function() {
        var te = this.elements;
        te[0] = 0;
        te[1] = 0;
        te[2] = 0;
        te[3] = 0;
        te[4] = 0;
        te[5] = 0;
        te[6] = 0;
        te[7] = 0;
        te[8] = 0;
        te[9] = 0;
        te[10] = 0;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 0;
        return this;
    };
    /**
	 * @method mmul
	 * @memberof Mat4
	 * @brief mutilples a and b
	 * @param Mat4 a
	 * @param Mat4 b
	 * @return Mat4
	 */
    Mat4.prototype.mmul = function(a, b) {
        var te = this.elements, ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15], b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Mat4
	 * @brief mutilples this and other
	 * @param Mat4 other
	 * @return Mat4
	 */
    Mat4.prototype.mul = function() {
        var ae = a.elements, be = b.elements, a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15], b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        ae[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        ae[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        ae[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        ae[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        ae[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        ae[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        ae[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        ae[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        ae[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        ae[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        ae[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        ae[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        ae[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        ae[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        ae[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        ae[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Mat4
	 * @brief mutilples this by scalar
	 * @param Number s
	 * @return Mat4
	 */
    Mat4.prototype.smul = function(s) {
        var te = this.elements;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        te[9] *= s;
        te[10] *= s;
        te[11] *= s;
        te[12] *= s;
        te[13] *= s;
        te[14] *= s;
        te[15] *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Mat4
	 * @brief divides this by scalar
	 * @param Number s
	 * @return Mat4
	 */
    Mat4.prototype.sdiv = function(s) {
        var te = this.elements;
        s = 0 !== s ? 1 / s : 1;
        te[0] *= s;
        te[1] *= s;
        te[2] *= s;
        te[3] *= s;
        te[4] *= s;
        te[5] *= s;
        te[6] *= s;
        te[7] *= s;
        te[8] *= s;
        te[9] *= s;
        te[10] *= s;
        te[11] *= s;
        te[12] *= s;
        te[13] *= s;
        te[14] *= s;
        te[15] *= s;
        return this;
    };
    /**
	 * @method transpose
	 * @memberof Mat4
	 * @brief transposes this matrix
	 * @return Mat4
	 */
    Mat4.prototype.transpose = function() {
        var tmp, te = this.elements;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    };
    /**
	 * @method setTrace
	 * @memberof Mat4
	 * @brief sets the diagonal of matrix
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.setTrace = function(v) {
        var te = this.elements;
        te[0] = v.x;
        te[5] = v.y;
        te[10] = v.z || 1;
        te[15] = v.w || 1;
        return this;
    };
    /**
	 * @method minv
	 * @memberof Mat4
	 * @brief gets the inverse of another matrix saves it in this
	 * @param Mat4 other
	 * @return Mat4
	 */
    Mat4.prototype.minv = function(m) {
        var te = this.elements, me = m.elements, m11 = me[0], m12 = me[4], m13 = me[8], m14 = me[12], m21 = me[1], m22 = me[5], m23 = me[9], m24 = me[13], m31 = me[2], m32 = me[6], m33 = me[10], m34 = me[14], m41 = me[3], m42 = me[7], m43 = me[11], m44 = me[15];
        te[0] = m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44;
        te[1] = m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44;
        te[2] = m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44;
        te[3] = m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43;
        te[4] = m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44;
        te[5] = m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44;
        te[6] = m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44;
        te[7] = m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43;
        te[8] = m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44;
        te[9] = m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44;
        te[10] = m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44;
        te[11] = m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43;
        te[12] = m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34;
        te[13] = m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34;
        te[14] = m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34;
        te[15] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        this.sdiv(m11 * te[0] + m21 * te[4] + m31 * te[8] + m41 * te[12]);
        return this;
    };
    /**
	 * @method inv
	 * @memberof Mat4
	 * @brief gets the inverse of this matrix
	 * @return Mat4
	 */
    Mat4.prototype.inv = function() {
        var te = this.elements, m11 = te[0], m12 = te[4], m13 = te[8], m14 = te[12], m21 = te[1], m22 = te[5], m23 = te[9], m24 = te[13], m31 = te[2], m32 = te[6], m33 = te[10], m34 = te[14], m41 = te[3], m42 = te[7], m43 = te[11], m44 = te[15];
        te[0] = m23 * m34 * m42 - m24 * m33 * m42 + m24 * m32 * m43 - m22 * m34 * m43 - m23 * m32 * m44 + m22 * m33 * m44;
        te[1] = m24 * m33 * m41 - m23 * m34 * m41 - m24 * m31 * m43 + m21 * m34 * m43 + m23 * m31 * m44 - m21 * m33 * m44;
        te[2] = m22 * m34 * m41 - m24 * m32 * m41 + m24 * m31 * m42 - m21 * m34 * m42 - m22 * m31 * m44 + m21 * m32 * m44;
        te[3] = m23 * m32 * m41 - m22 * m33 * m41 - m23 * m31 * m42 + m21 * m33 * m42 + m22 * m31 * m43 - m21 * m32 * m43;
        te[4] = m14 * m33 * m42 - m13 * m34 * m42 - m14 * m32 * m43 + m12 * m34 * m43 + m13 * m32 * m44 - m12 * m33 * m44;
        te[5] = m13 * m34 * m41 - m14 * m33 * m41 + m14 * m31 * m43 - m11 * m34 * m43 - m13 * m31 * m44 + m11 * m33 * m44;
        te[6] = m14 * m32 * m41 - m12 * m34 * m41 - m14 * m31 * m42 + m11 * m34 * m42 + m12 * m31 * m44 - m11 * m32 * m44;
        te[7] = m12 * m33 * m41 - m13 * m32 * m41 + m13 * m31 * m42 - m11 * m33 * m42 - m12 * m31 * m43 + m11 * m32 * m43;
        te[8] = m13 * m24 * m42 - m14 * m23 * m42 + m14 * m22 * m43 - m12 * m24 * m43 - m13 * m22 * m44 + m12 * m23 * m44;
        te[9] = m14 * m23 * m41 - m13 * m24 * m41 - m14 * m21 * m43 + m11 * m24 * m43 + m13 * m21 * m44 - m11 * m23 * m44;
        te[10] = m12 * m24 * m41 - m14 * m22 * m41 + m14 * m21 * m42 - m11 * m24 * m42 - m12 * m21 * m44 + m11 * m22 * m44;
        te[11] = m13 * m22 * m41 - m12 * m23 * m41 - m13 * m21 * m42 + m11 * m23 * m42 + m12 * m21 * m43 - m11 * m22 * m43;
        te[12] = m14 * m23 * m32 - m13 * m24 * m32 - m14 * m22 * m33 + m12 * m24 * m33 + m13 * m22 * m34 - m12 * m23 * m34;
        te[13] = m13 * m24 * m31 - m14 * m23 * m31 + m14 * m21 * m33 - m11 * m24 * m33 - m13 * m21 * m34 + m11 * m23 * m34;
        te[14] = m14 * m22 * m31 - m12 * m24 * m31 - m14 * m21 * m32 + m11 * m24 * m32 + m12 * m21 * m34 - m11 * m22 * m34;
        te[15] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
        this.sdiv(m11 * te[0] + m21 * te[4] + m31 * te[8] + m41 * te[12]);
        return this;
    };
    /**
	 * @method mlerp
	 * @memberof Mat4
	 * @brief linear interpolation between a matrix and b matrix by t
	 * @param Mat4 a
	 * @param Mat4 b
	 * @param Number t
	 * @return Mat4
	 */
    Mat4.prototype.mlerp = function(a, b, t) {
        var te = this.elements, ae = a.elements, be = b.elements;
        te[0] = lerp(ae[0], be[0], t);
        te[1] = lerp(ae[1], be[1], t);
        te[2] = lerp(ae[2], be[2], t);
        te[3] = lerp(ae[3], be[3], t);
        te[4] = lerp(ae[4], be[4], t);
        te[5] = lerp(ae[5], be[5], t);
        te[6] = lerp(ae[6], be[6], t);
        te[7] = lerp(ae[7], be[7], t);
        te[8] = lerp(ae[8], be[8], t);
        te[9] = lerp(ae[9], be[9], t);
        te[10] = lerp(ae[10], be[10], t);
        te[11] = lerp(ae[11], be[11], t);
        te[12] = lerp(ae[12], be[12], t);
        te[13] = lerp(ae[13], be[13], t);
        te[14] = lerp(ae[14], be[14], t);
        te[15] = lerp(ae[15], be[15], t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Mat4
	 * @brief linear interpolation between this and other matrix by t
	 * @param Mat4 other
	 * @param Number t
	 * @return Mat4
	 */
    Mat4.prototype.lerp = function(other, t) {
        var ae = this.elements, be = other.elements;
        ae[0] = lerp(ae[0], be[0], t);
        ae[1] = lerp(ae[1], be[1], t);
        ae[2] = lerp(ae[2], be[2], t);
        ae[3] = lerp(ae[3], be[3], t);
        ae[4] = lerp(ae[4], be[4], t);
        ae[5] = lerp(ae[5], be[5], t);
        ae[6] = lerp(ae[6], be[6], t);
        ae[7] = lerp(ae[7], be[7], t);
        ae[8] = lerp(ae[8], be[8], t);
        ae[9] = lerp(ae[9], be[9], t);
        ae[10] = lerp(ae[10], be[10], t);
        ae[11] = lerp(ae[11], be[11], t);
        ae[12] = lerp(ae[12], be[12], t);
        ae[13] = lerp(ae[13], be[13], t);
        ae[14] = lerp(ae[14], be[14], t);
        ae[15] = lerp(ae[15], be[15], t);
        return this;
    };
    /**
	 * @method abs
	 * @memberof Mat4
	 * @brief gets absolute values of matrix
	 * @return Mat4
	 */
    Mat4.prototype.abs = function() {
        var te = this.elements;
        te[0] = abs(te[0]);
        te[1] = abs(te[1]);
        te[2] = abs(te[2]);
        te[3] = abs(te[3]);
        te[4] = abs(te[4]);
        te[5] = abs(te[5]);
        te[6] = abs(te[6]);
        te[7] = abs(te[7]);
        te[8] = abs(te[8]);
        te[9] = abs(te[9]);
        te[10] = abs(te[10]);
        te[11] = abs(te[11]);
        te[12] = abs(te[12]);
        te[13] = abs(te[13]);
        te[14] = abs(te[14]);
        te[15] = abs(te[15]);
        return this;
    };
    /**
	 * @method setRotationQuat
	 * @memberof Mat4
	 * @brief sets rotation of matrix from quaterian
	 * @param Quat q
	 * @return Mat4
	 */
    Mat4.prototype.setRotationQuat = function(q) {
        var te = this.elements, x = q.x, y = q.y, z = q.z, w = q.w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;
        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;
        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);
        return this;
    };
    /**
	 * @method setTranslation
	 * @memberof Mat4
	 * @brief sets translation of matrix
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.setTranslation = function(v) {
        var te = this.elements;
        te[12] = v.x;
        te[13] = v.y;
        te[14] = v.z || 0;
        return this;
    };
    /**
	 * @method lookAt
	 * @memberof Mat4
	 * @brief makes matrix look from eye at target along up vector
	 * @param Vec3 eye
	 * @param Vec3 target
	 * @param Vec3 up
	 * @return Mat4
	 */
    Mat4.prototype.lookAt = function() {
        var dup = new Vec3(0, 0, 1), x = new Vec3(), y = new Vec3(), z = new Vec3();
        return function(eye, target, up) {
            up = up instanceof Vec3 ? up : dup;
            var te = this.elements;
            z.vsub(eye, target).norm();
            0 === z.len() && (z.z = 1);
            x.vcross(up, z).norm();
            if (0 === x.len()) {
                z.x += 1e-4;
                x.vcross(up, z).norm();
            }
            y.vcross(z, x);
            te[0] = x.x;
            te[4] = y.x;
            te[8] = z.x;
            te[1] = x.y;
            te[5] = y.y;
            te[9] = z.y;
            te[2] = x.z;
            te[6] = y.z;
            te[10] = z.z;
            return this;
        };
    }();
    /**
	 * @method extractPosition
	 * @memberof Mat4
	 * @brief extract matrix position
	 * @param Mat4 m
	 * @return Mat4
	 */
    Mat4.prototype.extractPosition = function(m) {
        var te = this.elements, me = m.elements;
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        return this;
    };
    /**
	 * @method extractRotation
	 * @memberof Mat4
	 * @brief extract matrix rotation
	 * @param Mat4 m
	 * @return Mat4
	 */
    Mat4.prototype.extractRotation = function() {
        var vec = new Vec3();
        return function(m) {
            var te = this.elements, me = m.elements, scaleX = 1 / vec.set(me[0], me[1], me[2]).len(), scaleY = 1 / vec.set(me[4], me[5], me[6]).len(), scaleZ = 1 / vec.set(me[8], me[9], me[10]).len();
            te[0] = me[0] * scaleX;
            te[1] = me[1] * scaleX;
            te[2] = me[2] * scaleX;
            te[4] = me[4] * scaleY;
            te[5] = me[5] * scaleY;
            te[6] = me[6] * scaleY;
            te[8] = me[8] * scaleZ;
            te[9] = me[9] * scaleZ;
            te[10] = me[10] * scaleZ;
            return this;
        };
    }();
    /**
	 * @method translate
	 * @memberof Mat4
	 * @brief translates matrix by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.translate = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[12] = te[0] * x + te[4] * y + te[8] * z + te[12];
        te[13] = te[1] * x + te[5] * y + te[9] * z + te[13];
        te[14] = te[2] * x + te[6] * y + te[10] * z + te[14];
        te[15] = te[3] * x + te[7] * y + te[11] * z + te[15];
        return this;
    };
    /**
	 * @method rotateAxis
	 * @memberof Mat4
	 * @brief rotates matrix axis by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.rotateAxis = function(v) {
        var te = this.elements, vx = v.x, vy = v.y, vz = v.z;
        v.x = vx * te[0] + vy * te[4] + vz * te[8];
        v.y = vx * te[1] + vy * te[5] + vz * te[9];
        v.z = vx * te[2] + vy * te[6] + vz * te[10];
        v.norm();
        return v;
    };
    /**
	 * @method rotateX
	 * @memberof Mat4
	 * @brief rotates matrix along x axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateX = function(angle) {
        var te = this.elements, m12 = te[4], m22 = te[5], m32 = te[6], m42 = te[7], m13 = te[8], m23 = te[9], m33 = te[10], m43 = te[11], c = cos(angle), s = sin(angle);
        te[4] = c * m12 + s * m13;
        te[5] = c * m22 + s * m23;
        te[6] = c * m32 + s * m33;
        te[7] = c * m42 + s * m43;
        te[8] = c * m13 - s * m12;
        te[9] = c * m23 - s * m22;
        te[10] = c * m33 - s * m32;
        te[11] = c * m43 - s * m42;
        return this;
    };
    /**
	 * @method rotateY
	 * @memberof Mat4
	 * @brief rotates matrix along y axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateY = function(angle) {
        var te = this.elements, m11 = te[0], m21 = te[1], m31 = te[2], m41 = te[3], m13 = te[8], m23 = te[9], m33 = te[10], m43 = te[11], c = cos(angle), s = sin(angle);
        te[0] = c * m11 - s * m13;
        te[1] = c * m21 - s * m23;
        te[2] = c * m31 - s * m33;
        te[3] = c * m41 - s * m43;
        te[8] = c * m13 + s * m11;
        te[9] = c * m23 + s * m21;
        te[10] = c * m33 + s * m31;
        te[11] = c * m43 + s * m41;
        return this;
    };
    /**
	 * @method rotateZ
	 * @memberof Mat4
	 * @brief rotates matrix along z axis by angle
	 * @param Number angle
	 * @return Mat4
	 */
    Mat4.prototype.rotateZ = function(angle) {
        var te = this.elements, m11 = te[0], m21 = te[1], m31 = te[2], m41 = te[3], m12 = te[4], m22 = te[5], m32 = te[6], m42 = te[7], c = cos(angle), s = sin(angle);
        te[0] = c * m11 + s * m12;
        te[1] = c * m21 + s * m22;
        te[2] = c * m31 + s * m32;
        te[3] = c * m41 + s * m42;
        te[4] = c * m12 - s * m11;
        te[5] = c * m22 - s * m21;
        te[6] = c * m32 - s * m31;
        te[7] = c * m42 - s * m41;
        return this;
    };
    /**
	 * @method scale
	 * @memberof Mat4
	 * @brief scales matrix by vector
	 * @param Vec3 v
	 * @return Mat4
	 */
    Mat4.prototype.scale = function(v) {
        var te = this.elements, x = v.x, y = v.y, z = v.z;
        te[0] *= x;
        te[4] *= y;
        te[8] *= z;
        te[1] *= x;
        te[5] *= y;
        te[9] *= z;
        te[2] *= x;
        te[6] *= y;
        te[10] *= z;
        te[3] *= x;
        te[7] *= y;
        te[11] *= z;
        return this;
    };
    /**
	 * @method frustum
	 * @memberof Mat4
	 * @brief makes frustum matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.frustum = function(left, right, top, bottom, near, far) {
        var te = this.elements, x = 2 * near / (right - left), y = 2 * near / (top - bottom), a = (right + left) / (right - left), b = (top + bottom) / (top - bottom), c = -(far + near) / (far - near), d = -2 * far * near / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
    };
    /**
	 * @method perspective
	 * @memberof Mat4
	 * @brief makes perspective matrix
	 * @param Number fov
	 * @param Number aspect
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.perspective = function(fov, aspect, near, far) {
        var ymax = near * tan(degsToRads(.5 * fov)), ymin = -ymax, xmin = ymin * aspect, xmax = ymax * aspect;
        return this.frustum(xmin, xmax, ymax, ymin, near, far);
    };
    /**
	 * @method orthographic
	 * @memberof Mat4
	 * @brief makes orthographic matrix
	 * @param Number left
	 * @param Number right
	 * @param Number top
	 * @param Number bottom
	 * @param Number near
	 * @param Number far
	 * @return Mat4
	 */
    Mat4.prototype.orthographic = function(left, right, top, bottom, near, far) {
        var te = this.elements, w = 1 / (right - left), h = 1 / (top - bottom), p = 1 / (far - near), x = (right + left) * w, y = (top + bottom) * h, z = (far + near) * p;
        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
    };
    /**
	 * @method toString
	 * @memberof Mat4
	 * @brief returns string value of this "Mat4[ 1, 0... ]"
	 * @return Mat4
	 */
    Mat4.prototype.toString = function() {
        var te = this.elements;
        return "Mat4[" + te[0] + ", " + te[4] + ", " + te[8] + ", " + te[12] + "]\n" + "     [" + te[1] + ", " + te[5] + ", " + te[9] + ", " + te[13] + "]\n" + "     [" + te[2] + ", " + te[6] + ", " + te[10] + ", " + te[14] + "]\n" + "     [" + te[3] + ", " + te[7] + ", " + te[11] + ", " + te[15] + "]";
    };
    /**
	 * @method equals
	 * @memberof Mat4
	 * @brief checks if this matrix equals other matrix
	 * @param Mat4 other
	 * @return Boolean
	 */
    Mat4.prototype.equals = function(other) {
        var ae = this.elements, be = other.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]) && equals(ae[9], be[9]) && equals(ae[10], be[10]) && equals(ae[11], be[11]) && equals(ae[12], be[12]) && equals(ae[13], be[13]) && equals(ae[14], be[14]) && equals(ae[15], be[15]));
    };
    /**
	 * @method Mat4.equals
	 * @memberof Mat4
	 * @brief checks if a matrix equals b matrix
	 * @param Mat4 a
	 * @param Mat4 b
	 * @return Boolean
	 */
    Mat4.equals = function(a, b) {
        var ae = a.elements, be = b.elements;
        return !!(equals(ae[0], be[0]) && equals(ae[1], be[1]) && equals(ae[2], be[2]) && equals(ae[3], be[3]) && equals(ae[4], be[4]) && equals(ae[5], be[5]) && equals(ae[6], be[6]) && equals(ae[7], be[7]) && equals(ae[8], be[8]) && equals(ae[9], be[9]) && equals(ae[10], be[10]) && equals(ae[11], be[11]) && equals(ae[12], be[12]) && equals(ae[13], be[13]) && equals(ae[14], be[14]) && equals(ae[15], be[15]));
    };
    return Mat4;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/quat", [ "math/mathf", "math/vec3" ], function(Mathf, Vec3) {
    /**
	 * @class Quat
	 * @brief Quaterian for 3D rotations
	 * @param Number x
	 * @param Number y
	 * @param Number x
	 * @param Number w
	 */
    function Quat(x, y, z, w) {
        /**
	    * @property Number x
	    * @memberof Quat
	    */
        this.x = x || 0;
        /**
	    * @property Number y
	    * @memberof Quat
	    */
        this.y = y || 0;
        /**
	    * @property Number z
	    * @memberof Quat
	    */
        this.z = z || 0;
        /**
	    * @property Number w
	    * @memberof Quat
	    */
        this.w = void 0 !== w ? w : 1;
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    Quat.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Quat
	 * @brief returns new copy of this
	 * @return Quat
	 */
    Quat.prototype.clone = function() {
        return new Quat(this.x, this.y, this.z, this.w);
    };
    /**
	 * @method copy
	 * @memberof Quat
	 * @brief copies other quaterian
	 * @return Quat
	 */
    Quat.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    };
    /**
	 * @method set
	 * @memberof Quat
	 * @brief sets x y z w components, use is not recommended unless you really know what you doing
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @param Number w
	 * @return Quat
	 */
    Quat.prototype.set = function(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    /**
	 * @method qmul
	 * @memberof Quat
	 * @brief multiples a quat by b quat
	 * @param Quat a
	 * @param Quat b
	 * @return Quat
	 */
    Quat.prototype.qmul = function(a, b) {
        var ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Quat
	 * @brief multiples this quat by other quat
	 * @param Quat other
	 * @return Quat
	 */
    Quat.prototype.mul = function(other) {
        var ax = this.x, ay = this.y, az = this.z, aw = this.w, bx = other.x, by = other.y, bz = other.z, bw = other.w;
        this.x = ax * bw + aw * bx + ay * bz - az * by;
        this.y = ay * bw + aw * by + az * bx - ax * bz;
        this.z = az * bw + aw * bz + ax * by - ay * bx;
        this.w = aw * bw - ax * bx - ay * by - az * bz;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Quat
	 * @brief multiples this quat by scalar
	 * @param Number s
	 * @return Quat
	 */
    Quat.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Quat
	 * @brief divides this quat by scalar
	 * @param Number s
	 * @return Quat
	 */
    Quat.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method qdot
	 * @memberof Quat
	 * @brief returns dot product of a and b
	 * @param Quat a
	 * @param Quat b
	 * @return Quat
	 */
    Quat.qdot = Quat.prototype.qdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    };
    /**
	 * @method dot
	 * @memberof Quat
	 * @brief returns dot product of this and other
	 * @param Quat other
	 * @return Quat
	 */
    Quat.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    };
    /**
	 * @method qlerp
	 * @memberof Quat
	 * @brief linear interpolation between a and b by t
	 * @param Quat a
	 * @param Quat b
	 * @param Number t
	 * @return Quat
	 */
    Quat.prototype.qlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        this.w = lerp(a.w, b.w, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Quat
	 * @brief linear interpolation between this and other by t
	 * @param Quat other
	 * @param Number t
	 * @return Quat
	 */
    Quat.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        this.w = lerp(this.w, other.w, t);
        return this;
    };
    /**
	 * @method qslerp
	 * @memberof Quat
	 * @brief angular interpolation between a and b by t
	 * @param Quat a
	 * @param Quat b
	 * @param Number t
	 * @return Quat
	 */
    Quat.prototype.qslerp = function() {
        var start = new Quat(), end = new Quat(), quat = new Quat(), relative = new Quat();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            quat.copy(start);
            relative.vsub(end, quat.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Quat
	 * @brief angular interpolation between this and other by t
	 * @param Quat other
	 * @param Number t
	 * @return Quat
	 */
    Quat.prototype.slerp = function() {
        var start = new Quat(), end = new Quat(), quat = new Quat(), relative = new Quat();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            quat.copy(start);
            relative.vsub(end, quat.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method lenSq
	 * @memberof Quat
	 * @brief returns squared length
	 * @return Number
	 */
    Quat.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return x * x + y * y + z * z + w * w;
    };
    /**
	 * @method len
	 * @memberof Quat
	 * @brief returns length
	 * @return Number
	 */
    Quat.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return sqrt(x * x + y * y + z * z + w * w);
    };
    /**
	 * @method norm
	 * @memberof Quat
	 * @brief normalizes quat
	 * @return Quat
	 */
    Quat.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        this.w *= l;
        return this;
    };
    /**
	 * @method qinv
	 * @memberof Quat
	 * @brief gets inverse of other quat
	 * @param Quat other
	 * @return Quat
	 */
    Quat.prototype.qinv = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x = -x * l;
        this.y = -y * l;
        this.z = -z * l;
        this.w = w * l;
        return this;
    };
    /**
	 * @method inv
	 * @memberof Quat
	 * @brief gets inverse of quat
	 * @return Quat
	 */
    Quat.prototype.inv = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x = -x * l;
        this.y = -y * l;
        this.z = -z * l;
        this.w = w * l;
        return this;
    };
    /**
	 * @method conjugate
	 * @memberof Quat
	 * @brief gets conjugate of quat
	 * @return Quat
	 */
    Quat.prototype.conjugate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    };
    /**
	 * @method calculateW
	 * @memberof Quat
	 * @brief calculates w component of quat
	 * @return Quat
	 */
    Quat.prototype.calculateW = function() {
        var x = this.x, y = this.y, z = this.z;
        this.w = -sqrt(abs(1 - x * x - y * y - z * z));
        return this;
    };
    /**
	 * @method axisAngle
	 * @memberof Quat
	 * @brief sets quat's axis angle
	 * @param Vec3 axis
	 * @param Number angle
	 * @return Quat
	 */
    Quat.prototype.axisAngle = function(axis, angle) {
        var halfAngle = .5 * angle, s = sin(halfAngle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        this.w = cos(halfAngle);
        return this;
    };
    /**
	 * @method setVec3s
	 * @memberof Quat
	 * @brief sets quat from two vectors
	 * @param Vec3 u
	 * @param Vec3 v
	 * @return Quat
	 */
    Quat.prototype.setVec3s = function() {
        var a = new Vec3();
        return function(u, v) {
            a.vcross(u, v);
            this.x = a.x;
            this.y = a.y;
            this.z = a.z;
            this.w = sqrt(u.lenSq() * v.lenSq()) + u.dot(v);
            this.norm();
            return this;
        };
    }();
    /**
	 * @method setRotationMat3
	 * @memberof Quat
	 * @brief sets rotation from Mat3
	 * @param Mat3 m
	 * @return Quat
	 */
    Quat.prototype.setRotationMat3 = function(m) {
        var s, te = m.elements, m11 = te[0], m12 = te[3], m13 = te[6], m21 = te[1], m22 = te[4], m23 = te[7], m31 = te[2], m32 = te[5], m33 = te[8], trace = m11 + m22 + m33;
        if (trace > 0) {
            s = .5 / sqrt(trace + 1);
            this.w = .25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            s = 2 * sqrt(1 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = .25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        } else if (m22 > m33) {
            s = 2 * sqrt(1 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = .25 * s;
            this.z = (m23 + m32) / s;
        } else {
            s = 2 * sqrt(1 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = .25 * s;
        }
        return this;
    };
    /**
	 * @method setRotationMat4
	 * @memberof Quat
	 * @brief sets rotation from Mat4
	 * @param Mat4 m
	 * @return Quat
	 */
    Quat.prototype.setRotationMat4 = function(m) {
        var s, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], trace = m11 + m22 + m33;
        if (trace > 0) {
            s = .5 / sqrt(trace + 1);
            this.w = .25 / s;
            this.x = (m32 - m23) * s;
            this.y = (m13 - m31) * s;
            this.z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            s = 2 * sqrt(1 + m11 - m22 - m33);
            this.w = (m32 - m23) / s;
            this.x = .25 * s;
            this.y = (m12 + m21) / s;
            this.z = (m13 + m31) / s;
        } else if (m22 > m33) {
            s = 2 * sqrt(1 + m22 - m11 - m33);
            this.w = (m13 - m31) / s;
            this.x = (m12 + m21) / s;
            this.y = .25 * s;
            this.z = (m23 + m32) / s;
        } else {
            s = 2 * sqrt(1 + m33 - m11 - m22);
            this.w = (m21 - m12) / s;
            this.x = (m13 + m31) / s;
            this.y = (m23 + m32) / s;
            this.z = .25 * s;
        }
        return this;
    };
    /**
	 * @method rotateX
	 * @memberof Quat
	 * @brief sets quat's x rotation
	 * @param Number angle
	 * @return Quat
	 */
    Quat.prototype.rotateX = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
        this.x = x * c + w * s;
        this.y = y * c + z * s;
        this.z = z * c - y * s;
        this.w = w * c - x * s;
        return this;
    };
    /**
	 * @method rotateY
	 * @memberof Quat
	 * @brief sets quat's y rotation
	 * @param Number angle
	 * @return Quat
	 */
    Quat.prototype.rotateY = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
        this.x = x * c - z * s;
        this.y = y * c + w * s;
        this.z = z * c + x * s;
        this.w = w * c - y * s;
        return this;
    };
    /**
	 * @method rotateZ
	 * @memberof Quat
	 * @brief sets quat's z rotation
	 * @param Number angle
	 * @return Quat
	 */
    Quat.prototype.rotateZ = function(angle) {
        var halfAngle = .5 * angle, x = this.x, y = this.y, z = this.z, w = this.w, s = sin(halfAngle), c = cos(halfAngle);
        this.x = x * c + y * s;
        this.y = y * c - x * s;
        this.z = z * c + w * s;
        this.w = w * c - z * s;
        return this;
    };
    /**
	 * @method rotate
	 * @memberof Quat
	 * @brief rotates quat by z then x then y in that order
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @return Quat
	 */
    Quat.prototype.rotate = function(x, y, z) {
        this.rotateZ(z);
        this.rotateX(x);
        this.rotateY(y);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Quat
	 * @brief returns string value of this "Quat( 0, 0, 0, 1 )"
	 * @return Quat
	 */
    Quat.prototype.toString = function() {
        return "Quat( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )";
    };
    /**
	 * @method equals
	 * @memberof Quat
	 * @brief checks if this quat equals other quat
	 * @param Quat other
	 * @return Boolean
	 */
    Quat.prototype.equals = function(other) {
        return !!(equals(this.x, other.x) && equals(this.y, other.y) && equals(this.z, other.z) && equals(this.w, other.w));
    };
    /**
	 * @method Quat.equals
	 * @memberof Quat
	 * @brief checks if a quat equals b quat
	 * @param Quat a
	 * @param Quat b
	 * @return Boolean
	 */
    Quat.equals = function(a, b) {
        return !!(equals(a.x, b.x) && equals(a.y, b.y) && equals(a.z, b.z) && equals(a.w, b.w));
    };
    return Quat;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("math/vec4", [ "math/mathf" ], function(Mathf) {
    /**
	 * @class Vec4
	 * @brief 4D vector
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @param Number w
	 */
    function Vec4(x, y, z, w) {
        /**
	    * @property Number x
	    * @memberof Vec4
	    */
        this.x = x || 0;
        /**
	    * @property Number y
	    * @memberof Vec4
	    */
        this.y = y || 0;
        /**
	    * @property Number z
	    * @memberof Vec4
	    */
        this.z = z || 0;
        /**
	    * @property Number w
	    * @memberof Vec4
	    */
        this.w = void 0 !== w ? w : 1;
    }
    var abs = Math.abs, sqrt = Math.sqrt, acos = Math.acos, sin = Math.sin, cos = Math.cos, lerp = Mathf.lerp, clamp = Mathf.clamp, equals = Mathf.equals;
    Vec4.prototype.fromJSON = function(json) {
        this.copy(json);
    };
    /**
	 * @method clone
	 * @memberof Vec4
	 * @brief returns new copy of this
	 * @return Vec4
	 */
    Vec4.prototype.clone = function() {
        return new Vec4(this.x, this.y, this.z, this.w);
    };
    /**
	 * @method copy
	 * @memberof Vec4
	 * @brief copies other vector
	 * @param Vec4 other vector to be copied
	 * @return Vec4
	 */
    Vec4.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    };
    /**
	 * @method set
	 * @memberof Vec4
	 * @brief sets x and y of this vector
	 * @param Number x
	 * @param Number y
	 * @return Vec4
	 */
    Vec4.prototype.set = function(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    /**
	 * @method vadd
	 * @memberof Vec4
	 * @brief adds a + b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vadd = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    };
    /**
	 * @method add
	 * @memberof Vec4
	 * @brief adds this + other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    };
    /**
	 * @method sadd
	 * @memberof Vec4
	 * @brief adds this + scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.sadd = function(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    };
    /**
	 * @method vsub
	 * @memberof Vec4
	 * @brief subtracts a - b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vsub = function(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    };
    /**
	 * @method sub
	 * @memberof Vec4
	 * @brief subtracts this - other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.sub = function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
        return this;
    };
    /**
	 * @method ssub
	 * @memberof Vec4
	 * @brief subtracts this - scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.ssub = function(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        this.w -= s;
        return this;
    };
    /**
	 * @method vmul
	 * @memberof Vec4
	 * @brief multiples a * b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vmul = function(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        this.w = a.w * b.w;
        return this;
    };
    /**
	 * @method mul
	 * @memberof Vec4
	 * @brief multiples this * other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.mul = function(other) {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        this.w *= other.w;
        return this;
    };
    /**
	 * @method smul
	 * @memberof Vec4
	 * @brief multiples this * scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.smul = function(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method vdiv
	 * @memberof Vec4
	 * @brief divides a / b saves it in this
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Vec4
	 */
    Vec4.prototype.vdiv = function(a, b) {
        var x = b.x, y = b.y, z = b.z, w = b.w;
        this.x = 0 !== x ? a.x / x : 0;
        this.y = 0 !== y ? a.y / y : 0;
        this.z = 0 !== z ? a.z / z : 0;
        this.w = 0 !== w ? a.w / w : 0;
        return this;
    };
    /**
	 * @method div
	 * @memberof Vec4
	 * @brief divides this / other
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.div = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = 0 !== x ? this.x / x : 0;
        this.y = 0 !== y ? this.y / y : 0;
        this.z = 0 !== z ? this.z / z : 0;
        this.w = 0 !== w ? this.w / w : 0;
        return this;
    };
    /**
	 * @method sdiv
	 * @memberof Vec4
	 * @brief divides this / scalar
	 * @param Number s
	 * @return Vec4
	 */
    Vec4.prototype.sdiv = function(s) {
        s = 0 !== s ? 1 / s : 0;
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    };
    /**
	 * @method vdot
	 * @memberof Vec4
	 * @brief gets dot product of a vector and b vector
	 * @param Vec4 a
	 * @param Vec4 b
	 * @return Number
	 */
    Vec4.vdot = Vec4.prototype.vdot = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    };
    /**
	 * @method dot
	 * @memberof Vec4
	 * @brief gets dot product of this vector and other vector
	 * @param Vec4 other
	 * @return Number
	 */
    Vec4.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
    };
    /**
	 * @method vlerp
	 * @memberof Vec4
	 * @brief linear interpolation between a vector and b vector by t
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.vlerp = function(a, b, t) {
        this.x = lerp(a.x, b.x, t);
        this.y = lerp(a.y, b.y, t);
        this.z = lerp(a.z, b.z, t);
        this.w = lerp(a.w, b.w, t);
        return this;
    };
    /**
	 * @method lerp
	 * @memberof Vec4
	 * @brief linear interpolation between this vector and other vector by t
	 * @param Vec4 other
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.lerp = function(other, t) {
        this.x = lerp(this.x, other.x, t);
        this.y = lerp(this.y, other.y, t);
        this.z = lerp(this.z, other.z, t);
        this.w = lerp(this.w, other.w, t);
        return this;
    };
    /**
	 * @method vslerp
	 * @memberof Vec4
	 * @brief angular interpolation between a vector and b vector by t
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.vslerp = function() {
        var start = new Vec4(), end = new Vec4(), vec = new Vec4(), relative = new Vec4();
        return function(a, b, t) {
            var dot = clamp(a.dot(b), -1, 1), theta = acos(dot) * t;
            start.copy(a);
            end.copy(b);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method slerp
	 * @memberof Vec4
	 * @brief angular interpolation between this vector and other vector by t
	 * @param Vec4 other
	 * @param Number t between 0 and 1
	 * @return Vec4
	 */
    Vec4.prototype.slerp = function() {
        var start = new Vec4(), end = new Vec4(), vec = new Vec4(), relative = new Vec4();
        return function(other, t) {
            var dot = clamp(this.dot(other), -1, 1), theta = acos(dot) * t;
            start.copy(this);
            end.copy(other);
            vec.copy(start);
            relative.vsub(end, vec.smul(dot));
            relative.norm();
            return this.vadd(start.smul(cos(theta)), relative.smul(sin(theta)));
        };
    }();
    /**
	 * @method applyMat4
	 * @memberof Vec4
	 * @brief multiply this vector by Mat4
	 * @param Mat4 m
	 * @return Vec4
	 */
    Vec4.prototype.applyMat4 = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, w = this.w;
        this.x = x * me[0] + y * me[4] + z * me[8] + w * me[12];
        this.y = x * me[1] + y * me[5] + z * me[9] + w * me[13];
        this.z = x * me[2] + y * me[6] + z * me[10] + w * me[14];
        this.w = x * me[3] + y * me[7] + z * me[11] + w * me[15];
        return this;
    };
    /**
	 * @method applyProj
	 * @memberof Vec4
	 * @brief multiply this vector by projection matrix
	 * @param Mat4 m
	 * @return Vec4
	 */
    Vec4.prototype.applyProj = function(m) {
        var me = m.elements, x = this.x, y = this.y, z = this.z, w = this.w;
        d = 1 / (x * me[3] + y * me[7] + z * me[11] + w * me[15]);
        this.x = (me[0] * x + me[4] * y + me[8] + z * me[12]) * d;
        this.y = (me[1] * x + me[5] * y + me[9] + z * me[13]) * d;
        this.z = (me[2] * x + me[6] * y + me[10] + z * me[14]) * d;
        this.z = (me[3] * x + me[7] * y + me[11] + z * me[15]) * d;
        return this;
    };
    /**
	 * @method lenSq
	 * @memberof Vec4
	 * @brief gets squared length of this
	 * @return Number
	 */
    Vec4.prototype.lenSq = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return x * x + y * y + z * z + w * w;
    };
    /**
	 * @method len
	 * @memberof Vec4
	 * @brief gets length of this
	 * @return Number
	 */
    Vec4.prototype.len = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        return sqrt(x * x + y * y + z * z + w * w);
    };
    /**
	 * @method norm
	 * @memberof Vec4
	 * @brief normalizes this vector so length is equal to 1
	 * @return Vec4
	 */
    Vec4.prototype.norm = function() {
        var x = this.x, y = this.y, z = this.z, w = this.w, l = x * x + y * y + z * z + w * w;
        l = 0 !== l ? 1 / sqrt(l) : 0;
        this.x *= l;
        this.y *= l;
        this.z *= l;
        return this;
    };
    /**
	 * @method negate
	 * @memberof Vec4
	 * @brief negates x and y values
	 * @return Vec4
	 */
    Vec4.prototype.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    };
    /**
	 * @method abs
	 * @memberof Vec4
	 * @brief gets absolute values of vector
	 * @return Vec4
	 */
    Vec4.prototype.abs = function() {
        this.x = abs(this.x);
        this.y = abs(this.y);
        this.z = abs(this.z);
        this.w = abs(this.w);
        return this;
    };
    /**
	 * @method min
	 * @memberof Vec4
	 * @brief returns min values from this and other vector
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.min = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = this.x > x ? x : this.x;
        this.y = this.y > y ? y : this.y;
        this.z = this.z > z ? z : this.z;
        this.w = this.w > w ? w : this.w;
        return this;
    };
    /**
	 * @method max
	 * @memberof Vec4
	 * @brief returns max values from this and other vector
	 * @param Vec4 other
	 * @return Vec4
	 */
    Vec4.prototype.max = function(other) {
        var x = other.x, y = other.y, z = other.z, w = other.w;
        this.x = x > this.x ? x : this.x;
        this.y = y > this.y ? y : this.y;
        this.z = z > this.z ? z : this.z;
        this.w = w > this.w ? w : this.w;
        return this;
    };
    /**
	 * @method clamp
	 * @memberof Vec4
	 * @brief clamps this vector between min and max vector's values
	 * @param Vec4 min
	 * @param Vec4 max
	 * @return Vec4
	 */
    Vec4.prototype.clamp = function(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
        this.z = clamp(this.z, min.z, max.z);
        this.w = clamp(this.w, min.w, max.w);
        return this;
    };
    /**
	 * @method toString
	 * @memberof Vec4
	 * @brief returns string of this vector - "Vec4( 0, 0, 0, 1 )"
	 * @return String
	 */
    Vec4.prototype.toString = function() {
        return "Vec4( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )";
    };
    /**
	 * @method equals
	 * @memberof Vec4
	 * @brief checks if this vector equals other vector
	 * @param Vec4 other
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec4.prototype.equals = function(other, e) {
        return !!(equals(this.x, other.x, e) && equals(this.y, other.y, e) && equals(this.z, other.z, e) && equals(this.w, other.w, e));
    };
    /**
	 * @method Vec4.equals
	 * @memberof Vec4
	 * @brief checks if a vector equals b vector
	 * @param Vec4 a
	 * @param Vec4 b
	 * @param Number epsilon defaults to 0.000001
	 * @return String
	 */
    Vec4.equals = function(a, b, e) {
        return !!(equals(a.x, b.x, e) && equals(a.y, b.y, e) && equals(a.z, b.z, e) && equals(a.w, b.w, e));
    };
    return Vec4;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/body/pbody2d", [ "base/class" ], function(Class) {
    /**
	 * @class PBody2D
	 * @extends Class
	 * @brief Base for 2D Physics Bodies
	 * @param Object opts sets Class properties from passed Object
	 */
    function PBody2D(opts) {
        opts || (opts = {});
        Class.call(this, opts);
        /**
	    * @property Number filterGroup
	    * @brief only bodies with the same filter group collide
	    * @memberof PBody2D
	    */
        this.filterGroup = void 0 !== opts.filterGroup ? opts.filterGroup : 0;
        /**
	    * @property PWorld2D world
	    * @brief reference to world this body is attached to
	    * @memberof PBody2D
	    */
        this.world = void 0;
        /**
	    * @property undefined userData
	    * @brief custom user data, when adding to a GameObject thourgh RigidBody2D component this is set to the RigidBody2D
	    * @memberof PBody2D
	    */
        this.userData = void 0;
    }
    Class.extend(PBody2D, Class);
    PBody2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "PBody2D";
        json._SERVER_ID = this._id;
        json.filterGroup = this.filterGroup;
        return json;
    };
    PBody2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.filterGroup = json.filterGroup;
        return this;
    };
    PBody2D.DYNAMIC = 1;
    PBody2D.STATIC = 2;
    PBody2D.KINEMATIC = 3;
    return PBody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/body/pparticle2d", [ "base/class", "math/vec2", "physics2d/body/pbody2d" ], function(Class, Vec2, PBody2D) {
    /**
	 * @class PParticle2D
	 * @extends PBody2D
	 * @brief Body consisting of one point mass, does not have orientation
	 * @param Object opts sets Class properties from passed Object
	 */
    function PParticle2D(opts) {
        opts || (opts = {});
        PBody2D.call(this, opts);
        /**
	    * @property Vec2 position
	    * @brief position of body
	    * @memberof PParticle2D
	    */
        this.position = opts.position instanceof Vec2 ? opts.position : new Vec2();
        /**
	    * @property Vec2 velocity
	    * @brief velocity of body
	    * @memberof PParticle2D
	    */
        this.velocity = opts.velocity instanceof Vec2 ? opts.velocity : new Vec2();
        /**
	    * @property Vec2 linearDamping
	    * @brief linear damping of body
	    * @memberof PParticle2D
	    */
        this.linearDamping = opts.linearDamping instanceof Vec2 ? opts.linearDamping : new Vec2(.01, .01);
        /**
	    * @property Number mass
	    * @brief mass of body, a mass of zero makes the bodt static
	    * @memberof PParticle2D
	    */
        this.mass = void 0 !== opts.mass ? opts.mass : 1;
        /**
	    * @property Number mass
	    * @brief inverse mass of body, 1 / mass
	    * @memberof PParticle2D
	    */
        this.invMass = this.mass > 0 ? 1 / this.mass : 0;
        /**
	    * @property Enum type
	    * @brief type of body, 1 - DYNAMIC, 2 - STATIC, 3 - KINEMATIC
	    * @memberof PParticle2D
	    */
        this.type = void 0 !== opts.type ? opts.type : this.mass > 0 ? DYNAMIC : STATIC;
        /**
	    * @property Number elasticity
	    * @brief the elasticity of the body
	    * @memberof PParticle2D
	    */
        this.elasticity = void 0 !== opts.elasticity ? opts.elasticity : .5;
        /**
	    * @property Number friction
	    * @brief the friction of the body
	    * @memberof PParticle2D
	    */
        this.friction = void 0 !== opts.friction ? opts.friction : .25;
        /**
	    * @property Vec2 force
	    * @memberof PParticle2D
	    */
        this.force = new Vec2();
        this.vlambda = new Vec2();
        /**
	    * @property Boolean allowSleep
	    * @memberof PParticle2D
	    */
        this.allowSleep = void 0 !== opts.allowSleep ? opts.allowSleep : !0;
        /**
	    * @property Enum sleepState
	    * @brief type of body, 1 - AWAKE, 2 - SLEEPY, 3 - SLEEPING
	    * @memberof PParticle2D
	    */
        this.sleepState = AWAKE;
        this._sleepVelocity = 1e-4;
        this._sleepTimeLimit = 3;
        this._sleepLastSleepy = 0;
    }
    var AWAKE, SLEEPY, SLEEPING, DYNAMIC = PBody2D.DYNAMIC, STATIC = PBody2D.STATIC;
    PBody2D.KINEMATIC;
    Class.extend(PParticle2D, PBody2D);
    /**
	 * @method isAwake
	 * @memberof PParticle2D
	 * @return Boolean
	 */
    PParticle2D.prototype.isAwake = function() {
        return this.sleepState === AWAKE;
    };
    /**
	 * @method isSleepy
	 * @memberof PParticle2D
	 * @return Boolean
	 */
    PParticle2D.prototype.isSleepy = function() {
        return this.sleepState === SLEEPY;
    };
    /**
	 * @method isSleeping
	 * @memberof PParticle2D
	 * @return Boolean
	 */
    PParticle2D.prototype.isSleeping = function() {
        return this.sleepState === SLEEPING;
    };
    /**
	 * @method wake
	 * @memberof PParticle2D
	 * @brief wakes body if sleeping
	 */
    PParticle2D.prototype.wake = function() {
        this.sleepState === SLEEPING && this.trigger("wake");
        this.sleepState = AWAKE;
    };
    /**
	 * @method sleep
	 * @memberof PParticle2D
	 * @brief makes body sleep
	 */
    PParticle2D.prototype.sleep = function() {
        (this.sleepState === AWAKE || this.sleepState === SLEEPY) && this.trigger("sleep");
        this.sleepState = SLEEPING;
    };
    /**
	 * @method sleepTick
	 * @memberof PParticle2D
	 * @brief if allowSleep is true checks if can sleep, called in PWorld2D.step
	 * @param Number time
	 */
    PParticle2D.prototype.sleepTick = function(time) {
        if (this.allowSleep) {
            var sleepState = this.sleepState, velSq = this.velocity.lenSq(), sleepVel = this._sleepVelocity, sleepVelSq = sleepVel * sleepVel;
            if (sleepState === AWAKE && sleepVelSq > velSq) {
                this._sleepLastSleepy = time;
                this.sleepState = SLEEPY;
                this.trigger("sleepy");
            } else sleepState === SLEEPY && velSq > sleepVelSq ? this.wake() : sleepState === SLEEPY && time - this._sleepLastSleepy > this._sleepTimeLimit && this.sleep();
        }
    };
    PParticle2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "PParticle2D";
        json._SERVER_ID = this._id;
        json.filterGroup = this.filterGroup;
        json.position = this.position;
        json.velocity = this.velocity;
        json.linearDamping = this.linearDamping;
        json.mass = this.mass;
        json.invMass = this.invMass;
        json.motionType = this.type;
        json.elasticity = this.elasticity;
        json.friction = this.friction;
        json.allowSleep = this.allowSleep;
        return json;
    };
    PParticle2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.filterGroup = json.filterGroup;
        this.position.fromJSON(json.position);
        this.velocity.fromJSON(json.velocity);
        this.linearDamping = json.linearDamping;
        this.mass = json.mass;
        this.invMass = json.invMass;
        this.type = json.motionType;
        this.elasticity = json.elasticity;
        this.friction = json.friction;
        this.allowSleep = json.allowSleep;
        return this;
    };
    PParticle2D.AWAKE = AWAKE = 1;
    PParticle2D.SLEEPY = SLEEPY = 2;
    PParticle2D.SLEEPING = SLEEPING = 3;
    return PParticle2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/shape/pshape2d", [ "base/class", "math/vec2", "math/aabb2" ], function(Class, Vec2, AABB2) {
    /**
	 * @class PShape2D
	 * @extends Class
	 * @brief Base class for shapes
	 */
    function PShape2D() {
        Class.call(this);
        /**
	    * @property PBody2D body
	    * @brief reference to body this shape is attached to
	    * @memberof PShape2D
	    */
        this.body = void 0;
        /**
	    * @property Enum type
	    * @brief shape type, 1 - BOX, 2 - CIRCLE, 3 - CONVEX
	    * @memberof PShape2D
	    */
        this.type = 0;
        /**
	    * @property AABB2 aabb
	    * @brief aabb of this shape
	    * @memberof PShape2D
	    */
        this.aabb = new AABB2();
        /**
	    * @property Number volume
	    * @brief volume of this shape
	    * @memberof PShape2D
	    */
        this.volume = 0;
        /**
	    * @property Number boundingRadius
	    * @brief the bounding radius of this shape
	    * @memberof PShape2D
	    */
        this.boundingRadius = 0;
    }
    Class.extend(PShape2D, Class);
    /**
	 * @method calculateAABB
	 * @memberof PShape2D
	 * @brief calculates aabb of this shape
	 */
    PShape2D.prototype.calculateAABB = function() {
        throw Error("calculateAABB not implemented for shape type " + this.type);
    };
    /**
	 * @method calculateWorldAABB
	 * @memberof PShape2D
	 * @brief calculates world aabb
	 * @param Vec2 position
	 * @param Array R
	 * @param AABB2 aabb
	 */
    PShape2D.prototype.calculateWorldAABB = function() {
        throw Error("calculateWorldAABB not implemented for shape type " + this.type);
    };
    /**
	 * @method calculateInertia
	 * @memberof PShape2D
	 * @brief calculates inertia
	 * @param Number mass
	 * @returns Number
	 */
    PShape2D.prototype.calculateInertia = function() {
        throw Error("calculateInertia not implemented for shape type " + this.type);
    };
    /**
	 * @method calculateBoundingRadius
	 * @memberof PShape2D
	 * @brief calculates bounding radius
	 */
    PShape2D.prototype.calculateBoundingRadius = function() {
        throw Error("calculateBoundingRadius not implemented for shape type " + this.type);
    };
    /**
	 * @method calculateVolume
	 * @memberof PShape2D
	 * @brief calculates volume of shape
	 */
    PShape2D.prototype.calculateVolume = function() {
        throw Error("calculateVolume not implemented for shape type " + this.type);
    };
    PShape2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "PShape2D";
        json._SERVER_ID = this._id;
        json.shapeType = this.type;
        json.aabb = this.aabb;
        json.volume = this.volume;
        json.boundingRadius = this.boundingRadius;
        return json;
    };
    PShape2D.prototype.fromJSON = function(json) {
        this.type = json.shapeType;
        this._SERVER_ID = json._SERVER_ID;
        this.aabb.fromJSON(json.aabb);
        this.volume = json.volume;
        this.boundingRadius = json.boundingRadius;
        return this;
    };
    PShape2D.BOX = 1;
    PShape2D.CIRCLE = 2;
    PShape2D.CONVEX = 3;
    return PShape2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/shape/pconvex2d", [ "base/class", "math/vec2", "physics2d/shape/pshape2d" ], function(Class, Vec2, PShape2D) {
    /**
	 * @class PConvex2D
	 * @extends PShape2D
	 * @brief Convex shape class
	 * @param Array vertices
	 */
    function PConvex2D(vertices) {
        var v1, v2, verts, normals, i, il;
        PShape2D.call(this);
        this.type = PShape2D.CONVEX;
        /**
	    * @property Array vertices
	    * @memberof PConvex2D
	    */
        this.vertices = verts = vertices instanceof Array ? vertices : [ new Vec2(.5, .5), new Vec2(-.5, .5), new Vec2(-.5, -.5), new Vec2(.5, -.5) ];
        /**
	    * @property Array normals
	    * @memberof PConvex2D
	    */
        this.normals = normals = [];
        for (i = 0, il = verts.length; il > i; i++) {
            v1 = verts[i];
            v2 = verts[i + 1] || verts[0];
            normals[i] = new Vec2(v2.y - v1.y, -(v2.x - v1.x)).norm();
        }
        this.calculateAABB();
        this.calculateBoundingRadius();
        this.calculateVolume();
    }
    var abs = Math.abs, sqrt = Math.sqrt;
    Class.extend(PConvex2D, PShape2D);
    PConvex2D.prototype.calculateAABB = function() {
        var v, x, y, i, vertices = this.vertices, aabb = this.aabb, min = aabb.min, max = aabb.max, minx = 1/0, miny = 1/0, maxx = -1/0, maxy = -1/0;
        for (i = vertices.length; i--; ) {
            v = vertices[i];
            x = v.x;
            y = v.y;
            minx = minx > x ? x : minx;
            miny = miny > y ? y : miny;
            maxx = x > maxx ? x : maxx;
            maxy = y > maxy ? y : maxy;
        }
        min.x = minx;
        min.y = miny;
        max.x = maxx;
        max.y = maxy;
    };
    PConvex2D.prototype.calculateWorldAABB = function() {
        new Vec2();
        return function(position, R, aabb) {
            var vertex, ox, oy, x, y, i, vertices = this.vertices, px = position.x, py = position.y, min = aabb.min, max = aabb.max, minx = 1/0, miny = 1/0, maxx = -1/0, maxy = -1/0, R11 = R[0], R12 = R[2], R21 = R[1], R22 = R[3];
            for (i = vertices.length; i--; ) {
                vertex = vertices[i];
                ox = vertex.x;
                oy = vertex.y;
                x = px + (ox * R11 + oy * R12);
                y = py + (ox * R21 + oy * R22);
                minx = minx > x ? x : minx;
                miny = miny > y ? y : miny;
                maxx = x > maxx ? x : maxx;
                maxy = y > maxy ? y : maxy;
            }
            min.x = minx;
            min.y = miny;
            max.x = maxx;
            max.y = maxy;
        };
    }();
    PConvex2D.prototype.calculateInertia = function(mass) {
        var v1, v2, v1x, v1y, v2x, v2y, a, b, i, il, vertices = this.vertices, d = 0, n = 0;
        for (i = 0, il = vertices.length; il > i; i++) {
            v1 = vertices[i];
            v2 = vertices[i + 1] || vertices[0];
            v1x = v1.x;
            v1y = v1.y;
            v2x = v2.x;
            v2y = v2.y;
            a = abs(v1x * v2y - v1y * v2x);
            b = v2x * v2x + v2y * v2y + (v2x * v1x + v2y * v1y) + (v1x * v1x + v1y * v1y);
            d += a * b;
            n += a;
        }
        return mass / 6 * (d / n);
    };
    PConvex2D.prototype.calculateBoundingRadius = function() {
        var vertex, x, y, lenSq, i, vertices = this.vertices, radiusSq = -1/0;
        for (i = vertices.length; i--; ) {
            vertex = vertices[i];
            x = vertex.x;
            y = vertex.y;
            lenSq = x * x + y * y;
            radiusSq = lenSq > radiusSq ? lenSq : radiusSq;
        }
        this.boundingRadius = sqrt(radiusSq);
    };
    PConvex2D.prototype.calculateVolume = function() {
        var v1, v2, i, il, vertices = this.vertices, volume = 0;
        for (i = 0, il = vertices.length; il > i; i++) {
            v1 = vertices[i];
            v2 = vertices[i + 1] || vertices[0];
            volume += v1.x * v2.y - v1.y * v2.x;
        }
        this.volume = volume;
    };
    PConvex2D.prototype.calculateVolume = function() {
        var v1, v2, i, il, vertices = this.vertices, volume = 0;
        for (i = 0, il = vertices.length; il > i; i++) {
            v1 = vertices[i];
            v2 = vertices[i + 1] || vertices[0];
            volume += v1.x * v2.y - v1.y * v2.x;
        }
        this.volume = volume;
    };
    PConvex2D.prototype.toJSON = function() {
        var i, json = this._JSON, vertices = this.vertices, normals = this.normals;
        json.type = "PConvex2D";
        json._SERVER_ID = this._id;
        json.shapeType = this.type;
        json.aabb = this.aabb;
        json.volume = this.volume;
        json.boundingRadius = this.boundingRadius;
        json.vertices = json.vertices || [];
        json.normals = json.normals || [];
        for (i = vertices.length; i--; ) json.vertices[i] = vertices[i];
        for (i = normals.length; i--; ) json.normals[i] = normals[i];
        return json;
    };
    PConvex2D.prototype.fromJSON = function(json) {
        var i, vertices = json.vertices, normals = json.normals;
        this.type = json.shapeType;
        this._SERVER_ID = json._SERVER_ID;
        this.aabb.fromJSON(json.aabb);
        this.volume = json.volume;
        this.boundingRadius = json.boundingRadius;
        for (i = vertices.length; i--; ) this.vertices[i] = (this.vertices[i] || new Vec2()).copy(vertices[i]);
        for (i = normals.length; i--; ) this.normals[i] = (this.normals[i] || new Vec2()).copy(normals[i]);
        return this;
    };
    return PConvex2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/shape/pbox2d", [ "base/class", "math/vec2", "physics2d/shape/pshape2d", "physics2d/shape/pconvex2d" ], function(Class, Vec2, PShape2D, PConvex2D) {
    /**
	 * @class PBox2D
	 * @extends PConvex2D
	 * @brief Box shape class
	 * @param Vec2 extents
	 */
    function PBox2D(extents) {
        /**
	    * @property Vec2 extents
	    * @memberof PShape2D
	    * @brief the half extents of box
	    */
        this.extents = extents instanceof Vec2 ? extents : new Vec2(.5, .5);
        var x = this.extents.x, y = this.extents.y, vertices = [ new Vec2(x, y), new Vec2(-x, y), new Vec2(-x, -y), new Vec2(x, -y) ];
        PConvex2D.call(this, vertices);
        this.type = PShape2D.BOX;
        this.calculateAABB();
        this.calculateBoundingRadius();
        this.calculateVolume();
    }
    var sqrt = Math.sqrt;
    Class.extend(PBox2D, PConvex2D);
    PBox2D.prototype.calculateAABB = function() {
        var extents = this.extents, x = extents.x, y = extents.y, aabb = this.aabb, min = aabb.min, max = aabb.max;
        min.x = -x;
        min.y = -y;
        max.x = x;
        max.y = y;
    };
    PBox2D.prototype.calculateInertia = function(mass) {
        var extents = this.extents, w = 2 * extents.x, h = 2 * extents.y;
        return mass * (w * w + h * h) / 12;
    };
    PBox2D.prototype.calculateBoundingRadius = function() {
        var extents = this.extents, x = extents.x, y = extents.y, l = x * x + y * y;
        this.boundingRadius = 0 !== l ? sqrt(l) : 0;
    };
    PBox2D.prototype.calculateVolume = function() {
        var extents = this.extents, w = 2 * extents.x, h = 2 * extents.y;
        this.volume = w * h;
    };
    PBox2D.prototype.toJSON = function() {
        var i, json = this._JSON, vertices = this.vertices, normals = this.normals;
        json.type = "PBox2D";
        json._SERVER_ID = this._id;
        json.shapeType = this.type;
        json.aabb = this.aabb;
        json.volume = this.volume;
        json.boundingRadius = this.boundingRadius;
        json.vertices = json.vertices || [];
        json.normals = json.normals || [];
        for (i = vertices.length; i--; ) json.vertices[i] = vertices[i];
        for (i = normals.length; i--; ) json.normals[i] = normals[i];
        json.extents = this.extents;
        return json;
    };
    PBox2D.prototype.fromJSON = function(json) {
        var i, vertices = json.vertices, normals = json.normals;
        this.type = json.shapeType;
        this._SERVER_ID = json._SERVER_ID;
        this.aabb.fromJSON(json.aabb);
        this.volume = json.volume;
        this.boundingRadius = json.boundingRadius;
        for (i = vertices.length; i--; ) this.vertices[i] = (this.vertices[i] || new Vec2()).copy(vertices[i]);
        for (i = normals.length; i--; ) this.normals[i] = (this.normals[i] || new Vec2()).copy(normals[i]);
        this.extents = json.extents;
        return this;
    };
    return PBox2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/shape/pcircle2d", [ "base/class", "math/vec2", "physics2d/shape/pshape2d" ], function(Class, Vec2, PShape2D) {
    /**
	 * @class PCircle2D
	 * @extends PShape2D
	 * @brief Circle shape class
	 * @param Number radius
	 */
    function PCircle2D(radius) {
        PShape2D.call(this);
        this.type = PShape2D.CIRCLE;
        /**
	    * @property Number radius
	    * @memberof PCircle2D
	    */
        this.radius = void 0 !== radius ? radius : .5;
        this.calculateAABB();
        this.calculateBoundingRadius();
        this.calculateVolume();
    }
    var PI = Math.PI;
    Class.extend(PCircle2D, PShape2D);
    PCircle2D.prototype.calculateAABB = function() {
        var r = this.radius, aabb = this.aabb, min = aabb.min, max = aabb.max;
        min.x = min.y = -r;
        max.x = max.y = r;
    };
    PCircle2D.prototype.calculateWorldAABB = function(position, R, aabb) {
        var r = this.radius, min = aabb.min, max = aabb.max, x = position.x, y = position.y;
        min.x = x - r;
        min.y = y - r;
        max.x = x + r;
        max.y = r + y;
    };
    PCircle2D.prototype.calculateInertia = function(mass) {
        var r = this.radius;
        return .4 * mass * r * r;
    };
    PCircle2D.prototype.calculateBoundingRadius = function() {
        this.boundingRadius = this.radius;
    };
    PCircle2D.prototype.calculateVolume = function() {
        var r = this.radius;
        this.volume = PI * r * r;
    };
    PCircle2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "PCircle2D";
        json._SERVER_ID = this._id;
        json.shapeType = this.type;
        json.aabb = this.aabb;
        json.volume = this.volume;
        json.boundingRadius = this.boundingRadius;
        json.radius = this.radius;
        return json;
    };
    PCircle2D.prototype.fromJSON = function(json) {
        this.type = json.shapeType;
        this._SERVER_ID = json._SERVER_ID;
        this.aabb.fromJSON(json.aabb);
        this.volume = json.volume;
        this.boundingRadius = json.boundingRadius;
        this.radius = json.radius;
        return this;
    };
    return PCircle2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/body/prigidbody2d", [ "base/class", "math/vec2", "math/mat2", "math/aabb2", "physics2d/body/pbody2d", "physics2d/body/pparticle2d", "physics2d/shape/pbox2d", "physics2d/shape/pcircle2d", "physics2d/shape/pconvex2d", "physics2d/shape/pshape2d" ], function(Class, Vec2, Mat2, AABB2, PBody2D, PParticle2D, PBox2D, PCircle2D, PConvex2D, PShape2D) {
    /**
	 * @class PRigidBody2D
	 * @extends PParticle2D
	 * @brief 2D Rigid Body
	 * @param Object opts sets Class properties from passed Object
	 */
    function PRigidBody2D(opts) {
        opts || (opts = {});
        PParticle2D.call(this, opts);
        /**
	    * @property PShape2D shape
	    * @brief the shape of the body
	    * @memberof PRigidBody2D
	    */
        this.shape = opts.shape instanceof PShape2D ? opts.shape : new PBox2D();
        this.shape.body = this;
        /**
	    * @property Number rotation
	    * @brief rotation of the body
	    * @memberof PRigidBody2D
	    */
        this.rotation = void 0 !== opts.rotation ? opts.rotation : 0;
        /**
	    * @property Mat2 R
	    * @brief rotation martix of the body
	    * @memberof PRigidBody2D
	    */
        this.R = new Mat2();
        /**
	    * @property Number angularVelocity
	    * @brief angular velocity of the body
	    * @memberof PRigidBody2D
	    */
        this.angularVelocity = void 0 !== opts.angularVelocity ? opts.angularVelocity : 0;
        /**
	    * @property Number angularDamping
	    * @brief angular damping of the body
	    * @memberof PRigidBody2D
	    */
        this.angularDamping = void 0 !== opts.angularDamping ? opts.angularDamping : .1;
        /**
	    * @property AABB2 aabb
	    * @brief min and max vectors of the body
	    * @memberof PRigidBody2D
	    */
        this.aabb = new AABB2();
        /**
	    * @property Boolean aabbNeedsUpdate
	    * @memberof PRigidBody2D
	    */
        this.aabbNeedsUpdate = !0;
        /**
	    * @property Number torque
	    * @brief torque of the body
	    * @memberof PRigidBody2D
	    */
        this.torque = 0;
        /**
	    * @property Number inertia
	    * @brief the inertia of the body's mass with its shape
	    * @memberof PRigidBody2D
	    */
        this.inertia = this.shape.calculateInertia(this.mass);
        /**
	    * @property Number invInertia
	    * @brief inverse inertia of the body
	    * @memberof PRigidBody2D
	    */
        this.invInertia = this.inertia > 0 ? 1 / this.inertia : 0;
        /**
	    * @property Number density
	    * @brief density of the body
	    * @memberof PRigidBody2D
	    */
        this.density = this.mass / this.shape.volume;
        this.wlambda = 0;
        this._sleepAngularVelocity = .001;
    }
    var AWAKE = PParticle2D.AWAKE, SLEEPY = PParticle2D.SLEEPY, SLEEPING = PParticle2D.SLEEPING, STATIC = (PBody2D.DYNAMIC, 
    PBody2D.STATIC);
    PBody2D.KINEMATIC;
    Class.extend(PRigidBody2D, PParticle2D);
    /**
	 * @method sleepTick
	 * @memberof PRigidBody2D
	 * @brief if allowSleep is true checks if can sleep, called in PWorld2D.step
	 * @param Number time
	 */
    PRigidBody2D.prototype.sleepTick = function(time) {
        if (this.allowSleep) {
            var sleepState = this.sleepState, velSq = this.velocity.lenSq(), aVel = this.angularVelocity, aVelSq = aVel * aVel, sleepVel = this._sleepVelocity, sleepVelSq = sleepVel * sleepVel, sleepAVel = this._sleepAngularVelocity, sleepAVelSq = sleepAVel * sleepAVel;
            if (sleepState === AWAKE && (sleepVelSq > velSq || sleepAVelSq > aVelSq)) {
                this._sleepLastSleepy = time;
                this.sleepState = SLEEPY;
                this.trigger("sleepy");
            } else sleepState === SLEEPY && (velSq > sleepVelSq || aVelSq > sleepAVelSq) ? this.wake() : sleepState === SLEEPY && time - this._sleepLastSleepy > this._sleepTimeLimit && this.sleep();
        }
    };
    /**
	 * @method calculateAABB
	 * @memberof PRigidBody2D
	 * @brief calculates aabb based on shape, position, and rotation
	 */
    PRigidBody2D.prototype.calculateAABB = function() {
        this.shape.calculateWorldAABB(this.position, this.R.elements, this.aabb);
        this.aabbNeedsUpdate = !1;
    };
    /**
	 * @method applyForce
	 * @memberof PRigidBody2D
	 * @param Vec2 force
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
    PRigidBody2D.prototype.applyForce = function(addForce, worldPoint, wake) {
        var px, py, pos = this.position, force = this.force, fx = addForce.x, fy = addForce.y;
        worldPoint = worldPoint || pos;
        if (this.type !== STATIC) {
            wake && this.sleepState === SLEEPING && this.wake();
            px = worldPoint.x - pos.x;
            py = worldPoint.y - pos.y;
            force.x += fx;
            force.y += fy;
            this.torque += px * fy - py * fx;
        }
    };
    /**
	 * @method applyTorque
	 * @memberof PRigidBody2D
	 * @param Number torque
	 * @param Boolean wake
	 */
    PRigidBody2D.prototype.applyTorque = function(torque, wake) {
        if (this.type !== STATIC) {
            wake && this.sleepState === SLEEPING && this.wake();
            this.torque += torque;
        }
    };
    /**
	 * @method applyImpulse
	 * @memberof PRigidBody2D
	 * @param Vec2 impulse
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
    PRigidBody2D.prototype.applyImpulse = function(impulse, worldPoint, wake) {
        var px, py, pos = this.position, invMass = this.invMass, velocity = this.velocity, ix = impulse.x, iy = impulse.y;
        worldPoint = worldPoint || pos;
        if (this.type !== STATIC) {
            wake && this.sleepState === SLEEPING && this.wake();
            px = worldPoint.x - pos.x;
            py = worldPoint.y - pos.y;
            velocity.x += ix * invMass;
            velocity.y += iy * invMass;
            this.angularVelocity += (px * iy - py * ix) * this.invInertia;
        }
    };
    PRigidBody2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "PRigidBody2D";
        json._SERVER_ID = this._id;
        json.filterGroup = this.filterGroup;
        json.position = this.position;
        json.velocity = this.velocity;
        json.linearDamping = this.linearDamping;
        json.mass = this.mass;
        json.invMass = this.invMass;
        json.motionType = this.type;
        json.elasticity = this.elasticity;
        json.friction = this.friction;
        json.allowSleep = this.allowSleep;
        json.shape = this.shape.toJSON();
        json.rotation = this.rotation;
        json.R = this.R;
        json.angularVelocity = this.angularVelocity;
        json.angularDamping = this.angularDamping;
        json.aabb = this.aabb;
        json.aabbNeedsUpdate = this.aabbNeedsUpdate;
        json.inertia = this.inertia;
        json.invInertia = this.invInertia;
        json.density = this.density;
        return json;
    };
    PRigidBody2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.filterGroup = json.filterGroup;
        this.position.fromJSON(json.position);
        this.velocity.fromJSON(json.velocity);
        this.linearDamping = json.linearDamping;
        this.mass = json.mass;
        this.invMass = json.invMass;
        this.type = json.motionType;
        this.elasticity = json.elasticity;
        this.friction = json.friction;
        this.allowSleep = json.allowSleep;
        this.shape = new Class.types[json.shape.type]();
        this.shape.fromJSON(json.shape);
        this.shape.body = this;
        this.rotation = json.rotation;
        this.R.fromJSON(json.R);
        this.angularVelocity = json.angularVelocity;
        this.angularDamping = json.angularDamping;
        this.aabb.fromJSON(json.aabb);
        this.aabbNeedsUpdate = json.aabbNeedsUpdate;
        this.inertia = json.inertia;
        this.invInertia = json.invInertia;
        this.density = json.density;
        return this;
    };
    return PRigidBody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/collision/pbroadphase2d", [ "base/class", "math/aabb2", "physics2d/body/pbody2d" ], function(Class, AABB2, PBody2D) {
    /**
	 * @class PBroadphase2D
	 * @extends Class
	 * @brief World broad phase
	 * @param Object opts sets Class properties from passed Object
	 */
    function PBroadphase2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Boolean useBoundingRadius
	    * @brief use bounding radius for broad phase instead of aabb, defaults to false
	    * @memberof PBroadphase2D
	    */
        this.useBoundingRadius = void 0 !== opts.useBoundingRadius ? opts.useBoundingRadius : !1;
    }
    var intersects = AABB2.intersects, STATIC = PBody2D.STATIC, KINEMATIC = PBody2D.KINEMATIC;
    Class.extend(PBroadphase2D, Class);
    /**
	 * @method needBroadphaseTest
	 * @memberof PBroadphase2D
	 * @brief checks if bodyi needs to be checked against bodyj
	 * @return Boolean
	 */
    PBroadphase2D.prototype.needBroadphaseTest = function(bi, bj) {
        return !(bi.filterGroup !== bj.filterGroup || (bi.type === KINEMATIC || bi.type === STATIC || bi.isSleeping()) && (bj.type === KINEMATIC || bj.type === STATIC || bj.isSleeping()) || !bi.shape && !bj.shape);
    };
    /**
	 * @method collisionPairs
	 * @memberof PBroadphase2D
	 * @brief gets all collisions to be checked by near phase
	 * @param PWorld2D world
	 * @param Array pairsi
	 * @param Array pairsj
	 */
    PBroadphase2D.prototype.collisionPairs = function(world, pairsi, pairsj) {
        var bi, bj, i, j, bodies = world.bodies, count = bodies.length;
        pairsi.length = pairsj.length = 0;
        if (this.useBoundingRadius) for (i = 0; count > i; i++) for (j = 0; j !== i; j++) {
            bi = bodies[i];
            bj = bodies[j];
            this.needBroadphaseTest(bi, bj) && this.boundingRadiusBroadphase(bi, bj, pairsi, pairsj);
        } else for (i = 0; count > i; i++) for (j = 0; j !== i; j++) {
            bi = bodies[i];
            bj = bodies[j];
            this.needBroadphaseTest(bi, bj) && this.AABBBroadphase(bi, bj, bi.aabb, bj.aabb, pairsi, pairsj);
        }
    };
    /**
	 * @method boundingRadiusBroadphase
	 * @memberof PBroadphase2D
	 * @brief does bounding radius broad phase
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Array pairsi
	 * @param Array pairsj
	 */
    PBroadphase2D.prototype.boundingRadiusBroadphase = function(bi, bj, pairsi, pairsj) {
        var si = bi.shape, sj = bj.shape, r = si.boundingRadius + sj.boundingRadius, xi = bi.position, xj = bj.position, dx = xj.x - xi.x, dy = xj.y - xi.y, d = dx * dx + dy * dy;
        if (r * r >= d) {
            pairsi.push(bi);
            pairsj.push(bj);
        }
    };
    /**
	 * @method AABBBroadphase
	 * @memberof PBroadphase2D
	 * @brief does aabb broad phase
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param AABB2 biAABB
	 * @param AABB2 bjAABB
	 * @param Array pairsi
	 * @param Array pairsj
	 */
    PBroadphase2D.prototype.AABBBroadphase = function(bi, bj, biAABB, bjAABB, pairsi, pairsj) {
        bi.aabbNeedsUpdate && bi.calculateAABB();
        bj.aabbNeedsUpdate && bj.calculateAABB();
        if (intersects(biAABB, bjAABB)) {
            pairsi.push(bi);
            pairsj.push(bj);
        }
    };
    return PBroadphase2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

require.config({
    name: "odin"
});

define("physics2d/collision/pnearphase2d", [ "base/class", "math/mathf", "math/vec2", "math/line2", "physics2d/shape/pshape2d" ], function(Class, Mathf, Vec2, Line2, PShape2D) {
    function createContact(bi, bj, contacts) {
        var c = contactPool.length ? contactPool.pop() : new PContact2D(bi, bj);
        c.bi = bi;
        c.bj = bj;
        contacts.push(c);
        return c;
    }
    function findMaxSeparation(si, sj, xi, xj, Ri, Rj, edgeOut) {
        var normal, d, s, sPrev, sNext, prevEdge, nextEdge, bestSeparation, i, verticesi = si.vertices, normalsi = si.normals, counti = verticesi.length, verticesj = sj.vertices, Ri11 = (sj.normals, 
        verticesj.length, Ri[0]), Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3], xix = (Rj[0], 
        Rj[2], Rj[1], Rj[3], xi.x), xiy = xi.y, xjx = xj.x, xjy = xj.y, dx = xjx - xix, dy = xjy - xiy, localx = dx * Ri11 + dy * Ri12, localy = dx * Ri21 + dy * Ri22, dmax = -1/0, edgeIndex = 0, bestEdge = 0, increment = 0;
        for (i = counti; i--; ) {
            normal = normalsi[i];
            d = normal.x * localx + normal.y * localy;
            if (d > dmax) {
                dmax = d;
                edgeIndex = i;
            }
        }
        s = edgeSeparation(si, sj, xi, xj, Ri, Rj, edgeIndex);
        if (s > 0) return s;
        prevEdge = edgeIndex - 1 > -1 ? edgeIndex - 1 : counti - 1;
        sPrev = edgeSeparation(si, sj, xi, xj, Ri, Rj, prevEdge);
        if (sPrev > 0) return sPrev;
        nextEdge = counti > edgeIndex + 1 ? edgeIndex + 1 : 0;
        sNext = edgeSeparation(si, sj, xi, xj, Ri, Rj, nextEdge);
        if (sNext > 0) return sNext;
        if (sPrev > s && sPrev > sNext) {
            increment = -1;
            bestEdge = prevEdge;
            bestSeparation = sPrev;
        } else {
            if (!(sNext > s)) {
                edgeOut[0] = edgeIndex;
                return s;
            }
            increment = 1;
            bestEdge = nextEdge;
            bestSeparation = sNext;
        }
        for (;;) {
            edgeIndex = -1 === increment ? bestEdge - 1 > -1 ? bestEdge - 1 : counti - 1 : counti > bestEdge + 1 ? bestEdge + 1 : 0;
            s = edgeSeparation(si, sj, xi, xj, Ri, Rj, edgeIndex);
            if (s > 0) return s;
            if (!(s > bestSeparation)) break;
            bestEdge = edgeIndex;
            bestSeparation = s;
        }
        edgeOut[0] = bestEdge;
        return bestSeparation;
    }
    function edgeSeparation(si, sj, xi, xj, Ri, Rj, edgeIndexi) {
        var vertex, x, y, vx, vy, v1x, v1y, v2x, v2y, d, i, verticesj = sj.vertices, Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3], Rj11 = Rj[0], Rj12 = Rj[2], Rj21 = Rj[1], Rj22 = Rj[3], xix = xi.x, xiy = xi.y, xjx = xj.x, xjy = xj.y, normal = si.normals[edgeIndexi], x = normal.x, y = normal.y, nx = x * Ri11 + y * Ri12, ny = x * Ri21 + y * Ri22, edgeIndexj = 0, dmax = -1/0;
        for (i = verticesj.length; i--; ) {
            vertex = verticesj[i];
            x = vertex.x;
            y = vertex.y;
            vx = xjx + (x * Rj11 + y * Rj12);
            vy = xjy + (x * Rj21 + y * Rj22);
            d = vx * -nx + vy * -ny;
            if (d > dmax) {
                dmax = d;
                edgeIndexj = i;
                v2x = vx;
                v2y = vy;
            }
        }
        vertex = si.vertices[edgeIndexi];
        x = vertex.x;
        y = vertex.y;
        v1x = xix + (x * Ri11 + y * Ri12);
        v1y = xiy + (x * Ri21 + y * Ri22);
        v2x -= v1x;
        v2y -= v1y;
        return v2x * nx + v2y * ny;
    }
    function findEdge(si, xi, Ri, edgeIndex, edge) {
        var vertex, x, y, v1x, v1y, v2x, v2y, vertices = si.vertices, count = vertices.length, Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3], xix = xi.x, xiy = xi.y;
        vertex = vertices[edgeIndex];
        x = vertex.x;
        y = vertex.y;
        v1x = xix + (x * Ri11 + y * Ri12);
        v1y = xiy + (x * Ri21 + y * Ri22);
        vertex = count > edgeIndex + 1 ? vertices[edgeIndex + 1] : vertices[0];
        x = vertex.x;
        y = vertex.y;
        v2x = xix + (x * Ri11 + y * Ri12);
        v2y = xiy + (x * Ri21 + y * Ri22);
        edge.start.set(v1x, v1y);
        edge.end.set(v2x, v2y);
    }
    /**
	 * @class PNearphase2D
	 * @extends Class
	 * @brief World near phase
	 */
    function PNearphase2D() {
        Class.call(this);
    }
    var EPSILON = Mathf.EPSILON, clamp01 = Mathf.clamp01, sqrt = (Mathf.equals, Math.abs, 
    Math.sqrt), BOX = (Math.min, Math.max, PShape2D.BOX), CIRCLE = PShape2D.CIRCLE, CONVEX = PShape2D.CONVEX, contactPool = [];
    Class.extend(PNearphase2D, Class);
    /**
	 * @method collisions
	 * @memberof PNearphase2D
	 * @brief gets all contacts from world pairs
	 * @param PWorld2D world
	 * @param Array pairsi
	 * @param Array pairsj
	 * @param Array contacts
	 */
    PNearphase2D.prototype.collisions = function(world, pairsi, pairsj, contacts) {
        var bi, bj, i;
        for (i = contacts.length; i--; ) contactPool.push(contacts[i]);
        contacts.length = 0;
        for (i = pairsi.length; i--; ) {
            bi = pairsi[i];
            bj = pairsj[i];
            this.nearphase(bi, bj, bi.shape, bj.shape, bi.position, bj.position, bi.R.elements, bj.R.elements, contacts);
        }
    };
    /**
	 * @method convexConvex
	 * @memberof PNearphase2D
	 * @brief convex vs convex collision detection
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param PShape2D si
	 * @param PShape2D sj
	 * @param Vec2 xi
	 * @param Vec2 xj
	 * @param Array Ri
	 * @param Array Rj
	 */
    PNearphase2D.prototype.convexConvex = function() {
        var edgei = new Line2(), edgej = new Line2(), edgeOuti = [ 0 ], edgeOutj = [ 0 ], relativeTol = .98, absoluteTol = .001, vec = (new Vec2(), 
        new Vec2());
        return function(bi, bj, si, sj, xi, xj, Ri, Rj, contacts) {
            var separationi, separationj, edgeIndexi, edgeIndexj, edgeiStart, edgeiEnd, edgejStart, edgejEnd, normal, x, y, nx, ny, offset, s, tmp, c, n, ri, rj;
            separationi = findMaxSeparation(si, sj, xi, xj, Ri, Rj, edgeOuti);
            edgeIndexi = edgeOuti[0];
            if (!(separationi > 0)) {
                separationj = findMaxSeparation(sj, si, xj, xi, Rj, Ri, edgeOutj);
                edgeIndexj = edgeOutj[0];
                if (!(separationj > 0)) {
                    normal = si.normals[edgeIndexi];
                    x = normal.x;
                    y = normal.y;
                    nx = x * Ri[0] + y * Ri[2];
                    ny = x * Ri[1] + y * Ri[3];
                    if (separationj > separationi * relativeTol + absoluteTol) {
                        tmp = bj;
                        bj = bi;
                        bi = tmp;
                        tmp = sj;
                        sj = si;
                        si = tmp;
                        tmp = xj;
                        xj = xi;
                        xi = tmp;
                        tmp = Rj;
                        Rj = Ri;
                        Ri = tmp;
                        tmp = edgeIndexj;
                        edgeIndexj = edgeIndexi;
                        edgeIndexi = tmp;
                        nx = -nx;
                        ny = -ny;
                    }
                    findEdge(si, xi, Ri, edgeIndexi, edgei);
                    findEdge(sj, xj, Rj, edgeIndexj, edgej);
                    edgeiStart = edgei.start;
                    edgeiEnd = edgei.end;
                    edgejStart = edgej.start;
                    edgejEnd = edgej.end;
                    offset = nx * edgeiStart.x + ny * edgeiStart.y;
                    edgei.closestPoint(edgejStart, vec);
                    s = nx * edgejStart.x + ny * edgejStart.y - offset;
                    if (0 >= s) {
                        c = createContact(bi, bj, contacts);
                        n = c.n;
                        ri = c.ri;
                        rj = c.rj;
                        n.x = nx;
                        n.y = ny;
                        edgei.closestPoint(vec, ri).sub(xi);
                        edgej.closestPoint(vec, rj).sub(xj);
                    }
                    edgei.closestPoint(edgejEnd, vec);
                    s = nx * edgejEnd.x + ny * edgejEnd.y - offset;
                    if (0 >= s) {
                        c = createContact(bi, bj, contacts);
                        n = c.n;
                        ri = c.ri;
                        rj = c.rj;
                        n.x = nx;
                        n.y = ny;
                        edgei.closestPoint(vec, ri).sub(xi);
                        edgej.closestPoint(vec, rj).sub(xj);
                    }
                    bi.wake();
                    bj.wake();
                    bi.trigger("collide", bj);
                    bj.trigger("collide", bi);
                }
            }
        };
    }();
    /**
	 * @method convexCircle
	 * @memberof PNearphase2D
	 * @brief convex vs circle collision detection
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param PShape2D si
	 * @param PShape2D sj
	 * @param Vec2 xi
	 * @param Vec2 xj
	 * @param Array Ri
	 */
    PNearphase2D.prototype.convexCircle = function(bi, bj, si, sj, xi, xj, Ri, contacts) {
        var x, y, vertex, vx, vy, normal, nx, ny, s, v1x, v1y, v2x, v2y, ex, ey, u, px, py, dx, dy, c, n, nx, ny, ri, rj, i, vertices = si.vertices, normals = si.normals, count = vertices.length, radius = sj.radius, Ri11 = Ri[0], Ri12 = Ri[2], Ri21 = Ri[1], Ri22 = Ri[3], xix = xi.x, xiy = xi.y, xjx = xj.x, xjy = xj.y, separation = -1/0, normalIndex = 0;
        for (i = count; i--; ) {
            vertex = vertices[i];
            x = vertex.x;
            y = vertex.y;
            vx = xix + (x * Ri11 + y * Ri12);
            vy = xiy + (x * Ri21 + y * Ri22);
            normal = normals[i];
            x = normal.x;
            y = normal.y;
            nx = x * Ri11 + y * Ri12;
            ny = x * Ri21 + y * Ri22;
            s = nx * (xjx - vx) + ny * (xjy - vy);
            if (s > radius) return;
            if (s > separation) {
                separation = s;
                normalIndex = i;
            }
        }
        normal = normals[normalIndex];
        x = normal.x;
        y = normal.y;
        nx = x * Ri11 + y * Ri12;
        ny = x * Ri21 + y * Ri22;
        vertex = vertices[normalIndex];
        x = vertex.x;
        y = vertex.y;
        v1x = xix + (x * Ri11 + y * Ri12);
        v1y = xiy + (x * Ri21 + y * Ri22);
        vertex = count > normalIndex + 1 ? vertices[normalIndex + 1] : vertices[0];
        x = vertex.x;
        y = vertex.y;
        v2x = xix + (x * Ri11 + y * Ri12);
        v2y = xiy + (x * Ri21 + y * Ri22);
        ex = v2x - v1x;
        ey = v2y - v1y;
        dx = xjx - v1x;
        dy = xjy - v1y;
        u = clamp01((ex * dx + ey * dy) / (ex * ex + ey * ey));
        px = v1x + ex * u;
        py = v1y + ey * u;
        c = createContact(bi, bj, contacts);
        n = c.n;
        ri = c.ri;
        rj = c.rj;
        n.x = nx;
        n.y = ny;
        ri.x = px - xix;
        ri.y = py - xiy;
        rj.x = -radius * nx;
        rj.y = -radius * ny;
        bi.wake();
        bj.wake();
        bi.trigger("collide", bj);
        bj.trigger("collide", bi);
    };
    /**
	 * @method circleCircle
	 * @memberof PNearphase2D
	 * @brief circle vs circle collision detection
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param PShape2D si
	 * @param PShape2D sj
	 * @param Vec2 xi
	 * @param Vec2 xj
	 */
    PNearphase2D.prototype.circleCircle = function(bi, bj, si, sj, xi, xj, contacts) {
        var invDist, c, n, nx, ny, ri, rj, dx = xj.x - xi.x, dy = xj.y - xi.y, dist = dx * dx + dy * dy, radiusi = si.radius, radiusj = sj.radius, r = radiusi + radiusj;
        if (!(dist > r * r)) {
            c = createContact(bi, bj, contacts);
            n = c.n;
            ri = c.ri;
            rj = c.rj;
            if (EPSILON > dist) {
                nx = 0;
                ny = 1;
            } else {
                dist = sqrt(dist);
                invDist = 1 / dist;
                nx = dx * invDist;
                ny = dy * invDist;
            }
            n.x = nx;
            n.y = ny;
            ri.x = radiusi * nx;
            ri.y = radiusi * ny;
            rj.x = -radiusj * nx;
            rj.y = -radiusj * ny;
            bi.wake();
            bj.wake();
            bi.trigger("collide", bj);
            bj.trigger("collide", bi);
        }
    };
    /**
	 * @method nearphase
	 * @memberof PNearphase2D
	 * @brief does near phase, calls detection function based on bodies type
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param PShape2D si
	 * @param PShape2D sj
	 * @param Vec2 xi
	 * @param Vec2 xj
	 * @param Array Ri
	 * @param Array Rj
	 * @param Array contacts
	 */
    PNearphase2D.prototype.nearphase = function(bi, bj, si, sj, xi, xj, Ri, Rj, contacts) {
        if (si && sj) if (si.type === CIRCLE) switch (sj.type) {
          case CIRCLE:
            this.circleCircle(bi, bj, si, sj, xi, xj, contacts);
            break;

          case BOX:
          case CONVEX:
            this.convexCircle(bj, bi, sj, si, xj, xi, Rj, contacts);
        } else if (si.type === BOX || si.type === CONVEX) switch (sj.type) {
          case CIRCLE:
            this.convexCircle(bi, bj, si, sj, xi, xj, Ri, contacts);
            break;

          case BOX:
          case CONVEX:
            this.convexConvex(bi, bj, si, sj, xi, xj, Ri, Rj, contacts);
        }
    };
    return PNearphase2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/constraints/pconstraint2d", [ "base/class" ], function(Class) {
    /**
	 * @class PConstraint2D
	 * @extends Class
	 * @brief 2d constraint
	 * @param PBody2D bi
	 * @param PBody2D bj
	 */
    function PConstraint2D(bi, bj) {
        Class.call(this);
        /**
	    * @property PBody2D bi
	    * @memberof PConstraint2D
	    */
        this.bi = bi;
        /**
	    * @property PBody2D bj
	    * @memberof PConstraint2D
	    */
        this.bj = bj;
        /**
	    * @property Array equations
	    * @memberof PConstraint2D
	    */
        this.equations = [];
    }
    Class.extend(PConstraint2D, Class);
    /**
	 * @method update
	 * @memberof PConstraint2D
	 * @brief updates equations, called in PWorld2D.step
	 */
    PConstraint2D.prototype.update = function() {};
    return PConstraint2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/constraints/pequation2d", [ "base/class" ], function(Class) {
    /**
	 * @class PEquation2D
	 * @extends Class
	 * @brief 2d equation
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Number minForce
	 * @param Number maxForce
	 */
    function PEquation2D(bi, bj, minForce, maxForce) {
        Class.call(this);
        /**
	    * @property PBody2D bi
	    * @memberof PEquation2D
	    */
        this.bi = bi;
        /**
	    * @property PBody2D bj
	    * @memberof PEquation2D
	    */
        this.bj = bj;
        /**
	    * @property Number minForce
	    * @brief min force of equation, used in solver
	    * @memberof PEquation2D
	    */
        this.minForce = void 0 !== minForce ? minForce : -1e6;
        /**
	    * @property Number maxForce
	    * @brief max force of equation, used in solver
	    * @memberof PEquation2D
	    */
        this.maxForce = void 0 !== maxForce ? maxForce : 1e6;
        /**
	    * @property Number stiffness
	    * @brief stiffness of the equation
	    * @memberof PEquation2D
	    */
        this.stiffness = 1e7;
        /**
	    * @property Number relaxation
	    * @brief number of steps to relax this equation
	    * @memberof PEquation2D
	    */
        this.relaxation = 5;
        /**
	    * @property Number a
	    * @memberof PEquation2D
	    */
        this.a = 0;
        /**
	    * @property Number b
	    * @memberof PEquation2D
	    */
        this.b = 0;
        /**
	    * @property Number eps
	    * @memberof PEquation2D
	    */
        this.eps = 0;
    }
    Class.extend(PEquation2D, Class);
    /**
	 * @method calculateConstants
	 * @memberof PEquation2D
	 * @brief calculates a, b, and eps based on delta time
	 * @param Number h
	 */
    PEquation2D.prototype.calculateConstants = function(h) {
        var d = this.relaxation, k = this.stiffness;
        this.a = 4 / (h * (1 + 4 * d));
        this.b = 4 * d / (1 + 4 * d);
        this.eps = 4 / (h * h * k * (1 + 4 * d));
    };
    return PEquation2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/constraints/pcontact2d", [ "base/class", "math/vec2", "physics2d/constraints/pequation2d" ], function(Class, Vec2, PEquation2D) {
    /**
	 * @class PContact2D
	 * @extends PEquation2D
	 * @brief 2d contact equation
	 * @param PBody2D bi
	 * @param PBody2D bj
	 */
    function PContact2D(bi, bj) {
        PEquation2D.call(this, bi, bj, 0, 1e6);
        /**
	    * @property Vec2 n
	    * @brief normal pointing from bodyi to bodyj
	    * @memberof PEquation2D
	    */
        this.n = new Vec2();
        /**
	    * @property Vec2 ri
	    * @brief contact point on bodyi
	    * @memberof PEquation2D
	    */
        this.ri = new Vec2();
        /**
	    * @property Vec2 rj
	    * @brief contact point on bodyj
	    * @memberof PEquation2D
	    */
        this.rj = new Vec2();
        this.rixn = 0;
        this.rjxn = 0;
        this.stiffness = 1e7;
        this.relaxation = 6;
    }
    var min = Math.min;
    Class.extend(PContact2D, PEquation2D);
    PContact2D.prototype.calculateB = function(h) {
        var a = this.a, b = this.b, n = this.n, nx = n.x, ny = n.y, ri = this.ri, rix = ri.x, riy = ri.y, rj = this.rj, rjx = rj.x, rjy = rj.y, bi = this.bi, invMassi = bi.invMass, invInertiai = bi.invInertia, xi = bi.position, vi = bi.velocity, fi = bi.force, wi = bi.angularVelocity, ti = bi.torque, bj = this.bj, invMassj = bj.invMass, invInertiaj = bj.invInertia, xj = bj.position, vj = bj.velocity, fj = bj.force, wj = bj.angularVelocity, tj = bj.torque, rixn = rix * ny - riy * nx, rjxn = rjx * ny - rjy * nx, e = 1 + min(bi.elasticity, bj.elasticity), Gqx = xj.x + rjx - xi.x - rix, Gqy = xj.y + rjy - xi.y - riy, Gq = Gqx * nx + Gqy * ny, GWx = vj.x + -wj * rjy - vi.x - -wi * riy, GWy = vj.y + wj * rjx - vi.y - wi * rix, GW = e * GWx * nx + e * GWy * ny, GiMfx = fj.x * invMassj + -tj * rjy * invInertiaj - fi.x * invMassi - -ti * riy * invInertiai, GiMfy = fj.y * invMassj + tj * rjx * invInertiaj - fi.y * invMassi - ti * rix * invInertiai, GiMf = GiMfx * nx + GiMfy * ny;
        this.rixn = rixn;
        this.rjxn = rjxn;
        return -a * Gq - b * GW - h * GiMf;
    };
    PContact2D.prototype.calculateC = function() {
        var n = this.n, bi = (n.x, n.y, this.bi), bj = this.bj, rixn = (this.ri, this.rj, 
        this.rixn), rjxn = this.rjxn, C = bi.invMass + bj.invMass + this.eps;
        C += bi.invInertia * rixn * rixn;
        C += bj.invInertia * rjxn * rjxn;
        return C;
    };
    PContact2D.prototype.calculateGWlambda = function() {
        var n = this.n, nx = n.x, ny = n.y, bi = (this.ri, this.rj, this.bi), vlambdai = bi.vlambda, wlambdai = bi.wlambda, bj = this.bj, vlambdaj = bj.vlambda, wlambdaj = bj.wlambda, ulambdax = vlambdaj.x - vlambdai.x, ulambday = vlambdaj.y - vlambdai.y, GWlambda = ulambdax * nx + ulambday * ny;
        void 0 !== wlambdai && (GWlambda -= wlambdai * this.rixn);
        void 0 !== wlambdaj && (GWlambda += wlambdaj * this.rjxn);
        return GWlambda;
    };
    PContact2D.prototype.addToWlambda = function(deltalambda) {
        var n = this.n, nx = n.x, ny = n.y, ri = this.ri, rj = this.rj, rixn = this.rixn, rjxn = this.rjxn, bi = this.bi, invMassi = bi.invMass, vlambdai = bi.vlambda, bj = this.bj, invMassj = bj.invMass, vlambdaj = bj.vlambda, lambdax = deltalambda * nx, lambday = deltalambda * ny;
        vlambdai.x -= lambdax * invMassi;
        vlambdai.y -= lambday * invMassi;
        vlambdaj.x += lambdax * invMassj;
        vlambdaj.y += lambday * invMassj;
        void 0 !== bi.wlambda && (bi.wlambda -= (ri.x * lambday - ri.y * lambdax) * bi.invInertia * rixn * rixn);
        void 0 !== bj.wlambda && (bj.wlambda += (rj.x * lambday - rj.y * lambdax) * bj.invInertia * rjxn * rjxn);
    };
    return PContact2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/constraints/pdistanceconstraint2d", [ "base/class", "physics2d/constraints/pconstraint2d", "physics2d/constraints/pcontact2d" ], function(Class, PConstraint2D, PContact2D) {
    /**
	 * @class PDistanceConstraint2D
	 * @extends PConstraint2D
	 * @brief 2d distance constraint
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Number distance
	 * @param Number maxForce
	 */
    function PDistanceConstraint2D(bi, bj, distance, maxForce) {
        PConstraint2D.call(this, bi, bj);
        /**
	    * @property Number distance
	    * @brief the min distance that separates the bodies
	    * @memberof PConstraint2D
	    */
        this.distance = void 0 !== distance ? distance : 1;
        this.maxForce = void 0 !== maxForce ? maxForce : 1e6;
        this.equations.push(new PContact2D(bi, bj));
        this.normal = this.equations[0];
        this.normal.minForce = -maxForce;
        this.normal.maxForce = maxForce;
    }
    Class.extend(PDistanceConstraint2D, PConstraint2D);
    PDistanceConstraint2D.prototype.update = function() {
        var normal = this.normal, n = normal.n, dist = this.distance;
        n.vsub(this.bj.position, this.bi.position).norm();
        normal.ri.copy(n).smul(.5 * dist);
        normal.rj.copy(n).smul(.5 * -dist);
    };
    return PDistanceConstraint2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/constraints/pfriction2d", [ "base/class", "math/vec2", "physics2d/constraints/pequation2d" ], function(Class, Vec2, PEquation2D) {
    /**
	 * @class PFriction2D
	 * @extends PEquation2D
	 * @brief 2d friction equation
	 * @param PBody2D bi
	 * @param PBody2D bj
	 * @param Number slipForce
	 */
    function PFriction2D(bi, bj, slipForce) {
        PEquation2D.call(this, bi, bj, -slipForce, slipForce);
        /**
	    * @property Vec2 t
	    * @brief tangent of the contact normal
	    * @memberof PEquation2D
	    */
        this.t = new Vec2();
        /**
	    * @property Vec2 ri
	    * @brief contact point on bodyi
	    * @memberof PEquation2D
	    */
        this.ri = new Vec2();
        /**
	    * @property Vec2 rj
	    * @brief contact point on bodyj
	    * @memberof PEquation2D
	    */
        this.rj = new Vec2();
        this.rixt = 0;
        this.rjxt = 0;
        this.stiffness = 1e7;
        this.relaxation = 6;
    }
    Math.abs;
    Class.extend(PFriction2D, PEquation2D);
    PFriction2D.prototype.calculateB = function(h) {
        var b = this.b, t = this.t, tx = t.x, ty = t.y, ri = this.ri, rix = ri.x, riy = ri.y, rj = this.rj, rjx = rj.x, rjy = rj.y, bi = this.bi, invMassi = bi.invMass, invInertiai = bi.invInertia, vi = bi.velocity, fi = bi.force, wi = bi.angularVelocity, ti = bi.torque, bj = this.bj, invMassj = bj.invMass, invInertiaj = bj.invInertia, vj = bj.velocity, fj = bj.force, wj = bj.angularVelocity, tj = bj.torque, rixt = rix * ty - riy * tx, rjxt = rjx * ty - rjy * tx, GWx = vj.x + -wj * rjy - vi.x - -wi * riy, GWy = vj.y + wj * rjx - vi.y - wi * rix, GW = GWx * tx + GWy * ty, GiMfx = fj.x * invMassj + -tj * rjy * invInertiaj - fi.x * invMassi - -ti * riy * invInertiai, GiMfy = fj.y * invMassj + tj * rjx * invInertiaj - fi.y * invMassi - ti * rix * invInertiai, GiMf = GiMfx * tx + GiMfy * ty;
        this.rixt = rixt;
        this.rjxt = rjxt;
        return -b * GW - h * GiMf;
    };
    PFriction2D.prototype.calculateC = function() {
        var t = this.t, bi = (t.x, t.y, this.bi), bj = this.bj, rixt = (this.ri, this.rj, 
        this.rixt), rjxt = this.rjxt, C = bi.invMass + bj.invMass + this.eps;
        C += bi.invInertia * rixt * rixt;
        C += bj.invInertia * rjxt * rjxt;
        return C;
    };
    PFriction2D.prototype.calculateGWlambda = function() {
        var t = this.t, tx = t.x, ty = t.y, bi = (this.ri, this.rj, this.bi), vlambdai = bi.vlambda, wlambdai = bi.wlambda, bj = this.bj, vlambdaj = bj.vlambda, wlambdaj = bj.wlambda, ulambdax = vlambdaj.x - vlambdai.x, ulambday = vlambdaj.y - vlambdai.y, GWlambda = ulambdax * tx + ulambday * ty;
        void 0 !== wlambdai && (GWlambda -= wlambdai * this.rixt);
        void 0 !== wlambdaj && (GWlambda += wlambdaj * this.rjxt);
        return GWlambda;
    };
    PFriction2D.prototype.addToWlambda = function(deltalambda) {
        var t = this.t, tx = t.x, ty = t.y, ri = this.ri, rj = this.rj, rixt = this.rixt, rjxt = this.rjxt, bi = this.bi, invMassi = bi.invMass, vlambdai = bi.vlambda, bj = this.bj, invMassj = bj.invMass, vlambdaj = bj.vlambda, lambdax = deltalambda * tx, lambday = deltalambda * ty;
        vlambdai.x -= lambdax * invMassi;
        vlambdai.y -= lambday * invMassi;
        vlambdaj.x += lambdax * invMassj;
        vlambdaj.y += lambday * invMassj;
        void 0 !== bi.wlambda && (bi.wlambda -= (ri.x * lambday - ri.y * lambdax) * bi.invInertia * rixt * rixt);
        void 0 !== bj.wlambda && (bj.wlambda += (rj.x * lambday - rj.y * lambdax) * bj.invInertia * rjxt * rjxt);
    };
    return PFriction2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/psolver2d", [ "base/class" ], function(Class) {
    /**
	 * @class PSolver2D
	 * @extends Class
	 * @brief constraint equation Gauss-Seidel solver
	 * @param Object opts sets Class properties from passed Object
	 */
    function PSolver2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Array equations
	    * @brief equations to solve
	    * @memberof PSolver2D
	    */
        this.equations = [];
        /**
	    * @property Number iterations
	    * @brief max number of iterations
	    * @memberof PSolver2D
	    */
        this.iterations = void 0 !== opts.iterations ? opts.iterations : 10;
        /**
	    * @property Number tolerance
	    * @brief global error tolerance
	    * @memberof PSolver2D
	    */
        this.tolerance = void 0 !== opts.tolerance ? opts.tolerance : 1e-6;
    }
    var abs = Math.abs;
    Class.extend(PSolver2D, Class);
    /**
	 * @method solve
	 * @memberof PSolver2D
	 * @brief sovles equations for world bodies
	 * @param PWorld2D world
	 * @param Number dt
	 */
    PSolver2D.prototype.solve = function() {
        var lambdas = [], invCs = [], Bs = [];
        return function(world, dt) {
            var B, invC, GWlambda, deltalambda, deltalambdaTotal, lambda, body, velocity, vlambda, c, i, iter, iterations = this.iterations, tolerance = this.tolerance, toleranceSq = tolerance * tolerance, equations = this.equations, equationsLen = equations.length, bodies = world.bodies, bodiesLen = bodies.length;
            if (equationsLen) {
                for (i = bodiesLen; i--; ) {
                    body = bodies[i];
                    vlambda = body.vlambda;
                    vlambda.x = 0;
                    vlambda.y = 0;
                    void 0 !== body.wlambda && (body.wlambda = 0);
                }
                for (i = equationsLen; i--; ) {
                    c = equations[i];
                    c.calculateConstants(dt);
                    lambdas[i] = 0;
                    Bs[i] = c.calculateB(dt);
                    invCs[i] = 1 / c.calculateC();
                }
                for (iter = 0; iterations > iter; iter++) {
                    deltalambdaTotal = 0;
                    for (i = equationsLen; i--; ) {
                        c = equations[i];
                        B = Bs[i];
                        invC = invCs[i];
                        lambda = lambdas[i];
                        GWlambda = c.calculateGWlambda();
                        deltalambda = invC * (B - GWlambda - c.eps * lambda);
                        c.minForce > lambda + deltalambda ? deltalambda = c.minForce - lambda : lambda + deltalambda > c.maxForce && (deltalambda = c.maxForce - lambda);
                        lambdas[i] += deltalambda;
                        deltalambdaTotal += abs(deltalambda);
                        c.addToWlambda(deltalambda);
                    }
                    if (toleranceSq > deltalambdaTotal * deltalambdaTotal) break;
                }
                for (i = bodiesLen; i--; ) {
                    body = bodies[i];
                    velocity = body.velocity;
                    vlambda = body.vlambda;
                    velocity.x += vlambda.x;
                    velocity.y += vlambda.y;
                    void 0 !== body.wlambda && (body.angularVelocity += body.wlambda);
                }
            }
            return iter;
        };
    }();
    /**
	 * @method add
	 * @memberof PSolver2D
	 * @brief adds equation
	 * @param PEquation2D equation
	 */
    PSolver2D.prototype.add = function(equation) {
        this.equations.push(equation);
    };
    /**
	 * @method remove
	 * @memberof PSolver2D
	 * @brief removes equation
	 * @param PEquation2D equation
	 */
    PSolver2D.prototype.remove = function(equation) {
        var equations = this.equations, idx = equations.indexOf(equation);
        -1 !== idx && equations.splice(idx, equation);
    };
    /**
	 * @method clear
	 * @memberof PSolver2D
	 * @brief clears all equations
	 */
    PSolver2D.prototype.clear = function() {
        this.equations.length = 0;
    };
    return PSolver2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("physics2d/pworld2d", [ "base/class", "math/mathf", "math/vec2", "physics2d/psolver2d", "physics2d/constraints/pfriction2d", "physics2d/collision/pbroadphase2d", "physics2d/collision/pnearphase2d", "physics2d/shape/pshape2d", "physics2d/body/pparticle2d", "physics2d/body/pbody2d", "physics2d/body/prigidbody2d" ], function(Class, Mathf, Vec2, PSolver2D, PFriction2D, PBroadphase2D, PNearphase2D, PShape2D, PParticle2D, PBody2D) {
    /**
	 * @class PWorld2D
	 * @extends Class
	 * @brief Physices manager for 2D Bodies
	 * @param Object opts sets Class properties from passed Object
	 */
    function PWorld2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Boolean allowSleep
	    * @brief global allowes bodies to sleep or not
	    * @memberof PWorld2D
	    */
        this.allowSleep = void 0 !== opts.allowSleep ? opts.allowSleep : !0;
        this._time = 0;
        /**
	    * @property Array bodies
	    * @brief array of all bodies attached to this world
	    * @memberof PWorld2D
	    */
        this.bodies = [];
        this.contacts = [];
        this.frictions = [];
        this.constraints = [];
        /**
	    * @property Array pairsi
	    * @brief array holding bodies i for check in nearphase
	    * @memberof PWorld2D
	    */
        this.pairsi = [];
        /**
	    * @property Array pairsj
	    * @brief array holding bodies j for check in nearphase
	    * @memberof PWorld2D
	    */
        this.pairsj = [];
        /**
	    * @property Vec2 gravity
	    * @brief world gravity defaults to Vec2( 0, -9.801 )
	    * @memberof PWorld2D
	    */
        this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2(0, -9.801);
        /**
	    * @property PSolver2D solver
	    * @brief world solver
	    * @memberof PWorld2D
	    */
        this.solver = new PSolver2D(opts);
        /**
	    * @property PBroadphase2D broadphase
	    * @brief world broadphase handler
	    * @memberof PWorld2D
	    */
        this.broadphase = new PBroadphase2D(opts);
        /**
	    * @property PNearphase2D nearphase
	    * @brief world nearphase handler
	    * @memberof PWorld2D
	    */
        this.nearphase = new PNearphase2D();
        /**
	    * @property Boolean debug
	    * @brief world debug
	    * @memberof PWorld2D
	    */
        this.debug = void 0 !== opts.debug ? opts.debug : !0;
        /**
	    * @property Object profile
	    * @brief world profile info, only calculated if debug is true
	    * @memberof PWorld2D
	    */
        this.profile = {
            total: 0,
            solve: 0,
            integration: 0,
            broadphase: 0,
            nearphase: 0
        };
        this._removeList = [];
    }
    var now, pow = Math.pow, min = Math.min, SLEEPING = (Mathf.clamp, PShape2D.CIRCLE, 
    PShape2D.BOX, PShape2D.CONVEX, PParticle2D.AWAKE, PParticle2D.SLEEPY, PParticle2D.SLEEPING), DYNAMIC = PBody2D.DYNAMIC, KINEMATIC = (PBody2D.STATIC, 
    PBody2D.KINEMATIC), LOW = 1e-6, HIGH = .1, frictionPool = [], now = function() {
        var startTime = Date.now(), w = "undefined" != typeof window ? window : {}, performance = w.performance !== void 0 ? w.performance : {
            now: function() {
                return Date.now() - startTime;
            }
        };
        return function() {
            return .001 * performance.now();
        };
    }();
    Class.extend(PWorld2D, Class);
    /**
	 * @method add
	 * @memberof PWorld2D
	 * @brief adds body to world
	 */
    PWorld2D.prototype.add = function(body) {
        var bodies = this.bodies, index = bodies.indexOf(body);
        if (-1 === index) {
            body.world = this;
            bodies.push(body);
            body.trigger("add");
        }
    };
    /**
	 * @method remove
	 * @memberof PWorld2D
	 * @brief removes body from world
	 */
    PWorld2D.prototype.remove = function(body) {
        this._removeList.push(body);
    };
    PWorld2D.prototype._remove = function() {
        var body, index, i, bodies = this.bodies, removeList = this._removeList;
        for (i = removeList.length; i--; ) {
            body = removeList[i];
            index = bodies.indexOf(body);
            if (-1 !== index) {
                bodies.splice(index, 1);
                body.trigger("remove");
            }
        }
        removeList.length = 0;
    };
    /**
	 * @method addConstraint
	 * @memberof PWorld2D
	 * @brief adds constraint to world
	 */
    PWorld2D.prototype.addConstraint = function(constraint) {
        var constraints = this.constraints, index = constraints.indexOf(constraint);
        -1 === index && constraints.push(constraint);
    };
    /**
	 * @method removeConstraint
	 * @memberof PWorld2D
	 * @brief removes constraint from world
	 */
    PWorld2D.prototype.removeConstraint = function(constraint) {
        var constraints = this.constraints, index = constraints.indexOf(constraint);
        -1 !== index && constraints.splice(index, 1);
    };
    /**
	 * @method step
	 * @memberof PWorld2D
	 * @brief step world forward by time,
	 * @param Number dt
	 */
    PWorld2D.prototype.step = function(dt) {
        var profileStart, c, bi, bj, um, umg, c1, c2, body, shape, shapeType, type, force, vel, aVel, linearDamping, pos, mass, invMass, i, j, debug = this.debug, profile = this.profile, start = now(), gravity = this.gravity, gn = gravity.len(), bodies = this.bodies, solver = this.solver, solverEquations = solver.equations, pairsi = this.pairsi, pairsj = this.pairsj, contacts = this.contacts, frictions = this.frictions, constraints = this.constraints;
        this._time += LOW > dt ? LOW : dt > HIGH ? HIGH : dt;
        for (i = bodies.length; i--; ) {
            body = bodies[i];
            force = body.force;
            mass = body.mass;
            if (body.type === DYNAMIC) {
                force.x += gravity.x * mass;
                force.y += gravity.y * mass;
            }
        }
        debug && (profileStart = now());
        this.broadphase.collisionPairs(this, pairsi, pairsj);
        debug && (profile.broadphase = now() - profileStart);
        debug && (profileStart = now());
        this.nearphase.collisions(this, pairsi, pairsj, contacts);
        for (i = frictions.length; i--; ) frictionPool.push(frictions[i]);
        frictions.length = 0;
        for (i = contacts.length; i--; ) {
            c = contacts[i];
            bi = c.bi;
            bj = c.bj;
            solverEquations.push(c);
            um = min(bi.friction, bj.friction);
            if (um > 0) {
                umg = um * gn;
                mass = bi.invMass + bj.invMass;
                mass = mass > 0 ? 1 / mass : 0;
                c1 = frictionPool.length ? frictionPool.pop() : new PFriction2D(bi, bj, umg * mass);
                c2 = frictionPool.length ? frictionPool.pop() : new PFriction2D(bi, bj, umg * mass);
                frictions.push(c1, c2);
                c1.bi = c2.bi = bi;
                c1.bj = c2.bj = bj;
                c1.minForce = c2.minForce = -umg * mass;
                c1.maxForce = c2.maxForce = umg * mass;
                c1.ri.copy(c.ri);
                c2.ri.copy(c.ri);
                c1.rj.copy(c.rj);
                c2.rj.copy(c.rj);
                c1.t.copy(c.n).perpL();
                c2.t.copy(c.n).perpR();
                solverEquations.push(c1, c2);
            }
        }
        debug && (profile.nearphase = now() - profileStart);
        debug && (profileStart = now());
        for (i = constraints.length; i--; ) {
            c = constraints[i];
            c.update();
            for (j = c.equations.length; j--; ) solverEquations.push(c.equations[j]);
        }
        solver.solve(this, dt);
        solverEquations.length = 0;
        debug && (profile.solve = now() - profileStart);
        debug && (profileStart = now());
        for (i = bodies.length; i--; ) {
            body = bodies[i];
            shape = body.shape;
            shapeType = shape.type;
            type = body.type;
            force = body.force;
            vel = body.velocity;
            aVel = body.angularVelocity;
            linearDamping = body.linearDamping;
            pos = body.position;
            invMass = body.invMass;
            body.trigger("preStep");
            if (type === DYNAMIC || type === KINEMATIC) {
                vel.x *= pow(1 - linearDamping.x, dt);
                vel.y *= pow(1 - linearDamping.y, dt);
                void 0 !== aVel && (body.angularVelocity *= pow(1 - body.angularDamping, dt));
                vel.x += force.x * invMass * dt;
                vel.y += force.y * invMass * dt;
                void 0 !== aVel && (body.angularVelocity += body.torque * body.invInertia * dt);
                if (body.sleepState !== SLEEPING) {
                    pos.x += vel.x * dt;
                    pos.y += vel.y * dt;
                    void 0 !== aVel && (body.rotation += aVel * dt);
                    body.aabb && (body.aabbNeedsUpdate = !0);
                }
            }
            body.R.setRotation(body.rotation);
            force.x = 0;
            force.y = 0;
            body.torque && (body.torque = 0);
            this.allowSleep && body.sleepTick(this._time);
            body.trigger("postStep");
        }
        debug && (profile.integration = now() - profileStart);
        this._removeList.length && this._remove();
        debug && (profile.total = now() - start);
    };
    PWorld2D.prototype.toJSON = function() {
        var i, json = this._JSON, bodies = this.bodies;
        json.type = "PWorld2D";
        json._SERVER_ID = this._id;
        json.allowSleep = this.allowSleep;
        json.gravity = this.gravity;
        json.debug = this.debug;
        json.bodies = json.bodies || [];
        for (i = bodies.length; i--; ) json.bodies[i] = bodies[i].toJSON();
        return json;
    };
    PWorld2D.prototype.fromJSON = function(json) {
        var jsonObject, object, i, bodies = json.bodies;
        this._SERVER_ID = json._SERVER_ID;
        this.allowSleep = json.allowSleep;
        this.gravity.fromJSON(json.gravity);
        this.debug = json.debug;
        for (i = bodies.length; i--; ) {
            jsonObject = bodies[i];
            object = new Class.types[jsonObject.type]();
            this.add(object.fromJSON(jsonObject));
        }
        return this;
    };
    return PWorld2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/component", [ "base/class" ], function(Class) {
    /**
	 * @class Component
	 * @extends Class
	 * @brief Base class for everything attached to GameObjects
	 */
    function Component() {
        Class.call(this);
        /**
	    * @property GameObject gameObject
	    * @brief reference to GameObject this component is attached too
	    * @memberof Component
	    */
        this.gameObject = void 0;
    }
    Class.extend(Component, Class);
    /**
	 * @method init
	 * @memberof Component
	 * @brief called when add to a GameObject
	 */
    Component.prototype.init = function() {};
    /**
	 * @method update
	 * @memberof Component
	 * @brief called before GameObject updates
	 */
    Component.prototype.update = function() {};
    return Component;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/renderable2d", [ "base/class", "base/utils", "core/components/component", "math/vec2", "math/color" ], function(Class, Utils, Component, Vec2, Color) {
    /**
	 * @class Renderable2D
	 * @extends Component
	 * @brief 2D Renderable Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Renderable2D(opts) {
        opts || (opts = {});
        Component.call(this);
        /**
	    * @property Boolean visible
	    * @brief visible value
	    * @memberof Renderable2D
	    */
        this.visible = void 0 !== opts.visible ? !!opts.visible : !0;
        /**
	    * @property Vec2 offset
	    * @brief offset of component
	    * @memberof Renderable2D
	    */
        this.offset = opts.offset instanceof Vec2 ? opts.offset : new Vec2();
        /**
	    * @property Number alpha
	    * @brief alpha value
	    * @memberof Renderable2D
	    */
        this.alpha = void 0 !== opts.alpha ? opts.alpha : 1;
        /**
	    * @property Boolean fill
	    * @brief draw solid object
	    * @memberof Renderable2D
	    */
        this.fill = void 0 !== opts.fill ? !!opts.fill : !0;
        /**
	    * @property Color color
	    * @brief color of Component
	    * @memberof Renderable2D
	    */
        this.color = opts.color instanceof Color ? opts.color : new Color();
        /**
	    * @property Boolean line
	    * @brief draw lines
	    * @memberof Renderable2D
	    */
        this.line = void 0 !== opts.line ? !!opts.line : !1;
        /**
	    * @property Color lineColor
	    * @brief line color
	    * @memberof Renderable2D
	    */
        this.lineColor = opts.lineColor instanceof Color ? opts.lineColor : new Color();
        /**
	    * @property Color lineWidth
	    * @brief line width
	    * @memberof Renderable2D
	    */
        this.lineWidth = void 0 !== opts.lineWidth ? opts.lineWidth : .01;
        this._data = {
            needsUpdate: !0,
            dynamic: void 0 !== opts.dynamic ? !!opts.dynamic : !1,
            vertices: [],
            vertexBuffer: void 0,
            indices: [],
            indexBuffer: void 0,
            uvs: [],
            uvBuffer: void 0
        };
    }
    var ceil = (Utils.has, Math.ceil), sqrt = Math.sqrt, cos = Math.cos, sin = Math.sin, TWO_PI = 2 * Math.PI;
    Class.extend(Renderable2D, Component);
    Renderable2D.prototype.copy = function(other) {
        other._data, this._data;
        this.visible = other.visible;
        this.offset.copy(other.offset);
        this.alpha = other.alpha;
        this.fill = other.fill;
        this.color.copy(other.color);
        this.line = other.line;
        this.lineColor.copy(other.lineColor);
        this.lineWidth = other.lineWidth;
        return this;
    };
    Renderable2D.prototype.calculateSprite = function() {
        var data = this._data, w = .5 * this.width, h = .5 * this.height, uvs = data.uvs || [], vertices = data.vertices, indices = data.indices;
        vertices.length = indices.length = uvs.length = 0;
        data.vertexBuffer = data.indexBuffer = data.uvBuffer = void 0;
        vertices.push(w, h, -w, h, -w, -h, w, -h);
        indices.push(0, 1, 2, 0, 2, 3);
        uvs.push(1, 0, 0, 0, 0, 1, 1, 1);
    };
    Renderable2D.prototype.calculateBox = function() {
        var data = this._data, extents = this.extents, w = extents.x, h = extents.y, vertices = data.vertices, indices = data.indices;
        vertices.length = indices.length = data.uvs.length = 0;
        data.vertexBuffer = data.indexBuffer = data.uvBuffer = void 0;
        vertices.push(w, h, -w, h, -w, -h, w, -h);
        indices.push(0, 1, 2, 0, 2, 3);
    };
    Renderable2D.prototype.calculateCircle = function() {
        var segment, i, data = this._data, radius = this.radius, vertices = data.vertices, indices = data.indices, segments = ceil(sqrt(1024 * radius));
        vertices.length = indices.length = data.uvs.length = 0;
        data.vertexBuffer = data.indexBuffer = data.uvBuffer = void 0;
        vertices.push(0, 0);
        for (i = 0; segments >= i; i++) {
            segment = i / segments * TWO_PI;
            vertices.push(cos(segment) * radius, sin(segment) * radius);
        }
        for (i = 1; segments >= i; i++) indices.push(i, i + 1, 0);
    };
    Renderable2D.prototype.calculatePoly = function() {
        var vertex, i, data = this._data, tvertices = this.vertices, vertices = data.vertices, indices = data.indices;
        vertices.length = indices.length = data.uvs.length = 0;
        data.vertexBuffer = data.indexBuffer = data.uvBuffer = void 0;
        vertices.push(0, 0);
        for (i = 0, il = tvertices.length; il > i; i++) {
            vertex = tvertices[i];
            vertices.push(vertex.x, vertex.y);
        }
        for (i = 2, il = vertices.length; il > i; i++) indices.push(0, i - 1, i);
    };
    Renderable2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "Renderable2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        return json;
    };
    Renderable2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        return this;
    };
    return Renderable2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/box2d", [ "base/class", "math/vec2", "core/components/renderable2d" ], function(Class, Vec2, Renderable2D) {
    /**
	 * @class Box2D
	 * @extends Renderable2D
	 * @brief 2D Box Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Box2D(opts) {
        opts || (opts = {});
        Renderable2D.call(this, opts);
        /**
	    * @property Vec2 extents
	    * @brief half extents of the box
	    * @memberof Box2D
	    */
        this.extents = opts.extents instanceof Vec2 ? opts.extents : new Vec2(.5, .5);
        this.calculateBox();
    }
    Class.extend(Box2D, Renderable2D);
    Box2D.prototype.copy = function(other) {
        Renderable2D.call(this, other);
        this.extents.copy(other.extents);
        return this;
    };
    Box2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "Box2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        json.extents = this.extents;
        return json;
    };
    Box2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        this.extents.fromJSON(json.extents);
        this.calculateBox();
        return this;
    };
    return Box2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/circle2d", [ "base/class", "core/components/renderable2d" ], function(Class, Renderable2D) {
    /**
	 * @class Circle2D
	 * @extends Renderable2D
	 * @brief 2D Circle Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Circle2D(opts) {
        opts || (opts = {});
        Renderable2D.call(this, opts);
        /**
	    * @property Number radius
	    * @brief radius of the circle
	    * @memberof Circle2D
	    */
        this.radius = void 0 !== opts.radius ? opts.radius : .5;
        this.calculateCircle();
    }
    Math.floor, Math.sqrt, Math.cos, Math.sin, 2 * Math.PI;
    Class.extend(Circle2D, Renderable2D);
    Circle2D.prototype.copy = function(other) {
        Renderable2D.call(this, other);
        this.radius = other.radius;
        return this;
    };
    Circle2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "Circle2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        json.radius = this.radius;
        return json;
    };
    Circle2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        this.radius = json.radius;
        this.calculateCircle();
        return this;
    };
    return Circle2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/poly2d", [ "base/class", "math/vec2", "core/components/renderable2d" ], function(Class, Vec2, Renderable2D) {
    /**
	 * @class Poly2D
	 * @extends Renderable2D
	 * @brief 2D Polygon Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Poly2D(opts) {
        opts || (opts = {});
        Renderable2D.call(this, opts);
        /**
	    * @property Array vertices
	    * @brief array of vectors representing this poly
	    * @memberof Poly2D
	    */
        this.vertices = opts.vertices instanceof Array ? opts.vertices : [ new Vec2(.5, .5), new Vec2(-.5, .5), new Vec2(-.5, -.5), new Vec2(.5, -.5) ];
        this.calculatePoly();
    }
    Class.extend(Poly2D, Renderable2D);
    Poly2D.prototype.copy = function(other) {
        var vertex, i, vertices = other.vertices;
        Renderable2D.call(this, other);
        for (i = vertices.length; i--; ) {
            vertex = this.vertices[i] || new Vec2();
            vertex.copy(vertices[i]);
        }
        return this;
    };
    Poly2D.prototype.toJSON = function() {
        var i, json = this._JSON, vertices = this.vertices;
        json.type = "Poly2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        json.vertices = json.vertices || [];
        for (i = vertices.length; i--; ) json.vertices[i] = vertices[i];
        return json;
    };
    Poly2D.prototype.fromJSON = function(json) {
        var vertex, vertices = json.vertices;
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        for (i = vertices.length; i--; ) {
            vertex = this.vertices[i];
            vertex || (vertex = this.vertices[i] = new Vec2());
            vertex.fromJSON(vertices[i]);
        }
        this.calculatePoly();
        return this;
    };
    return Poly2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/rigidbody2d", [ "base/class", "base/time", "core/components/renderable2d", "physics2d/body/pbody2d", "physics2d/body/prigidbody2d", "physics2d/shape/pshape2d", "physics2d/shape/pcircle2d", "physics2d/shape/pbox2d", "physics2d/shape/pconvex2d" ], function(Class, Time, Renderable2D, PBody2D, PRigidBody2D, PShape2D, PCircle2D, PBox2D, PConvex2D) {
    /**
	 * @class RigidBody2D
	 * @extends Renderable2D
	 * @brief 2D RigidBody Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function RigidBody2D(opts) {
        opts || (opts = {});
        Renderable2D.call(this, opts);
        /**
	    * @property Number radius
	    * @brief if passed shape will be a Circle, radius of the RigidBody
	    * @memberof RigidBody2D
	    */
        this.radius = void 0;
        /**
	    * @property Vec2 extents
	    * @brief if passed shape will be a Box, half extents of the RigidBody
	    * @memberof RigidBody2D
	    */
        this.extents = void 0;
        /**
	    * @property Array vertices
	    * @brief if passed shape will be Convex Polygon, vertices of the RigidBody
	    * @memberof RigidBody2D
	    */
        this.vertices = void 0;
        var shape;
        if (opts.radius) {
            shape = new PCircle2D(opts.radius);
            this.radius = opts.radius || shape.radius;
            this.calculateCircle();
        }
        if (opts.extents) {
            shape = new PBox2D(opts.extents);
            this.extents = opts.extents || shape.extents;
            this.calculateBox();
        }
        if (opts.vertices) {
            shape = new PConvex2D(opts.vertices);
            this.vertices = opts.vertices || shape.vertices;
            this.calculatePoly();
        }
        /**
	    * @property PRigidBody2D body
	    * @brief reference to PRigidBody2D
	    * @memberof RigidBody2D
	    */
        opts.shape = shape instanceof PShape2D ? shape : void 0;
        this.body = new PRigidBody2D(opts);
        this.line = !0;
        this.alpha = .25;
        this.visible = !1;
        switch (this.body.type) {
          case RigidBody2D.DYNAMIC:
            this.color.setArgs(0, 1, 0, 1);
            break;

          case RigidBody2D.STATIC:
            this.color.setArgs(0, 0, 1, 1);
            break;

          case RigidBody2D.KINEMATIC:
            this.color.setArgs(1, 0, 0, 1);
        }
    }
    Class.extend(RigidBody2D, Renderable2D);
    RigidBody2D.prototype.copy = function(other) {
        var vertex, i, vertices = other.vertices;
        Renderable2D.call(this, other);
        if (other.radius) {
            this.radius = other.radius;
            this.calculateCircle();
        }
        if (other.extents) {
            this.extents = new Vec2().copy(other.extents);
            this.calculateBox();
        }
        if (vertices) {
            for (i = vertices.length; i--; ) {
                vertex = this.vertices[i] || new Vec2();
                vertex.copy(vertices[i]);
            }
            this.calculatePoly();
        }
        this.body.copy(other);
        return this;
    };
    RigidBody2D.prototype.init = function() {
        var body = this.body, gameObject = this.gameObject;
        body.position.copy(gameObject.position);
        body.rotation = gameObject.rotation;
        body.R.setRotation(gameObject.rotation);
        body.calculateAABB();
        this.listenTo(this.body, "collide", function() {
            this.trigger("collide", this, Time.stamp());
        });
    };
    RigidBody2D.prototype.update = function() {
        var body = this.body, gameObject = this.gameObject;
        gameObject.position.copy(body.position);
        gameObject.rotation = body.rotation;
    };
    /**
	 * @method applyForce
	 * @memberof RigidBody2D
	 * @brief applies force to body at world point
	 * @param Vec2 force
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
    RigidBody2D.prototype.applyForce = function(force, worldPoint, wake) {
        this.body.applyForce(force, worldPoint, wake);
    };
    /**
	 * @method applyTorque
	 * @memberof RigidBody2D
	 * @brief applies torque to body
	 * @param Number torque
	 * @param Boolean wake
	 */
    RigidBody2D.prototype.applyTorque = function(torque, wake) {
        this.body.applyTorque(torque, wake);
    };
    /**
	 * @method applyImpulse
	 * @memberof RigidBody2D
	 * @brief applies impulse to body at world point
	 * @param Vec2 impulse
	 * @param Vec2 worldPoint
	 * @param Boolean wake
	 */
    RigidBody2D.prototype.applyImpulse = function(impulse, worldPoint, wake) {
        this.body.applyImpulse(impulse, worldPoint, wake);
    };
    RigidBody2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "RigidBody2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        json.body = this.body.toJSON();
        return json;
    };
    RigidBody2D.prototype.fromJSON = function(json) {
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        this.body.fromJSON(json.body);
        json.body.radius && this.calculateCircle();
        json.body.extents && this.calculateBox();
        json.body.vertices && this.calculatePoly();
        return this;
    };
    RigidBody2D.DYNAMIC = PBody2D.DYNAMIC;
    RigidBody2D.STATIC = PBody2D.STATIC;
    RigidBody2D.KINEMATIC = PBody2D.KINEMATIC;
    return RigidBody2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/components/sprite2d", [ "base/class", "base/time", "core/components/renderable2d", "math/vec2" ], function(Class, Time, Renderable2D) {
    /**
	 * @class Sprite2D
	 * @extends Renderable2D
	 * @brief 2D Sprite Component
	 * @param Object opts sets Class properties from passed Object
	 */
    function Sprite2D(opts) {
        opts || (opts = {});
        Renderable2D.call(this, opts);
        /**
	    * @property String image
	    * @brief string source of image to load
	    * @memberof Sprite2D
	    */
        this.image = void 0 !== opts.image ? opts.image : "default";
        /**
	    * @property Number width
	    * @brief width of Sprite
	    * @memberof Sprite2D
	    */
        this.width = opts.width || 1;
        /**
	    * @property Number height
	    * @brief height of Sprite
	    * @memberof Sprite2D
	    */
        this.height = opts.height || 1;
        /**
	    * @property Number x
	    * @brief source x position of image
	    * @memberof Sprite2D
	    */
        this.x = opts.x || 0;
        /**
	    * @property Number y
	    * @brief source y position of image
	    * @memberof Sprite2D
	    */
        this.y = opts.y || 0;
        /**
	    * @property Number w
	    * @brief source width of image
	    * @memberof Sprite2D
	    */
        this.w = opts.w || this.image.width;
        /**
	    * @property Number h
	    * @brief source height of image
	    * @memberof Sprite2D
	    */
        this.h = opts.h || this.image.height;
        /**
	    * @property Object animations
	    * @brief list of animations { "name": [ frame1 [ x, y, w, h, frameTime in seconds ], frame2, frame3... ] }
	    * @memberof Sprite2D
	    */
        this.animations = opts.animations || {
            idle: [ [ this.x, this.y, this.w, this.h, .25 ] ]
        };
        /**
	    * @property String animation
	    * @brief active animation
	    * @memberof Sprite2D
	    */
        this.animation = "idle";
        /**
	    * @property Enum mode
	    * @brief animation playback type ( 0 - Sprite2D.ONCE, 1 - Sprite2D.LOOP, or 2 - Sprite2D.PINGPONG )
	    * @memberof Sprite2D
	    */
        this.mode = Sprite2D.LOOP;
        /**
	    * @property Number rate
	    * @brief animation playback rate, defaults to 1
	    * @memberof Sprite2D
	    */
        this.rate = void 0 !== opts.rate ? opts.rate : 1;
        this._last = 0;
        this._frame = 0;
        this._order = 1;
        /**
	    * @property Boolean playing
	    * @brief is playing animation
	    * @memberof Sprite2D
	    */
        this.playing = void 0 !== this.animations[this.animation] ? !0 : !1;
        this.calculateSprite();
    }
    Class.extend(Sprite2D, Renderable2D);
    Sprite2D.prototype.copy = function(other) {
        var key, value, i, animations = other.animations;
        Renderable2D.call(this, other);
        this.image = other.image;
        this.width = other.width;
        this.height = other.height;
        this.x = other.x;
        this.y = other.y;
        this.w = other.w;
        this.h = other.h;
        for (key in animations) {
            value = animations[key];
            for (i = value.length; i--; ) this.animations[key][i] = value[i];
        }
        this.animation = this.animations.idle;
        this.mode = other.mode;
        this.rate = other.rate;
        this._last = other._last;
        this._frame = other._frame;
        this._order = other._order;
        this.playing = other.playing;
        return this;
    };
    /**
	 * @method play
	 * @memberof Sprite2D
	 * @brief plays animation with name and playback mode
	 * @param String name
	 * @param Enum mode
	 */
    Sprite2D.prototype.play = function(name, mode, rate) {
        if (name !== this.animation && this.animations[name]) {
            this.animation = name;
            this.rate = rate || this.rate;
            switch (mode) {
              case Sprite2D.LOOP:
              case "loop":
                this.mode = Sprite2D.LOOP;
                break;

              case Sprite2D.PINGPONG:
              case "pingpong":
                this.mode = Sprite2D.PINGPONG;
                break;

              case Sprite2D.ONCE:
              case "once":
                this.mode = Sprite2D.ONCE;
                break;

              default:
                this.mode = Sprite2D.LOOP;
            }
            this.playing = !0;
            this.trigger("play", name);
        }
    };
    /**
	 * @method stop
	 * @memberof Sprite2D
	 * @brief stops animation
	 */
    Sprite2D.prototype.stop = function() {
        this.playing && this.trigger("stop");
        this.playing = !1;
    };
    Sprite2D.prototype.update = function() {
        var currentFrame, animation = this.animations[this.animation], frame = this._frame, frames = animation.length - 1, order = this._order, currentFrame = animation[frame], frameTime = currentFrame[4];
        if (this.playing && this._last + frameTime / Time.scale / this.rate <= Time.time) {
            this._last = Time.time;
            if (currentFrame) {
                this.x = currentFrame[0];
                this.y = currentFrame[1];
                this.w = currentFrame[2];
                this.h = currentFrame[3];
            }
            this.mode === Sprite2D.PINGPONG ? 1 === order ? frame >= frames ? this._order = -1 : this._frame++ : 0 >= frame ? this._order = 1 : this._frame-- : frame >= frames ? this.mode === Sprite2D.LOOP ? this._frame = 0 : this.mode === Sprite2D.ONCE && this.stop() : this._frame++;
        }
    };
    Sprite2D.prototype.toJSON = function() {
        var animation, i, j, json = this._JSON, animations = this.animations;
        json.type = "Sprite2D";
        json._SERVER_ID = this._id;
        json.visible = this.visible;
        json.offset = this.offset;
        json.alpha = this.alpha;
        json.fill = this.fill;
        json.color = this.color;
        json.line = this.line;
        json.lineColor = this.lineColor;
        json.lineWidth = this.lineWidth;
        json.image = this.image;
        json.x = this.x;
        json.y = this.y;
        json.w = this.w;
        json.h = this.h;
        json.animations = json.animations || {};
        for (i in animations) {
            json.animations[i] = json.animations[i] || [];
            animation = animations[i];
            for (j = animation.length; j--; ) json.animations[i][j] = animation[j];
        }
        json.animation = this.animation;
        json.playing = this.playing;
        json.mode = this.mode;
        json._last = this._last;
        json._from = this._frame;
        return json;
    };
    Sprite2D.prototype.fromJSON = function(json) {
        var animation, i, j, animations = json.animations;
        this._SERVER_ID = json._SERVER_ID;
        this.visible = json.visible;
        this.offset.fromJSON(json.offset);
        this.alpha = json.alpha;
        this.fill = json.fill;
        this.color.fromJSON(json.color);
        this.line = json.line;
        this.lineColor.fromJSON(json.lineColor);
        this.lineWidth = json.lineWidth;
        this.image = json.image;
        this.x = json.x;
        this.y = json.y;
        this.w = json.w;
        this.h = json.h;
        for (i in animations) {
            this.animations[i] = animations[i];
            animation = animations[i];
            for (j = animation.length; j--; ) this.animations[i][j] = animation[j];
        }
        this.animation = json.animation;
        this.playing = json.playing;
        this.mode = json.mode;
        this._last = json._last;
        this._from = json._frame;
        this.calculateSprite();
        return this;
    };
    Sprite2D.ONCE = 0;
    Sprite2D.LOOP = 1;
    Sprite2D.PINGPONG = 2;
    return Sprite2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/client", [ "base/class" ], function(Class) {
    /**
	 * @class Client
	 * @extends Class
	 * @brief client information used by ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
    function Client(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof Client
	    */
        this.id = void 0 !== opts.id ? opts.id : "";
        /**
	    * @property Object socket
	    * @brief reference to this client's socket
	    * @memberof Client
	    */
        this.socket = void 0 !== opts.socket ? opts.socket : void 0;
        /**
	    * @property Number connectTime
	    * @brief the time stamp this client connected
	    * @memberof Client
	    */
        this.connectTime = void 0 !== opts.connectTime ? opts.connectTime : 0;
        /**
	    * @property Scene scene
	    * @brief clients active scene 
	    * @memberof Client
	    */
        this.scene = void 0 !== opts.scene ? opts.scene : void 0;
        /**
	    * @property Camera camera
	    * @brief clients active camera 
	    * @memberof Client
	    */
        this.camera = void 0 !== opts.camera ? opts.camera : void 0;
        /**
	    * @property Object userData
	    * @brief clients custom data 
	    * @memberof Client
	    */
        this.userData = void 0 !== opts.userData ? opts.userData : {};
        /**
	    * @property Object device
	    * @brief clients device information
	    * @memberof Client
	    */
        this.device = void 0;
    }
    Array.prototype.slice;
    Class.extend(Client, Class);
    /**
	 * @method log
	 * @memberof Client
	 * @brief sends console.log message to client, all arguments will be sent
	 */
    Client.prototype.log = function() {
        if (this.socket) {
            var args = Array.apply(null, arguments);
            args.unshift("log");
            this.socket.emit.apply(this.socket, args);
        }
    };
    return Client;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/mouse", [ "base/class", "base/time", "math/vec2" ], function(Class, Time, Vec2) {
    /**
	 * @class Mouse
	 * @extends Class
	 * @brief Mouse helper
	 * @event down called when mouse button is clicked
	 * @event move called when mouse is moved
	 * @event up called when mouse button is released
	 * @event out called when mouse leaves element
	 * @event wheel called when mouse wheel is moved
	 */
    function Mouse() {
        Class.call(this);
        /**
	    * @property Vec2 start
	    * @brief start position of mouse
	    * @memberof Mouse
	    */
        this.start = new Vec2();
        /**
	    * @property Vec2 delta
	    * @brief delta position of mouse
	    * @memberof Mouse
	    */
        this.delta = new Vec2();
        /**
	    * @property Vec2 position
	    * @brief current position of mouse
	    * @memberof Mouse
	    */
        this.position = new Vec2();
        /**
	    * @property Vec2 end
	    * @brief end position of mouse
	    * @memberof Mouse
	    */
        this.end = new Vec2();
        /**
	    * @property Number startTime
	    * @brief start time of mouse when clicked
	    * @memberof Mouse
	    */
        this.startTime = 0;
        /**
	    * @property Number deltaTime
	    * @brief delta time of mouse when released
	    * @memberof Mouse
	    */
        this.deltaTime = 0;
        /**
	    * @property Number endTime
	    * @brief end time of mouse when released
	    * @memberof Mouse
	    */
        this.endTime = 0;
        /**
	    * @property Number wheel
	    * @brief wheels direction -1 or 1
	    * @memberof Mouse
	    */
        this.wheel = 0;
        this._downFrame = -1;
        this._upFrame = -1;
        /**
	    * @property Boolean left
	    * @brief left mouse button
	    * @memberof Mouse
	    */
        this.left = !1;
        /**
	    * @property Boolean middle
	    * @brief middle mouse button
	    * @memberof Mouse
	    */
        this.middle = !1;
        /**
	    * @property Boolean right
	    * @brief right mouse button
	    * @memberof Mouse
	    */
        this.right = !1;
    }
    var max = Math.max, min = Math.min, downNeedsUpdate = !0, moveNeedsUpdate = !0, upNeedsUpdate = !0, outNeedsUpdate = !0, wheelNeedsUpdate = !0, isDown = !1, isUp = !0, last = new Vec2();
    Class.extend(Mouse, Class);
    Mouse.prototype.update = function() {
        downNeedsUpdate = !0;
        moveNeedsUpdate = !0;
        upNeedsUpdate = !0;
        outNeedsUpdate = !0;
        wheelNeedsUpdate = !0;
    };
    Mouse.prototype.handleEvents = function(e) {
        e.preventDefault();
        switch (e.type) {
          case "mousedown":
            this.handle_mousedown(e);
            break;

          case "mousemove":
            this.handle_mousemove(e);
            break;

          case "mouseup":
            this.handle_mouseup(e);
            break;

          case "mouseout":
            this.handle_mouseout(e);
            break;

          case "mousewheel":
          case "DOMMouseScroll":
            this.handle_mousewheel(e);
        }
    };
    Mouse.prototype.getPosition = function(e) {
        var element = e.target || e.srcElement, offsetX = element.offsetLeft, offsetY = element.offsetTop, x = (e.pageX || e.clientX) - offsetX, y = (e.pageY || e.clientY) - offsetY;
        this.position.set(x, y);
    };
    Mouse.prototype.handle_mousedown = function(e) {
        if (downNeedsUpdate) {
            this.startTime = Time.stamp();
            this.getPosition(e);
            this.start.copy(this.position);
            this.delta.set(0, 0);
            switch (e.button) {
              case 0:
                this.left = !0;
                break;

              case 1:
                this.middle = !0;
                break;

              case 2:
                this.right = !0;
            }
            if (!isDown) {
                this._downFrame = Time.frame;
                isDown = !0;
            }
            isUp = !1;
            this.trigger("down");
            downNeedsUpdate = !1;
        }
    };
    Mouse.prototype.handle_mousemove = function(e) {
        var delta = this.delta, position = this.position;
        if (moveNeedsUpdate) {
            last.copy(this.position);
            this.getPosition(e);
            delta.x = position.x - last.x;
            delta.y = -(position.y - last.y);
            this.trigger("move");
            moveNeedsUpdate = !1;
        }
    };
    Mouse.prototype.handle_mouseup = function(e) {
        if (upNeedsUpdate) {
            this.endTime = Time.stamp();
            this.deltaTime = this.endTime - this.startTime;
            this.getPosition(e);
            this.end.copy(this.position);
            switch (e.button) {
              case 0:
                this.left = !1;
                break;

              case 1:
                this.middle = !1;
                break;

              case 2:
                this.right = !1;
            }
            if (!isUp) {
                this._upFrame = Time.frame;
                isUp = !0;
            }
            isDown = !1;
            this.trigger("up");
            upNeedsUpdate = !1;
        }
    };
    Mouse.prototype.handle_mouseout = function(e) {
        if (outNeedsUpdate) {
            this.endTime = Time.stamp();
            this.deltaTime = this.endTime - this.startTime;
            this.getPosition(e);
            this.left = !1;
            this.middle = !1;
            this.right = !1;
            this.trigger("out");
            outNeedsUpdate = !1;
        }
    };
    Mouse.prototype.handle_mousewheel = function(e) {
        if (wheelNeedsUpdate) {
            this.wheel = max(-1, min(1, e.wheelDelta || -e.detail));
            this.trigger("wheel");
            wheelNeedsUpdate = !1;
        }
    };
    Mouse.prototype.toJSON = function() {
        var json = this._JSON;
        json.start = this.start;
        json.delta = this.delta;
        json.position = this.position;
        json.end = this.end;
        json.startTime = this.startTime;
        json.deltaTime = this.deltaTime;
        json.endTime = this.endTime;
        json.wheel = this.wheel;
        json.left = this.left;
        json.middle = this.middle;
        json.right = this.right;
        return json;
    };
    return new Mouse();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/touch", [ "base/class", "math/vec2" ], function(Class, Vec2) {
    /**
	 * @class Touch
	 * @extends Class
	 * @brief Touch helper
	 */
    function Touch() {
        Class.call(this);
        /**
	    * @property Number identifier
	    * @brief id of this touch
	    * @memberof Touch
	    */
        this.identifier = -1;
        /**
	    * @property Vec2 start
	    * @brief start position of touch
	    * @memberof Touch
	    */
        this.start = new Vec2();
        /**
	    * @property Vec2 delta
	    * @brief delta position of touch
	    * @memberof Touch
	    */
        this.delta = new Vec2();
        /**
	    * @property Vec2 position
	    * @brief current position of touch
	    * @memberof Touch
	    */
        this.position = new Vec2();
        /**
	    * @property Vec2 end
	    * @brief end position of touch
	    * @memberof Touch
	    */
        this.end = new Vec2();
        this._first = !1;
        this._downFrame = -1;
        this._upFrame = -1;
        /**
	    * @property Number startTime
	    * @brief start time of touch
	    * @memberof Touch
	    */
        this.startTime = 0;
        /**
	    * @property Number deltaTime
	    * @brief delta time of touch
	    * @memberof Touch
	    */
        this.deltaTime = 0;
        /**
	    * @property Number endTime
	    * @brief end time of touch
	    * @memberof Touch
	    */
        this.endTime = 0;
        this._last = new Vec2();
    }
    Class.extend(Touch, Class);
    /**
	 * @method clear
	 * @memberof Touch
	 * @brief clears touch
	 */
    Touch.prototype.clear = function() {
        this.identifier = -1;
        this.start.set(0, 0);
        this.delta.set(0, 0);
        this.position.set(0, 0);
        this.end.set(0, 0);
        this.startTime = 0;
        this.deltaTime = 0;
        this.endTime = 0;
        this._last.set(0, 0);
    };
    Touch.prototype.getPosition = function(e) {
        var element = e.target || e.srcElement, offsetX = element.offsetLeft, offsetY = element.offsetTop, x = (e.pageX || e.clientX) - offsetX, y = (e.pageY || e.clientY) - offsetY;
        this.position.set(x, y);
    };
    Touch.prototype.toJSON = function() {
        var json = this._JSON;
        json.identifier = this.identifier;
        json.start = this.start;
        json.delta = this.delta;
        json.position = this.position;
        json.end = this.end;
        json.startTime = this.startTime;
        json.deltaTime = this.deltaTime;
        json.endTime = this.endTime;
        return json;
    };
    return Touch;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/touches", [ "base/class", "base/time", "math/vec2", "core/input/touch" ], function(Class, Time, Vec2, Touch) {
    /**
	 * @class Touches
	 * @extends Class
	 * @brief handles all Touch events
	 */
    function Touches() {
        Class.call(this);
        /**
	    * @property Array array
	    * @brief array holding all touches
	    * @memberof Touches
	    */
        this.array = [];
        for (var i = 0; 11 > i; i++) this.array.push(new Touch());
    }
    var startNeedsUpdate = !0, moveNeedsUpdate = !0, endNeedsUpdate = !0;
    Class.extend(Touches, Class);
    /**
	 * @method clear
	 * @memberof Touches
	 * @brief clears all touch events
	 */
    Touches.prototype.clear = function() {
        var i, il, array = this.array;
        for (i = 0, il = array.length; il > i; i++) array[i].clear();
    };
    /**
	 * @method getTouches
	 * @memberof Touches
	 * @brief returns list of active touches
	 * @param Array array
	 * @return Array
	 */
    Touches.prototype.getTouches = function() {
        var defaultArray = [];
        return function(array) {
            array = array instanceof Array ? array : defaultArray;
            array.length = 0;
            var touch, i, il, thisArray = this.array;
            for (i = 0, il = thisArray.length; il > i; i++) {
                touch = thisArray[i];
                -1 !== touch.identifier && array.push(touch);
            }
            return array;
        };
    }();
    /**
	 * @method forEach
	 * @memberof Touches
	 * @brief for each active touch call a function
	 * @param Function callback
	 */
    Touches.prototype.forEach = function(callback) {
        var touch, i, il, thisArray = this.array;
        for (i = 0, il = thisArray.length; il > i; i++) {
            touch = thisArray[i];
            -1 !== touch.identifier && callback(touch);
        }
    };
    /**
	 * @method count
	 * @memberof Touches
	 * @brief returns number of active touches
	 * @return Number
	 */
    Touches.prototype.count = function() {
        var touch, i, il, thisArray = this.array, count = 0;
        for (i = 0, il = thisArray.length; il > i; i++) {
            touch = thisArray[i];
            -1 !== touch.identifier && count++;
        }
        return count;
    };
    Touches.prototype.update = function() {
        startNeedsUpdate = !0;
        moveNeedsUpdate = !0;
        endNeedsUpdate = !0;
    };
    Touches.prototype.handleEvents = function(e) {
        e.preventDefault();
        switch (e.type) {
          case "touchstart":
            this.handle_touchstart(e);
            break;

          case "touchmove":
            this.handle_touchmove(e);
            break;

          case "touchend":
            this.handle_touchend(e);
            break;

          case "touchcancel":
            this.handle_touchcancel(e);
        }
    };
    Touches.prototype.handle_touchstart = function(e) {
        var touches, count, evtTouches, touch, evtTouch, i;
        if (startNeedsUpdate) {
            touches = this.array;
            evtTouches = e.touches;
            count = evtTouches.length;
            if (touches.length >= count) for (i = count; i--; ) {
                evtTouch = evtTouches[i];
                touch = touches[i];
                touch.identifier = evtTouch.identifier;
                touch.startTime = Time.stamp();
                touch.getPosition(evtTouch);
                if (touch._first) {
                    touch._downFrame = Time.frame;
                    touch._first = !1;
                }
                touch.start.copy(touch.position);
                this.trigger("start", touch);
            } else this.clear();
            startNeedsUpdate = !1;
        }
    };
    Touches.prototype.handle_touchmove = function(e) {
        var touches, count, evtTouches, touch, evtTouch, delta, position, last, i, j;
        if (moveNeedsUpdate) {
            touches = this.array;
            evtTouches = e.changedTouches;
            count = evtTouches.length;
            for (i = count; i--; ) {
                evtTouch = evtTouches[i];
                for (j = touches.length; j--; ) {
                    touch = touches[j];
                    if (touch.identifier === evtTouch.identifier) {
                        delta = touch.delta;
                        position = touch.position;
                        last = touch._last;
                        last.copy(touch.position);
                        touch.getPosition(evtTouch);
                        delta.x = position.x - last.x;
                        delta.y = -(position.y - last.y);
                        this.trigger("move", touch);
                    }
                }
            }
            moveNeedsUpdate = !1;
        }
    };
    Touches.prototype.handle_touchend = function(e) {
        var touches, count, evtTouches, touch, evtTouch, i, j;
        if (endNeedsUpdate) {
            touches = this.array;
            evtTouches = e.changedTouches;
            count = evtTouches.length;
            for (i = count; i--; ) {
                evtTouch = evtTouches[i];
                for (j = touches.length; j--; ) {
                    touch = touches[j];
                    if (touch.identifier === evtTouch.identifier) {
                        touch._last.copy(touch.position);
                        touch.getPosition(evtTouch);
                        if (!touch._first) {
                            touch._upFrame = Time.frame;
                            touch._first = !0;
                        }
                        touch.endTime = Time.stamp();
                        touch.deltaTime = touch.endTime - touch.startTime;
                        touch.end.copy(touch.position);
                        touch.identifier = -1;
                        this.trigger("end", touch);
                    }
                }
            }
            endNeedsUpdate = !1;
        }
    };
    Touches.prototype.handle_touchcancel = function() {
        this.clear();
    };
    Touches.prototype.toJSON = function() {
        var json = this._JSON;
        json.array = this.getTouches();
        return json;
    };
    return new Touches();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/key", [ "base/class", "math/vec2" ], function(Class) {
    /**
	 * @class Key
	 * @extends Class
	 * @brief a keyboard key object
	 * @param String name the name of the key
	 * @param Number keyCode the key code of the key
	 */
    function Key(name, keyCode) {
        Class.call(this);
        /**
	    * @property String name
	    * @brief the name of the key
	    * @memberof Key
	    */
        this.name = name;
        /**
	    * @property String keyCode
	    * @brief the key code
	    * @memberof Key
	    */
        this.keyCode = keyCode;
        /**
	    * @property Boolean down
	    * @brief boolean if this key is pressed
	    * @memberof Key
	    */
        this.down = !1;
        this._first = !0;
        this._downFrame = -1;
        this._upFrame = -1;
        /**
	    * @property Number downTime
	    * @brief time the key was pressed
	    * @memberof Key
	    */
        this.downTime = -1;
        /**
	    * @property Number endTime
	    * @brief time the key was released
	    * @memberof Key
	    */
        this.endTime = -1;
    }
    Class.extend(Key, Class);
    Key.prototype.toJSON = function() {
        var json = this._JSON;
        json.name = this.name;
        json.keyCode = this.keyCode;
        json.down = this.down;
        json.downTime = this.downTime;
        json.endTime = this.endTime;
        return json;
    };
    return Key;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/keyboard", [ "base/class", "base/time", "core/input/key" ], function(Class, Time, Key) {
    /**
	 * @class Keyboard
	 * @extends Class
	 * @brief Keyboard helper
	 * @event keydown called when any key is pressed
	 * @event keyup called when any key is released
	 */
    function Keyboard() {
        Class.call(this);
        /**
	    * @property Object keys
	    * @brief all keys on the keyboard
	    * @memberof Keyboard
	    */
        this.keys = {};
        for (var key in keyNames) this.keys[key] = new Key(key, keyNames[key]);
    }
    Class.extend(Keyboard, Class);
    Keyboard.prototype.handleEvents = function(e) {
        e.preventDefault();
        switch (e.type) {
          case "keydown":
            this.handle_keydown(e);
            break;

          case "keyup":
            this.handle_keyup(e);
        }
    };
    Keyboard.prototype.handle_keydown = function(e) {
        var key, name, keys = this.keys;
        for (name in keys) {
            key = keys[name];
            if (key.keyCode === e.keyCode) {
                key.down = !0;
                if (key._first) {
                    key.downTime = Time.stamp();
                    key._downFrame = Time.frame;
                    key._first = !1;
                }
                this.trigger("keydown", key);
            }
        }
    };
    Keyboard.prototype.handle_keyup = function(e) {
        var key, name, keys = this.keys;
        for (name in keys) {
            key = keys[name];
            if (key.keyCode === e.keyCode) {
                key.down = !1;
                if (!key._first) {
                    key.endTime = Time.stamp();
                    key._upFrame = Time.frame;
                    key._first = !0;
                }
                this.trigger("keyup", key);
            }
        }
    };
    Keyboard.prototype.toJSON = function() {
        var json = this._JSON;
        json.keys = this.keys;
        return json;
    };
    var keyNames = {
        win_key_ff_linux: 0,
        mac_enter: 3,
        backspace: 8,
        tab: 9,
        num_center: 12,
        enter: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        caps_lock: 20,
        esc: 27,
        space: 32,
        page_up: 33,
        page_down: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        print_screen: 44,
        insert: 45,
        "delete": 46,
        zero: 48,
        one: 49,
        two: 50,
        three: 51,
        four: 52,
        five: 53,
        six: 54,
        seven: 55,
        eight: 56,
        nine: 57,
        ff_semicolon: 59,
        ff_equals: 61,
        question_mark: 63,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90,
        meta: 91,
        win_key_right: 92,
        context_menu: 93,
        num_zero: 96,
        num_one: 97,
        num_two: 98,
        num_three: 99,
        num_four: 100,
        num_five: 101,
        num_six: 102,
        num_seven: 103,
        num_eight: 104,
        num_nine: 105,
        num_mult: 106,
        num_plus: 107,
        num_minus: 109,
        num_period: 110,
        num_division: 111,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
        numlock: 144,
        scroll_lock: 145,
        first_media_key: 166,
        last_media_key: 183,
        semicolon: 186,
        dash: 189,
        equals: 187,
        comma: 188,
        period: 190,
        slash: 191,
        apostrophe: 192,
        tilde: 192,
        single_quote: 222,
        open_square_bracket: 219,
        backslash: 220,
        close_square_bracket: 221,
        win_key: 224,
        mac_ff_meta: 224,
        win_ime: 229,
        phantom: 255
    };
    return new Keyboard();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/accelerometer", [ "base/class", "math/vec2" ], function(Class) {
    /**
	 * @class Accelerometer
	 * @extends Class
	 * @brief Accelerometer helper
	 * @event accelerometer called when the device accelerometer changes
	 */
    function Accelerometer() {
        Class.call(this);
        /**
	    * @property Number x
	    * @memberof Accelerometer
	    */
        this.x = 0;
        /**
	    * @property Number y
	    * @memberof Accelerometer
	    */
        this.y = 0;
        /**
	    * @property Number z
	    * @memberof Accelerometer
	    */
        this.z = 0;
    }
    var sqrt = (Math.abs, Math.sqrt);
    Class.extend(Accelerometer, Class);
    Accelerometer.prototype.handle_devicemotion = function(e) {
        var x, y, z, len;
        aig = e.accelerationIncludingGravity;
        if (aig) {
            x = aig.x, y = aig.y, z = aig.z;
            len = x * x + y * y + z * z;
            if (len > 0) {
                len = 1 / sqrt(len);
                this.x = x * len;
                this.y = y * len;
                this.z = z * len;
            } else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            this.trigger("accelerometer");
        }
    };
    Accelerometer.prototype.toJSON = function() {
        var json = this._JSON;
        json.x = this.x;
        json.y = this.y;
        json.z = this.z;
        return json;
    };
    return new Accelerometer();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/orientation", [ "base/class" ], function(Class) {
    /**
	 * @class Orientation
	 * @extends Class
	 * @brief Orientation helper
	 * @event orientation called when orientation changes
	 * @event orientationchange called orientation mode changes ( landscape or portrait )
	 */
    function Orientation() {
        Class.call(this);
        /**
	    * @property Number alpha
	    * @brief the alpha value
	    * @memberof Orientation
	    */
        this.alpha = 0;
        /**
	    * @property Number beta
	    * @brief the beta value
	    * @memberof Orientation
	    */
        this.beta = 0;
        /**
	    * @property Number gamma
	    * @brief the gamma value
	    * @memberof Orientation
	    */
        this.gamma = 0;
        /**
	    * @property Number mode
	    * @brief the mode of the orientation ( portrait_up, portrait_down, landscape_left, or landscape_right )
	    * @memberof Orientation
	    */
        this.mode = "portrait_up";
    }
    Class.extend(Orientation, Class);
    Orientation.prototype.handleEvents = function(e) {
        switch (e.type) {
          case "deviceorientation":
            this.handle_deviceorientation(e);
            break;

          case "orientationchange":
            this.handle_orientationchange(e);
        }
    };
    Orientation.prototype.handle_deviceorientation = function(e) {
        if (void 0 !== e.alpha && void 0 !== e.beta && void 0 !== e.gamma) {
            this.alpha = e.alpha;
            this.beta = e.beta;
            this.gamma = e.gamma;
            this.trigger("orientation", this);
        }
    };
    Orientation.prototype.handle_orientationchange = function() {
        orientation = window.orientation;
        switch (orientation) {
          case 0:
            this.mode = "portrait_up";
            break;

          case 90:
            this.mode = "landscape_left";
            break;

          case -90:
            this.mode = "landscape_right";
            break;

          case 180:
          case -180:
            this.mode = "portrait_down";
        }
        this.trigger("orientationchange", this.mode, orientation);
    };
    Orientation.prototype.toJSON = function() {
        var json = this._JSON;
        json.alpha = this.alpha;
        json.beta = this.beta;
        json.gamma = this.gamma;
        json.mode = this.mode;
        return json;
    };
    return new Orientation();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/input/input", [ "base/class", "base/dom", "base/time", "core/input/mouse", "core/input/touches", "core/input/keyboard", "core/input/accelerometer", "core/input/orientation" ], function(Class, Dom, Time, Mouse, Touches, Keyboard, Accelerometer, Orientation) {
    /**
	 * @class Input
	 * @extends Class
	 * @brief Input helper
	 * @event hold called when a touch or the mouse is holding on the screen
	 * @event tap called when a touch or the mouse taps the screen
	 * @event doubletap called when a touch or the mouse double taps the screen
	 * @event swipe called when a touch or the mouse swipes the screen
	 * @event dragstart called when a touch or the mouse starts dragging
	 * @event dragend called when a touch or the mouse ends dragging
	 * @event transformstart called when two touches start a transform
	 * @event transform called while two touches are transforming
	 * @event transformend called when two touches end transform
	 */
    function Input() {
        Class.call(this);
        /**
	    * @property Element element
	    * @brief element events are attached to
	    * @memberof Input
	    */
        this.element = void 0;
    }
    var addEvent = Dom.addEvent, removeEvent = Dom.removeEvent;
    Class.extend(Input, Class);
    Input.prototype.init = function(element) {
        this.element = element;
        addEvent(element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel touchstart touchmove touchend touchcancel", this.handleEvents, this);
        addEvent(element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel", Mouse.handleEvents, Mouse);
        addEvent(element, "touchstart touchmove touchend touchcancel", Touches.handleEvents, Touches);
        addEvent(top, "keydown keyup", Keyboard.handleEvents, Keyboard);
        addEvent(window, "devicemotion", Accelerometer.handle_devicemotion, Accelerometer);
        addEvent(window, "deviceorientation orientationchange", Orientation.handleEvents, Orientation);
    };
    Input.prototype.clear = function() {
        var element = this.element;
        if (element) {
            removeEvent(element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel touchstart touchmove touchend touchcancel", this.handleEvents, this);
            removeEvent(element, "mousedown mousemove mouseup mouseout DOMMouseScroll mousewheel", Mouse.handleEvents, Mouse);
            removeEvent(element, "touchstart touchmove touchend touchcancel", Touches.handleEvents, Touches);
            removeEvent(top, "keydown keyup", Keyboard.handleEvents, Keyboard);
            removeEvent(window, "devicemotion", Accelerometer.handle_devicemotion, Accelerometer);
            removeEvent(window, "deviceorientation orientationchange", Orientation.handleEvents, Orientation);
        }
        this.element = void 0;
    };
    Input.prototype.update = function() {
        Mouse.update();
        Touches.update();
    };
    /**
	 * @method key
	 * @memberof Input
	 * @brief checks if any key in arguments is down
	 * @return Boolean
	 */
    Input.prototype.key = function() {
        var key, i, il, keys = Keyboard.keys;
        for (i = 0, il = arguments.length; il > i; i++) {
            key = keys[arguments[i]];
            if (key && key.down) return !0;
        }
        return !1;
    };
    /**
	 * @method keyDown
	 * @memberof Input
	 * @brief checks if any key in arguments is down this frame
	 * @return Boolean
	 */
    Input.prototype.keyDown = function() {
        var key, i, il, keys = Keyboard.keys;
        for (i = 0, il = arguments.length; il > i; i++) {
            key = keys[arguments[i]];
            if (key && key.down && key._downFrame === Time.frame - 1) return !0;
        }
        return !1;
    };
    /**
	 * @method keyUp
	 * @memberof Input
	 * @brief checks if any key in arguments is up this frame
	 * @return Boolean
	 */
    Input.prototype.keyUp = function() {
        var key, i, il, keys = Keyboard.keys;
        for (i = 0, il = arguments.length; il > i; i++) {
            key = keys[arguments[i]];
            if (key && !key.down && key._upFrame === Time.frame - 1) return !0;
        }
        return !1;
    };
    /**
	 * @method mouseButton
	 * @memberof Input
	 * @brief checks if any mouse button is down
	 * @param Number index mouse index, 0 - left, 1 - middle, 2 - right
	 * @return Boolean
	 */
    Input.prototype.mouseButton = function(index) {
        return Mouse.left && 0 == index ? !0 : Mouse.middle && 1 == index ? !0 : Mouse.right && 2 == index ? !0 : !1;
    };
    /**
	 * @method mouseButtonDown
	 * @memberof Input
	 * @brief checks if any mouse button is down this frame
	 * @param Number index mouse index, 0 - left, 1 - middle, 2 - right
	 * @return Boolean
	 */
    Input.prototype.mouseButtonDown = function(index) {
        return this.mouseButton(index) && Mouse._downFrame === Time.frame - 1;
    };
    /**
	 * @method mouseButtonUp
	 * @memberof Input
	 * @brief checks if any mouse button is up this frame
	 * @param Number index mouse index, 0 - left, 1 - middle, 2 - right
	 * @return Boolean
	 */
    Input.prototype.mouseButtonUp = function(index) {
        return !this.mouseButton(index) && Mouse._upFrame === Time.frame - 1;
    };
    /**
	 * @method getTouch
	 * @memberof Input
	 * @brief gets touch from touches by index if touch is active
	 * @param Number index the touch's index to get
	 * @return Touch
	 */
    Input.prototype.getTouch = function(index) {
        var touch = Touches.array[index];
        return touch && -1 !== touch.identifier ? touch : void 0;
    };
    var gesture = "", lastGesture = "", lastGestureTime = 0;
    Input.prototype.handleEvents = function(e) {
        e.preventDefault();
        var timeStamp = e.timeStamp / 1e3, type = e.type;
        this._hold(type);
        this._tap(type, timeStamp);
        this._swipe(type);
        this._drag(type);
    };
    var holdTimer, holdTimeout = 500, holdThreshold = 1;
    Input.prototype._hold = function(type) {
        var scope = this;
        if ("touchstart" === type || "mousedown" === type) {
            var event = -1 !== Touches.array[0].identifier ? Touches.array[0] : Mouse;
            gesture = "hold";
            holdTimer = setTimeout(function() {
                if ("hold" === gesture) {
                    lastGesture = "hold";
                    lastGestureTime = Time.stamp();
                    scope.trigger("hold", event);
                }
            }, holdTimeout);
        }
        if ("touchmove" === type || "mousemove" === type) {
            var delta = -1 !== Touches.array[0].identifier ? Touches.array[0].delta : Mouse.delta;
            delta.lenSq() > holdThreshold && clearTimeout(holdTimer);
        }
        ("touchend" === type || "mouseup" === type) && clearTimeout(holdTimer);
    };
    var tapMaxTime = .25, tapMaxDist = 100, doubleTapDistance = 400, doubleTapInterval = .3;
    Input.prototype._tap = function(type, timeStamp) {
        if ("touchend" === type || "mouseup" === type) {
            var event = -1 !== Touches.array[0].identifier ? Touches.array[0] : Mouse;
            if (event.deltaTime > tapMaxTime || event.delta.lenSq() > tapMaxDist) return;
            if ("tap" === lastGesture && doubleTapInterval > timeStamp - lastGestureTime && doubleTapDistance > event.delta.lenSq()) {
                gesture = "doubletap";
                lastGesture = "doubletap";
                lastGestureTime = Time.stamp();
                this.trigger("doubletap", event);
            } else {
                gesture = "tap";
                lastGesture = "tap";
                lastGestureTime = Time.stamp();
                this.trigger("tap", event);
            }
        }
    };
    var swipeVelocity = .25;
    Input.prototype._swipe = function(type) {
        if ("touchend" === type || "mouseup" === type) {
            var event = -1 !== Touches.array[0].identifier ? Touches.array[0] : Mouse, delta = event.delta;
            if (Math.abs(delta.x * Time.delta) > swipeVelocity || Math.abs(delta.y * Time.delta) > swipeVelocity) {
                gesture = "swipe";
                lastGesture = "swipe";
                lastGestureTime = Time.stamp();
                this.trigger("swipe", event, Mathf.direction(delta.x, delta.y));
            }
        }
    };
    var dragMinDistance = 10, dragTriggered = !1;
    Input.prototype._drag = function(type) {
        var event = -1 !== Touches.array[0].identifier ? Touches.array[0] : Mouse;
        if ("drag" !== gesture && dragTriggered) {
            this.trigger("dragend", event);
            dragTriggered = !1;
        } else {
            ("touchstart" === type || "mousedown" === type) && (dragTriggered = !1);
            if ("touchmove" === type || "mousemove" === type && (Mouse.left || Mouse.middle || Mouse.right)) {
                if (dragMinDistance > event.delta.lenSq() && "drag" !== gesture) return;
                gesture = "drag";
                if (!dragTriggered) {
                    this.trigger("dragstart", event);
                    dragTriggered = !0;
                }
                this.trigger("drag", event);
            }
            if (("touchend" === type || "mouseup" === type) && dragTriggered) {
                this.trigger("dragend", event);
                dragTriggered = !1;
            }
        }
    };
    var transformMinScale = 10, transformMinRotation = 1, transformTriggered = !1;
    Input.prototype._transformStart = function() {
        var scale, rotation, scaleThreshold, rotationThreshold, touches = Touches.getTouches(), touch1 = touches[0], touch2 = touches[1];
        if ("transform" !== gesture && transformTriggered) {
            this.trigger("transformend");
            transformTriggered = !1;
        } else if (!(2 > touches.length)) {
            ("touchstart" === type || "mousedown" === type) && (transformTriggered = !1);
            if ("touchmove" === type || "mousemove" === type && (Mouse.left || Mouse.middle || Mouse.right)) {
                scale = Vec2.dist(touch1.position, touch2.position) / Vec2.dist(touch1.start, touch2.start);
                rotation = Math.atan2(touch2.position.y - touch1.position.y, touch2.position.x - touch1.position.x) - Math.atan2(touch2.start.y - touch1.start.y, touch2.start.x - touch1.start.x);
                scaleThreshold = Math.abs(1 - scale);
                rotationThreshold = Math.abs(rotation);
                if (transformMinScale > scaleThreshold && transformMinRotation > rotationThreshold) return;
                gesture = "transform";
                if (!transformTriggered) {
                    this.trigger("transformstart", scale, rotation);
                    transformTriggered = !0;
                }
                this.trigger("transform", scale, rotation);
            }
            if ("touchend" === type || "mouseup" === type) {
                transformTriggered && this.trigger("transformend", scale, rotation);
                transformTriggered = !1;
            }
        }
    };
    return new Input();
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/scene/world2d", [ "base/class", "base/time", "math/color", "math/vec2", "physics2d/pworld2d" ], function(Class, Time, Color, Vec2, PWorld2D) {
    /**
	 * @class World2D
	 * @extends Class
	 * @brief holds world information for scene
	 * @param Object opts sets Class properties from passed Object
	 */
    function World2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property String name
	    * @brief name of this Object
	    * @memberof World2D
	    */
        this.name = opts.name || this._class + "-" + this._id;
        /**
	    * @property Color background
	    * @brief background color of scene
	    * @memberof World2D
	    */
        this.background = opts.background instanceof Color ? opts.background : new Color(.5, .5, .5, 1);
        /**
	    * @property Vec2 gravity
	    * @brief gravity in meters/second^2
	    * @memberof World2D
	    */
        this.gravity = opts.gravity instanceof Vec2 ? opts.gravity : new Vec2(0, -9.801);
        /**
	    * @property PWorld2D pworld
	    * @brief physics world
	    * @memberof World2D
	    */
        this.pworld = new PWorld2D(opts);
    }
    Class.extend(World2D, Class);
    World2D.prototype.add = function(rigidbody) {
        var body = rigidbody.body;
        body.userData = rigidbody;
        this.pworld.add(body);
    };
    World2D.prototype.remove = function(rigidbody) {
        var body = rigidbody.body;
        body.userData = void 0;
        this.pworld.remove(body);
    };
    World2D.prototype.update = function() {
        this.pworld.step(Time.delta);
    };
    World2D.prototype.toJSON = function() {
        var json = this._JSON;
        json.type = "World2D";
        json.name = this.name;
        json._SERVER_ID = this._id;
        json.gravity = this.gravity;
        json.background = this.background;
        json.pworld = this.pworld;
        return json;
    };
    World2D.prototype.fromJSON = function(json) {
        this.name = json.name;
        this._SERVER_ID = json._SERVER_ID;
        this.gravity.fromJSON(json.gravity);
        this.background.fromJSON(json.background);
        this.pworld.fromJSON(json.pworld);
        return this;
    };
    return World2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/objects/transform2d", [ "base/class", "base/utils", "math/mathf", "math/vec2", "math/mat32" ], function(Class, Utils, Mathf, Vec2, Mat32) {
    /**
	 * @class Transform2D
	 * @extends Class
	 * @brief 2d Transform info for Game Objects
	 * @param Object opts sets Class properties from passed Object
	 */
    function Transform2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Class root
	    * @brief reference to root element
	    * @memberof Transform2D
	    */
        this.root = this;
        /**
	    * @property Array children
	    * @brief array of children attached to this object
	    * @memberof Transform2D
	    */
        this.children = [];
        /**
	    * @property Mat32 matrix
	    * @brief local matrix
	    * @memberof Transform2D
	    */
        this.matrix = new Mat32();
        /**
	    * @property Mat32 matrixWorld
	    * @brief world matrix
	    * @memberof Transform2D
	    */
        this.matrixWorld = new Mat32();
        /**
	    * @property Mat32 matrixModelView
	    * @brief model view matrix, calculated in renderer
	    * @memberof Transform2D
	    */
        this.matrixModelView = new Mat32();
        /**
	    * @property Vec2 position
	    * @brief local position
	    * @memberof Transform2D
	    */
        this.position = opts.position instanceof Vec2 ? opts.position : new Vec2();
        /**
	    * @property Number rotation
	    * @brief local rotation
	    * @memberof Transform2D
	    */
        this.rotation = opts.rotation ? opts.rotation : 0;
        /**
	    * @property Vec2 scale
	    * @brief local scale
	    * @memberof Transform2D
	    */
        this.scale = opts.scale instanceof Vec2 ? opts.scale : new Vec2(1, 1);
        this._position = this.position.clone();
        this._rotation = this.rotation;
        this._scale = this.scale.clone();
        this.updateMatrices();
    }
    var isNumber = Utils.isNumber, EPSILON = Mathf.EPSILON;
    Mathf.standardRadian;
    Class.extend(Transform2D, Class);
    /**
	 * @method copy
	 * @memberof Transform2D
	 * @brief copies other object's properties
	 * @param Transform2D other
	 */
    Transform2D.prototype.copy = function(other) {
        var child, i, children = other.children;
        this.children.length = 0;
        for (i = children.length; i--; ) {
            child = children[c];
            child && this.add(child.clone());
        }
        this.root = other.root;
        this.position.copy(other.position);
        this.scale.copy(other.scale);
        this.rotation = other.rotation;
        this.updateMatrices();
        return this;
    };
    /**
	 * @method add
	 * @memberof Transform2D
	 * @brief adds all objects in arguments to children
	 */
    Transform2D.prototype.add = function() {
        var child, index, root, i, children = this.children;
        for (i = arguments.length; i--; ) {
            child = arguments[i];
            index = children.indexOf(child);
            if (-1 === index && child instanceof Transform2D) {
                child.parent && child.parent.remove(child);
                child.parent = this;
                children.push(child);
                root = this;
                for (;root.parent; ) root = root.parent;
                child.root = root;
                child.trigger("add");
                this.trigger("addChild", child);
            }
        }
        return this;
    };
    /**
	 * @method remove
	 * @memberof Transform2D
	 * @brief removes all objects in arguments from children
	 */
    Transform2D.prototype.remove = function() {
        var child, index, i, children = this.children;
        for (i = arguments.length; i--; ) {
            child = arguments[i];
            index = children.indexOf(child);
            if (-1 !== index) {
                children.splice(index, 1);
                child.parent = void 0;
                root = this;
                for (;root.parent; ) root = root.parent;
                child.root = root;
                child.trigger("remove");
                this.trigger("removeChild", child);
            }
        }
        return this;
    };
    /**
	 * @method localToWorld
	 * @memberof Transform2D
	 * @brief converts vector from local to world coordinates
	 * @param Vec2 v
	 */
    Transform2D.prototype.localToWorld = function(v) {
        return v.applyMat32(this.matrixWorld);
    };
    /**
	 * @method worldToLocal
	 * @memberof Transform2D
	 * @brief converts vector from world to local coordinates
	 * @param Vec2 v
	 */
    Transform2D.prototype.worldToLocal = function() {
        var mat = new Mat32();
        return function(v) {
            return v.applyMat32(mat.getInverse(this.matrixWorld));
        };
    }();
    /**
	 * @method applyMat32
	 * @memberof Transform2D
	 * @brief applies Mat32 to Transform
	 * @param Mat32 matrix
	 */
    Transform2D.prototype.applyMat32 = function() {
        new Mat32();
        return function(matrix) {
            this.matrix.mmul(matrix, this.matrix);
            this.scale.getScaleMat32(this.matrix);
            this.rotation = this.matrix.getRotation();
            this.position.getPositionMat32(this.matrix);
        };
    }();
    /**
	 * @method translate
	 * @memberof Transform2D
	 * @brief translates Transform by translation relative to some object or if not set itself
	 * @param Vec2 translation
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.translate = function() {
        var vec = new Vec2(), mat = new Mat32();
        return function(translation, relativeTo) {
            vec.copy(translation);
            relativeTo instanceof Transform2D ? mat.setRotation(relativeTo.rotation) : isNumber(relativeTo) && mat.setRotation(relativeTo);
            relativeTo && vec.applyMat32(mat);
            this.position.add(vec);
        };
    }();
    /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief rotates Transform by rotation relative to some object or if not set itself
	 * @param Number rotation
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.rotate = function(angle, relativeTo) {
        relativeTo instanceof Transform2D ? angle += relativeTo.rotation : isNumber(relativeTo) && (angle += relativeTo);
        relativeTo && (angle += relativeTo.rotation);
        this.rotation += angle;
    };
    /**
	 * @method rotate
	 * @memberof Transform2D
	 * @brief scales Transform by scale relative to some object or if not set itself
	 * @param Number scale
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.scale = function() {
        var vec = new Vec2(), mat = new Mat32();
        return function(scale, relativeTo) {
            vec.copy(scale);
            relativeTo instanceof Transform2D ? mat.setRotation(relativeTo.rotation) : isNumber(relativeTo) && mat.setRotation(relativeTo);
            relativeTo && vec.applyMat32(mat);
            this.scale.add(vec);
        };
    }();
    /**
	 * @method rotateAround
	 * @memberof Transform2D
	 * @brief rotates Transform around point
	 * @param Vec2 point
	 * @param Number angle
	 */
    Transform2D.prototype.rotateAround = function() {
        new Vec2();
        return function(point, angle) {
            point.copy(point).sub(this.position);
            this.translate(point);
            this.rotate(angle);
            this.translate(point.inverse(), angle);
        };
    }();
    /**
	 * @method lookAt
	 * @memberof Transform2D
	 * @brief makes Transform look at another Transform or point
	 * @param Transform2D target
	 */
    Transform2D.prototype.lookAt = function() {
        var vec = new Vec2(), mat = new Mat32();
        return function(target) {
            target instanceof Transform2D ? vec.copy(target.position) : vec.copy(target);
            this.rotation = mat.lookAt(this.position, vec).getRotation();
        };
    }();
    /**
	 * @method follow
	 * @memberof Transform2D
	 * @brief makes Transform follow another Transform or point
	 * @param Transform2D target
	 * @param Number damping
	 * @param Transform2D relativeTo
	 */
    Transform2D.prototype.follow = function() {
        var vec = new Vec2();
        return function(target, damping, relativeTo) {
            damping = damping ? damping : 1;
            target instanceof Transform2D ? vec.vsub(target.position, this.position) : target instanceof Vec2 && vec.vsub(target, this.position);
            vec.lenSq() > EPSILON && this.translate(vec.smul(1 / damping), relativeTo);
        };
    }();
    /**
	 * @method updateMatrices
	 * @memberof Transform2D
	 * @brief update matrices
	 */
    Transform2D.prototype.updateMatrices = function() {
        var scale = this.scale, matrix = this.matrix, matrixWorld = this.matrixWorld;
        matrix.setRotation(this.rotation);
        (1 !== scale.x || 1 !== scale.y) && matrix.scale(scale);
        matrix.setTranslation(this.position);
        this.root === this ? matrixWorld.copy(matrix) : matrixWorld.mmul(matrix, this.parent.matrixWorld);
        this._position.equals(this.position) || this.trigger("moved");
        this._scale.equals(scale) || this.trigger("scaled");
        this._rotation !== this.rotation && this.trigger("rotated");
    };
    Transform2D.prototype.toJSON = function() {
        var i, json = this._JSON, children = this.children;
        json.type = "Transform2D";
        json._SERVER_ID = this._id;
        json.children = json.children || [];
        for (i = children.length; i--; ) json.children[i] = children[i].toJSON();
        json.position = this.position;
        json.rotation = this.rotation;
        json.scale = this.scale;
        return json;
    };
    Transform2D.prototype.fromJSON = function(json) {
        var jsonObject, object, i, children = json.children;
        this._SERVER_ID = json._SERVER_ID;
        for (i = children.length; i--; ) {
            jsonObject = children[i];
            object = new Class.types[jsonObject.type]();
            this.add(object.fromJSON(jsonObject));
        }
        this.position.fromJSON(json.position);
        this.rotation = json.rotation;
        this.scale.fromJSON(json.scale);
        this.updateMatrices();
        return this;
    };
    return Transform2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/objects/gameobject2d", [ "base/class", "core/objects/transform2d", "core/objects/camera2d", "core/components/box2d", "core/components/circle2d", "core/components/component", "core/components/poly2d", "core/components/renderable2d", "core/components/rigidbody2d", "core/components/sprite2d" ], function(Class, Transform2D, Camera2D, Box2D, Circle2D, Component) {
    /**
	 * @class GameObject2D
	 * @extends Transform2D
	 * @brief 2d GameObject
	 * @param Object opts sets Class properties from passed Object
	 */
    function GameObject2D(opts) {
        opts || (opts = {});
        Transform2D.call(this, opts);
        /**
	    * @property String name
	    * @brief name of this GameObject
	    * @memberof GameObject2D
	    */
        this.name = opts.name || this._class + "-" + this._id;
        /**
	    * @property Number z
	    * @brief determines renderering order smaller numbers render in back
	    * @memberof GameObject2D
	    */
        this.z = void 0 !== opts.z ? opts.z : 0;
        /**
	    * @property Object userData
	    * @brief any extra custom data added
	    * @memberof GameObject2D
	    */
        this.userData = void 0 !== opts.userData ? opts.userData : {};
        /**
	    * @property Array tags
	    * @brief array of string names
	    * @memberof GameObject2D
	    */
        this.tags = [];
        /**
	    * @property Object components
	    * @brief object holding components attached to GameObject
	    * @memberof GameObject2D
	    */
        this.components = {};
        /**
	    * @property Scene2D scene
	    * @brief reference to Scene this was added to
	    * @memberof GameObject2D
	    */
        this.scene = void 0;
        this.add.apply(this, opts.children);
        this.addTag.apply(this, opts.tags);
        this.addComponent.apply(this, opts.components);
    }
    Class.extend(GameObject2D, Transform2D);
    /**
	 * @method copy
	 * @memberof GameObject2D
	 * @brief copies other object's properties
	 * @param GameObject2D other
	 */
    GameObject2D.prototype.copy = function(other) {
        var name, component;
        Transform2D.call(this, other);
        this.name = this._class + this._id;
        this.tags.length = 0;
        this.addTag.apply(this, other.tags);
        for (name in other.components) {
            component = other.components[name];
            this.addComponent(component.clone());
        }
        other.scene && other.scene.add(this);
        return this;
    };
    /**
	 * @method init
	 * @memberof GameObject2D
	 * @brief called when added to scene
	 */
    GameObject2D.prototype.init = function() {
        var type, component, components = this.components;
        for (type in components) {
            component = components[type];
            if (component) {
                component.init();
                component.trigger("init");
            }
        }
        this.trigger("init");
    };
    /**
	 * @method addTag
	 * @memberof GameObject2D
	 * @brief adds all strings in arguments to tags
	 */
    GameObject2D.prototype.addTag = function() {
        var tag, index, i, il, tags = this.tags;
        for (i = 0, il = arguments.length; il > i; i++) {
            tag = arguments[i];
            index = tags.indexOf(tag);
            -1 === index && tags.push(tag);
        }
    };
    /**
	 * @method removeTag
	 * @memberof GameObject2D
	 * @brief removes all strings in arguments from tags
	 */
    GameObject2D.prototype.removeTag = function() {
        var tag, index, i, il, tags = this.tags;
        for (i = 0, il = arguments.length; il > i; i++) {
            tag = arguments[a];
            index = tags.indexOf(tag);
            -1 !== index && tags.splice(index, 1);
        }
    };
    /**
	 * @method hasTag
	 * @memberof GameObject2D
	 * @brief checks if this GameObject has a tag
	 * @param String tag
	 */
    GameObject2D.prototype.hasTag = function(tag) {
        return -1 !== this.tags.indexOf(tag);
    };
    /**
	 * @method addComponent
	 * @memberof GameObject2D
	 * @brief adds all components in arguments to components
	 */
    GameObject2D.prototype.addComponent = function() {
        var component, i, components = this.components;
        for (i = arguments.length; i--; ) {
            component = arguments[i];
            if (components[component._class]) console.warn("GameObject2D.addComponent: GameObject2D already has a " + component._class + " Component"); else if (component instanceof Component) {
                component.gameObject && (component = component.clone());
                components[component._class] = component;
                component.gameObject = this;
                this.trigger("addComponent", component);
                component.trigger("add", this);
            } else console.warn("GameObject2D.addComponent: " + component._class + " is not an instance of Component");
        }
    };
    /**
	 * @method removeComponent
	 * @memberof GameObject2D
	 * @brief removes all components in arguments from components
	 */
    GameObject2D.prototype.removeComponent = function() {
        var component, i, components = this.components;
        for (i = arguments.length; i--; ) {
            component = arguments[i];
            if (components[component._class]) {
                component.gameObject = void 0;
                components[component._class] = void 0;
                this.trigger("removeComponent", component);
                component.trigger("remove", this);
            } else console.warn("GameObject2D.removeComponent: Component is not attached to GameObject2D");
        }
    };
    /**
	 * @method hasComponent
	 * @memberof GameObject2D
	 * @brief checks if this GameObject has a Component
	 * @param String type
	 */
    GameObject2D.prototype.hasComponent = function(type) {
        return !!this.components[type];
    };
    /**
	 * @method getComponent
	 * @memberof GameObject2D
	 * @brief returns component with name
	 * @param String type
	 */
    GameObject2D.prototype.getComponent = function(type) {
        return this.components[type];
    };
    /**
	 * @method getComponents
	 * @memberof GameObject2D
	 * @brief returns all components attached to this GameObject
	 * @param Array results
	 */
    GameObject2D.prototype.getComponents = function(results) {
        results = results || [];
        var key;
        for (key in this.components) results.push(this.components[key]);
        return results;
    };
    /**
	 * @method forEachComponent
	 * @memberof GameObject2D
	 * @brief for each component call a function
	 * @param Function callback
	 */
    GameObject2D.prototype.forEachComponent = function(callback) {
        var type, component, components = this.components;
        for (type in components) {
            component = components[type];
            component && callback(component);
        }
    };
    /**
	 * @method update
	 * @memberof GameObject2D
	 * @brief called in Scence2D.update
	 */
    GameObject2D.prototype.update = function() {
        var type, component, components = this.components;
        this.trigger("update");
        for (type in components) {
            component = components[type];
            component && component.update && component.update();
        }
        this.updateMatrices();
        this.trigger("lateUpdate");
    };
    GameObject2D.prototype.toJSON = function() {
        var component, i, json = this._JSON, children = this.children, components = this.components, tags = this.tags;
        json.type = "GameObject2D";
        json.name = this.name;
        json._SERVER_ID = this._id;
        json.children = json.children || [];
        json.components = json.components || {};
        json.tags = json.tags || [];
        for (i = children.length; i--; ) json.children[i] = children[i].toJSON();
        for (i in components) {
            component = components[i];
            "RigidBody2D" !== component._class && (json.components[i] = component.toJSON());
        }
        for (i = tags.length; i--; ) json.tags[i] = tags[i];
        json.z = this.z;
        json.position = this.position;
        json.rotation = this.rotation;
        json.scale = this.scale;
        return json;
    };
    GameObject2D.prototype.fromJSON = function(json) {
        var jsonObject, object, i, children = json.children, components = json.components, tags = json.tags;
        this.name = json.name;
        this._SERVER_ID = json._SERVER_ID;
        for (i = children.length; i--; ) {
            jsonObject = children[i];
            object = new Class.types[jsonObject.type]();
            this.add(object.fromJSON(jsonObject));
        }
        for (i in components) {
            jsonObject = components[i];
            object = new Class.types[jsonObject.type]();
            this.addComponent(object.fromJSON(jsonObject));
        }
        for (i = tags.length; i--; ) this.tags[i] = tags[i];
        this.z = json.z;
        this.position.fromJSON(json.position);
        this.rotation = json.rotation;
        this.scale.fromJSON(json.scale);
        this.updateMatrices();
        return this;
    };
    return GameObject2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/objects/camera2d", [ "base/class", "math/mathf", "math/vec2", "math/mat32", "math/mat4", "core/objects/gameobject2d" ], function(Class, Mathf, Vec2, Mat32, Mat4, GameObject2D) {
    /**
	 * @class Camera2D
	 * @extends GameObject2D
	 * @brief 2d Camera
	 * @param Object opts sets Class properties from passed Object
	 */
    function Camera2D(opts) {
        opts || (opts = {});
        GameObject2D.call(this, opts);
        /**
	    * @property Number width
	    * @brief width of camera
	    * @memberof Camera2D
	    */
        this.width = 960;
        /**
	    * @property Number height
	    * @brief height of camera
	    * @memberof Camera2D
	    */
        this.height = 640;
        /**
	    * @property Number aspect
	    * @brief width / height
	    * @memberof Camera2D
	    */
        this.aspect = this.width / this.height;
        /**
	    * @property Number zoom
	    * @brief zoom amount
	    * @memberof Camera2D
	    */
        this.zoom = void 0 !== opts.zoom ? opts.zoom : 1;
        this._matrixProjection3D = new Mat4();
        /**
	    * @property Mat32 matrixProjection
	    * @brief projection matrix
	    * @memberof Camera2D
	    */
        this.matrixProjection = new Mat32();
        /**
	    * @property Mat32 matrixProjectionInverse
	    * @brief inverse projection matrix
	    * @memberof Camera2D
	    */
        this.matrixProjectionInverse = new Mat32();
        /**
	    * @property Mat32 matrixWorldInverse
	    * @brief inverse matrix world, calculated in renderer
	    * @memberof Camera2D
	    */
        this.matrixWorldInverse = new Mat32();
        /**
	    * @property Mat32 matrixWorldInverse
	    * @brief inverse matrix world, calculated in renderer
	    * @memberof Camera2D
	    */
        this.needsUpdate = !0;
    }
    var clampBottom = Mathf.clampBottom;
    Class.extend(Camera2D, GameObject2D);
    /**
	 * @method copy
	 * @memberof Camera2D
	 * @brief copies other object's properties
	 * @param Camera2D other
	 */
    Camera2D.prototype.copy = function(other) {
        GameObject2D.call(this, other);
        this.width = other.width;
        this.height = other.height;
        this.aspect = other.aspect;
        this.zoom = other.zoom;
        this.matrixProjection.copy(other.matrixProjection);
        this.matrixProjectionInverse.copy(other.matrixProjectionInverse);
        this.matrixWorldInverse.copy(other.matrixWorldInverse);
        this.needsUpdate = other.needsUpdate;
        return this;
    };
    /**
	 * @method setSize
	 * @memberof Camera2D
	 * @brief sets width and height of camera
	 * @param Number width
	 * @param Number height
	 */
    Camera2D.prototype.setSize = function(width, height) {
        this.width = void 0 !== width ? width : this.width;
        this.height = void 0 !== height ? height : this.height;
        this.aspect = this.width / this.height;
        this.needsUpdate = !0;
    };
    /**
	 * @method setZoom
	 * @memberof Camera2D
	 * @brief sets zoom amount
	 * @param Number zoom
	 */
    Camera2D.prototype.setZoom = function(zoom) {
        this.zoom = void 0 !== zoom ? zoom : this.zoom;
        this.trigger("zoom");
        this.needsUpdate = !0;
    };
    /**
	 * @method zoomBy
	 * @memberof Camera2D
	 * @brief zooms by some amount
	 * @param Number zoom
	 */
    Camera2D.prototype.zoomBy = function(zoom) {
        this.zoom += void 0 !== zoom ? zoom : 0;
        this.trigger("zoom");
        this.needsUpdate = !0;
    };
    /**
	 * @method updateMatrixProjection
	 * @memberof Camera2D
	 * @brief updates matrix projection
	 */
    Camera2D.prototype.updateMatrixProjection = function() {
        var zoom = clampBottom(this.zoom, .001), w = this.width, h = this.height, right = .5 * w * zoom, left = -right, top = .5 * h * zoom, bottom = -top;
        this.matrixProjection.orthographic(left, right, top, bottom);
        this.matrixProjectionInverse.minv(this.matrixProjection);
        this._matrixProjection3D.orthographic(left, right, top, bottom, -1, 1);
        this.needsUpdate = !1;
    };
    /**
	 * @method update
	 * @memberof Camera2D
	 * @brief called in Scence2D.update
	 */
    Camera2D.prototype.update = function() {
        var type, component, components = this.components;
        this.trigger("update");
        for (type in components) {
            component = components[type];
            component && component.update && component.update();
        }
        this.updateMatrices();
        this.needsUpdate && this.updateMatrixProjection();
        this.matrixWorldInverse.minv(this.matrixWorld);
        this.trigger("lateUpdate");
    };
    Camera2D.prototype.toJSON = function() {
        var i, json = this._JSON, children = this.children, components = this.components, tags = this.tags;
        json.type = "Camera2D";
        json.name = this.name;
        json._SERVER_ID = this._id;
        json.children = json.children || [];
        json.components = json.components || [];
        json.tags = json.tags || [];
        for (i = children.length; i--; ) json.children[i] = children[i].toJSON();
        for (i = components.length; i--; ) json.components[i] = components[i].toJSON();
        for (i = tags.length; i--; ) json.tags[i] = tags[i];
        json.z = this.z;
        json.position = this.position;
        json.rotation = this.rotation;
        json.scale = this.scale;
        json.width = this.width;
        json.height = this.height;
        json.zoom = this.zoom;
        return json;
    };
    Camera2D.prototype.fromJSON = function(json) {
        var jsonObject, object, i, children = json.children, components = json.components, tags = json.tags;
        this.name = json.name;
        this._SERVER_ID = json._SERVER_ID;
        for (i = children.length; i--; ) {
            jsonObject = children[i];
            object = new Class.types[jsonObject.type]();
            this.add(object.fromJSON(jsonObject));
        }
        for (i in components) {
            jsonObject = components[i];
            object = new Class.types[jsonObject.type]();
            this.addComponent(object.fromJSON(jsonObject));
        }
        for (i = tags.length; i--; ) this.tags[i] = tags[i];
        this.z = json.z;
        this.position.fromJSON(json.position);
        this.rotation = json.rotation;
        this.scale.fromJSON(json.scale);
        this.zoom = json.zoom;
        this.setSize(json.width, json.height);
        this.updateMatrices();
        return this;
    };
    return Camera2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/scene/scene2d", [ "base/class", "base/utils", "core/scene/world2d", "core/objects/camera2d", "core/objects/gameobject2d", "core/objects/transform2d" ], function(Class, Utils, World2D, Camera2D, GameObject2D, Transform2D) {
    /**
	 * @class Scene2D
	 * @extends Class
	 * @brief Scene manager for 2D GameObjects
	 * @param Object opts sets Class properties from passed Object
	 */
    function Scene2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property String name
	    * @brief name of this Object
	    * @memberof Scene2D
	    */
        this.name = opts.name || this._class + "-" + this._id;
        /**
	    * @property Array children
	    * @brief array of all children attached to scene
	    * @memberof Scene2D
	    */
        this.children = [];
        this._renderables = [];
        this._rigidbodies = [];
        this._cameras = [];
        /**
	    * @property World2D world
	    * @brief World Class
	    * @memberof Scene2D
	    */
        this.world = opts.world instanceof World2D ? opts.world : new World2D(opts);
        this.add.apply(this, opts.children);
    }
    Class.extend(Scene2D, Class);
    /**
	 * @method forEach
	 * @memberof Scene2D
	 * @brief calls function on each child in scene
	 * @param Function callback function to be called on each child
	 */
    Scene2D.prototype.forEach = function(callback) {
        var i, children = this.children;
        for (i = children.length; i--; ) callback(children[i]);
    };
    /**
	 * @method add
	 * @memberof Scene2D
	 * @brief adds all Objects in arguments to scene
	 */
    Scene2D.prototype.add = function() {
        var child, index, i, children = this.children;
        for (i = arguments.length; i--; ) {
            child = arguments[i];
            index = children.indexOf(child);
            if (-1 === index) {
                child.scene = this;
                children.push(child);
                child.children.length > 0 && this.add.apply(this, child.children);
                this._add(child);
                child.trigger("addToScene");
                this.trigger("addGameObject", child);
                child.init();
            } else console.warn("Scene2D.add: " + child.name + " is already added to scene");
        }
    };
    /**
	 * @method remove
	 * @memberof Scene2D
	 * @brief removes all Objects in arguments from scene
	 */
    Scene2D.prototype.remove = function() {
        var child, index, i, children = this.children;
        for (i = arguments.length; i--; ) {
            child = arguments[i];
            index = children.indexOf(child);
            if (-1 !== index) {
                child.scene = void 0;
                children.splice(index, 1);
                child.children.length > 0 && this.remove.apply(this, child.children);
                this._remove(child);
                child.trigger("removeFromScene");
                this.trigger("removeGameObject", child);
            } else console.warn("Scene2D.remove: " + child + " is not in scene");
        }
    };
    /**
	 * @method clear
	 * @memberof Scene2D
	 * @brief removes all Objects from scene
	 */
    Scene2D.prototype.clear = function() {
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            child.scene = void 0;
            children.splice(i, 1);
            child.children.length > 0 && this.remove.apply(this, child.children);
            this._remove(child);
            child.trigger("removeFromScene");
            this.trigger("removeGameObject", child);
        }
    };
    Scene2D.prototype._add = function(gameObject) {
        var renderable = gameObject.getComponent("Sprite2D") || gameObject.getComponent("Box2D") || gameObject.getComponent("Circle2D") || gameObject.getComponent("Poly2D"), rigidbody2d = gameObject.getComponent("RigidBody2D");
        if (renderable) {
            this._renderables.push(renderable);
            this._renderables.sort(this.sort);
        }
        if (rigidbody2d) {
            this._rigidbodies.push(rigidbody2d);
            this.world.add(rigidbody2d);
        }
        gameObject.matrixProjection && this._cameras.push(gameObject);
    };
    Scene2D.prototype._remove = function(gameObject) {
        var index, renderable = gameObject.getComponent("Sprite2D") || gameObject.getComponent("Box2D") || gameObject.getComponent("Circle2D") || gameObject.getComponent("Poly2D"), rigidbody2d = gameObject.getComponent("RigidBody2D");
        if (renderable) {
            index = this._renderables.indexOf(renderable);
            this._renderables.splice(index, 1);
            this._renderables.sort(this.sort);
        }
        if (rigidbody2d) {
            index = this._rigidbodies.indexOf(rigidbody2d);
            this._rigidbodies.splice(index, 1);
            this.world.remove(rigidbody2d);
        }
        if (gameObject.matrixProjection) {
            index = this._cameras.indexOf(gameObject);
            this._cameras.splice(index, 1);
        }
    };
    Scene2D.prototype.sort = function(a, b) {
        return b.gameObject.z - a.gameObject.z;
    };
    /**
	 * @method findByTag
	 * @memberof Scene2D
	 * @brief finds Object by tag
	 * @param String tag
	 * @param Array results
	 */
    Scene2D.prototype.findByTag = function(tag, results) {
        results = results || [];
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            child.hasTag(tag) && results.push(child);
        }
        return results;
    };
    /**
	 * @method findByName
	 * @memberof Scene2D
	 * @brief finds Object by name
	 * @param String name
	 */
    Scene2D.prototype.findByName = function(name) {
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            if (child.name === name) return child;
        }
        return void 0;
    };
    /**
	 * @method findById
	 * @memberof Scene2D
	 * @brief finds Object by id
	 * @param Number id
	 */
    Scene2D.prototype.findById = function(id) {
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            if (child._id === id) return child;
        }
        return void 0;
    };
    /**
	 * @method findByServerId
	 * @memberof Scene2D
	 * @brief finds Object by its Server ID
	 * @param Number id
	 */
    Scene2D.prototype.findByServerId = function(id) {
        var child, i, children = this.children;
        for (i = children.length; i--; ) {
            child = children[i];
            if (child._SERVER_ID === id) return child;
        }
        return void 0;
    };
    /**
	 * @method update
	 * @memberof Scene2D
	 * @brief updates all objects in scene
	 */
    Scene2D.prototype.update = function() {
        var i, children = this.children;
        this.trigger("update");
        this.world.update();
        for (i = children.length; i--; ) children[i].update();
        this.trigger("lateUpdate");
    };
    Scene2D.prototype.toJSON = function() {
        var i, json = this._JSON, children = this.children;
        json.type = "Scene2D";
        json.name = this.name;
        json._SERVER_ID = this._id;
        json.world = this.world.toJSON();
        json.children = json.children || [];
        for (i = children.length; i--; ) json.children[i] = children[i].toJSON();
        return json;
    };
    Scene2D.prototype.fromJSON = function(json) {
        var jsonObject, object, i, children = json.children;
        this.name = json.name;
        this._SERVER_ID = json._SERVER_ID;
        this.world.fromJSON(json.world);
        this.clear();
        for (i = children.length; i--; ) {
            jsonObject = children[i];
            object = new Class.types[jsonObject.type]();
            this.add(object.fromJSON(jsonObject));
        }
        return this;
    };
    return Scene2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/canvas", [ "base/class", "base/device", "base/dom" ], function(Class, Device, Dom) {
    /**
	 * @class Canvas
	 * @extends Class
	 * @brief HTML5 Canvas Element Helper
	 * @param Number width the width of the Canvas in pixels
	 * @param Number height the height of the Cavnas in pixels
	 */
    function Canvas(width, height) {
        Class.call(this);
        /**
	    * @property String viewportId
	    * @brief id of this objects canvas element
	    * @memberof Canvas
	    */
        this.viewportId = "viewport" + this._id;
        addMeta(this.viewportId, "viewport", "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
        addMeta(this.viewportId + "-width", "viewport", "width=device-width");
        addMeta(this.viewportId + "-height", "viewport", "height=device-height");
        /**
	    * @property Object element
	    * @brief reference to Canvas Element
	    * @memberof Canvas
	    */
        var element = document.createElement("canvas");
        this.element = element;
        /**
	    * @property Boolean fullScreen
	    * @brief if set to true canvas will adjust aspect to match screen 
	    * @memberof Canvas
	    */
        this.fullScreen = !1;
        /**
	    * @property Number width
	    * @brief the width of the Canvas Element
	    * @memberof Canvas
	    */
        this.width = 960;
        /**
	    * @property Number height
	    * @brief the height of the Canvas Element
	    * @memberof Canvas
	    */
        this.height = 640;
        if (width || height) {
            this.width = void 0 !== width ? width : 960;
            this.height = void 0 !== height ? height : 640;
        } else {
            this.fullScreen = !0;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this._aspect = window.innerWidth / window.innerHeight;
        }
        this._width = this.width;
        this._height = this.height;
        this._aspect = this._width / this._height;
        element.style.position = "absolute";
        element.style.left = "50%";
        element.style.top = "50%";
        element.style.padding = "0px";
        element.style.margin = "0px";
        element.marginLeft = .5 * -this.width + "px";
        element.marginTop = .5 * -this.height + "px";
        element.style.width = Math.floor(this.width) + "px";
        element.style.height = Math.floor(this.height) + "px";
        element.width = this.width;
        element.height = this.height;
        /**
	    * @property Object aspect
	    * @brief aspect ratio ( width / height )
	    * @memberof Canvas
	    */
        this.aspect = this.width / this.height;
        element.oncontextmenu = function() {
            return !1;
        };
        document.body.appendChild(element);
        this.handleResize();
        addEvent(window, "resize orientationchange", this.handleResize, this);
    }
    var addMeta = Dom.addMeta, addEvent = Dom.addEvent;
    Class.extend(Canvas, Class);
    /**
	 * @method set
	 * @memberof Canvas
	 * @brief sets width and height of the Canvas Element
	 * @param Number width the new width
	 * @param Number height the new height
	 */
    Canvas.prototype.set = function(width, height) {
        if (width && height) {
            width = width;
            height = height;
            this.width = width;
            this.height = height;
            this.aspect = this.width / this.height;
            this.handleResize();
        } else console.warn("Canvas.set: no width and or height specified using default width and height");
    };
    Canvas.prototype.handleResize = function() {
        var width, height, element = this.element, elementStyle = element.style, w = window.innerWidth, h = window.innerHeight, pixelRatio = Device.pixelRatio, aspect = w / h, id = "#" + this.viewportId, viewportScale = document.querySelector(id).getAttribute("content");
        if (this.fullScreen) {
            this.aspect = w / h;
            if (this.aspect >= this._aspect) {
                this.width = element.width = this._height * this.aspect;
                this.height = element.height = this._height;
            } else {
                this.width = element.width = this._width;
                this.height = element.height = this._width / this.aspect;
            }
            width = w;
            height = h;
        } else if (aspect >= this.aspect) {
            width = h * this.aspect;
            height = h;
        } else {
            width = w;
            height = w / this.aspect;
        }
        elementStyle.width = Math.floor(width) + "px";
        elementStyle.height = Math.floor(height) + "px";
        elementStyle.marginLeft = .5 * -width + "px";
        elementStyle.marginTop = .5 * -height + "px";
        document.querySelector(id).setAttribute("content", viewportScale.replace(/-scale\s*=\s*[.0-9]+/g, "-scale=" + pixelRatio));
        document.querySelector(id + "-width").setAttribute("content", "width=" + w);
        document.querySelector(id + "-height").setAttribute("content", "height=" + h);
        window.scrollTo(0, 0);
        this.trigger("resize");
    };
    return Canvas;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/canvasrenderer2d", [ "base/class", "base/dom", "base/device", "base/time", "core/canvas", "math/color", "math/mat32" ], function(Class, Dom, Device, Time, Canvas, Color, Mat32) {
    /**
	 * @class CanvasRenderer2D
	 * @extends Class
	 * @brief Canvas 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
    function CanvasRenderer2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Boolean debug
	    * @brief games debug value
	    * @memberof CanvasRenderer2D
	    */
        this.debug = void 0 !== opts.debug ? !!opts.debug : !1;
        /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof CanvasRenderer2D
	    */
        this.pixelRatio = (void 0 !== opts.pixelRatio ? opts.pixelRatio : 128) * Device.pixelRatio;
        this._invPixelRatio = 1 / this.pixelRatio;
        /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof CanvasRenderer2D
	    */
        this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas(opts.width, opts.height);
        /**
	    * @property CanvasRenderingContext2D context
	    * @brief this Canvas's Context
	    * @memberof CanvasRenderer2D
	    */
        this.context = Dom.get2DContext(this.canvas.element);
        /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof CanvasRenderer2D
	    */
        this.autoClear = void 0 !== opts.autoClear ? opts.autoClear : !0;
        /**
	    * @property Number time
	    * @brief How long in seconds it took to render last frame
	    * @memberof CanvasRenderer2D
	    */
        this.time = 0;
        this._data = {
            images: {
                "default": defaultImage
            }
        };
    }
    var now = Time.now, PI = Math.PI, TWO_PI = 2 * PI, defaultImage = new Image();
    defaultImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
    Class.extend(CanvasRenderer2D, Class);
    /**
	 * @method setClearColor
	 * @memberof CanvasRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
    CanvasRenderer2D.prototype.setClearColor = function(color) {
        this.canvas.element.style.background = color ? color.hex() : "#000000";
    };
    /**
	 * @method clear
	 * @memberof CanvasRenderer2D
	 * @brief clears canvas
	 */
    CanvasRenderer2D.prototype.clear = function() {
        this.context.clearRect(-1, -1, 2, 2);
    };
    /**
	 * @method render
	 * @memberof CanvasRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    CanvasRenderer2D.prototype.render = function() {
        var lastScene, lastCamera, lastBackground = new Color();
        return function(scene, camera) {
            var renderable, rigidbody, i, self = this, background = scene.world.background, ctx = this.context, renderables = scene._renderables, rigidbodies = scene._rigidbodies, start = now();
            if (!lastBackground.equals(background)) {
                this.setClearColor(background);
                lastBackground.copy(background);
            }
            if (lastScene !== scene) {
                this.setClearColor(background);
                lastScene = scene;
            }
            if (lastCamera !== camera) {
                var canvas = this.canvas, ipr = 1 / this.pixelRatio, w = canvas.width * ipr, h = canvas.height * ipr, hw = .5 * canvas.width, hh = .5 * canvas.height;
                ctx.translate(hw, hh);
                ctx.scale(hw, hh);
                camera.setSize(w, h);
                if (this.canvas.fullScreen) {
                    this.canvas.off("resize");
                    this.canvas.on("resize", function() {
                        var ipr = 1 / self.pixelRatio, w = this.width * ipr, h = this.height * ipr, hw = .5 * this.width, hh = .5 * this.height;
                        ctx.translate(hw, hh);
                        ctx.scale(hw, hh);
                        camera.setSize(w, h);
                    });
                }
                lastCamera = camera;
            }
            this.autoClear && this.clear();
            if (this.debug) for (i = rigidbodies.length; i--; ) {
                rigidbody = rigidbodies[i];
                this.renderComponent(rigidbody, camera);
            }
            for (i = renderables.length; i--; ) {
                renderable = renderables[i];
                renderable.visible && this.renderComponent(renderable, camera);
            }
            this.time = now() - start;
        };
    }();
    CanvasRenderer2D.prototype.renderComponent = function() {
        var model = new Mat32(), modelView = new Mat32(), modelViewProj = new Mat32(), mvp = modelViewProj.elements;
        return function(component, camera) {
            var sleepState, vertex, x, y, i, ctx = this.context, images = this._data.images, gameObject = component.gameObject, offset = component.offset, imageSrc = component.image, radius = component.radius, extents = component.extents, vertices = component.vertices, body = component.body, image = images[imageSrc];
            if (!image && imageSrc) if ("default" === imageSrc) image = images["default"]; else {
                image = new Image();
                image.src = imageSrc;
                images[imageSrc] = image;
            }
            model.copy(gameObject.matrixWorld);
            modelView.mmul(model, camera.matrixWorldInverse);
            modelViewProj.mmul(modelView, camera.matrixProjection);
            ctx.save();
            ctx.transform(mvp[0], -mvp[2], -mvp[1], mvp[3], mvp[4], mvp[5]);
            ctx.scale(1, -1);
            component.image && ctx.drawImage(image, component.x, component.y, component.w, component.h, offset.x - .5 * component.width, component.height * -.5 - offset.y, component.width, component.height);
            if (radius || extents || vertices) {
                body && (sleepState = body.sleepState);
                component.fill && (ctx.fillStyle = component.color ? component.color.rgba() : "#000000");
                ctx.globalAlpha = component.alpha;
                3 === sleepState && (ctx.globalAlpha *= .5);
                if (component.line) {
                    ctx.strokeStyle = component.lineColor ? component.lineColor.rgba() : "#000000";
                    ctx.lineWidth = component.lineWidth || this._invPixelRatio;
                }
                ctx.beginPath();
                if (radius) {
                    component.body && ctx.lineTo(0, 0);
                    ctx.arc(offset.x, -offset.y, radius, 0, TWO_PI);
                } else if (extents) {
                    x = offset.x + extents.x;
                    y = extents.y - offset.y;
                    ctx.lineTo(x, y);
                    ctx.lineTo(-x, y);
                    ctx.lineTo(-x, -y);
                    ctx.lineTo(x, -y);
                } else if (vertices) for (i = vertices.length; i--; ) {
                    vertex = vertices[i];
                    ctx.lineTo(offset.x + vertex.x, vertex.y - offset.y);
                }
                ctx.closePath();
                component.fill && ctx.fill();
                if (component.line) {
                    ctx.globalAlpha = 1;
                    ctx.stroke();
                }
            }
            ctx.restore();
        };
    }();
    return CanvasRenderer2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/webglrenderer2d", [ "base/class", "base/dom", "base/device", "base/time", "core/canvas", "math/mathf", "math/color", "math/vec2", "math/mat32", "math/mat4" ], function(Class, Dom, Device, Time, Canvas, Mathf, Color, Vec2, Mat32, Mat4) {
    function parseUniformsAttributes(gl, shader) {
        var matchAttributes, matchUniforms, name, length, line, i, j, src = shader.vertexShader + shader.fragmentShader, lines = src.split("\n");
        for (i = lines.length; i--; ) {
            line = lines[i];
            matchAttributes = line.match(regAttribute);
            matchUniforms = line.match(regUniform);
            if (matchAttributes) {
                name = matchAttributes[3];
                shader.attributes[name] = gl.getAttribLocation(shader.program, name);
            }
            if (matchUniforms) {
                name = matchUniforms[3];
                length = parseInt(matchUniforms[5]);
                if (length) {
                    shader.uniforms[name] = [];
                    for (j = length; j--; ) shader.uniforms[name][j] = gl.getUniformLocation(shader.program, name + "[" + j + "]");
                } else shader.uniforms[name] = gl.getUniformLocation(shader.program, name);
            }
        }
    }
    function basicVertexShader(precision) {
        return [ "precision " + precision + " float;", "uniform mat4 uMatrix;", "attribute vec2 aVertexPosition;", "void main(){", "gl_Position = uMatrix * vec4( aVertexPosition, 0.0, 1.0 );", "}" ].join("\n");
    }
    function basicFragmentShader(precision) {
        return [ "precision " + precision + " float;", "uniform float uAlpha;", "uniform vec3 uColor;", "void main(){", "gl_FragColor = vec4( uColor, uAlpha );", "}" ].join("\n");
    }
    function spriteVertexShader(precision) {
        return [ "precision " + precision + " float;", "uniform mat4 uMatrix;", "uniform vec4 uCrop;", "attribute vec2 aVertexPosition;", "attribute vec2 aUvPosition;", "varying vec2 vUvPosition;", "void main(){", "vUvPosition = vec2( aUvPosition.x * uCrop.z, aUvPosition.y * uCrop.w ) + uCrop.xy;", "gl_Position = uMatrix * vec4( aVertexPosition, 0.0, 1.0 );", "}" ].join("\n");
    }
    function spriteFragmentShader(precision) {
        return [ "precision " + precision + " float;", "uniform float uAlpha;", "uniform sampler2D uTexture;", "varying vec2 vUvPosition;", "void main(){", "vec4 finalColor = texture2D( uTexture, vUvPosition );", "finalColor.w *= uAlpha;", "gl_FragColor = finalColor;", "}" ].join("\n");
    }
    /**
	 * @class WebGLRenderer2D
	 * @extends Class
	 * @brief WebGL 2D Renderer
	 * @param Object opts sets Class properties from passed Object
	 */
    function WebGLRenderer2D(opts) {
        opts || (opts = {});
        Class.call(this);
        /**
	    * @property Boolean debug
	    * @brief games debug value
	    * @memberof WebGLRenderer2D
	    */
        this.debug = void 0 !== opts.debug ? !!opts.debug : !1;
        /**
	    * @property Number pixelRatio
	    * @brief ratio of pixels/meter
	    * @memberof WebGLRenderer2D
	    */
        this.pixelRatio = (void 0 !== opts.pixelRatio ? opts.pixelRatio : 128) * Device.pixelRatio;
        this._invPixelRatio = 1 / this.pixelRatio;
        /**
	    * @property Canvas canvas
	    * @brief Canvas Class
	    * @memberof WebGLRenderer2D
	    */
        this.canvas = opts.canvas instanceof Canvas ? opts.canvas : new Canvas(opts.width, opts.height);
        /**
	    * @property WebGLRenderingContext context
	    * @brief this Canvas's Context
	    * @memberof WebGLRenderer2D
	    */
        opts.attributes || (opts.attributes = {});
        opts.attributes.depth = !1;
        this.context = Dom.getWebGLContext(this.canvas.element, opts.attributes);
        /**
	    * @property Boolean autoClear
	    * @brief if true clears ever frame
	    * @memberof WebGLRenderer2D
	    */
        this.autoClear = void 0 !== opts.autoClear ? opts.autoClear : !0;
        /**
	    * @property Number time
	    * @brief How long in seconds it took to render last frame
	    * @memberof WebGLRenderer2D
	    */
        this.time = 0;
        /**
	    * @property Object ext
	    * @brief WebGL extension information
	    * @memberof WebGLRenderer2D
	    */
        this.ext = {
            texture_filter_anisotropic: void 0,
            texture_float: void 0,
            standard_derivatives: void 0,
            compressed_texture_s3tc: void 0
        };
        /**
	    * @property Object gpu
	    * @brief WebGL gpu information
	    * @memberof WebGLRenderer2D
	    */
        this.gpu = {
            precision: "highp",
            maxAnisotropy: 16,
            maxTextures: 16,
            maxTextureSize: 16384,
            maxCubeTextureSize: 16384,
            maxRenderBufferSize: 16384
        };
        this._data = {
            images: {
                "default": defaultImage
            },
            textures: {
                "default": void 0
            },
            sprite: {
                vertexShader: void 0,
                fragmentShader: void 0,
                program: void 0,
                uniforms: {},
                attributes: {}
            },
            basic: {
                vertexShader: void 0,
                fragmentShader: void 0,
                program: void 0,
                uniforms: {},
                attributes: {}
            }
        };
        this.setDefault();
    }
    var now = Time.now, createProgram = Dom.createProgram, isPowerOfTwo = (2 * Math.PI, 
    Math.cos, Math.sin, Mathf.isPowerOfTwo), regAttribute = (Mathf.toPowerOfTwo, /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/), regUniform = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/, defaultImage = new Image();
    defaultImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
    Class.extend(WebGLRenderer2D, Class);
    WebGLRenderer2D.prototype.getExtensions = function() {
        var gl = this.context, ext = this.ext, texture_filter_anisotropic = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic"), compressed_texture_s3tc = gl.getExtension("WEBGL_compressed_texture_s3tc") || gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"), standard_derivatives = gl.getExtension("OES_standard_derivatives"), texture_float = gl.getExtension("OES_texture_float");
        ext.texture_filter_anisotropic = texture_filter_anisotropic;
        ext.standard_derivatives = standard_derivatives;
        ext.texture_float = texture_float;
        ext.compressed_texture_s3tc = compressed_texture_s3tc;
    };
    WebGLRenderer2D.prototype.getGPUCapabilities = function() {
        var gl = this.context, gpu = this.gpu, ext = this.ext, VERTEX_SHADER = gl.VERTEX_SHADER, FRAGMENT_SHADER = gl.FRAGMENT_SHADER, HIGH_FLOAT = gl.HIGH_FLOAT, MEDIUM_FLOAT = gl.MEDIUM_FLOAT, shaderPrecision = (gl.LOW_FLOAT, 
        gl.getShaderPrecisionFormat !== void 0), maxAnisotropy = ext.texture_filter_anisotropic ? gl.getParameter(ext.texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1, maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE), maxCubeTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE), maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), vsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(VERTEX_SHADER, HIGH_FLOAT) : 0, vsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(VERTEX_SHADER, MEDIUM_FLOAT) : 23, fsHighpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(FRAGMENT_SHADER, HIGH_FLOAT) : 0, fsMediumpFloat = shaderPrecision ? gl.getShaderPrecisionFormat(FRAGMENT_SHADER, MEDIUM_FLOAT) : 23, highpAvailable = vsHighpFloat.precision > 0 && fsHighpFloat.precision > 0, mediumpAvailable = vsMediumpFloat.precision > 0 && fsMediumpFloat.precision > 0, precision = "highp";
        (!highpAvailable || Device.mobile) && (precision = mediumpAvailable ? "mediump" : "lowp");
        gpu.precision = precision;
        gpu.maxAnisotropy = maxAnisotropy;
        gpu.maxTextures = maxTextures;
        gpu.maxTextureSize = maxTextureSize;
        gpu.maxCubeTextureSize = maxCubeTextureSize;
        gpu.maxRenderBufferSize = maxRenderBufferSize;
    };
    /**
	 * @method setDefault
	 * @memberof WebGLRenderer2D
	 * @brief sets WebGL context to default settings
	 */
    WebGLRenderer2D.prototype.setDefault = function() {
        var precision, gl = this.context, data = this._data, gpu = this.gpu, basic = data.basic, sprite = data.sprite;
        this.getExtensions();
        this.getGPUCapabilities();
        precision = gpu.precision;
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(0);
        gl.clearStencil(0);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        basic.vertexShader = basicVertexShader(precision);
        basic.fragmentShader = basicFragmentShader(precision);
        basic.program = createProgram(gl, basic.vertexShader, basic.fragmentShader);
        parseUniformsAttributes(gl, basic);
        sprite.vertexShader = spriteVertexShader(precision);
        sprite.fragmentShader = spriteFragmentShader(precision);
        sprite.program = createProgram(gl, sprite.vertexShader, sprite.fragmentShader);
        parseUniformsAttributes(gl, sprite);
        this.createImage("default");
    };
    WebGLRenderer2D.prototype.createImage = function(imageSrc) {
        var self = this, data = this._data, images = data.images, textures = data.textures, image = images[imageSrc];
        if (!image) if ("default" === imageSrc) {
            image = images["default"];
            textures[imageSrc] || createTexture(image, imageSrc);
        } else {
            image = new Image();
            image.src = imageSrc;
            images[imageSrc] = image;
        }
        image.onload = function() {
            self.createTexture(image, imageSrc);
        };
    };
    WebGLRenderer2D.prototype.createTexture = function(image, imageSrc) {
        var gl = this.context, data = this._data, textures = data.textures, texture = gl.createTexture(), isPOT = isPowerOfTwo(image.width) && isPowerOfTwo(image.height), TEXTURE_2D = gl.TEXTURE_2D, MAG_FILTER = gl.LINEAR, MIN_FILTER = isPOT ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR, WRAP = isPOT ? gl.REPEAT : gl.CLAMP_TO_EDGE, RGBA = gl.RGBA;
        gl.bindTexture(TEXTURE_2D, texture);
        gl.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MAG_FILTER, MAG_FILTER);
        gl.texParameteri(TEXTURE_2D, gl.TEXTURE_MIN_FILTER, MIN_FILTER);
        gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_S, WRAP);
        gl.texParameteri(TEXTURE_2D, gl.TEXTURE_WRAP_T, WRAP);
        isPOT && gl.generateMipmap(TEXTURE_2D);
        gl.bindTexture(TEXTURE_2D, null);
        textures[imageSrc] = texture;
    };
    /**
	 * @method setClearColor
	 * @memberof WebGLRenderer2D
	 * @brief sets background color
	 * @param Color color color to set background too
	 */
    WebGLRenderer2D.prototype.setClearColor = function(color) {
        color ? this.context.clearColor(color.r, color.g, color.b, color.a) : this.context.clearColor(0, 0, 0, 1);
    };
    /**
	 * @method clear
	 * @memberof WebGLRenderer2D
	 * @brief clears canvas
	 */
    WebGLRenderer2D.prototype.clear = function() {
        var gl = this.context;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    };
    /**
	 * @method setBlending
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl blending mode( 0 - none, 1 - additive, 2 - subtractive, or 3 - multiply  )
	 * @param Number blending 
	 */
    WebGLRenderer2D.prototype.setBlending = function() {
        var lastBlending, gl;
        return function(blending) {
            gl = this.context;
            if (blending !== lastBlending) {
                switch (blending) {
                  case WebGLRenderer2D.none:
                    gl.disable(gl.BLEND);
                    break;

                  case WebGLRenderer2D.additive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    break;

                  case WebGLRenderer2D.subtractive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                    break;

                  case WebGLRenderer2D.multiply:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                    break;

                  default:
                    gl.enable(gl.BLEND);
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
                lastBlending = blending;
            }
        };
    }();
    /**
	 * @method setLineWidth
	 * @memberof WebGLRenderer2D
	 * @brief sets webgl line width
	 * @param Number width 
	 */
    WebGLRenderer2D.prototype.setLineWidth = function() {
        var lastLineWidth = 1;
        return function(width) {
            if (width !== lastLineWidth) {
                this.context.lineWidth(width * this.pixelRatio);
                lastLineWidth = width;
            }
        };
    }();
    /**
	 * @method render
	 * @memberof WebGLRenderer2D
	 * @brief renders scene from cameras perspective
	 * @param Scene2D scene to render
	 * @param Camera2D camera to get perspective from
	 */
    WebGLRenderer2D.prototype.render = function() {
        var lastScene, lastCamera, lastBackground = new Color();
        return function(scene, camera) {
            var renderable, rigidbody, i, self = this, background = scene.world.background, gl = this.context, renderables = scene._renderables, rigidbodies = scene._rigidbodies, start = now();
            if (!lastBackground.equals(background)) {
                this.setClearColor(background);
                lastBackground.copy(background);
            }
            if (lastScene !== scene) {
                this.setClearColor(background);
                lastScene = scene;
            }
            if (lastCamera !== camera) {
                var canvas = this.canvas, ipr = 1 / this.pixelRatio, w = canvas.width * ipr, h = canvas.height * ipr;
                camera.setSize(w, h);
                gl.viewport(0, 0, canvas.width, canvas.height);
                if (this.canvas.fullScreen) {
                    this.canvas.off("resize");
                    this.canvas.on("resize", function() {
                        var ipr = 1 / self.pixelRatio, w = this.width * ipr, h = this.height * ipr;
                        camera.setSize(w, h);
                        gl.viewport(0, 0, this.width, this.height);
                    });
                }
                lastCamera = camera;
            }
            this.autoClear && this.clear();
            if (this.debug) for (i = rigidbodies.length; i--; ) {
                rigidbody = rigidbodies[i];
                this.renderComponent(rigidbody, camera);
            }
            for (i = renderables.length; i--; ) {
                renderable = renderables[i];
                renderable.visible && this.renderComponent(renderable, camera);
            }
            this.time = now() - start;
        };
    }();
    WebGLRenderer2D.prototype.renderComponent = function() {
        var model32 = new Mat32(), modelView32 = new Mat32(), modelView4 = new Mat4(), modelViewProj4 = new Mat4(), mvp = modelViewProj4.elements;
        return function(component, camera) {
            var sleepState, uniforms, attributes, w, h, gl = this.context, data = this._data, imageSrc = component.image, image = data.images[imageSrc], texture = data.textures[imageSrc], componentData = component._data, offset = component.offset, color = component.color, lineColor = component.lineColor, alpha = component.alpha, gameObject = component.gameObject, body = component.body, sprite = data.sprite, basic = data.basic;
            if (!texture && imageSrc) {
                this.createImage(imageSrc);
                image = data.images["default"];
                texture = data.textures["default"];
            }
            componentData.needsUpdate && this.setupBuffers(componentData);
            model32.copy(gameObject.matrixWorld).translate(offset);
            modelView32.mmul(model32, camera.matrixWorldInverse);
            modelView4.fromMat32(modelView32);
            modelViewProj4.mmul(camera._matrixProjection3D, modelView4);
            if (componentData.uvBuffer) {
                gl.useProgram(sprite.program);
                w = 1 / image.width;
                h = 1 / image.height;
                uniforms = sprite.uniforms;
                attributes = sprite.attributes;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.uniform1i(uniforms.uTexture, 0);
                gl.uniform4f(uniforms.uCrop, component.x * w, component.y * h, component.w * w, component.h * h);
            } else {
                body && (sleepState = body.sleepState);
                gl.useProgram(basic.program);
                uniforms = basic.uniforms;
                attributes = basic.attributes;
                gl.uniform3f(uniforms.uColor, color.r, color.g, color.b);
            }
            this.bindBuffers(attributes, componentData);
            gl.uniformMatrix4fv(uniforms.uMatrix, !1, mvp);
            3 === sleepState && (alpha *= .5);
            gl.uniform1f(uniforms.uAlpha, alpha);
            gl.drawElements(gl.TRIANGLES, componentData.indices.length, gl.UNSIGNED_SHORT, 0);
            if (component.line) {
                gl.useProgram(basic.program);
                this.bindBuffers(attributes, componentData);
                this.setLineWidth(component.lineWidth || this._invPixelRatio);
                uniforms = basic.uniforms;
                attributes = basic.attributes;
                gl.bindTexture(gl.TEXTURE_2D, null);
                gl.uniformMatrix4fv(uniforms.uMatrix, !1, mvp);
                gl.uniform3f(uniforms.uColor, lineColor.r, lineColor.g, lineColor.b);
                gl.uniform1f(uniforms.uAlpha, 1);
                gl.drawArrays(gl.LINE_LOOP, 0, .5 * componentData.vertices.length);
            }
        };
    }();
    WebGLRenderer2D.prototype.bindBuffers = function(attributes, data) {
        var gl = this.context, ARRAY_BUFFER = gl.ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER, FLOAT = gl.FLOAT;
        gl.bindBuffer(ARRAY_BUFFER, data.vertexBuffer);
        gl.enableVertexAttribArray(attributes.aVertexPosition);
        gl.vertexAttribPointer(attributes.aVertexPosition, 2, FLOAT, !1, 0, 0);
        gl.bindBuffer(ELEMENT_ARRAY_BUFFER, data.indexBuffer);
        if (data.uvs.length) {
            gl.bindBuffer(ARRAY_BUFFER, data.uvBuffer);
            gl.enableVertexAttribArray(attributes.aUvPosition);
            gl.vertexAttribPointer(attributes.aUvPosition, 2, FLOAT, !1, 0, 0);
        }
    };
    WebGLRenderer2D.prototype.setupBuffers = function(data) {
        var gl = this.context, DRAW = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW, ARRAY_BUFFER = gl.ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER = gl.ELEMENT_ARRAY_BUFFER;
        if (data.vertices.length) {
            data.vertexBuffer = data.vertexBuffer || gl.createBuffer();
            gl.bindBuffer(ARRAY_BUFFER, data.vertexBuffer);
            gl.bufferData(ARRAY_BUFFER, new Float32Array(data.vertices), DRAW);
        }
        if (data.uvs.length) {
            data.uvBuffer = data.uvBuffer || gl.createBuffer();
            gl.bindBuffer(ARRAY_BUFFER, data.uvBuffer);
            gl.bufferData(ARRAY_BUFFER, new Float32Array(data.uvs), DRAW);
        }
        if (data.indices.length) {
            data.indexBuffer = data.indexBuffer || gl.createBuffer();
            gl.bindBuffer(ELEMENT_ARRAY_BUFFER, data.indexBuffer);
            gl.bufferData(ELEMENT_ARRAY_BUFFER, new Int16Array(data.indices), DRAW);
        }
        data.needsUpdate = !1;
    };
    WebGLRenderer2D.none = 0;
    WebGLRenderer2D.additive = 1;
    WebGLRenderer2D.subtractive = 2;
    WebGLRenderer2D.multiply = 3;
    return WebGLRenderer2D;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/game", [ "base/class", "base/utils", "base/device", "base/dom", "base/time", "core/input/input", "core/scene/scene2d", "core/canvas", "core/canvasrenderer2d", "core/webglrenderer2d" ], function(Class, Utils, Device, Dom, Time, Input, Scene2D, Canvas, CanvasRenderer2D, WebGLRenderer2D) {
    /**
	 * @class Game
	 * @extends Class
	 * @brief used for client side game
	 * @param Object opts sets Class properties from passed Object
	 * @event update called before update
	 * @event lateUpdate called after update
	 */
    function Game(opts) {
        opts || (opts = {});
        Class.call(this, opts);
        /**
	    * @property Boolean debug
	    * @brief game debug value
	    * @memberof Game
	    */
        this.debug = void 0 !== opts.debug ? !!opts.debug : !1;
        /**
	    * @property Boolean forceCanvas
	    * @brief force canvas renderer
	    * @memberof Game
	    */
        this.forceCanvas = void 0 !== opts.forceCanvas ? !!opts.forceCanvas : !1;
        /**
	    * @property Camera camera
	    * @brief game's camera
	    * @memberof Game
	    */
        this.camera = void 0;
        /**
	    * @property Scene scene
	    * @brief game's active scene
	    * @memberof Game
	    */
        this.scene = void 0;
        /**
	    * @property Array scenes
	    * @brief game's list of all scenes
	    * @memberof Game
	    */
        this.scenes = [];
        /**
	    * @property WebGLRenderer2D WebGLRenderer2D
	    * @brief reference to WebGL 2D Renderer
	    * @memberof Game
	    */
        this.WebGLRenderer2D = new WebGLRenderer2D(opts);
        /**
	    * @property CanvasRenderer2D CanvasRenderer2D
	    * @brief reference to Canvas 2D Renderer
	    * @memberof Game
	    */
        this.CanvasRenderer2D = new CanvasRenderer2D(opts);
        /**
	    * @property Renderer renderer
	    * @brief reference to game's active renderer
	    * @memberof Game
	    */
        this.renderer = this.WebGLRenderer2D;
        Input.init(this.renderer.canvas.element);
        /**
	    * @property Boolean pause
	    * @brief game's paused value
	    * @memberof Game
	    */
        this.pause = !1;
        addEvent(window, "focus", this.handleFocus, this);
        addEvent(window, "blur", this.handleBlur, this);
    }
    var requestAnimFrame = Dom.requestAnimFrame, addEvent = (Math.floor, Dom.addEvent);
    Class.extend(Game, Class);
    /**
	 * @method init
	 * @memberof Game
	 * @brief call this to start game
	 */
    Game.prototype.init = function() {
        this.trigger("init");
        this.animate();
    };
    /**
	 * @method updateRenderer
	 * @memberof Game
	 * @brief updates game's renderer based on scene
	 * @param Scene scene
	 */
    Game.prototype.updateRenderer = function(scene) {
        this.renderer.canvas.element.style.zIndex = -1;
        if (scene instanceof Scene2D) if (Device.webgl && !this.forceCanvas) this.renderer = this.WebGLRenderer2D; else {
            if (!Device.canvas) throw Error("Game: Could not get a renderer");
            this.renderer = this.CanvasRenderer2D;
        }
        Input.clear();
        Input.init(this.renderer.canvas.element);
        this.renderer.canvas.element.style.zIndex = 1;
    };
    /**
	 * @method addScene
	 * @memberof Game
	 * @brief adds all scenes in arguments to game
	 */
    Game.prototype.addScene = function() {
        var scene, index, i, scenes = this.scenes;
        for (i = arguments.length; i--; ) {
            scene = arguments[i];
            index = scenes.indexOf(scene);
            if (-1 === index) {
                scenes.push(scene);
                scene.game = this;
                scene.trigger("addToGame");
                this.trigger("addScene", scene);
            } else console.warn("Game.add: " + scene.name + " is already added to game");
        }
    };
    /**
	 * @method removeScene
	 * @memberof Game
	 * @brief removes all scenes in arguments from game
	 */
    Game.prototype.removeScene = function() {
        var scene, index, i, scenes = this.scenes;
        for (i = arguments.length; i--; ) {
            scene = arguments[i];
            index = scenes.indexOf(scene);
            if (-1 !== index) {
                scenes.splice(index, 1);
                scene.game = void 0;
                scene.trigger("removeFromGame");
                this.trigger("removeScene", scene);
            } else console.warn("Game.remove: " + scene.name + " is not in game");
        }
    };
    /**
	 * @method setScene
	 * @memberof Game
	 * @brief sets game's active scene
	 * @param Scene scene
	 */
    Game.prototype.setScene = function(scene) {
        var index, type = typeof scene;
        "string" === type ? scene = this.findSceneByName(scene) : "number" === type && (scene = this.findSceneById(scene));
        index = this.scenes.indexOf(scene);
        if (-1 === index) {
            console.warn("Game.setScene: scene not added to Game, adding it...");
            this.addScene(scene);
        }
        this.scene = scene;
        this.scene ? this.updateRenderer(this.scene) : console.warn("Game.setScene: could not find scene in Game " + scene);
    };
    /**
	 * @method setCamera
	 * @memberof Game
	 * @brief sets game's active camera
	 * @param Camera camera
	 */
    Game.prototype.setCamera = function(camera) {
        var index, type = typeof camera, scene = this.scene;
        if (scene) {
            if ("string" === type) this.camera = scene.findByName(camera); else if ("number" === type) camera = scene.findById(camera); else {
                index = scene.children.indexOf(camera);
                if (-1 === index) {
                    console.warn("Game.setCamera: camera not added to Scene, adding it...");
                    scene.add(camera);
                }
                this.camera = camera;
            }
            this.camera || console.warn("Game.setCamera: no camera found " + camera);
        } else console.warn("Game.setCamera: no active scene for camera.");
    };
    /**
	 * @method findSceneByName
	 * @memberof Game
	 * @brief finds scene by name
	 * @param String name
	 */
    Game.prototype.findSceneByName = function(name) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene.name === name) return scene;
        }
        return void 0;
    };
    /**
	 * @method findSceneById
	 * @memberof Game
	 * @brief finds scene by id
	 * @param Number id
	 */
    Game.prototype.findSceneById = function(id) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene._id === id) return scene;
        }
        return void 0;
    };
    /**
	 * @method findSceneByServerId
	 * @memberof Game
	 * @brief finds scene by its Server ID
	 * @param Number id
	 */
    Game.prototype.findSceneByServerId = function(id) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene._SERVER_ID === id) return scene;
        }
        return void 0;
    };
    /**
	 * @method update
	 * @memberof Game
	 * @brief updates actice scene and Time
	 */
    Game.prototype.update = function() {
        var scene = this.scene;
        Time.sinceStart = Time.now();
        Input.update();
        if (!this.pause) {
            Time.update();
            this.trigger("update");
            scene && scene.update();
            this.trigger("lateUpdate");
        }
    };
    /**
	 * @method render
	 * @memberof Game
	 * @brief renders active scene from game's camera
	 */
    Game.prototype.render = function() {
        var scene = this.scene, camera = this.camera;
        scene && camera && this.renderer.render(scene, camera);
    };
    /**
	 * @method animate
	 * @memberof Game
	 * @brief starts the game called in Game.init
	 */
    Game.prototype.animate = function() {
        var fpsDisplay = document.createElement("p"), last = 0;
        fpsDisplay.style.cssText = [ "z-index: 1000;", "position: absolute;", "margin: 0px;", "padding: 0px;", "color: #ddd;", "text-shadow: 1px 1px #333", "-webkit-touch-callout: none;", "-webkit-user-select: none;", "-khtml-user-select: none;", "-moz-user-select: moz-none;", "-ms-user-select: none;", "user-select: none;" ].join("\n");
        document.body.appendChild(fpsDisplay);
        return function() {
            if (this.debug && Time.sinceStart >= last + .5) {
                fpsDisplay.innerHTML = Time.fps.toFixed(2) + "fps";
                last = Time.sinceStart;
            }
            this.update();
            this.render();
            requestAnimFrame(this.animate.bind(this));
        };
    }();
    Game.prototype.handleFocus = function(e) {
        this.trigger("focus", e);
    };
    Game.prototype.handleBlur = function(e) {
        this.trigger("blur", e);
    };
    return Game;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/clientgame", [ "require", "base/class", "base/time", "base/device", "core/input/input", "core/input/mouse", "core/input/touches", "core/input/keyboard", "core/input/accelerometer", "core/input/orientation", "core/scene/scene2d", "core/game/game", "core/objects/camera2d", "core/objects/gameobject2d", "core/objects/transform2d" ], function(require, Class, Time, Device, Input, Mouse, Touches, Keyboard, Accelerometer, Orientation, Scene2D, Game) {
    /**
	 * @class ClientGame
	 * @extends Game
	 * @brief Client Game used to join ServerGame
	 * @param Object opts sets Class properties from passed Object
	 */
    function ClientGame(opts) {
        opts || (opts = {});
        Game.call(this, opts);
        /**
	    * @property Number id
	    * @brief unique id of this client
	    * @memberof ClientGame
	    */
        this.id = void 0;
        /**
	    * @property String host
	    * @brief the host address
	    * @memberof ClientGame
	    */
        this.host = opts.host || "127.0.0.1";
        /**
	    * @property Number port
	    * @brief the port
	    * @memberof ClientGame
	    */
        this.port = opts.port || 3e3;
        var socket, jsonObject, object, i, self = this;
        /**
	    * @property Object socket
	    * @brief reference to client's socket
	    * @memberof ClientGame
	    */
        this.socket = socket = io.connect("http://" + this.host, {
            port: this.port
        });
        socket.on("connection", function(id, scenes) {
            self.id = id;
            socket.emit("clientConnect", Device);
            for (i = scenes.length; i--; ) {
                jsonObject = scenes[i];
                object = new Class.types[jsonObject.type]();
                object.fromJSON(jsonObject);
                self.addScene(object);
            }
            socket.on("cameraZoom", function(scene, gameObject, zoom) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    if (gameObject) {
                        gameObject.zoom = zoom;
                        gameObject.updateMatrixProjection();
                    }
                }
            });
            socket.on("gameObjectMoved", function(scene, gameObject, position) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    if (gameObject) {
                        gameObject.position.copy(position);
                        gameObject.updateMatrices();
                    }
                }
            });
            socket.on("gameObjectScaled", function(scene, gameObject, scale) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    if (gameObject) {
                        gameObject.scale.copy(scale);
                        gameObject.updateMatrices();
                    }
                }
            });
            socket.on("gameObjectRotated", function(scene, gameObject, rotation) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    if (gameObject) {
                        gameObject.rotation = rotation;
                        gameObject.updateMatrices();
                    }
                }
            });
            socket.on("addComponent", function(scene, gameObject, component) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    if (gameObject) {
                        object = new Class.types[component.type]();
                        object.fromJSON(component);
                        gameObject.addComponent(object);
                    }
                }
            });
            socket.on("removeComponent", function(scene, gameObject, component) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    gameObject && gameObject.removeComponent(gameObject.getComponent(component));
                }
            });
            socket.on("addGameObject", function(scene, gameObject) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    object = new Class.types[gameObject.type]();
                    object.fromJSON(gameObject);
                    scene.add(object);
                }
            });
            socket.on("removeGameObject", function(scene, gameObject) {
                scene = self.findSceneByServerId(scene);
                if (scene) {
                    gameObject = scene.findByServerId(gameObject);
                    gameObject && scene.remove(gameObject);
                }
            });
            socket.on("addScene", function(scene) {
                object = new Class.types[scene.type]();
                object.fromJSON(scene);
                self.add(object);
            });
            socket.on("removeScene", function(scene) {
                scene = self.findSceneByServerId(scene);
                scene && self.removeScene(scene);
            });
            socket.on("setScene", function(scene) {
                scene = self.findSceneByServerId(scene);
                scene && self.setScene(scene);
            });
            socket.on("setCamera", function(camera) {
                camera = self.scene.findByServerId(camera);
                camera && self.setCamera(camera);
            });
            socket.on("log", function() {
                console.log.apply(console, arguments);
            });
            Accelerometer.on("accelerometer", function() {
                socket.emit("accelerometer", Accelerometer);
            });
            Orientation.on("orientation", function(orientation) {
                socket.emit("orientation", orientation);
            });
            Orientation.on("orientationchange", function(mode, orientation) {
                socket.emit("orientationchange", mode, orientation);
            });
            Keyboard.on("keydown", function(key) {
                socket.emit("keydown", key);
            });
            Keyboard.on("keyup", function(key) {
                socket.emit("keyup", key);
            });
            Touches.on("start", function(touch) {
                socket.emit("touchstart", touch);
            });
            Touches.on("end", function(touch) {
                socket.emit("touchend", touch);
            });
            Touches.on("move", function(touch) {
                socket.emit("touchmove", touch);
            });
            Mouse.on("down", function() {
                socket.emit("mousedown", Mouse);
            });
            Mouse.on("up", function() {
                socket.emit("mouseup", Mouse);
            });
            Mouse.on("out", function() {
                socket.emit("mouseout", Mouse);
            });
            Mouse.on("move", function() {
                socket.emit("mousemove", Mouse);
            });
            Mouse.on("wheel", function() {
                socket.emit("mousewheel", Mouse);
            });
        });
    }
    Class.extend(ClientGame, Game);
    return ClientGame;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("core/game/servergame", [ "require", "base/class", "base/time", "core/game/client", "core/scene/scene2d" ], function(require, Class, Time, Client) {
    /**
	 * @class ServerGame
	 * @extends Class
	 * @brief used for server side game
	 * @param Object opts sets Class properties from passed Object
	 * @event update called before update
	 * @event lateUpdate called after update
	 */
    function ServerGame(opts) {
        opts || (opts = {});
        Class.call(this, opts);
        /**
	    * @property Array scenes
	    * @brief list of scenes
	    * @memberof ServerGame
	    */
        this.scenes = [];
        /**
	    * @property Object clients
	    * @brief list of clients
	    * @memberof ServerGame
	    */
        this.clients = {};
        /**
	    * @property String host
	    * @brief host address of game
	    * @memberof ServerGame
	    */
        this.host = opts.host || "127.0.0.1";
        /**
	    * @property String port
	    * @brief port of game
	    * @memberof ServerGame
	    */
        this.port = opts.port || 3e3;
        /**
	    * @property Object server
	    * @brief reference to http server
	    * @memberof ServerGame
	    */
        this.server = http.createServer(this._onRequest.bind(this));
        this.server.listen(this.port, this.host);
        /**
	    * @property Object io
	    * @brief reference to socket.io
	    * @memberof ServerGame
	    */
        this.io = io.listen(this.server);
        this.io.set("log level", opts.logLevel || 2);
        var self = this;
        this.io.sockets.on("connection", function(socket) {
            var i, scenes = self.scenes, client = new Client({
                id: socket.id,
                socket: socket,
                connectTime: Time.stamp()
            }), id = socket.id;
            scenesList.length = 0;
            for (i = scenes.length; i--; ) scenesList[i] = scenes[i].toJSON();
            self.clients[id] = client;
            socket.emit("connection", id, scenesList);
            socket.on("disconnect", function() {
                self.trigger("disconnect", id);
                console.log("ServerGame: Client id: " + id + " disconnected");
            });
            socket.on("error", function(error) {
                console.log("ServerGame: Client id: " + id + " to error: " + error);
            });
            socket.on("clientConnect", function(device) {
                client.device = device;
                self.trigger("connection", id);
                console.log("ServerGame: new Client id: " + id + " " + device.userAgent);
            });
            socket.on("accelerometer", function(accelerometer) {
                client.trigger("accelerometer", accelerometer);
            });
            socket.on("orientation", function(orientation) {
                client.trigger("orientation", orientation);
            });
            socket.on("orientationchange", function(mode, orientation) {
                client.trigger("orientationchange", mode, orientation);
            });
            socket.on("keydown", function(key) {
                client.trigger("keydown", key);
            });
            socket.on("keyup", function(key) {
                client.trigger("keyup", key);
            });
            socket.on("touchstart", function(Touches, touch) {
                client.trigger("touchstart", touch);
            });
            socket.on("touchend", function(Touches, touch) {
                client.trigger("touchend", touch);
            });
            socket.on("touchmove", function(Touches, touch) {
                client.trigger("touchmove", touch);
            });
            socket.on("mousedown", function(Mouse) {
                client.trigger("mousedown", Mouse);
            });
            socket.on("mouseup", function(Mouse) {
                client.trigger("mouseup", Mouse);
            });
            socket.on("mouseout", function(Mouse) {
                client.trigger("mouseout", Mouse);
            });
            socket.on("mousemove", function(Mouse) {
                client.trigger("mousemove", Mouse);
            });
            socket.on("mousewheel", function(Mouse) {
                client.trigger("mousewheel", Mouse);
            });
        });
    }
    var http = require("http"), url = require("url"), path = require("path"), fs = require("fs"), io = require("socket.io"), scenesList = [];
    Class.extend(ServerGame, Class);
    /**
	 * @method init
	 * @memberof ServerGame
	 * @brief call this to start game
	 */
    ServerGame.prototype.init = function() {
        this.trigger("init");
        this.animate();
        console.log("Game started at " + this.host + ":" + this.port);
    };
    /**
	 * @method addScene
	 * @memberof ServerGame
	 * @brief adds all scenes in arguments to game
	 */
    ServerGame.prototype.addScene = function() {
        var scene, index, i, scenes = this.scenes, sockets = this.io.sockets;
        for (i = arguments.length; i--; ) {
            scene = arguments[i];
            index = scenes.indexOf(scene);
            if (-1 === index) {
                scenes.push(scene);
                scene.game = this;
                scene.trigger("addToGame");
                this.trigger("addScene", scene);
                sockets.emit("addScene", scene.toJSON());
                scene.on("addGameObject", function(gameObject) {
                    sockets.emit("addGameObject", this._id, gameObject.toJSON());
                    gameObject.on("addComponent", function(component) {
                        "RigidBody2D" !== component._class && sockets.emit("addComponent", this.scene._id, this._id, component.toJSON());
                    });
                    gameObject.on("removeComponent", function(component) {
                        "RigidBody2D" !== component._class && sockets.emit("removeComponent", this.scene._id, this._id, component._class);
                    });
                    gameObject.on("zoom", function() {
                        sockets.emit("cameraZoom", this.scene._id, this._id, this.zoom);
                    });
                    gameObject.on("moved", function() {
                        sockets.emit("gameObjectMoved", this.scene._id, this._id, this.position);
                    });
                    gameObject.on("scaled", function() {
                        sockets.emit("gameObjectScaled", this.scene._id, this._id, this.scale);
                    });
                    gameObject.on("rotated", function() {
                        sockets.emit("gameObjectRotated", this.scene._id, this._id, this.rotation);
                    });
                });
                scene.on("removeGameObject", function(gameObject) {
                    sockets.emit("removeGameObject", this._id, gameObject._id);
                });
            } else console.warn("ServerGame.add: " + scene.name + " is already added to game");
        }
    };
    /**
	 * @method removeScene
	 * @memberof ServerGame
	 * @brief removes all scenes in arguments from game
	 */
    ServerGame.prototype.removeScene = function() {
        var scene, index, i, scenes = this.scenes, sockets = this.io.sockets;
        for (i = arguments.length; i--; ) {
            scene = arguments[i];
            index = scenes.indexOf(scene);
            if (-1 !== index) {
                scenes.splice(index, 1);
                scene.game = void 0;
                scene.trigger("removeFromGame");
                this.trigger("removeScene", scene);
                sockets.emit("removeScene", scene._id);
            } else console.warn("ServerGame.remove: " + scene.name + " is not in game");
        }
    };
    /**
	 * @method setScene
	 * @memberof ServerGame
	 * @brief sets client's active scene
	 * @param Client client
	 * @param Scene scene
	 */
    ServerGame.prototype.setScene = function(client, scene) {
        var index = this.scenes.indexOf(scene), socket = this.io.sockets.sockets[client.id];
        if (-1 === index) {
            console.warn("ServerGame.setScene: scene not added to Game, adding it...");
            this.addScene(scene);
        }
        client.scene = scene;
        socket.emit("setScene", scene._id);
        client.scene || console.warn("ServerGame.setScene: could not find scene in Game " + scene);
    };
    /**
	 * @method setCamera
	 * @memberof ServerGame
	 * @brief sets client's active camera
	 * @param Client client
	 * @param Camera camera
	 */
    ServerGame.prototype.setCamera = function(client, camera) {
        var scene = client.scene, index = scene.children.indexOf(camera), socket = this.io.sockets.sockets[client.id];
        if (-1 === index) {
            console.warn("ServerGame.setCamera: camera not added to scene, adding it...");
            scene.add(camera);
        }
        client.camera = camera;
        socket.emit("setCamera", camera._id);
        client.camera || console.warn("ServerGame.setCamera: could not find camera in scene " + scene);
    };
    /**
	 * @method findSceneByName
	 * @memberof ServerGame
	 * @brief find scene by name
	 * @param String name
	 */
    ServerGame.prototype.findSceneByName = function(name) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene.name === name) return scene;
        }
        return void 0;
    };
    /**
	 * @method findSceneById
	 * @memberof ServerGame
	 * @brief find scene by id
	 * @param Number id
	 */
    ServerGame.prototype.findSceneById = function(id) {
        var scene, i, scenes = this.scenes;
        for (i = scenes.length; i--; ) {
            scene = scenes[i];
            if (scene._id === id) return scene;
        }
        return void 0;
    };
    /**
	 * @method update
	 * @memberof ServerGame
	 * @brief updates scenes and Time
	 */
    ServerGame.prototype.update = function() {
        var i, scenes = this.scenes;
        Time.sinceStart = Time.now();
        Time.update();
        for (i = scenes.length; i--; ) scenes[i].update();
    };
    /**
	 * @method animate
	 * @memberof ServerGame
	 * @brief starts the game called in ServerGame.init
	 */
    ServerGame.prototype.animate = function() {
        this.update();
        setTimeout(this.animate.bind(this), 0);
    };
    ServerGame.prototype._onRequest = function() {
        var mimeTypes = {
            txt: "text/plain",
            html: "text/html",
            css: "text/css",
            xml: "application/xml",
            json: "application/json",
            js: "application/javascript",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            png: "image/png",
            svg: "image/svg+xml"
        };
        return function(req, res) {
            var uri = url.parse(req.url).pathname, filename = path.join(process.cwd(), uri), mime = mimeTypes[uri.split(".").pop()] || "text/plain";
            fs.exists(filename, function(exists) {
                if (exists) {
                    if (fs.statSync(filename).isDirectory()) {
                        filename += "index.html";
                        mime = "text/html";
                    }
                    fs.readFile(filename, function(error, file) {
                        console.log(req.method + ": " + filename + " " + mime);
                        if (error) {
                            res.writeHead(500, {
                                "Content-Type": "text/plain"
                            });
                            res.write(err + "\n");
                            res.end();
                        } else {
                            res.writeHead(200, {
                                "Content-Type": mime
                            });
                            res.write(file, mime);
                            res.end();
                        }
                    });
                } else {
                    res.writeHead(404, {
                        "Content-Type": "text/plain"
                    });
                    res.write("404 Not Found");
                    res.end();
                }
            });
        };
    }();
    return ServerGame;
});

if ("function" != typeof define) var define = require("amdefine")(module);

define("odindoc", [ "require", "base/class", "base/device", "base/dom", "base/objectpool", "base/time", "base/utils", "math/aabb2", "math/aabb3", "math/color", "math/line2", "math/mat2", "math/mat3", "math/mat32", "math/mat4", "math/mathf", "math/quat", "math/vec2", "math/vec3", "math/vec4", "physics2d/body/pbody2d", "physics2d/body/pparticle2d", "physics2d/body/prigidbody2d", "physics2d/collision/pbroadphase2d", "physics2d/collision/pnearphase2d", "physics2d/constraints/pconstraint2d", "physics2d/constraints/pcontact2d", "physics2d/constraints/pdistanceconstraint2d", "physics2d/constraints/pequation2d", "physics2d/constraints/pfriction2d", "physics2d/shape/pbox2d", "physics2d/shape/pcircle2d", "physics2d/shape/pconvex2d", "physics2d/shape/pshape2d", "physics2d/psolver2d", "physics2d/pworld2d", "core/components/box2d", "core/components/circle2d", "core/components/component", "core/components/poly2d", "core/components/renderable2d", "core/components/rigidbody2d", "core/components/sprite2d", "core/game/client", "core/game/clientgame", "core/game/game", "core/game/servergame", "core/input/accelerometer", "core/input/input", "core/input/key", "core/input/keyboard", "core/input/mouse", "core/input/orientation", "core/input/touch", "core/input/touches", "core/objects/camera2d", "core/objects/gameobject2d", "core/objects/transform2d", "core/scene/scene2d", "core/scene/world2d", "core/canvas", "core/canvasrenderer2d", "core/webglrenderer2d" ], function(require) {
    /**
	* @library Odin.js
	* @version 0.0.12
	* @brief Node.js Canvas/WebGL Javascript Game Engine
	*/
    /**
	 * @class Odin
	 * @brief Holds all Classes
	 */
    var Odin = {};
    /**
	 * @method globalize
	 * @memberof Odin
	 * @brief globalizes Odin Classes
	 */
    Odin.globalize = function() {
        for (var key in this) window[key] = this[key];
        window.Odin = this;
    };
    /**
	 * @method test
	 * @memberof Odin
	 * @brief test function a nth numeber of times and console.logs the time it took
	 * @param String name
	 * @param Number times
	 * @param Function fn
	 */
    Odin.test = function() {
        var start, i, now = Date.now;
        return function(name, times, fn) {
            start = now();
            for (i = 0; times > i; i++) fn();
            console.log(name + ": " + (now() - start) + "ms");
        };
    }();
    Odin.Class = require("base/class");
    Odin.Device = require("base/device");
    Odin.Dom = require("base/dom");
    Odin.ObjectPool = require("base/objectpool");
    Odin.Time = require("base/time");
    Odin.Utils = require("base/utils");
    Odin.AABB2 = require("math/aabb2");
    Odin.AABB3 = require("math/aabb3");
    Odin.Color = require("math/color");
    Odin.Line2 = require("math/line2");
    Odin.Mat2 = require("math/mat2");
    Odin.Mat3 = require("math/mat3");
    Odin.Mat32 = require("math/mat32");
    Odin.Mat4 = require("math/mat4");
    Odin.Mathf = require("math/mathf");
    Odin.Quat = require("math/quat");
    Odin.Vec2 = require("math/vec2");
    Odin.Vec3 = require("math/vec3");
    Odin.Vec4 = require("math/vec4");
    Odin.PBody2D = require("physics2d/body/pbody2d");
    Odin.PParticle2D = require("physics2d/body/pparticle2d");
    Odin.PRigidBody2D = require("physics2d/body/prigidbody2d");
    Odin.PBroadphase2D = require("physics2d/collision/pbroadphase2d");
    Odin.PNearphase2D = require("physics2d/collision/pnearphase2d");
    Odin.PConstraint2D = require("physics2d/constraints/pconstraint2d");
    Odin.PContact2D = require("physics2d/constraints/pcontact2d");
    Odin.PDistanceConstraint2D = require("physics2d/constraints/pdistanceconstraint2d");
    Odin.PEquation2D = require("physics2d/constraints/pequation2d");
    Odin.PFriction2D = require("physics2d/constraints/pfriction2d");
    Odin.PBox2D = require("physics2d/shape/pbox2d");
    Odin.PCircle2D = require("physics2d/shape/pcircle2d");
    Odin.PConvex2D = require("physics2d/shape/pconvex2d");
    Odin.PShape2D = require("physics2d/shape/pshape2d");
    Odin.PSolver2D = require("physics2d/psolver2d");
    Odin.PWorld2D = require("physics2d/pworld2d");
    Odin.Box2D = require("core/components/box2d");
    Odin.Circle2D = require("core/components/circle2d");
    Odin.Component = require("core/components/component");
    Odin.Poly2D = require("core/components/poly2d");
    Odin.Renderable2D = require("core/components/renderable2d");
    Odin.RigidBody2D = require("core/components/rigidbody2d");
    Odin.Sprite2D = require("core/components/sprite2d");
    Odin.Client = require("core/game/client");
    Odin.ClientGame = require("core/game/clientgame");
    Odin.Game = require("core/game/game");
    Odin.ServerGame = require("core/game/servergame");
    Odin.Accelerometer = require("core/input/accelerometer");
    Odin.Input = require("core/input/input");
    Odin.Key = require("core/input/key");
    Odin.Keyboard = require("core/input/keyboard");
    Odin.Mouse = require("core/input/mouse");
    Odin.Orientation = require("core/input/orientation");
    Odin.Touch = require("core/input/touch");
    Odin.Touches = require("core/input/touches");
    Odin.Camera2D = require("core/objects/camera2d");
    Odin.GameObject2D = require("core/objects/gameobject2d");
    Odin.Transform2D = require("core/objects/transform2d");
    Odin.Scene2D = require("core/scene/scene2d");
    Odin.World2D = require("core/scene/world2d");
    Odin.Canvas = require("core/canvas");
    Odin.CanvasRenderer2D = require("core/canvasrenderer2d");
    Odin.WebGLRenderer2D = require("core/webglrenderer2d");
    return Odin;
});