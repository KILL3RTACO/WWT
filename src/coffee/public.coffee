  #OPTIONS CLASS DEFINITON
  #=======================
  options = root.Options = new class

    #Look And Feel
    DEF_LAF                      = "default"
    LAF                          = DEF_LAF
    VALID_LAF                    = ["default", "win", "cocoa", "gtk", "native", "custom"]

    #Accent color for Windows LAF
    DEF_LAF_WINDOWS_ACCENT      = "blue"
    LAF_WINDOWS_ACCENT          = DEF_LAF_WINDOWS_ACCENT
    VALID_LAF_WINDOWS_ACCENT    = ["gray", "red", "green", "blue", "orange", "yellow", "purple"]

    #GTK LAF boolean for dark theme. Default: false (normal/light theme)
    LAF_GTK_DARK                = false

    RES_BASE                   = ""

    get = (valid, value, def) ->
      if value in valid then value else def

    getLookAndFeel: -> get(VALID_LAF, LAF, DEF_LAF)
    setLookAndFeel: (laf) -> LAF = get(VALID_LAF, laf, DEF_LAF)
    isNativeLookAndFeel: -> LAF is "native"

    getWindowsAccent: -> get(VALID_LAF_WINDOWS_ACCENT, LAF_WINDOWS_ACCENT, DEF_LAF_WINDOWS_ACCENT)
    setWindowsAccent: (accent) -> get(VALID_LAF_WINDOWS_ACCENT, accent, DEF_LAF_WINDOWS_ACCENT)

    setResourceBase: (base) -> RES_BASE = base
    getResourceBase: -> return RES_BASE

    isGtkDark: -> LAF_GTK_DARK
    setGtkDark: (dark) ->
      validateBoolean "dark", dark
      LAF_GTK_DARK = dark

  hasBeenInit = false
  NATIVE_LAF = ""
  MOUSE =
    client: {}
    page: {}
    screen: {}

  #WWT Public Functions
  #====================

  root.electron = electron

  root.updateTheme = ->
    return if not hasBeenInit
    $("#_wwtTheme").remove()
    base = options.getResourceBase()
    laf = if options.isNativeLookAndFeel() then NATIVE_LAF else options.getLookAndFeel()
    $("head").append "<link id='_wwtTheme' rel='stylesheet' href='#{base}/css/laf-#{laf}.css'>"

  root.init = ->
    hasBeenInit = true
    os = navigator.platform
    if os.startsWith "Win"
      NATIVE_LAF = "windows"
    else if os.startsWith "Mac"
      NATIVE_LAF = "aqua"
    else
      NATIVE_LAF = "gtk"

    root.updateTheme()

  root.getMousePos = -> $.extend {}, MOUSE

  root.util =
    watch: ($element, property, onChange, thisArg) ->
      oldValue = $element.prop property
      timer = window.setTimeout(->
        onChange.call thisArg if $element.prop(property) isnt oldValue
      , 100)

    defineConstant: (obj, name, val) ->
      Object.defineProperty obj, name,
        enumerable: false
        configurable: false
        writable: false
        value: val

    isArray: (arr) ->
      return arr instanceof Array

    isJQuery: (obj) ->
      return obj instanceof $

    validate: (name, variable, type) ->
      throw new TypeError("#{name} must be a #{type}") if typeof variable isnt type

    validateArray: (name, variable) ->
      throw new TypeError("#{name} must be an array") if not @isArray variable

    validateString:  (name, variable) ->
      @validate name, variable, "string"

    validateBoolean:(name, variable) ->
      @validate name, variable, "boolean"

    validateFunction: (name, variable) ->
      @validate name, variable, "function"

    validateNumber: (name, variable) ->
      @validate name, variable, "number"

    validateObject: (name, variable) ->
      @validate name, variable, "object"

    validateInt: (name, variable) ->
      throw new Error("#{name} must be an integer") if typeof variable isnt "number" or not Number.isInteger variable

    validateInteger: -> @validaeInt.apply this, arguments

    validateJQuery:  (name, variable) ->
      throw new Error("#{name} must be a jQuery object") if not @isJQuery variable

    async: ({fn = null, fnThis, fnArgs = [], callback = null, callbackThis, callbackArgs = []}) ->
      return if fn is null or callback is null
      setTimeout ->
        fn.apply fnThis, if isArray fnArgs then fnArgs else []
        callback.apply callbackThis, if isArray callbackArgs then callbackArgs else []
      , 0

  # Event Name Constants
  # Name inspiration/concept from SWT
  # Note: Events are only fired when values are changed internally. Calling set methods (setText, setItems, etc), will not fire events
  # Some events are fired after the fact (and cannot be canceled), while others are fired before, and can be modified/canceled
  root.util.defineConstant root, "event",
    Selection: "selection" # (Toggle)Button is pressed, Check/Radio checked, Tab change, List/Combo selection ...
    AfterSelection: "after-selection"
    Hover: "hover" # Widget is hovered over by mouse (cannot be canceled)
    Dispose: "dispose" # Widget is disposed (cannot be canceled)
    Modify: "modify" # Text contents/Spinner number changed
    AfterModify: "after-modify"
    Show: "show" # Combo's list or tooltip/FileChooser shown. Also used for Spectrum's before-show event
    Hide: "hide" # Opposite of Show
    Resize: "resize" # Widget is resized via CSS or other action (cannot be canceled)

    # ColorPicker (Spectrum) Events
    # Due to how spectrum handles its events, they are not cancelable; the events are fired after they have been completed.
    SpectrumChange: "spectrum-change" # Color Picker color changed
    SpectrumShow: "spectrum-show" # Color Picker shown
    SpectrumHide: "spectrum-hide" # Color Picker hide
    SpectrumDragStart: "spectrum-drag-start" # Color Picker drag (start)
    SpectrumDragEnd: "spectrum-drag-end" # Color Picker drag (end, before move completion)
    SpectrumMove: "spectrum-move" # Color Picker drag (end, after move completion)
