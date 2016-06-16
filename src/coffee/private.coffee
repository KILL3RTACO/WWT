  # PRIVATE FUNCTIONS
  #==================

  #Private Widget functions
  check = (parent, id = "") ->
    throw new Error("parent must be a string, jQuery object, or an instanceof wwt.Composite") if typeof parent isnt "string" and not root.util.isJQuery(parent) and not parent instanceof Composite
    throw new Error("DOM id #{parent} (parent) does not exist") if $("##{parent}").length is 0 unless parent is "" or root.util.isJQuery(parent) or parent instanceof Composite
    root.util.validateString "id", id
    throw new Error("DOM id #{id} (id) already exists") if id.length > 0 and $("##{id}").length isnt 0

  getParent = (parent) ->
    if parent is "" then $("body") else if typeof parent is "object" and parent instanceof Composite then parent.$__element else $("##{parent}")

  getString = (variable) ->
    if typeof variable isnt "undefined" then variable else ""

  getBoolean = (variable, def = false) ->
    if typeof variable is "boolean" then variable else def

  #http://stackoverflow.com/a/10454560
  decimalPlaces = (num) ->
    match = ('' + num).match /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/
    return 0 if not match
    return Math.max(
         0,
         # Number of digits right of decimal point.
         if match[1] then match[1].length else 0
         # Adjust for scientific notation.
         - if match[2] then +match[2] else 0)

  indexCheck = (arr, index) ->
    throw new Error("index (#{index}) out of bounds (0-#{arr.length - 1})") if -1 > index < arr.length
