(function() {
  "use strict";
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  (function(factory) {
    var electron, error, error1, jq;
    if (!window) {
      throw new Error("WWT cannot run in a windowless environment");
    }
    jq = window.jQuery ? window.jQuery : require("jquery");
    if (!jq) {
      throw new Error("WWT requires jQuery to run");
    }
    if (typeof module === "object" && typeof module.exports === "object") {
      electron = void 0;
      try {
        electron = require("electron");
      } catch (error1) {
        error = error1;
      }
      return factory(jq, module.exports, electron);
    } else {
      return factory(jq, (window.wwt = {}));
    }
  })(function($, root, electron) {
    var AbstractItemList, Button, ButtonGroup, Check, ColorPicker, Combo, Composite, CssController, EventListener, FileChooser, Image, Label, List, MOUSE, NATIVE_LAF, ProgressBar, Radio, Registry, Spinner, Switch, TabFolder, Table, Text, ToggleButton, Widget, YTVideo, check, decimalPlaces, getBoolean, getParent, getString, hasBeenInit, indexCheck, options, registry;
    root.registry = registry = new (Registry = (function() {
      function Registry() {
        this.__widgets = [];
      }

      Registry.prototype.add = function(widget) {
        if (widget instanceof Widget) {
          return this.__widgets.push(widget);
        }
      };

      Registry.prototype.getByType = function(type, strict) {
        var j, len, ref, results, w;
        if (strict == null) {
          strict = false;
        }
        if (type !== null) {
          ref = this.__widgets;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            w = ref[j];
            if ((!strict ? w instanceof type : w.constructor === type)) {
              results.push(w);
            }
          }
          return results;
        } else {
          return [];
        }
      };

      Registry.prototype.getById = function(id) {
        var j, len, ref, w;
        root.util.validateString("id", id);
        if (id.length === 0) {
          return null;
        }
        ref = this.__widgets;
        for (j = 0, len = ref.length; j < len; j++) {
          w = ref[j];
          if (w.getId() === id) {
            return w;
          }
        }
        return null;
      };

      return Registry;

    })());
    check = function(parent, id) {
      if (id == null) {
        id = "";
      }
      if (typeof parent !== "string" && !root.util.isJQuery(parent) && !parent instanceof Composite) {
        throw new Error("parent must be a string, jQuery object, or an instanceof wwt.Composite");
      }
      if (!(parent === "" || root.util.isJQuery(parent) || parent instanceof Composite)) {
        if ($("#" + parent).length === 0) {
          throw new Error("DOM id " + parent + " (parent) does not exist");
        }
      }
      root.util.validateString("id", id);
      if (id.length > 0 && $("#" + id).length !== 0) {
        throw new Error("DOM id " + id + " (id) already exists");
      }
    };
    getParent = function(parent) {
      if (parent === "") {
        return $("body");
      } else if (typeof parent === "object" && parent instanceof Composite) {
        return parent.$__element;
      } else {
        return $("#" + parent);
      }
    };
    getString = function(variable) {
      if (typeof variable !== "undefined") {
        return variable;
      } else {
        return "";
      }
    };
    getBoolean = function(variable, def) {
      if (def == null) {
        def = false;
      }
      if (typeof variable === "boolean") {
        return variable;
      } else {
        return def;
      }
    };
    decimalPlaces = function(num) {
      var match;
      match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) {
        return 0;
      }
      return Math.max(0, match[1] ? match[1].length : 0, -(match[2] ? +match[2] : 0));
    };
    indexCheck = function(arr, index) {
      if ((-1 > index && index < arr.length)) {
        throw new Error("index (" + index + ") out of bounds (0-" + (arr.length - 1) + ")");
      }
    };
    options = root.Options = new ((function() {
      var DEF_LAF, DEF_LAF_WINDOWS_ACCENT, LAF, LAF_GTK_DARK, LAF_WINDOWS_ACCENT, RES_BASE, VALID_LAF, VALID_LAF_WINDOWS_ACCENT, get;

      function _Class() {}

      DEF_LAF = "default";

      LAF = DEF_LAF;

      VALID_LAF = ["default", "win", "cocoa", "gtk", "native", "custom"];

      DEF_LAF_WINDOWS_ACCENT = "blue";

      LAF_WINDOWS_ACCENT = DEF_LAF_WINDOWS_ACCENT;

      VALID_LAF_WINDOWS_ACCENT = ["gray", "red", "green", "blue", "orange", "yellow", "purple"];

      LAF_GTK_DARK = false;

      RES_BASE = "";

      get = function(valid, value, def) {
        if (indexOf.call(valid, value) >= 0) {
          return value;
        } else {
          return def;
        }
      };

      _Class.prototype.getLookAndFeel = function() {
        return get(VALID_LAF, LAF, DEF_LAF);
      };

      _Class.prototype.setLookAndFeel = function(laf) {
        return LAF = get(VALID_LAF, laf, DEF_LAF);
      };

      _Class.prototype.isNativeLookAndFeel = function() {
        return LAF === "native";
      };

      _Class.prototype.getWindowsAccent = function() {
        return get(VALID_LAF_WINDOWS_ACCENT, LAF_WINDOWS_ACCENT, DEF_LAF_WINDOWS_ACCENT);
      };

      _Class.prototype.setWindowsAccent = function(accent) {
        return get(VALID_LAF_WINDOWS_ACCENT, accent, DEF_LAF_WINDOWS_ACCENT);
      };

      _Class.prototype.setResourceBase = function(base) {
        return RES_BASE = base;
      };

      _Class.prototype.getResourceBase = function() {
        return RES_BASE;
      };

      _Class.prototype.isGtkDark = function() {
        return LAF_GTK_DARK;
      };

      _Class.prototype.setGtkDark = function(dark) {
        validateBoolean("dark", dark);
        return LAF_GTK_DARK = dark;
      };

      return _Class;

    })());
    hasBeenInit = false;
    NATIVE_LAF = "";
    MOUSE = {
      client: {},
      page: {},
      screen: {}
    };
    root.electron = electron;
    root.updateTheme = function() {
      var base, laf;
      if (!hasBeenInit) {
        return;
      }
      $("#_wwtTheme").remove();
      base = options.getResourceBase();
      laf = options.isNativeLookAndFeel() ? NATIVE_LAF : options.getLookAndFeel();
      return $("head").append("<link id='_wwtTheme' rel='stylesheet' href='" + base + "/css/laf-" + laf + ".css'>");
    };
    root.init = function() {
      var os;
      hasBeenInit = true;
      os = navigator.platform;
      if (os.startsWith("Win")) {
        NATIVE_LAF = "windows";
      } else if (os.startsWith("Mac")) {
        NATIVE_LAF = "aqua";
      } else {
        NATIVE_LAF = "gtk";
      }
      return root.updateTheme();
    };
    root.getMousePos = function() {
      return $.extend({}, MOUSE);
    };
    root.util = {
      watch: function($element, property, onChange, thisArg) {
        var oldValue, timer;
        oldValue = $element.prop(property);
        return timer = window.setTimeout(function() {
          if ($element.prop(property) !== oldValue) {
            return onChange.call(thisArg);
          }
        }, 100);
      },
      defineConstant: function(obj, name, val) {
        return Object.defineProperty(obj, name, {
          enumerable: false,
          configurable: false,
          writable: false,
          value: val
        });
      },
      isArray: function(arr) {
        return arr instanceof Array;
      },
      isJQuery: function(obj) {
        return obj instanceof $;
      },
      validate: function(name, variable, type) {
        if (typeof variable !== type) {
          throw new TypeError(name + " must be a " + type);
        }
      },
      validateArray: function(name, variable) {
        if (!this.isArray(variable)) {
          throw new TypeError(name + " must be an array");
        }
      },
      validateString: function(name, variable) {
        return this.validate(name, variable, "string");
      },
      validateBoolean: function(name, variable) {
        return this.validate(name, variable, "boolean");
      },
      validateFunction: function(name, variable) {
        return this.validate(name, variable, "function");
      },
      validateNumber: function(name, variable) {
        return this.validate(name, variable, "number");
      },
      validateObject: function(name, variable) {
        return this.validate(name, variable, "object");
      },
      validateInt: function(name, variable) {
        if (typeof variable !== "number" || !Number.isInteger(variable)) {
          throw new Error(name + " must be an integer");
        }
      },
      validateInteger: function() {
        return this.validaeInt.apply(this, arguments);
      },
      validateJQuery: function(name, variable) {
        if (!this.isJQuery(variable)) {
          throw new Error(name + " must be a jQuery object");
        }
      },
      async: function(arg) {
        var callback, callbackArgs, callbackThis, fn, fnArgs, fnThis, ref, ref1, ref2, ref3;
        fn = (ref = arg.fn) != null ? ref : null, fnThis = arg.fnThis, fnArgs = (ref1 = arg.fnArgs) != null ? ref1 : [], callback = (ref2 = arg.callback) != null ? ref2 : null, callbackThis = arg.callbackThis, callbackArgs = (ref3 = arg.callbackArgs) != null ? ref3 : [];
        if (fn === null || callback === null) {
          return;
        }
        return setTimeout(function() {
          fn.apply(fnThis, isArray(fnArgs) ? fnArgs : []);
          return callback.apply(callbackThis, isArray(callbackArgs) ? callbackArgs : []);
        }, 0);
      }
    };
    root.util.defineConstant(root, "event", {
      Selection: "selection",
      AfterSelection: "after-selection",
      Hover: "hover",
      Dispose: "dispose",
      Modify: "modify",
      AfterModify: "after-modify",
      Show: "show",
      Hide: "hide",
      Resize: "resize",
      SpectrumChange: "spectrum-change",
      SpectrumShow: "spectrum-show",
      SpectrumHide: "spectrum-hide",
      SpectrumDragStart: "spectrum-drag-start",
      SpectrumDragEnd: "spectrum-drag-end",
      SpectrumMove: "spectrum-move"
    });
    CssController = (function() {
      function CssController($e, id) {
        if (id == null) {
          id = "";
        }
        root.util.validateJQuery("$e", $e);
        this.$__element = $e;
        this.__id = "";
        if (typeof id === "string") {
          this.__id = id;
        }
        if (typeof this.$__element.attr("id") !== "string") {
          this.$__element.attr("id", this.__id);
        }
        this.__classes = [];
      }

      CssController.prototype.__classIf = function(classname, shouldAdd, $elem) {
        if ($elem == null) {
          $elem = this.$__element;
        }
        if (shouldAdd === true) {
          $elem.addClass(classname);
        } else {
          $elem.removeClass(classname);
        }
        return this;
      };

      CssController.prototype.__cssIf = function(cssTrue, cssFalse, shouldAdd, $elem) {
        if ($elem == null) {
          $elem = this.$__element;
        }
        if (shouldAdd === true) {
          return $elem.css(cssTrue);
        } else {
          return $elem.css(cssFalse);
        }
      };

      CssController.prototype.__attrIf = function(attr, condition, $elem) {
        if ($elem == null) {
          $elem = this.$__element;
        }
        if (condition === true) {
          return $elem.attr(attr, "");
        } else {
          return $elem.removeAttr(attr);
        }
      };

      CssController.prototype.hasClass = function(className) {
        return typeof className === "string" && $.inArray(className, this.__classes) > -1;
      };

      CssController.prototype.addClass = function(className) {
        root.util.validateString("className", className);
        if (className.indexOf(" ") > -1) {
          throw new Error("className cannot have space");
        }
        if (!this.hasClass(className)) {
          this.__classes.push(className);
          this.$__element.addClass(className);
        }
        return this;
      };

      CssController.prototype.removeClass = function(className) {
        var c, count, index, j, len, ref;
        if (root.util.isArray(className)) {
          throw new Error("className must be a string. Use removeClasses() for Array input");
        }
        root.util.validateString("className", className);
        if (className.indexOf(" ") > -1) {
          throw new Error("className cannot have space");
        }
        index = -1;
        count = 0;
        ref = this.__addedClasses;
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          if (c === className) {
            index = count;
            break;
          }
          count++;
        }
        if (index > -1) {
          this.__addedClasses.splice(index, 1);
          this.$__element.removeClass(className);
        }
        return this;
      };

      CssController.prototype.removeClasses = function(classes) {
        var c, j, len;
        root.util.validateArray("classes", classes);
        for (j = 0, len = classes.length; j < len; j++) {
          c = classes[j];
          if (typeof c === "string") {
            removeClass(c);
          }
        }
        return this;
      };

      CssController.prototype.clearClasses = function() {
        this.$__element.removeClass(this.__addedClasses.join(" "));
        this.__addedClasses.splice(0, this.__addedClasses.length);
        return this;
      };

      CssController.prototype.getClasses = function() {
        return this.__classes.slice(0);
      };

      CssController.prototype.css = function() {
        this.$__element.css.apply(this.$__element, arguments);
        return this;
      };

      CssController.prototype.getId = function() {
        return this.__id;
      };

      return CssController;

    })();
    root.EventListener = EventListener = (function() {
      function EventListener() {}

      EventListener.prototype.addListener = function(eventType, listener) {
        this.__checkDisposeState();
        root.util.validateString("eventType", eventType);
        root.util.validateFunction("listener", listener);
        this.__getListeners(eventType).push(listener);
        return this;
      };

      EventListener.prototype.removeAllListeners = function(eventType) {
        var k, ref, v;
        if (eventType == null) {
          eventType = null;
        }
        if (eventType === null) {
          ref = this.__listeners;
          for (k in ref) {
            v = ref[k];
            if (root.util.isArray(this.__listeners[k])) {
              this.__listeners[k].splice(0);
            }
          }
          return this;
        }
        return __getListeners(eventType).splice(0);
      };

      EventListener.prototype.removeListener = function(eventType, listener) {
        var fn, i, index, j, len, listeners;
        index = -1;
        listeners = this.__getListeners(eventType);
        if (listeners.length === 0) {
          return;
        }
        for (i = j = 0, len = listeners.length; j < len; i = ++j) {
          fn = listeners[i];
          if (fn === listener) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          return;
        }
        return listeners.splice(index, 1);
      };

      EventListener.prototype.__getListeners = function(eventType) {
        var list;
        list = this.__listeners[eventType];
        if (!root.util.isArray(list)) {
          list = (this.__listeners[eventType] = []);
        }
        return list;
      };

      EventListener.prototype.notifyListeners = function(eventType, eventData) {
        var j, l, len, listenerList;
        this.__checkDisposeState();
        root.util.validateString(eventType, "string");
        listenerList = this.__listeners[eventType];
        if (!root.util.isArray(listenerList)) {
          return;
        }
        if (typeof eventData !== "object") {
          eventData = {};
        }
        for (j = 0, len = listenerList.length; j < len; j++) {
          l = listenerList[j];
          if (typeof l === "function") {
            l.call(this, eventData);
          }
        }
        return this;
      };

      return EventListener;

    })();
    root.Widget = Widget = (function(superClass) {
      extend(Widget, superClass);

      $.extend(Widget.prototype, EventListener.prototype);

      function Widget(parent, id, update) {
        if (id == null) {
          id = "";
        }
        if (update == null) {
          update = true;
        }
        check(parent, id);
        this.__classes = [];
        this.__listeners = {};
        this.__eventsAdded = false;
        this.__disposed = false;
        this.__id = id;
        this.__appended = false;
        this.$__parent = root.util.isJQuery(parent) ? parent : getParent(parent);
        this.__enabled = true;
        this.__tooltip = "";
        this.__showToolipWhenDisabled = false;
        registry.add(this);
        if (update) {
          this.update();
        }
      }

      Widget.prototype.__checkDisposeState = function() {
        if (this.__disposed === true) {
          throw new Error("Widget has been disposed");
        }
      };

      Widget.prototype.setEnabled = function(enabled, update) {
        if (enabled == null) {
          enabled = true;
        }
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        this.__enabled = enabled === true;
        if (update) {
          this.update();
        }
        return this;
      };

      Widget.prototype.isEnabled = function() {
        this.__checkDisposeState();
        return this.__enabled;
      };

      Widget.prototype.setTooltip = function(tooltip) {
        this.__checkDisposeState();
        if (!(typeof tooltip === "string" || typeof tooltip === "function")) {
          throw new Error("tooltip must be a function or string");
        }
        this.__tooltip = tooltip;
        return this;
      };

      Widget.prototype.getTooltip = function() {
        this.__checkDisposeState();
        return this.__tooltip;
      };

      Widget.prototype.__getTooltipElement = function() {
        return this.$__element;
      };

      Widget.prototype.__afterAppend = function() {
        var $tipElement;
        this.__appended = true;
        root.util.watch(this.$__element, "clientWidth", (function(_this) {
          return function() {
            return _this.notifyListeners(root.event.Resize, _this);
          };
        })(this));
        root.util.watch(this.$__element, "clientWidth", (function(_this) {
          return function() {
            return _this.notifyListeners(root.event.Resize, _this);
          };
        })(this));
        $tipElement = this.__getTooltipElement();
        if ($tipElement === null) {
          return;
        }
        return this.__getTooltipElement().hover(((function(_this) {
          return function() {
            return _this.__showTooltip();
          };
        })(this)), ((function(_this) {
          return function() {
            return _this.__hideTooltip();
          };
        })(this)));
      };

      Widget.prototype.showTooltipWhenDisabled = function(tooltipWhenDisabled) {
        if (tooltipWhenDisabled == null) {
          tooltipWhenDisabled = true;
        }
        this.__checkDisposeState();
        this.__showToolipWhenDisabled = tooltipWhenDisabled === true;
        return this;
      };

      Widget.prototype.tooltipShownWhenDisabled = function() {
        this.__checkDisposeState();
        return this.__showToolipWhenDisabled;
      };

      Widget.prototype.__showTooltip = function() {
        var $tipElement, docHeight, docWidth, elemTop, height, tipHeight, tipOffset, tipWidth, width, x, y;
        if (!(this.__enabled || this.__showToolipWhenDisabled)) {
          return;
        }
        docHeight = $(document).height();
        docWidth = $(document).width();
        $tipElement = this.__getTooltipElement();
        if ($tipElement === null) {
          return;
        }
        elemTop = $tipElement.offset().top;
        width = $tipElement.outerWidth();
        height = $tipElement.outerHeight();
        Widget.Tooltip.setText(typeof this.__tooltip === "string" ? this.__tooltip : this.__tooltip.call(this));
        if (Widget.Tooltip.getText().length === 0) {
          Widget.Tooltip.hide();
          return this;
        }
        Widget.Tooltip.show();
        tipHeight = Widget.Tooltip.$__element.outerHeight();
        tipWidth = Widget.Tooltip.$__element.outerWidth();
        tipOffset = 10;
        x = (function() {
          var initial;
          initial = MOUSE.page.x + tipOffset;
          if (initial + tipWidth > docWidth) {
            return MOUSE.page.x - tipWidth - tipOffset;
          } else {
            return initial;
          }
        })();
        y = (function() {
          var initial;
          initial = MOUSE.page.y + tipOffset;
          if (initial + tipHeight > docHeight) {
            return MOUSE.page.y - tipHeight - tipOffset;
          } else {
            return initial;
          }
        })();
        return Widget.Tooltip.setLocation(x, y);
      };

      Widget.prototype.__hideTooltip = function() {
        return Widget.Tooltip.hide();
      };

      Widget.prototype.__updateEnabledClass = function() {
        return this.__classIf("disabled", !this.__enabled);
      };

      Widget.prototype.__updateEnabledAttr = function($elem) {
        if ($elem == null) {
          $elem = this.$__element;
        }
        return this.__attrIf("disabled", !this.__enabled, $elem);
      };

      Widget.prototype.height = function() {
        this.__checkDisposeState();
        return this.$__element.height();
      };

      Widget.prototype.outerHeight = function() {
        this.__checkDisposeState();
        return this.$__element.outerHeight.apply(this.$__element, arguments);
      };

      Widget.prototype.innerHeight = function() {
        this.__checkDisposeState();
        return this.$__element.innerHeight();
      };

      Widget.prototype.width = function() {
        this.__checkDisposeState();
        return this.$__element.width();
      };

      Widget.prototype.outerWidth = function() {
        this.__checkDisposeState();
        return this.$__element.outerWidth.apply(this.$__element, arguments);
      };

      Widget.prototype.innerWidth = function() {
        this.__checkDisposeState();
        return this.$__element.innerWidth();
      };

      Widget.prototype.isDisposed = function() {
        return this.__disposed;
      };

      Widget.prototype.dispose = function() {
        if (this.__disposed || !this.$__element) {
          return;
        }
        this.$__element.remove();
        this.__disposed = true;
        return this.__notifyListeners(root.event.Dispose);
      };

      Widget.prototype.update = function() {};

      return Widget;

    })(CssController);
    $(document).ready(function() {
      return Widget.Tooltip = new ((function(superClass) {
        extend(_Class, superClass);

        function _Class() {
          _Class.__super__.constructor.call(this, "", "wwt_tooltip");
          this.hide();
        }

        _Class.prototype.dispose = function() {};

        _Class.prototype.isDisposed = function() {
          return false;
        };

        _Class.prototype.setText = function(text) {
          if (text == null) {
            text = "";
          }
          root.util.validateString("text", text);
          this.__text = text;
          this.update();
          return this;
        };

        _Class.prototype.getText = function() {
          return this.__text;
        };

        _Class.prototype.hide = function() {
          this.$__element.css({
            display: "none"
          });
          return this;
        };

        _Class.prototype.show = function(x, y) {
          if (typeof this.__text !== "string" || this.__text.length === 0) {
            return;
          }
          this.$__element.css({
            display: ""
          });
          this.setLocation(x, y);
          return this;
        };

        _Class.prototype.setLocation = function(x, y) {
          if (x == null) {
            x = 0;
          }
          if (y == null) {
            y = 0;
          }
          return this.$__element.css({
            left: x,
            top: y
          });
        };

        _Class.prototype.update = function() {
          if (!this.__appended) {
            this.$__element = $("<div id='" + this.__id + "'></div>").appendTo(this.$__parent);
            this.__afterAppend();
          }
          return this.$__element.html(this.__text);
        };

        return _Class;

      })(Widget));
    });
    root.Composite = Composite = (function(superClass) {
      var BodyComposite;

      extend(Composite, superClass);

      BodyComposite = (function(superClass1) {
        extend(BodyComposite, superClass1);

        function BodyComposite() {
          this.__id = "";
          this.$__element = $("body");
        }

        BodyComposite.prototype.update = function() {};

        BodyComposite.prototype.isDisposed = function() {
          return false;
        };

        BodyComposite.prototype.dispose = function() {};

        return BodyComposite;

      })(Composite);

      function Composite(parent, id) {
        Composite.__super__.constructor.call(this, parent, id);
      }

      Composite.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div id='" + this.__id + "' class='Composite'></div>").appendTo(this.$__parent);
          return this.__afterAppend();
        }
      };

      Composite.prototype.prepend = function(thingToPrepend) {
        this.__checkDisposeState();
        this.$__element.prepend(thingToPrepend);
        return this;
      };

      Composite.prototype.append = function(thingToAppend) {
        this.__checkDisposeState();
        this.$__element.append(thingToAppend);
        return this;
      };

      Composite.prototype.clear = function() {
        this.__checkDisposeState();
        this.$__element.empty();
        return this;
      };

      Composite.prototype.setContent = function(content) {
        this.__checkDisposeState();
        this.clear();
        this.append(content);
        return this;
      };

      Composite.prototype.__getTooltipElement = function() {
        return null;
      };

      root.util.defineConstant(Composite, "BODY", new BodyComposite());

      return Composite;

    })(Widget);
    root.Label = Label = (function(superClass) {
      extend(Label, superClass);

      function Label(parent, id, text) {
        if (text == null) {
          text = "";
        }
        this.setText(text, false);
        Label.__super__.constructor.call(this, parent, id);
      }

      Label.prototype.setText = function(text, update) {
        if (text == null) {
          text = "";
        }
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("text", text);
        this.__text = text;
        if (update) {
          return this.update();
        }
      };

      Label.prototype.getText = function() {
        this.__checkDisposeState();
        return this.__text;
      };

      Label.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<span id='" + this.__id + "' class='Label'>" + this.__text + "</span>").appendTo(this.$__parent);
          this.__afterAppend();
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
        }
        return this.$__element.html(this.__text);
      };

      return Label;

    })(Widget);
    root.Image = Image = (function(superClass) {
      extend(Image, superClass);

      function Image(parent, id, src) {
        if (src == null) {
          src = "";
        }
        Image.__super__.constructor.call(this, parent, id);
        this.setSrc(src);
      }

      Image.prototype.setSrc = function(src) {
        this.__checkDisposeState();
        if (typeof src !== "string") {
          return;
        }
        this.__src = src;
        return this.update();
      };

      Image.prototype.getSrc = function() {
        return this.__src;
      };

      Image.prototype.update = function() {
        if (!this.__appended) {
          this.$__element = $("<image/>").appendTo(this.$__parent);
        }
        this.$__element.attr("src", this.__src);
        return this.__cssIf({
          display: "none"
        }, {
          display: ""
        }, this.__src === "");
      };

      return Image;

    })(Widget);
    root.Button = Button = (function(superClass) {
      extend(Button, superClass);

      function Button(parent, id, title) {
        if (title == null) {
          title = "";
        }
        Button.__super__.constructor.call(this, parent, id, false);
        this.setText(title);
      }

      Button.prototype.setText = function(title, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("title", title);
        this.__title = title;
        if (!this.__forceInvisibleText) {
          this.__textInvisible = false;
        }
        if (update) {
          this.update();
        }
        return this;
      };

      Button.prototype.getText = function() {
        this.__checkDisposeState();
        return getString(this.__title);
      };

      Button.prototype.setTextInvisible = function(invisible) {
        if (invisible == null) {
          invisible = true;
        }
        this.__checkDisposeState();
        this.__textInvisible = invisible === true;
        this.update();
        return this;
      };

      Button.prototype.isTextInvisible = function() {
        return this.__textInvisible;
      };

      Button.prototype.forceInvisibleText = function(force) {
        this.__forceInvisibleText = force === true;
        return this;
      };

      Button.prototype.isInvisibleTextForced = function() {
        return this.__forceInvisibleText;
      };

      Button.prototype.getGroup = function() {
        if (this.hasGroup) {
          return this.__group;
        } else {
          return null;
        }
      };

      Button.prototype.hasGroup = function() {
        this.__checkDisposeState();
        return typeof this.__group === "object" && this.__group instanceof ButtonGroup;
      };

      Button.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<button id='" + this.__id + "' class='Button noselect'></button>").appendTo(this.$__parent);
          this.$__title = $("<span class='title'></span>").appendTo(this.$__element);
          this.__afterAppend();
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
          this.$__element.click((function(_this) {
            return function() {
              if (!_this.__enabled) {
                return;
              }
              _this.notifyListeners(root.event.Selection);
              return _this.notifyListeners(root.event.AfterSelection);
            };
          })(this));
        }
        this.__updateEnabledClass();
        this.$__title.html(this.__title);
        return this.__classIf("invisible", this.__textInvisible, this.$__title);
      };

      return Button;

    })(Widget);
    root.ToggleButton = ToggleButton = (function(superClass) {
      extend(ToggleButton, superClass);

      function ToggleButton(parent, id, title) {
        if (title == null) {
          title = "";
        }
        ToggleButton.__super__.constructor.call(this, parent, id, title);
      }

      ToggleButton.prototype.__updateStateClass = function() {
        if (this.__state) {
          this.$__element.removeClass("state-out");
          return this.$__element.addClass("state-in");
        } else {
          this.$__element.removeClass("state-in");
          return this.$__element.addClass("state-out");
        }
      };

      ToggleButton.prototype.setState = function(state, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateBoolean("state", state);
        this.__state = state;
        if (update) {
          this.update();
        }
        return this;
      };

      ToggleButton.prototype.getState = function() {
        this.__checkDisposeState();
        return this.__state;
      };

      ToggleButton.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<button id='" + this.__id + "' class='ToggleButton noselect state-" + (this.__state ? "in" : "out") + "'></button>").appendTo(this.$__parent);
          this.$__title = $("<span class='title'></span>").appendTo(this.$__element);
          this.__afterAppend();
          this.$__element.hover((function(_this) {
            return function() {
              return root.event.Hover;
            };
          })(this));
          this.$__element.click((function(_this) {
            return function() {
              var event;
              if (!_this.__enabled) {
                return;
              }
              event = {
                state: !_this.__state,
                canceled: false
              };
              _this.notifyListeners(root.event.Selection, event);
              if (event.canceled === true) {
                return;
              }
              _this.__state = !_this.__state;
              return _this.update();
            };
          })(this));
        }
        this.__updateEnabledClass();
        this.__updateStateClass();
        return this.$__title.html(this.__title);
      };

      return ToggleButton;

    })(Button);
    root.ButtonGroup = ButtonGroup = (function(superClass) {
      extend(ButtonGroup, superClass);

      function ButtonGroup(parent, id, toggle) {
        if (toggle == null) {
          toggle = false;
        }
        this.__buttons = [];
        this.__toggle = typeof toggle === "boolean" ? toggle : false;
        ButtonGroup.__super__.constructor.call(this, parent, id);
      }

      ButtonGroup.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div id='" + this.__id + "' class='ButtonGroup'></div>").appendTo(this.$__parent);
          return this.__afterAppend();
        }
      };

      ButtonGroup.prototype.addButton = function(id, title) {
        var button;
        if (title == null) {
          title = "";
        }
        this.__checkDisposeState();
        button = new (this.__toggle ? ToggleButton : Button)(this.$__element, id, title);
        button.__group = this;
        this.__buttons.push(button);
        return button.setEnabled(this.__enabled);
      };

      ButtonGroup.prototype.getButton = function(index) {
        this.__checkDisposeState();
        indexCheck(this.__buttons, index);
        return this.__buttons[index];
      };

      ButtonGroup.prototype.removeButton = function(index) {
        this.__checkDisposeState();
        indexCheck(this.__buttons, index);
        this.__buttons.splice(index, 1);
        return this;
      };

      ButtonGroup.prototype.getButtons = function() {
        this.__checkDisposeState();
        return this.__buttons.slice(0);
      };

      ButtonGroup.prototype.isToggle = function() {
        this.__checkDisposeState();
        return this.__toggle;
      };

      ButtonGroup.prototype.__getTooltipElement = function() {
        return null;
      };

      ButtonGroup.prototype.setEnabled = function(enabled) {
        var b, j, len, ref;
        this.__checkDisposeState();
        ButtonGroup.__super__.setEnabled.call(this, enabled, false);
        ref = this.__buttons;
        for (j = 0, len = ref.length; j < len; j++) {
          b = ref[j];
          b.setEnabled(enabled);
        }
        return this;
      };

      return ButtonGroup;

    })(Widget);
    root.Text = Text = (function(superClass) {
      var getAttributes, getCurrentText;

      extend(Text, superClass);

      getAttributes = function(text) {
        return "id='" + text.__id + "' class='Text" + (text.isMulti() ? "Area" : "") + "' placeholder='" + (text.getPlaceholder()) + "'";
      };

      getCurrentText = function(multi, element) {
        if (multi) {
          return element.text();
        } else {
          return element.val();
        }
      };

      function Text(parent, id, type) {
        if (type == null) {
          type = "";
        }
        root.util.validateString("type", type);
        this.__type = $.inArray(type, ["multi", "password"] >= 0) ? type : "";
        this.__text = "";
        Text.__super__.constructor.call(this, parent, id);
      }

      Text.prototype.setPlaceholder = function(placeholder, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("placeholder", placeholder);
        this.__placeholder = placeholder;
        if (update) {
          this.update();
        }
        return this;
      };

      Text.prototype.getPlaceholder = function() {
        this.__checkDisposeState();
        return getString(this.__placeholder);
      };

      Text.prototype.setText = function(text, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("text", text);
        this.__text = text;
        if (update) {
          this.update();
        }
        return this;
      };

      Text.prototype.getText = function() {
        this.__checkDisposeState();
        return this.__text;
      };

      Text.prototype.isMulti = function() {
        this.__checkDisposeState();
        return this.__type === "multi";
      };

      Text.prototype.isPassword = function() {
        this.__checkDisposeState();
        return this.__type === "password";
      };

      Text.prototype.isNormal = function() {
        return !(this.isMulti() || this.isPassword());
      };

      Text.prototype.getCarsetPosition = function() {
        var e, length, pos, sel;
        pos = 0;
        e = this.$__element[0];
        if (document.selection) {
          e.focus();
          sel = document.selection.createRange();
          length = sel.text.length;
          sel.moveStart("character", -(getCurrentText(this.isMulti(), this.$__element).length));
          pos = sel.text.length - length;
        } else if (e.selectionStart) {
          pos = Math.min(e.selectionStart, e.selectionEnd);
        }
        return pos;
      };

      Text.prototype.setCaretPosition = function(pos) {
        var e, range;
        e = this.$__element[0];
        if (e.setSelectionRange) {
          return e.setSelectionRange(pos, pos);
        } else if (e.createTextRange) {
          range = e.createTextRange();
          range.collapse(true);
          if (pos < 0) {
            pos = this.getCurrentText.length + pos;
            range.moveStart("character", pos);
            range.moveEnd("character", pos);
            return range.select();
          }
        }
      };

      Text.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = this.isMulti() ? $("<textarea " + (getAttributes(this)) + "'></textarea>") : $("<input type='" + (this.isPassword() ? "password" : "text") + "' " + (getAttributes(this)) + "/>");
          this.$__element.appendTo(this.$__parent);
          this.__afterAppend();
          this.$__element.focus(function() {
            return $(this).attr("placeholder", "");
          });
          this.$__element.blur((function(_this) {
            return function(e) {
              return $(e.target).attr("placeholder", _this.getPlaceholder());
            };
          })(this));
          this.$__element.on("input", (function(_this) {
            return function() {
              var cachedLength, caret, currentLength, event;
              event = {
                value: getCurrentText(_this.isMulti(), _this.$__element),
                canceled: false
              };
              _this.notifyListeners(root.event.Modify, event);
              if (event.canceled) {
                caret = _this.getCarsetPosition();
                cachedLength = _this.__text.length;
                currentLength = getCurrentText(_this.isMulti(), _this.$__element).length;
                caret -= Math.max(cachedLength, currentLength) - Math.min(cachedLength, currentLength);
                _this.setText(_this.__text);
                _this.setCaretPosition(caret);
              } else {
                _this.__text = getCurrentText(_this.isMulti(), _this.$__element);
              }
              if (!event.canceled) {
                return _this.notifyListeners(root.event.AfterModify);
              }
            };
          })(this));
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
        }
        this.__updateEnabledClass();
        if (this.isMulti()) {
          this.$__element.text(this.getText());
        } else {
          this.$__element.val(this.getText());
        }
        this.$__element.attr("placeholder", this.getPlaceholder());
        return this.__updateEnabledAttr();
      };

      Text.prototype.setResize = function(resize) {
        this.__checkDisposeState();
        this.$__element.removeClass("no-resize resize-v resize-h resize-all");
        if (resize === "none" || resize === false) {
          return this.$__element.addClass("no-resize");
        } else if (resize === "all" || resize === "*" || resize === "both" || resize === true) {
          return this.$__element.addClass("resize-all");
        } else if (typeof resize === "object") {
          if (resize.h && !resize.v) {
            return this.$__element.addClass("resize-h");
          } else if (resize.v && !resize.h) {
            return this.$__element.addClass("resize-v");
          } else if (resize.v && resize.h) {
            return this.$__element.addClass("resize-all");
          } else if (!resize.h && !resize.v) {
            return this.$__element.addClass("no-resize");
          }
        }
      };

      return Text;

    })(Widget);
    root.Spinner = Spinner = (function(superClass) {
      var __testInputAllowed;

      extend(Spinner, superClass);

      function Spinner(parent, id, num) {
        if (num == null) {
          num = 0;
        }
        Spinner.__super__.constructor.call(this, parent, id, false);
        this.setValue(num);
        this.__min = Number.NEGATIVE_INFINITY;
        this.__max = Number.POSATIVE_INFINITY;
        this.__interval = 1;
      }

      Spinner.prototype.setDecimalAllowed = function() {
        this.__checkDisposeState();
        this.__allowDecimal = allowDecimal === true;
        return this;
      };

      Spinner.prototype.isDecimalAllowed = function() {
        this.__checkDisposeState();
        return this.__allowDecimal;
      };

      __testInputAllowed = function(input, allowDecimal) {
        if (!allowDecimal && !Number.isInteger(input)) {
          throw new Error("decimals are not allowed for this Spinner");
        }
      };

      Spinner.prototype.setInterval = function(interval) {
        this.__checkDisposeState();
        root.util.validateNumber("interval", interval);
        __testInputAllowed(interval, this.__allowDecimal);
        if (interval === 0) {
          throw new Error("interval cannot be 0");
        }
        this.__interval = interval;
        return this;
      };

      Spinner.prototype.getInterval = function() {
        this.__checkDisposeState();
        return this.__interval;
      };

      Spinner.prototype.setMinimum = function(min) {
        this.__checkDisposeState();
        root.util.validateNumber("min", min);
        __testInputAllowed(min, this.__allowDecimal);
        if (min > this.__max) {
          throw new Error("Given minimum (" + min + ") cannot more than the current maximum (" + this.__max + ")");
        }
        this.__min = min;
        this.setValue(this.__num);
        return this;
      };

      Spinner.prototype.getMinimum = function() {
        this.__checkDisposeState();
        return this.__min;
      };

      Spinner.prototype.setMaximum = function(max) {
        this.__checkDisposeState();
        root.util.validateNumber("max", max);
        __testInputAllowed(max, this.__allowDecimal);
        if (max < this.__min) {
          throw new Error("Given maximum (" + max + ") cannot less than the current minimum (" + this.__min + ")");
        }
        this.__max = max;
        this.setValue(this.__num);
        return this;
      };

      Spinner.prototype.getMaximum = function() {
        this.__checkDisposeState();
        return this.__max;
      };

      Spinner.prototype.setValue = function(num, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateNumber("num", num);
        __testInputAllowed(num, this.__allowDecimal);
        this.__num = num < this.__min ? this.__min : num > this.__max ? this.__max : num;
        if (update) {
          this.update();
        }
        return this;
      };

      Spinner.prototype.getValue = function() {
        this.__checkDisposeState();
        return this.__num;
      };

      Spinner.prototype.increment = function(steps) {
        if (steps == null) {
          steps = 1;
        }
        this.__checkDisposeState();
        root.util.validateInt("steps", steps);
        return this.setValue(this.__num + (steps * this.__interval), true);
      };

      Spinner.prototype.decrement = function(steps) {
        if (steps == null) {
          steps = 1;
        }
        this.__checkDisposeState();
        root.util.validateInt("steps", steps);
        return this.setValue(this.__num - (steps * this.__interval), true);
      };

      Spinner.prototype.update = function() {
        var fireEvent, hookEvents, intervalId, updateInterval;
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div id='" + this.__id + "' class='Spinner'></div>").appendTo(this.$__parent);
          this.$__number = $("<input type='text' class='Text SpinnerNumber'/>").appendTo(this.$__element);
          this.$__buttonContainer = $("<div class='SpinnerButtonsContainer'></div>").appendTo(this.$__element);
          this.$__upButton = $("<div class='SpinnerIncrement'><div class='SpinnerUpArrow'></div></div>").appendTo(this.$__buttonContainer);
          this.$__downButton = $("<div class='SpinnerDecrement'><div class='SpinnerDownArrow'></div></div>").appendTo(this.$__buttonContainer);
          this.__afterAppend();
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
          intervalId = 0;
          updateInterval = 100;
          fireEvent = (function(_this) {
            return function(num, increment, arrow) {
              var event, fire;
              event = {
                value: num + increment,
                arrow: arrow,
                canceled: false
              };
              fire = function() {
                event.canceled = false;
                _this.notifyListeners(root.event.Modify, event);
                if (event.canceled === true) {
                  return false;
                }
                if (typeof event.value === "number") {
                  _this.setValue(event.value);
                }
                _this.notifyListeners(root.event.AfterModify, {
                  arrow: event.arrow
                });
                return true;
              };
              if (!fire()) {
                return;
              }
              return intervalId = window.setInterval(function() {
                event.value += increment;
                return fire();
              }, updateInterval);
            };
          })(this);
          hookEvents = (function(_this) {
            return function(increment) {
              var $e;
              $e = increment ? _this.$__upButton : _this.$__downButton;
              return $e.mousedown(function() {
                if (!_this.isEnabled()) {
                  return;
                }
                return fireEvent(_this.__num, (increment ? _this.__interval : -_this.__interval), increment ? 0 : 1);
              }).mouseup(function() {
                if (!_this.isEnabled()) {
                  return;
                }
                return window.clearInterval(intervalId);
              });
            };
          })(this);
          hookEvents(true);
          hookEvents(false);
          this.$__number.on("input", (function(_this) {
            return function(e) {
              var event, newNum, numString, zeroAlias;
              numString = _this.$__number.val();
              newNum = null;
              zeroAlias = numString === "." || numString === "-" || numString === "";
              if (zeroAlias) {
                newNum = 0;
              } else {
                newNum = Number(numString);
                if (Number.isNaN(newNum) || newNum < _this.__min || newNum > _this.__max) {
                  _this.$__number.val(_this.__num);
                  return;
                }
              }
              event = {
                value: newNum,
                arrow: false,
                canceled: false
              };
              _this.notifyListeners(root.event.Modify, event);
              if (event.canceled === true) {
                _this.$__number.val(_this.__num);
                return;
              } else {
                _this.__num = typeof event.value === "number" ? event.value : newNum;
                _this.__updateClassAndAttr(!zeroAlias);
              }
              return _this.notifyListeners(root.event.AfterModify, {
                arrow: event.arrow
              });
            };
          })(this));
        }
        this.__updateClassAndAttr(true);
        return this;
      };

      Spinner.prototype.__updateClassAndAttr = function(number) {
        this.__updateEnabledClass();
        if (number) {
          this.$__number.val(this.__num);
        }
        return this.__updateEnabledAttr(this.$__number);
      };

      return Spinner;

    })(Widget);
    Switch = (function(superClass) {
      var labelHtml, switchHtml;

      extend(Switch, superClass);

      switchHtml = "<span class='outer'><span class='inner'></span></span>";

      labelHtml = function(left, text) {
        return "" + (left ? switchHtml : "") + text + (!left ? switchHtml : "");
      };

      function Switch(parent, id) {
        if (this.__classname == null) {
          this.__classname = "Switch";
        }
        if (this.__inputType == null) {
          this.__inputType = "checkbox";
        }
        if (this.__labelOnLeft == null) {
          this.__labelOnLeft = false;
        }
        this.setState(false, false);
        Switch.__super__.constructor.call(this, parent, id);
      }

      Switch.prototype.setState = function(state, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        this.__state = state === true;
        if (update) {
          this.update();
        }
        return this;
      };

      Switch.prototype.getState = function() {
        this.__checkDisposeState();
        return getBoolean(this.__state);
      };

      Switch.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div class='" + this.__classname + "Container'></div>").appendTo(this.$__parent);
          this.$__input = $("<input id='" + this.__id + "' class='" + this.__classname + "' type='" + this.__inputType + "' " + (this.__state ? "checked" : "") + "/>").appendTo(this.$__element);
          this.$__label = $("<label class='noselect' for='" + this.__id + "'>" + (labelHtml(this.__labelOnLeft, this.getText())) + "</label>").appendTo(this.$__element);
          this.__afterAppend();
          this.$__input.change((function(_this) {
            return function() {
              var event;
              event = {
                state: _this.$__input.prop("checked"),
                canceled: false
              };
              _this.notifyListeners(root.event.Selection, event);
              if (event.canceled === true) {
                _this.$__input.prop("checked", _this.__state);
              } else {
                _this.__state = _this.$__input.prop("checked");
                _this.notifyListeners(root.event.AfterSelection);
              }
            };
          })(this));
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
        }
        this.__updateEnabledClass();
        this.$__label.html("" + (labelHtml(this.__labelOnLeft, this.getText())));
        this.__updateEnabledAttr(this.$__input);
        this.$__input.prop("checked", this.__state);
        return this;
      };

      return Switch;

    })(Widget);
    root.Check = Check = (function(superClass) {
      extend(Check, superClass);

      function Check(parent, id, text) {
        if (text == null) {
          text = "";
        }
        if (this.__classname == null) {
          this.__classname = "Check";
        }
        this.__labelOnLeft = true;
        Check.__super__.constructor.call(this, parent, id);
        this.setText(text);
      }

      Check.prototype.setText = function(text, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("text", text);
        this.__text = text;
        if (update) {
          this.update();
        }
        return this;
      };

      Check.prototype.getText = function() {
        this.__checkDisposeState();
        return getString(this.__text);
      };

      return Check;

    })(Switch);
    root.Radio = Radio = (function(superClass) {
      extend(Radio, superClass);

      function Radio(parent, id, text) {
        if (text == null) {
          text = "";
        }
        this.__classname = "Radio";
        this.__inputType = "radio";
        Radio.__super__.constructor.call(this, parent, id, text);
      }

      Radio.prototype.setGroup = function(group, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("group", group);
        this.__group = group;
        if (update) {
          this.update();
        }
        return this;
      };

      Radio.prototype.getGroup = function() {
        this.__checkDisposeState();
        return getString(this.__group);
      };

      return Radio;

    })(Check);
    AbstractItemList = (function(superClass) {
      extend(AbstractItemList, superClass);

      function AbstractItemList(parent, id, __itemClassName, $__itemContainerElement, __unique) {
        this.__itemClassName = __itemClassName;
        this.$__itemContainerElement = $__itemContainerElement;
        this.__unique = __unique != null ? __unique : false;
        this.__items = [];
        AbstractItemList.__super__.constructor.call(this, parent, id);
      }

      AbstractItemList.prototype.addItem = function(item, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        if (typeof item === "string" && (!(this.__unique && this.hasItem(item)))) {
          this.__items.push(item);
          if (update) {
            return this.update();
          }
        }
      };

      AbstractItemList.prototype.setItems = function(items, update) {
        var item, j, len;
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateArray("items", items);
        this.__items.splice(0);
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          this.addItem(item, false);
        }
        this.__itemsChanged = true;
        if (update) {
          this.update();
        }
        return this;
      };

      AbstractItemList.prototype.getItems = function() {
        this.__checkDisposeState();
        return this.__items.slice(0);
      };

      AbstractItemList.prototype.removeItem = function(item, update) {
        var index;
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("item", item);
        index = $.inArray(item, this.__items);
        if (index > -1) {
          this.__types.slice(index(1));
          this.__itemsChanged = true;
          if (update) {
            return this.update();
          }
        }
      };

      AbstractItemList.prototype.hasItem = function(item) {
        this.__checkDisposeState();
        return this.indexOf(item) > -1;
      };

      AbstractItemList.prototype.indexOf = function(item) {
        this.__checkDisposeState();
        if (typeof item !== "string") {
          return -1;
        }
        return $.inArray(item, this.__items);
      };

      AbstractItemList.prototype.__append = function() {};

      AbstractItemList.prototype.update = function() {
        var item, j, len, ref;
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__parent.append(this.$__element);
          this.__append();
          this.__afterAppend();
        }
        if (this.__itemsChanged) {
          this.$__itemContainerElement.find("." + this.__itemClassName).remove();
          ref = this.__items;
          for (j = 0, len = ref.length; j < len; j++) {
            item = ref[j];
            this.$__itemContainerElement.append(this.__renderItem(item));
          }
        }
        return this.__updateEnabledClass();
      };

      return AbstractItemList;

    })(Widget);
    root.List = List = (function(superClass) {
      extend(List, superClass);

      function List(parent, id, items) {
        if (items == null) {
          items = [];
        }
        this.__lastSelected = -1;
        this.__hScroll = true;
        this.$__element = $("<div id='" + id + "' class='List'></div>");
        List.__super__.constructor.call(this, parent, id, "ListItem", this.$__element);
        this.setItems(items);
      }

      List.prototype.setMultiSelect = function(multi) {
        this.__checkDisposeState();
        this.__multi = multi === true;
        if (!this.__multi) {
          setItemSelected(this.__lastSelected);
        }
        return this;
      };

      List.prototype.isMultiSelect = function() {
        this.__checkDisposeState();
        return this.__multi;
      };

      List.prototype.setItems = function(items, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        this.__selected = [];
        return List.__super__.setItems.call(this, items, update);
      };

      List.prototype.getSelectedItems = function() {
        var i, j, len, ref;
        this.__checkDisposeState();
        ref = this.__selected;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if ((this.__items.length > i && i > 0)) {
            return;
          }
        }
      };

      List.prototype.getLastSelectedItem = function() {
        this.__checkDisposeState();
        return this.__lastSelected;
      };

      List.prototype.setItemSelected = function(item, selected) {
        var index, isSelected;
        if (selected == null) {
          selected = true;
        }
        this.__checkDisposeState();
        index = -1;
        if (typeof item === "string") {
          index = $.inArray(item, this.__items);
        } else if (typeof item === "number") {
          index = item;
        } else {
          throw new Error("item must be a string or number");
        }
        if (index < 0) {
          return;
        }
        isSelected = this.isSelected(index);
        if (selected && !this.__multi) {
          this.deselectAll();
        }
        if (selected && !isSelected) {
          this.__selected.push(item);
        }
        if (!selected) {
          this.__selected.splice($.inArray(index, this.__selected), 1);
        }
        this.__selectionChanged = true;
        this.update();
        return this;
      };

      List.prototype.toggleItemSelected = function(item) {
        this.__checkDisposeState();
        return this.setItemSelected(item, !this.isSelected(item));
      };

      List.prototype.isSelected = function(item) {
        var index;
        this.__checkDisposeState();
        if (typeof item === "number") {
          return $.inArray(item, this.__selected) > -1;
        } else if (typeof item === "string") {
          index = $.inArray(item, this.items);
          return index > -1 && $.inArray(index, this.__selected) > -1;
        } else {
          return false;
        }
      };

      List.prototype.setSelectedItems = function(items, update) {
        var item, j, len;
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        if (!this.__multi) {
          throw new Error("list is not multi select");
        }
        this.__selectionChanged = true;
        this.__selected = [];
        root.util.validateArray("items", items);
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          this.setItemSelected(item);
        }
        if (update) {
          this.update();
        }
        return this;
      };

      List.prototype.getSelectedIndices = function() {
        this.__checkDisposeState();
        return this.__selected.slice(0);
      };

      List.prototype.selectAll = function() {
        var item, j, len, ref, results;
        this.__checkDisposeState();
        ref = this.__items;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          item = ref[j];
          results.push(this.setItemSelected(item, selected));
        }
        return results;
      };

      List.prototype.deselectAll = function() {
        this.__checkDisposeState();
        this.__selected.splice(0);
        return this.__selectionChanged = true;
      };

      List.prototype.__renderItem = function(item) {
        return "<div class='" + this.__itemClassName + " noselect'>" + item + "</div>";
      };

      List.prototype.__append = function() {
        return this.$__element.mouseenter((function(_this) {
          return function() {
            return _this.notifyListeners(root.event.Hover);
          };
        })(this));
      };

      List.prototype.update = function() {
        this.__checkDisposeState();
        List.__super__.update.apply(this, arguments);
        if (this.__itemsChanged) {
          this.$__element.find(".ListItem").click((function(_this) {
            return function(e) {
              var allSelected, currentIndex, event, fireEvent, index, indices, item, j, len, len1, len2, m, n, o, ref, ref1, ref2, results;
              currentIndex = $(e.target).index();
              fireEvent = function(indices) {
                var event;
                event = {
                  index: indices[0],
                  indices: indices,
                  canceled: false
                };
                _this.notifyListeners(root.event.Selection, event);
                return event;
              };
              ({
                afterEvent: function(e) {
                  return this.notifyListeners(root.event.AfterSelection, {
                    index: e.index,
                    indices: e.indices
                  });
                }
              });
              if ((NATIVE_LAF === "aqua" && e.metaKey) || (NATIVE_LAF !== "aqua" && e.ctrlKey)) {
                event = fireEvent([currentIndex]);
                if (event.canceled === true) {
                  return;
                }
                if (root.util.isArray(event.indices)) {
                  ref = event.indices;
                  for (j = 0, len = ref.length; j < len; j++) {
                    index = ref[j];
                    _this.toggleItemSelected(index);
                  }
                }
                afterEvent(event);
              } else if (e.shiftKey) {
                allSelected = true;
                indices = (function() {
                  results = [];
                  for (var m = ref1 = _this.__lastSelected; ref1 <= currentIndex ? m <= currentIndex : m >= currentIndex; ref1 <= currentIndex ? m++ : m--){ results.push(m); }
                  return results;
                }).apply(this);
                for (n = 0, len1 = indices.length; n < len1; n++) {
                  item = indices[n];
                  allSelected = allSelected && _this.isSelected(item);
                  if (!allSelected) {
                    break;
                  }
                }
                event = fireEvent(indices);
                if (event.canceled === true) {
                  return;
                }
                if (root.util.isArray(event.indices)) {
                  ref2 = event.indices;
                  for (o = 0, len2 = ref2.length; o < len2; o++) {
                    item = ref2[o];
                    _this.setItemSelected(item, !allSelected);
                  }
                }
                afterEvent(event);
              } else {
                event = fireEvent([currentIndex]);
                if (event.canceled === true) {
                  return;
                }
                _this.deselectAll();
                _this.toggleItemSelected(currentIndex);
                afterEvent(event);
              }
              return _this.__lastSelected = currentIndex;
            };
          })(this));
          this.__itemsChanged = false;
        }
        if (this.__selectionChanged) {
          this.$__element.find(".ListItem").each((function(_this) {
            return function(i, e) {
              var $e;
              $e = $(e);
              if (_this.isSelected(i)) {
                return $e.addClass("selected");
              } else {
                return $e.removeClass("selected");
              }
            };
          })(this));
          return this.__selectionChanged = false;
        }
      };

      return List;

    })(AbstractItemList);
    root.Combo = Combo = (function(superClass) {
      extend(Combo, superClass);

      function Combo(parent, id, editable) {
        if (editable == null) {
          editable = false;
        }
        this.__editable = editable === true;
        this.__hideSelectedItem = this.__editable;
        this.__lastSelectedItem = -1;
        if (this.__editable) {
          this.$__element = $("<div class='ComboEditable'></div>");
          this.$__textfield = $("<input type='text' class='Text'/>").appendTo(this.$__element);
          this.$__button = $("<div class='ComboEditableButtonContainer'> <div class='ComboEditableButton'> <span class='ComboEditableArrowContainer'><span class='down-arrow'></span></span> </div> </div>").appendTo(this.$__element);
        } else {
          this.$__element = $("<button id='" + id + "' class='Combo'><span class='title'>" + this.__text + "</span> <div class='arrow-container'> <div class='arrow-up-container'> <div class='arrow-up'></div> </div> <div class='arrow-down-container'> <div class='arrow-down'></div> </div> </div> </button>");
        }
        this.__listOverlayed = !this.__editable && options.getLookAndFeel() !== "win";
        Combo.__super__.constructor.call(this, parent, id, "ComboItem", $("<ul class='ComboItemList hidden'></ul>"), true);
        if (this.__listOverlayed) {
          this.$__itemContainerElement.addClass("overlayed");
        }
      }

      Combo.prototype.__renderItem = function(item) {
        return "<li class='" + this.__itemClassName + "'>" + item + "</li>";
      };

      Combo.prototype.setText = function(text, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("text", text);
        this.__text = text;
        if (update) {
          this.update();
        }
        return this;
      };

      Combo.prototype.getText = function() {
        this.__checkDisposeState();
        return this.__text;
      };

      Combo.prototype.setHideSelected = function(hideSelected) {
        if (hideSelected == null) {
          hideSelected = true;
        }
        this.__checkDisposeState();
        if (this.__editable) {
          return this.__hideSelectedItem = hideSelected === true;
        }
      };

      Combo.prototype.getHideSelected = function() {
        this.__checkDisposeState();
        return this.__hideSelectedItem;
      };

      Combo.prototype.setEnabled = function(enabled) {
        if (enabled == null) {
          enabled = true;
        }
        Combo.__super__.setEnabled.apply(this, arguments);
        if (this.__editable) {
          this.__updateEnabledAttr(this.$__textfield);
        }
        return this;
      };

      Combo.prototype.__hide = function() {
        this.$__element.removeClass("listShown");
        this.$__itemContainerElement.addClass("hidden");
        return this.__listVisible = false;
      };

      Combo.prototype.__show = function() {
        this.$__element.addClass("listShown");
        this.$__itemContainerElement.removeClass("hidden");
        return this.__listVisible = true;
      };

      Combo.prototype.__append = function() {
        var justShown, onHover;
        $("body").append(this.$__itemContainerElement);
        this.__listVisible = false;
        justShown = false;
        (!this.__editable ? this.$__element : this.$__button).click((function(_this) {
          return function(e) {
            var borderTop, bottomBorderWith, css, currIndex, currItem, docHeight, docWidth, elemPos, event, itemListBorderWidth, listHeight, listTop, offset;
            if (!_this.isEnabled() || _this.__items.length === 0) {
              return;
            }
            if (typeof Combo.__CURRENT__ === "object" && Combo.__CURRENT__ instanceof Combo) {
              Combo.__CURRENT__.__hide();
            }
            e.stopPropagation();
            Combo.__CURRENT__ = _this;
            if (_this.__listVisible) {
              _this.__hide();
              return;
            }
            listTop = 0;
            _this.$__itemContainerElement.children().each(function(i, e) {
              var $e;
              $e = $(e);
              if ($e.text() === _this.__text && _this.__hideSelectedItem) {
                return $e.addClass("selected");
              } else {
                return $e.removeClass("selected");
              }
            });
            docHeight = $(document).outerHeight();
            docWidth = $(document).outerWidth();
            if (_this.__editable) {
              event = {
                canceled: false
              };
              _this.notifyListeners(root.event.Show, event);
              if (event.canceled === true) {
                return;
              }
            }
            _this.__show();
            itemListBorderWidth = _this.$__itemContainerElement.outerWidth() - _this.$__itemContainerElement.innerWidth();
            _this.$__itemContainerElement.css({
              width: _this.$__element.outerWidth() - itemListBorderWidth
            });
            elemPos = _this.$__element.offset();
            if (_this.__listOverlayed) {
              currIndex = 0;
              currItem = null;
              offset = 0;
              _this.$__itemContainerElement.children().each(function(i, e) {
                var $item;
                $item = $(e);
                if (currIndex === _this.__lastSelectedItem || (_this.__lastSelectedItem === -1 && $item.text() === _this.__text)) {
                  currItem = $item;
                  return false;
                } else {
                  if (!$item.hasClass("selected")) {
                    offset += $item.outerHeight();
                  }
                }
                return currIndex++;
              });
              borderTop = _this.$__itemContainerElement.css("border-top-width");
              listTop = (elemPos.top - offset) - parseInt(borderTop.substring(0, borderTop.length - 2), 10);
            } else {
              listTop = elemPos.top + _this.$__element.outerHeight();
            }
            css = {
              left: elemPos.left,
              top: listTop < 0 ? _this.$__element.css("border-top-width") : listTop,
              height: "",
              "max-height": "50%"
            };
            _this.$__itemContainerElement.css(css);
            listTop = _this.$__itemContainerElement.offset().top;
            listHeight = _this.$__itemContainerElement.outerHeight();
            if (listTop + listHeight > docHeight) {
              bottomBorderWith = _this.$__itemContainerElement.css("border-bottom-width");
              _this.$__itemContainerElement.css({
                height: (listHeight - ((listTop + listHeight) - docHeight)) - 5
              });
              return _this.$__itemContainerElement.css({
                left: _this.$__element.offset().left
              });
            }
          };
        })(this));
        this.$__itemContainerElement.delegate("li", "click", (function(_this) {
          return function(e) {
            var $e, index, selectionEvent, text;
            $e = $(e.target);
            text = $e.text();
            index = $e.index();
            selectionEvent = {
              selection: text,
              index: index,
              canceled: false
            };
            _this.notifyListeners(root.event.Selection, selectionEvent);
            if (selectionEvent.canceled === true) {
              return;
            }
            _this.notifyListeners(root.event.AfterSelection, {
              index: selectionEvent.index
            });
            _this.setText(selectionEvent.selection);
            _this.__lastSelectedItem = index;
            return _this.__hide();
          };
        })(this));
        if (this.__editable) {
          this.$__textfield.on("input", (function(_this) {
            return function() {
              var event;
              event = {
                value: _this.$__textfield.val(),
                canceled: false
              };
              _this.notifyListeners(root.event.Modify, event);
              if (event.canceled === true) {
                return _this.$__textfield.val(_this.__text);
              } else {
                return _this.__text = event.value;
              }
            };
          })(this));
        }
        if (this.__editable) {
          onHover = (function(_this) {
            return function(part) {
              var event;
              event = {
                part: part
              };
              return _this.notifyListeners(root.event.Hover, event);
            };
          })(this);
          this.$__textfield.mouseenter((function(_this) {
            return function() {
              return onHover("textbox");
            };
          })(this));
          this.$__button.mouseenter((function(_this) {
            return function() {
              return onHover("button");
            };
          })(this));
        } else {
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
        }
        return $("body").click((function(_this) {
          return function() {
            if (!justShown) {
              _this.__hide();
            }
            return null;
          };
        })(this));
      };

      Combo.prototype.update = function() {
        Combo.__super__.update.apply(this, arguments);
        this.__hide();
        if (!this.__editable) {
          return this.$__element.find(".title").text(this.__text);
        } else {
          return this.$__textfield.val(this.__text);
        }
      };

      Combo.prototype.dispose = function() {
        if (this.__disposed || !this.$__element) {
          return;
        }
        this.$__itemContainerElement.remove();
        return Combo.__super__.dispose.apply(this, arguments);
      };

      return Combo;

    })(AbstractItemList);
    root.Table = Table = (function(superClass) {
      var Header, Row, add, get, makeHeader, makeRow, remove, set;

      extend(Table, superClass);

      root.util.defineConstant(Table, "Header", Header = (function(superClass1) {
        extend(Header, superClass1);

        function Header(value, id) {
          if (id == null) {
            id = "";
          }
          Header.__super__.constructor.call(this, $("<th class='TableHeader noselect'></th>"), id);
          this.setValue(value);
        }

        Header.prototype.setValue = function(value) {
          root.util.validateString("value", value);
          this.__value = value;
          this.$__element.text(this.__value);
          return this;
        };

        Header.prototype.getValue = function() {
          return this.__value;
        };

        return Header;

      })(CssController));

      root.util.defineConstant(Table, "Row", Row = (function(superClass1) {
        var Value, makeValue;

        extend(Row, superClass1);

        root.util.defineConstant(Row, "Value", Value = (function(superClass2) {
          extend(Value, superClass2);

          function Value(value, id) {
            if (id == null) {
              id = "";
            }
            Value.__super__.constructor.call(this, $("<td class='TableRowValue'></td>"), id);
            this.setValue(value);
          }

          Value.prototype.setValue = function(value) {
            if (typeof value !== "string" && typeof value !== "number") {
              throw new Error("value must be a string or a number");
            }
            this.__value = value;
            this.$__element.text(this.__value);
            return this;
          };

          Value.prototype.getValue = function() {
            return this.__value;
          };

          return Value;

        })(CssController));

        makeValue = function(value) {
          if (value instanceof Value) {
            return value;
          } else {
            if (typeof value === "string" || typeof value === "number") {
              return new Value(value);
            } else {
              return null;
            }
          }
        };

        function Row(values, id) {
          var j, len, v, v_;
          if (id == null) {
            id = "";
          }
          root.util.validateArray("values", values);
          this.__values = [];
          for (j = 0, len = values.length; j < len; j++) {
            v = values[j];
            if ((v_ = makeValue(v)) instanceof Value) {
              this.__values.push(v_);
            }
          }
          Row.__super__.constructor.call(this, $("<tr class='TableRow'></tr>"), id);
        }

        Row.prototype.setValue = function(index, value) {
          root.util.validateInt("index", index);
          if (!value instanceof Value) {
            if (typeof value !== "string" && typeof value !== "number") {
              throw new Error("value must be an instance of Table.Row.Value, a string, or a number");
            }
            value = new Value(value);
          }
          this.__values[index] = value;
          return this;
        };

        Row.prototype.getValue = function(index) {
          if (index === null) {
            return this.getValues();
          }
          root.util.validateInt("index", index);
          return this.__values[index];
        };

        Row.prototype.getValues = function() {
          var arr, j, len, ref, v;
          arr = [];
          ref = this.__values;
          for (j = 0, len = ref.length; j < len; j++) {
            v = ref[j];
            if (v instanceof Value) {
              arr.push(v);
            }
          }
          return arr;
        };

        Row.prototype.__getValues = function() {
          var arr, j, len, ref, v;
          arr = [];
          ref = this.__values;
          for (j = 0, len = ref.length; j < len; j++) {
            v = ref[j];
            arr.push(v instanceof Value ? v : $("<td></td>"));
          }
          return arr;
        };

        return Row;

      })(CssController));

      function Table(parent, id) {
        this.__headers = [];
        this.__rows = [];
        Table.__super__.constructor.call(this, parent, id);
      }

      Table.prototype.getHeaders = function() {
        var arr, header, j, len, ref;
        this.__checkDisposeState();
        arr = [];
        ref = this.__headers;
        for (j = 0, len = ref.length; j < len; j++) {
          header = ref[j];
          arr.push(header);
        }
        return arr;
      };

      Table.prototype.update = function() {
        var $body, $headers, $row, h, j, len, len1, len2, m, n, r, ref, ref1, ref2, v;
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<table class='Table' id='" + this.__id + "'> <thead> </thead> <tbody></tbody> </table>").appendTo(this.$__parent);
          this.__afterAppend();
        }
        $headers = this.$__parent.find("thead");
        $body = this.$__parent.find("tbody");
        $body.empty();
        $headers.empty();
        ref = this.__headers;
        for (j = 0, len = ref.length; j < len; j++) {
          h = ref[j];
          $headers.append(h.$__element);
        }
        ref1 = this.__rows;
        for (m = 0, len1 = ref1.length; m < len1; m++) {
          r = ref1[m];
          $row = r.$__element;
          $row.empty();
          ref2 = r.__getValues();
          for (n = 0, len2 = ref2.length; n < len2; n++) {
            v = ref2[n];
            $row.append(v instanceof Row.Value ? v.$__element : v);
          }
          $row.appendTo($body);
        }
        return this.__updateEnabledClass();
      };

      makeHeader = function(header, id) {
        var header_;
        if (id == null) {
          id = "";
        }
        header_ = header;
        if (typeof header === "string") {
          header_ = new Header(header, typeof id === "string" ? id : "");
        }
        if (!header instanceof Header) {
          throw new Error("header must be a string or an instance of Table.Header");
        }
        return header_;
      };

      makeRow = function(row, id) {
        var row_;
        if (id == null) {
          id = "";
        }
        row_ = row;
        if (root.util.isArray(row)) {
          row_ = new Row(row, typeof id === "string" ? id : "");
        }
        if (!row instanceof Row) {
          throw new Error("row must be an array or an instance of Table.Row");
        }
        return row_;
      };

      set = function(index, arr, make, thing, id, _this) {
        var thing_;
        indexCheck(arr, index);
        thing_ = make(thing, id);
        arr[index] = thing_;
        return _this.update();
      };

      add = function(thing, make, arr, _this) {
        var thing_;
        thing_ = make(thing);
        arr.push(thing_);
        _this.update();
        return thing_;
      };

      get = function(index, arr, _this) {
        indexCheck(arr, index);
        arr[index];
        return _this.update();
      };

      remove = function(thing, arr, instanceClass) {
        var index;
        index = Number.isInteger(thing) ? thing : thing instanceof instanceClass ? $.inArray(thing, arr) : -1;
        if ((-1 > index && index < arr.length)) {
          arr.splice(index, 1);
        }
        return null;
      };

      Table.prototype.setHeader = function(index, header, id) {
        if (id == null) {
          id = "";
        }
        this.__checkDisposeState();
        set(index, this.__headers, makeHeader, header, id, this);
        return this;
      };

      Table.prototype.addHeader = function(header) {
        this.__checkDisposeState();
        return add(header, makeHeader, this.__headers, this);
      };

      Table.prototype.getHeader = function(index) {
        this.__checkDisposeState();
        return get(index, this.__headers, this);
      };

      Table.prototype.removeHeader = function(header) {
        this.__checkDisposeState();
        return remove(header, this.__headers, Header);
      };

      Table.prototype.setRow = function(index, row, id) {
        if (id == null) {
          id = "";
        }
        this.__checkDisposeState();
        set(index, this.__rows, makeRow, row, id, this);
        return this;
      };

      Table.prototype.addRow = function(row) {
        this.__checkDisposeState();
        return add(row, makeRow, this.__rows, this);
      };

      Table.prototype.getRow = function(index) {
        this.__checkDisposeState();
        return get(index, this.__rows, this);
      };

      Table.prototype.removeRow = function(row) {
        this.__checkDisposeState();
        return remove(row, this.__rows, Row, this);
      };

      return Table;

    })(Widget);
    root.TabFolder = TabFolder = (function(superClass) {
      var Tab;

      extend(TabFolder, superClass);

      Tab = (function(superClass1) {
        extend(Tab, superClass1);

        function Tab(__folder, id, $__tab) {
          this.__folder = __folder;
          this.$__tab = $__tab;
          this.__items = [];
          Tab.__super__.constructor.call(this, this.__folder.$__content, id);
        }

        Tab.prototype.update = function() {
          if (!this.__appended) {
            this.$__element = $("<div id='" + this.__id + "' class='TabContent'></div>").appendTo(this.$__parent);
            this.__afterAppend();
          }
          this.$__tab.text(this.__title);
          return this.$__tab.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
        };

        Tab.prototype.isDisposed = function() {
          return false;
        };

        Tab.prototype.dispose = function() {};

        Tab.prototype.__getTooltipElement = function() {
          return this.$__tab;
        };

        Tab.prototype.getTabFolder = function() {
          return this.__folder;
        };

        Tab.prototype.setText = function(title, update) {
          if (update == null) {
            update = true;
          }
          if (typeof title === "string") {
            this.__title = title;
          }
          if (update) {
            this.update();
          }
          return this;
        };

        Tab.prototype.getText = function() {
          return this.__title;
        };

        return Tab;

      })(Composite);

      function TabFolder(parent, id) {
        this.__tabs = [];
        this.__selectedTab = 0;
        TabFolder.__super__.constructor.call(this, parent, id);
      }

      TabFolder.prototype.remove = function(index) {
        this.__checkDisposeState();
        indexCheck(this.__tabs, index);
        this.__tabs.splice(index, 1);
        return this;
      };

      TabFolder.prototype.append = function(title, id) {
        var $t, tab;
        this.__checkDisposeState();
        $t = $("<div class='Tab noselect'></div>");
        tab = new Tab(this, id, $t.appendTo(this.$__tabContainer));
        tab.setText(title);
        $t.click((function(_this) {
          return function() {
            var event;
            if (!tab.isEnabled()) {
              return;
            }
            event = {
              selection: $t.index(),
              tab: tab,
              canceled: false
            };
            _this.notifyListeners(root.event.Selection, event);
            if (event.canceled !== true) {
              return _this.setSelectedIndex($t.index());
            }
          };
        })(this));
        this.__tabs.push(tab);
        this.setSelectedIndex(this.__tabs.length - 1);
        return tab;
      };

      TabFolder.prototype.clear = function() {
        var results;
        this.__checkDisposeState();
        results = [];
        while (this.__tabs.length > 0) {
          results.push(this.remove(0));
        }
        return results;
      };

      TabFolder.prototype.getSelectedIndex = function() {
        this.__checkDisposeState();
        return this.__selectedTab;
      };

      TabFolder.prototype.getSelectedTab = function() {
        this.__checkDisposeState();
        return this.__tabs[this.__selectedTab];
      };

      TabFolder.prototype.setSelectedIndex = function(index) {
        var selectedTab;
        this.__checkDisposeState();
        indexCheck(this.__tabs, index);
        selectedTab = this.__tabs[this.__selectedTab];
        selectedTab.$__tab.removeClass("selected");
        selectedTab.$__element.css({
          display: "none"
        });
        this.__selectedTab = index;
        selectedTab = this.__tabs[index];
        selectedTab.$__tab.addClass("selected");
        return selectedTab.$__element.css({
          display: ""
        });
      };

      TabFolder.prototype.__getTooltipElement = function() {
        return null;
      };

      TabFolder.prototype.getTabs = function() {
        this.__checkDisposeState();
        return this.__tabs.slice(0);
      };

      TabFolder.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div id='" + this.__id + "' class='TabFolder'> <div class='TabContainer'></div> <div class='TabContentContainer'></div> </div>").appendTo(this.$__parent);
          this.$__tabContainer = this.$__element.find(".TabContainer");
          this.$__content = this.$__element.find(".TabContentContainer");
          return this.__afterAppend();
        }
      };

      return TabFolder;

    })(Widget);
    root.ProgressBar = ProgressBar = (function(superClass) {
      extend(ProgressBar, superClass);

      function ProgressBar(parent, id) {
        this.__progress = 0;
        ProgressBar.__super__.constructor.call(this, parent, id);
      }

      ProgressBar.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<div id='" + this.__id + "' class='ProgressBar'> </div>").appendTo(this.$__parent);
          this.$__inner = $("<div class='ProgressBarInner'></div>").appendTo(this.$__element);
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
          this.__afterAppend();
        }
        this.$__inner.css("width", this.__progress + "%");
        this.__classIf("full", this.__progress === 100);
        return this.__classIf("indeterminate", this.__indeterminate);
      };

      ProgressBar.prototype.setProgress = function(progress, denominator) {
        if (denominator == null) {
          denominator = 100;
        }
        this.__checkDisposeState();
        root.util.validateNumber("progress", progress);
        root.util.validateNumber("denominator", denominator);
        this.__progress = (progress / denominator) * 100;
        this.update();
        return this;
      };

      ProgressBar.prototype.getProgress = function() {
        this.__checkDisposeState();
        return this.__progress;
      };

      ProgressBar.prototype.setIndeterminate = function(indeterminate) {
        if (indeterminate == null) {
          indeterminate = true;
        }
        this.__indeterminate = indeterminate === true;
        this.update();
        return this;
      };

      ProgressBar.prototype.isIndeterminate = function() {
        return this.__indeterminate;
      };

      return ProgressBar;

    })(Widget);
    root.FileChooser = FileChooser = (function(superClass) {
      extend(FileChooser, superClass);

      function FileChooser(parent, id, text) {
        if (text == null) {
          text = "";
        }
        this.__files = [];
        this.__types = [];
        this.setText(text, false);
        FileChooser.__super__.constructor.call(this, parent, id);
      }

      FileChooser.prototype.setMulti = function(multi) {
        if (multi == null) {
          multi = true;
        }
        this.__checkDisposeState();
        root.util.validateBoolean("multi", multi);
        return this.__multi = multi;
      };

      FileChooser.prototype.accept = function(type) {
        var j, len, t;
        this.__checkDisposeState();
        if (typeof type === "string") {
          this.__types.push(type);
        } else if (typeof typeof type === "array") {
          for (j = 0, len = type.length; j < len; j++) {
            t = type[j];
            accept(t);
          }
        }
        return this;
      };

      FileChooser.prototype.getAccepted = function() {
        this.__checkDisposeState();
        return this.__types.slice(0);
      };

      FileChooser.prototype.getAcceptedString = function() {
        this.__checkDisposeState();
        if (typeof this.__types === "array") {
          return this.__types.join();
        } else {
          return "";
        }
      };

      FileChooser.prototype.clearAcceptedTypes = function() {
        this.__checkDisposeState();
        return this.__types.splice(0, this.__types.length);
      };

      FileChooser.prototype.stopAccepting = function(type) {
        var index, j, len, t;
        this.__checkDisposeState();
        if (typeof type === "string") {
          index = $.inArray(type, this.__types);
          if (index > -1) {
            this.__types.splice(index, 1);
          }
        } else if (typeof type === "array") {
          for (j = 0, len = type.length; j < len; j++) {
            t = type[j];
            stopAccepting(t);
          }
        }
        return this;
      };

      FileChooser.prototype.setText = function(text, update) {
        if (update == null) {
          update = true;
        }
        this.__checkDisposeState();
        root.util.validateString("text", text);
        this.__text = text;
        if (update) {
          this.update();
        }
        return this;
      };

      FileChooser.prototype.getText = function() {
        this.__checkDisposeState();
        return this.__text;
      };

      FileChooser.prototype.getFiles = function() {
        this.__checkDisposeState();
        return this.__files.slice(0);
      };

      FileChooser.prototype.__getTooltipElement = function() {
        return this.$__label;
      };

      FileChooser.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<input id='" + this.__id + "' class='FileChooser' type='file'>").appendTo(this.$__parent);
          this.$__label = $("<label class='noselect' for='" + this.__id + "'>" + this.__text + "</label>").insertAfter(this.$__element);
          this.$__element.change((function(_this) {
            return function(e) {
              _this.__files = e.files;
              return _this.notifyListeners(root.event.Selection);
            };
          })(this));
          this.$__element.click((function(_this) {
            return function(e) {
              var event;
              if (!_this.__enabled) {
                return;
              }
              event = {
                canceled: false
              };
              _this.notifyListeners(root.event.Show, event);
              if (event.canceled === true) {
                return e.preventDefault();
              }
            };
          })(this));
          this.$__element.mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
          this.__afterAppend();
        }
        if (this.__multi) {
          this.$__element.attr("multiple", "");
        } else {
          this.$__element.removeAttr("multiple");
        }
        this.$__element.attr("accept", this.getAcceptedString());
        this.__updateEnabledClass();
        return this.__updateEnabledAttr();
      };

      return FileChooser;

    })(Widget);
    root.ColorPicker = ColorPicker = (function(superClass) {
      extend(ColorPicker, superClass);

      function ColorPicker(parent, id, options) {
        if (options == null) {
          options = {};
        }
        root.util.validateObject("options", options);
        if (options.showPalette == null) {
          options.showPalette = typeof options.palette === "object" && options.palette.constructor === Array;
        }
        if (options.showInput == null) {
          options.showInput = true;
        }
        if (options.showAlpha == null) {
          options.showAlpha = true;
        }
        if (options.showInital == null) {
          options.showInital = true;
        }
        if (options.showButtons == null) {
          options.showButtons = false;
        }
        if (typeof options.containerClassName !== "string") {
          options.containerClassName = "";
        }
        options.containerClassName = "ColorPickerContainer " + options.containerClassName;
        if (typeof options.replacerClassName !== "string") {
          options.replacerClassName = "";
        }
        options.replacerClassName = "ColorPickerReplacer " + options.replacerClassName;
        if (options.preferredFormat == null) {
          options.preferredFormat = "hex3";
        }
        this.__options = $.extend({}, options);
        ColorPicker.__super__.constructor.call(this, parent, id);
      }

      ColorPicker.prototype.setOption = function(option, value) {
        root.util.validateString("option", option);
        this.__spectrum("option", option, value);
        return this;
      };

      ColorPicker.prototype.setOptions = function(options) {
        var k, v;
        root.util.validateObject("options", options);
        for (k in options) {
          v = options[k];
          if (typeof k === "string" && (typeof v !== "object" || root.util.isArray(v))) {
            setOption(k, v);
          }
        }
        return this;
      };

      ColorPicker.prototype.getOption = function(option) {
        root.util.validateString("option", option);
        return this.__spectrum(option);
      };

      ColorPicker.prototype.hide = function() {
        this.__checkDisposeState();
        this.__spectrum("hide");
        return this;
      };

      ColorPicker.prototype.show = function() {
        this.__checkDisposeState();
        this.__spectrum("show");
        return this;
      };

      ColorPicker.prototype.toggle = function() {
        this.__checkDisposeState();
        this.__spectrum("toggle");
        return this;
      };

      ColorPicker.prototype.setColor = function(color) {
        this.__checkDisposeState();
        root.util.validateString("color", color);
        this.__spectrum("set", color);
        return this;
      };

      ColorPicker.prototype.getColor = function() {
        return this.__spectrum("get");
      };

      ColorPicker.prototype.__hookEvent = function(event, eventName) {
        return this.__options[event] = (function(_this) {
          return function() {
            var eventData;
            eventData = {};
            switch (event) {
              case "move":
              case "hide":
              case "show":
              case "beforeShow":
              case "change":
                eventData.color = arguments[0];
                break;
              default:
                eventData.spectrumEvent = arguments[0];
                eventData.color = arguments[1];
            }
            return _this.notifyListeners(eventName, eventData);
          };
        })(this);
      };

      ColorPicker.prototype.setEnabled = function(enabled) {
        ColorPicker.__super__.setEnabled.call(this, enabled);
        if (enabled) {
          this.__spectrum("enable");
        } else {
          this.__spectrum("disable");
        }
        return this;
      };

      ColorPicker.prototype.dispose = function() {
        this.__spectrum("destroy");
        return ColorPicker.__super__.dispose.apply(this, arguments);
      };

      ColorPicker.prototype.__spectrum = function() {
        return this.$__element.spectrum.apply(this.$__element, arguments);
      };

      ColorPicker.prototype.__getTooltipElement = function() {
        if (this.__replacer === null) {
          return this.$__element;
        } else {
          return this.__replacer;
        }
      };

      ColorPicker.prototype.update = function() {
        this.__checkDisposeState();
        if (!this.__appended) {
          this.$__element = $("<input id='" + this.__id + "' type='text'>").appendTo(this.$__parent);
          this.__hookEvent("change", root.event.SpectrumChange);
          this.__hookEvent("move", root.event.SpectrumMove);
          this.__hookEvent("hide", root.event.SpectrumHide);
          this.__hookEvent("show", root.event.SpectrumShow);
          this.__hookEvent("dragStart", root.event.DragStart);
          this.__hookEvent("dragEnd", root.event.DragEnd);
          this.__options.beforeShow = (function(_this) {
            return function(color) {
              var event;
              event = {
                color: color,
                canceled: false
              };
              _this.notifyListeners(root.event.Show, event);
              if (event.canceled === true) {
                return false;
              }
            };
          })(this);
          this.__spectrum(this.__options);
          this.__replacer = $(this.__spectrum("replacer"));
          this.__getTooltipElement().mouseenter((function(_this) {
            return function() {
              return _this.notifyListeners(root.event.Hover);
            };
          })(this));
          this.__afterAppend();
        }
      };

      return ColorPicker;

    })(Widget);
    root.YTVideo = YTVideo = (function(superClass) {
      var Options, createParamList, createPlayer, ytConstant;

      extend(YTVideo, superClass);

      ytConstant = function(name, value) {
        return root.util.defineConstant(YTVideo, name, value);
      };

      ytConstant("Options", Options = (function() {
        function Options(videoId) {
          if (videoId == null) {
            videoId = "";
          }
          this.setVideoId(videoId);
        }

        Options.prototype.setAutoHide = function(autohide) {
          root.util.validateBoolean("autohide", autohide);
          this.autohide = autohide ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.isAutoHide = function() {
          if (this.autohide === YTVideo.TRUE) {
            return true;
          } else {
            return false;
          }
        };

        Options.prototype.setAutoPlay = function(autoplay) {
          root.util.validateBoolean("autoplay", autoplay);
          this.autoplay = autoplay ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.isAutoPlay = function() {
          return this.autoplay;
        };

        Options.prototype.setSize = function(width, height) {
          if (Number.isInteger(width)) {
            this.width = width;
          }
          if (Number.isInteger(height)) {
            this.height = width;
          }
          return this;
        };

        Options.prototype.setCcLoadPolicy = function(ccLoadPolicy) {
          root.util.validateInt("ccLoadPolicy", ccLoadPolicy);
          this.cc_load_policy = ccLoadPolicy;
          return this;
        };

        Options.prototype.getCcLoadPolicy = function() {
          return this.cc_load_policy;
        };

        Options.prototype.setColor = function(color) {
          root.util.validateString("color");
          if (color !== "red" && color !== "white") {
            throw new Error("color must be 'red' or 'white'");
          }
          this.color = color;
          return this;
        };

        Options.prototype.getColor = function() {
          return this.color;
        };

        Options.prototype.setControlPolicy = function(controlPolicy) {
          root.util.validateInt(controlPolicy);
          this.controls = controlPolicy;
          return this;
        };

        Options.prototype.getControlPolicy = function() {
          return this.controls;
        };

        Options.prototype.enableKeyboardControls = function() {
          this.disablekb = YTVideo.FALSE;
          return this;
        };

        Options.prototype.disableKeyboardControls = function() {
          this.disablekb = YTVideo.TRUE;
          return this;
        };

        Options.prototype.enableJsApi = function() {
          this.enablejsapi = YTVideo.TRUE;
          return this;
        };

        Options.prototype.disableJsApi = function() {
          this.enablejsapi = YTVideo.FALSE;
          return this;
        };

        Options.prototype.setEnd = function(end) {
          root.util.validateNumber("end", end);
          this.end = end;
          return this;
        };

        Options.prototype.getEnd = function() {
          return this.end;
        };

        Options.prototype.setFullscreenAllowed = function(fsAllowed) {
          root.util.validateBoolean("fsAllowed", fsAllowed);
          this.fs = fsAllowed ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.isFullscreenAllowed = function() {
          if (this.fs === YTVideo.TRUE) {
            return true;
          } else {
            return false;
          }
        };

        Options.prototype.setInterfaceLanguage = function(interfaceLanguage) {
          root.util.validateString("interfaceString", interfaceString);
          this.hl = interfaceLanguage;
          return this;
        };

        Options.prototype.getInterfaceLanguage = function() {
          return this.hl;
        };

        Options.prototype.setAnnotationsShownByDefault = function() {
          this.iv_load_policy = YTVideo.ANNOTATIONS_SHOWN_BY_DEFAULT;
          return this;
        };

        Options.prototype.setAnnotationsHiddenByDefault = function() {
          this.iv_load_policy = YTVideo.ANNOTATIONS_NOT_SHOWN_BY_DEFAULT;
          return this;
        };

        Options.prototype.areAnnotationShownByDefault = function() {
          return this.iv_load_policy === YTVideo.ANNOTATIONS_SHOWN_BY_DEFAULT;
        };

        Options.prototype.setListSearch = function(query) {
          root.util.validateString("query", query);
          this.listType = "search";
          this.list = query;
          return this;
        };

        Options.prototype.setListUserUploads = function(user) {
          root.util.validateString("user", user);
          this.listType = "user_uploads";
          this.list = user;
          return this;
        };

        Options.prototype.setListPlaylist = function(id) {
          root.util.validateString("id", id);
          this.listType = "playlist";
          this.list = "PL" + id;
          return this;
        };

        Options.prototype.setLooping = function(looping) {
          root.util.validateBoolean("looping", looping);
          this.loop = looping ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.isLooping = function() {
          return this.loop === YTVideo.TRUE;
        };

        Options.prototype.setModestBranding = function(modestBranding) {
          root.util.validateBoolean("modestBranding", modestBranding);
          this.modestbranding = modestBranding ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.hasModestBranding = function() {
          return this.modestbranding === YTVideo.TRUE;
        };

        Options.prototype.setOrigin = function(origin) {
          root.util.validateString("origin", origin);
          this.origin = origin;
          return this;
        };

        Options.prototype.getOrigin = function() {
          return this.origin;
        };

        Options.prototype.setPlayerApiId = function(playerApiId) {
          root.util.validateString("playerApiId", playerApiId);
          this.playerapiid = playerApiId;
          return this;
        };

        Options.prototype.getPlayerApiId = function() {
          return this.playerapiid;
        };

        Options.prototype.setPlaylist = function(playlist) {
          var id, j, len;
          root.util.validateArray("playlist", playlist);
          this.playlist = [];
          for (j = 0, len = playlist.length; j < len; j++) {
            id = playlist[j];
            if (typeof id === "string") {
              this.playlist_.push(id);
            }
          }
          return this;
        };

        Options.prototype.getPlaylist = function() {
          return this.playlist;
        };

        Options.prototype.setPlaysInline = function(playsInline) {
          root.util.validateBoolean("playsInline", playsInline);
          this.playsinline = playsInline ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.playsInline = function() {
          if (this.playsinline === YTVideo.TRUE) {
            return true;
          } else {
            return false;
          }
        };

        Options.prototype.setShowRelatedVideos = function(showRelated) {
          root.util.validateBoolean("showRelated", showRelated);
          this.rel = showRelated ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.showsRelatedVideos = function() {
          if (this.rel === YTVideo.TRUE) {
            return true;
          } else {
            return false;
          }
        };

        Options.prototype.setShowInfo = function(showInfo) {
          root.util.validateBoolean("showInfo", showInfo);
          this.showinfo = showInfo ? YTVideo.TRUE : YTVideo.FALSE;
          return this;
        };

        Options.prototype.getShowInfo = function() {
          if (this.showinfo === YTVideo.TRUE) {
            return true;
          } else {
            return false;
          }
        };

        Options.prototype.setStart = function(start) {
          root.util.validateNumber("start", start);
          this.start = start;
          return this;
        };

        Options.prototype.getStart = function() {
          return this.start;
        };

        Options.prototype.setVideoId = function(videoId) {
          if (videoId == null) {
            videoId = "";
          }
          root.util.validateString("videoId", videoId);
          return this.videoId = videoId;
        };

        Options.prototype.setDarkTheme = function() {
          this.theme = YTVideo.THEME_DARK;
          return this;
        };

        Options.prototype.setLightTheme = function() {
          this.theme = YTVideo.THEME_LIGHT;
          return this;
        };

        Options.prototype.isDarkTheme = function() {
          return this.theme === YTVideo.THEME_DARK;
        };

        return Options;

      })());

      ytConstant("TRUE", 1);

      ytConstant("FALSE", 0);

      ytConstant("AUTOHIDE_VISIBLE", 0);

      ytConstant("AUTOHIDE_AUTO", 1);

      ytConstant("AUTOHIDE_AUTO_OR_VISIBLE", 2);

      ytConstant("CC_SHOW_BY_DEFAULT", 1);

      ytConstant("CONTROLS_HIDDEN", 0);

      ytConstant("CONTROLS_VISIBLE_IMMEDIATELY", 1);

      ytConstant("CONTROLS_FLASH_LOAD_AFTER_PLAYBACK", 2);

      ytConstant("ANNOTATIONS_SHOWN_BY_DEFAULT", 1);

      ytConstant("ANNOTATIONS_NOT_SHOWN_BY_DEFAULT", 3);

      ytConstant("THEME_DARK", "dark");

      ytConstant("THEME_LIGHT", "light");

      createParamList = function(options) {
        var k, params, v;
        params = "";
        for (k in options) {
          v = options[k];
          if (typeof v === "string" || typeof v === "number") {
            params += k + "=" + v + "&";
          }
        }
        return params.substring(0, params.length - 1);
      };

      createPlayer = function($parent, id, options) {
        if (options == null) {
          options = {};
        }
        if (options.videoId == null) {
          options.videoId = "";
        }
        id = typeof this.__id === "string" ? "id='" + this.__id + "''" : "";
        return $parent.append("<iframe " + id + " src='https://youtube.com/embed/" + options.videoId + "?" + (createParamList(options)) + "' frameborder='0' allowfullscreen> </iframe>");
      };

      function YTVideo(parent, id, options) {
        if (options == null) {
          options = {};
        }
        root.util.validateObject("options", options);
        YTVideo.__super__.constructor.call(this, parent, id);
        if (options.videoId) {
          root.util.validateString("options.videoId", options.videoId);
        }
        createPlayer(this.$__parent, id, options);
        this.__afterAppend();
      }

      return YTVideo;

    })(Widget);
    $(window).resize(function() {
      var j, len, ref, results, w;
      ref = registry.getByType(Combo);
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        w = ref[j];
        results.push(w.__hide());
      }
      return results;
    });
    $(window).mousemove(function(e) {
      MOUSE.page.x = e.pageX;
      MOUSE.page.y = e.pageY;
      MOUSE.client.x = e.clientX;
      MOUSE.client.y = e.clientY;
      MOUSE.screen.x = e.screenX;
      return MOUSE.screen.y = e.screenY;
    });
  });

}).call(this);
