  # CHECK CLASS DEFINITION
  # This is primarly a wrapper for input[type="checkbox"]. Although it extends Switch, this widget should
  # look like an actual checkbox (via CSS)
  # Events:
  #   - Hover
  #   - Selection
  #======================================================================================================
  root.Check = class Check extends Switch

    constructor: (parent, id, text = "") ->
      @__classname ?= "Check"
      @__labelOnLeft = true
      super parent, id
      @setText text

    setText: (text, update = true) ->
      @__checkDisposeState()
      root.util.validateString "text", text
      @__text = text
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      getString  @__text
