  # SWITCH CLASS DEFINITION
  # A Switch is a very basic wrapper for input[type="checkbox"]. Although a label is added in the DOM,
  # no display text is allowed.
  # A switch is like a fancy ToggleButton. However, instead of a 'pressesd/depressed' look, it should
  # look more like a circle/rectangle sliding left or right inside its container, depending on its state.
  #======================================================================================================
  class Switch extends Widget

    switchHtml = "<span class='outer'><span class='inner'></span></span>"

    labelHtml = (left, text) ->
      return "#{if left then switchHtml else ""}#{text}#{if not left then switchHtml else ""}"

    constructor: (parent, id) ->
      @__classname ?= "Switch"
      @__inputType ?= "checkbox"
      @__labelOnLeft ?= false
      @setState false, false
      super parent, id

    setState: (state, update = true) ->
      @__checkDisposeState()
      @__state = state is true
      @update() if update
      return @
    getState: ->
      @__checkDisposeState()
      getBoolean @__state

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div class='#{@__classname}Container'></div>").appendTo @$__parent
        @$__input = $("<input id='#{@__id}' class='#{@__classname}' type='#{@__inputType}' #{if @__state then "checked" else ""}/>").appendTo @$__element
        @$__label = $("<label class='noselect' for='#{@__id}'>#{labelHtml @__labelOnLeft, @getText()}</label>").appendTo @$__element
        @__afterAppend()
        @$__input.change =>
          event =
            state: @$__input.prop "checked" # Modifying this has no effect on the event
            canceled: false
          @notifyListeners root.event.Selection, event
          if event.canceled is true
            @$__input.prop "checked", @__state
          else
            @__state = @$__input.prop "checked"
            @notifyListeners root.event.AfterSelection
          return
        @$__element.mouseenter => @notifyListeners root.event.Hover

      @__updateEnabledClass()
      @$__label.html "#{labelHtml @__labelOnLeft, @getText()}"
      @__updateEnabledAttr @$__input
      @$__input.prop "checked", @__state
      return @
