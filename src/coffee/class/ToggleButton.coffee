  # TOGGLEBUTTON CLASS DEFINITION
  # ToggleButtons retain a certain state. When state === true then the button looks pressed in
  #==========================================================================================
  root.ToggleButton = class ToggleButton extends Button


    constructor: (parent, id, title = "") ->
      super parent, id, title

    __updateStateClass: () ->
      if @__state
        @$__element.removeClass "state-out"
        @$__element.addClass "state-in"
      else
        @$__element.removeClass "state-in"
        @$__element.addClass "state-out"

    setState: (state, update = true) ->
      @__checkDisposeState()
      root.util.validateBoolean "state", state
      @__state = state
      @update() if update
      return @
    getState: ->
      @__checkDisposeState()
      @__state

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<button id='#{@__id}' class='ToggleButton noselect state-#{if @__state then "in" else "out"}'></button>").appendTo @$__parent
        @$__title = $("<span class='title'></span>").appendTo @$__element
        @__afterAppend()

        @$__element.hover => root.event.Hover
        @$__element.click =>
          return if not @__enabled
          event =
            state: not @__state
            canceled: false
          @notifyListeners root.event.Selection, event
          return if event.canceled is true
          @__state = not @__state
          @update()

      @__updateEnabledClass()
      @__updateStateClass()
      @$__title.html @__title
