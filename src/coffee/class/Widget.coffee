  # WIDGET CLASS DEFINITION
  # This is the base class for all controls
  # Made public so others can make their own Widgets. Usage of 'new Widget()'
  # is not reccomended, extend the class (via $.extend or 'extends' in CoffeeScript)
  #=================================================================================
  root.Widget = class Widget extends CssController

    $.extend Widget.prototype, EventListener.prototype

    constructor: (parent, id = "", update = true) ->
      check parent, id
      @__classes = []
      @__listeners = {}
      @__eventsAdded = false
      @__disposed = false
      @__id = id
      @__appended = false
      @$__parent = if root.util.isJQuery parent then parent else getParent parent
      @__enabled = true
      @__tooltip = ""
      @__showToolipWhenDisabled = false
      registry.add @
      @update() if update

    __checkDisposeState: -> throw new Error("Widget has been disposed") if @__disposed is true

    setEnabled: (enabled = true, update = true) ->
      @__checkDisposeState()
      @__enabled = enabled is true
      @update() if update
      return @
    isEnabled: ->
      @__checkDisposeState()
      return @__enabled

    setTooltip: (tooltip) ->
      @__checkDisposeState()
      throw new Error("tooltip must be a function or string") if not (typeof tooltip is "string" or typeof tooltip is "function")
      @__tooltip = tooltip
      return @
    getTooltip: ->
      @__checkDisposeState()
      return @__tooltip

    __getTooltipElement: -> @$__element

    __afterAppend: ->
      @__appended = true

      # The resize event is only passed to the window, so we simulate it by watching the clientHeight and clientWidth properties
      # and notify the Resize listeners when they have changed
      root.util.watch @$__element, "clientWidth", => @notifyListeners root.event.Resize, @
      root.util.watch @$__element, "clientWidth", => @notifyListeners root.event.Resize, @

      $tipElement = @__getTooltipElement()
      return if $tipElement is null
      @__getTooltipElement().hover (=> @__showTooltip()), (=> @__hideTooltip())

    showTooltipWhenDisabled: (tooltipWhenDisabled = true) ->
      @__checkDisposeState()
      @__showToolipWhenDisabled = tooltipWhenDisabled is true
      return @
    tooltipShownWhenDisabled: ->
      @__checkDisposeState()
      @__showToolipWhenDisabled

    __showTooltip:  ->
      return if not (@__enabled or @__showToolipWhenDisabled)
      docHeight = $(document).height()
      docWidth = $(document).width()
      $tipElement = @__getTooltipElement()
      return if $tipElement is null
      elemTop = $tipElement.offset().top
      width = $tipElement.outerWidth()
      height = $tipElement.outerHeight()
      Widget.Tooltip.setText(if typeof @__tooltip is "string" then @__tooltip else @__tooltip.call @)
      if Widget.Tooltip.getText().length is 0
        Widget.Tooltip.hide()
        return @
      Widget.Tooltip.show()
      tipHeight = Widget.Tooltip.$__element.outerHeight()
      tipWidth = Widget.Tooltip.$__element.outerWidth()

      tipOffset = 10

      x = (->
        initial = MOUSE.page.x + tipOffset
        if initial + tipWidth > docWidth
          # return docWidth - tipWidth
          return MOUSE.page.x - tipWidth - tipOffset
        else
          return initial
      )()

      y = (->
        # initial = elemTop + height
        initial = MOUSE.page.y + tipOffset
        if initial + tipHeight > docHeight
          # return elemTop - tipHeight
          return MOUSE.page.y - tipHeight - tipOffset
        else
          return initial
      )()

      Widget.Tooltip.setLocation(x, y)

    __hideTooltip: -> Widget.Tooltip.hide()

    __updateEnabledClass: -> @__classIf "disabled", not @__enabled
    __updateEnabledAttr: ($elem = @$__element) -> @__attrIf "disabled", not @__enabled, $elem

    height: ->
      @__checkDisposeState()
      @$__element.height()
    outerHeight: ->
      @__checkDisposeState()
      @$__element.outerHeight.apply @$__element, arguments
    innerHeight: ->
      @__checkDisposeState()
      @$__element.innerHeight()

    width: ->
      @__checkDisposeState()
      @$__element.width()
    outerWidth: ->
      @__checkDisposeState()
      @$__element.outerWidth.apply @$__element, arguments
    innerWidth: ->
      @__checkDisposeState()
      @$__element.innerWidth()

    isDisposed: -> @__disposed
    dispose: ->
      return if @__disposed or not @$__element
      @$__element.remove()
      @__disposed = true
      @notifyListeners root.event.Dispose

    # Subclasses should override
    update: ->

  $(document).ready -> #This is done so $(body) isn't undefined
    Widget.Tooltip = new class extends Widget

      constructor: ->
        super "", "wwt_tooltip"
        @hide()

      dispose: -> # Cannot dispose
      isDisposed: -> false

      setText: (text = "") ->
        root.util.validateString "text", text
        @__text = text
        @update()
        return @
      getText: -> @__text

      hide: ->
        @$__element.css display: "none"
        return @

      # x, y in pixels
      show: (x, y) ->
        return if typeof @__text isnt "string" or @__text.length is 0
        @$__element.css display: ""
        @setLocation x, y
        return @

      # x, y in pixels
      setLocation: (x = 0, y = 0) ->
        @$__element.css
          left: x
          top: y

      update: ->
        if not @__appended
          @$__element = $("<div id='#{@__id}'></div>").appendTo @$__parent
          @__afterAppend()

        @$__element.html @__text
