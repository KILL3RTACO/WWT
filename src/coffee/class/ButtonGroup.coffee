  # BUTTONGROUP CLASS DEFINITION
  #=============================
  root.ButtonGroup = class ButtonGroup extends Widget

    constructor: (parent, id, toggle = false) ->
      @__buttons = []
      @__toggle = if typeof toggle is "boolean" then toggle else false
      super parent, id

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div id='#{@__id}' class='ButtonGroup'></div>").appendTo @$__parent
        @__afterAppend()

    addButton: (id, title = "") ->
      @__checkDisposeState()
      button = new (if @__toggle then ToggleButton else Button) @$__element, id, title
      button.__group = @
      @__buttons.push button
      button.setEnabled @__enabled
    getButton: (index) ->
      @__checkDisposeState()
      indexCheck @__buttons, index
      return @__buttons[index]
    removeButton: (index) ->
      @__checkDisposeState()
      indexCheck @__buttons, index
      @__buttons.splice index, 1
      return @
    getButtons: ->
      @__checkDisposeState()
      @__buttons.slice 0

    isToggle: ->
      @__checkDisposeState()
      @__toggle

    __getTooltipElement: -> null

    setEnabled: (enabled) ->
      @__checkDisposeState()
      super enabled, false
      b.setEnabled enabled for b in @__buttons
      return @
