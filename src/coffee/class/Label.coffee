  root.Label = class Label extends Widget

    constructor: (parent, id, text = "") ->
      @setText text, false
      super parent, id

    setText: (text = "", update = true) ->
      @__checkDisposeState()
      root.util.validateString "text", text
      @__text = text
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      @__text

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<span id='#{@__id}' class='Label'>#{@__text}</span>").appendTo @$__parent
        @__afterAppend()
        @$__element.mouseenter => @notifyListeners root.event.Hover

      @$__element.html @__text
