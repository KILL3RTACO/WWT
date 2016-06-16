  # CSSCONTROLLER CLASS DEFINITION
  # Allows the setting/getting of an objects id and classes
  #========================================================
  class CssController

    constructor: ($e, id = "") ->
      root.util.validateJQuery "$e", $e
      @$__element = $e
      @__id = ""
      @__id = id if typeof id is "string"
      @$__element.attr "id", @__id if typeof @$__element.attr("id") isnt "string"
      @__classes = []

    __classIf: (classname, shouldAdd, $elem = @$__element) ->
      if shouldAdd is true
        $elem.addClass classname
      else
        $elem.removeClass classname
      return @
    __cssIf: (cssTrue, cssFalse, shouldAdd, $elem = @$__element) ->
      if shouldAdd is true
        $elem.css cssTrue
      else
        $elem.css cssFalse
    __attrIf: (attr, condition, $elem = @$__element) ->
      if condition is true
        $elem.attr attr, ""
      else
        $elem.removeAttr attr

    hasClass: (className) -> typeof className is "string" and $.inArray(className, @__classes) > -1
    addClass: (className) ->
      root.util.validateString "className", className
      throw new Error("className cannot have space") if className.indexOf(" ") > -1
      if not @hasClass className
        @__classes.push className
        @$__element.addClass className
      return @
    removeClass: (className) ->
      throw new Error("className must be a string. Use removeClasses() for Array input") if root.util.isArray className
      root.util.validateString "className", className
      throw new Error("className cannot have space") if className.indexOf(" ") > -1
      index = -1
      count = 0
      for c in @__addedClasses
        if c is className
          index = count
          break
        count++
      if index > -1
        @__addedClasses.splice index, 1
        @$__element.removeClass className
      return @
    removeClasses: (classes) ->
      root.util.validateArray "classes", classes
      (removeClass c if typeof c is "string") for c in classes
      return @
    clearClasses: ->
      @$__element.removeClass @__addedClasses.join " "
      @__addedClasses.splice 0, @__addedClasses.length
      return @
    getClasses: -> @__classes.slice 0
    css: ->
      @$__element.css.apply @$__element, arguments
      return @

    getId: -> @__id
