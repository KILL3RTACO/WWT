  root.Composite = class Composite extends Widget

    class BodyComposite extends Composite

      constructor: ->
        @__id = ""
        @$__element = $("body")

      update: -> #do nothing

      isDisposed: -> false
      dispose: -> # do nothing

    constructor: (parent, id) ->
      super parent, id

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div id='#{@__id}' class='Composite'></div>").appendTo @$__parent
        @__afterAppend()

    prepend: (thingToPrepend) ->
      @__checkDisposeState()
      @$__element.prepend thingToPrepend
      return @
    append: (thingToAppend) ->
      @__checkDisposeState()
      @$__element.append thingToAppend
      return @
    clear: ->
      @__checkDisposeState()
      @$__element.empty()
      return @
    setContent: (content) ->
      @__checkDisposeState()
      @clear()
      @append content
      return @

    __getTooltipElement: -> null

    root.util.defineConstant Composite, "BODY", new BodyComposite()
