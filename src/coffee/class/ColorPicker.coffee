  # COLORPICKER CLASS DEFINITION
  # (Wrapper for Spectrum by Brian Grinstead)
  # https://github.com/bgrins/spectrum
  # Events:
  #   - Show - (beforeShow.spectrum)
  #   - SpectrumChange (change.spectrum)
  #   - SpectrumMove (move.spectrum)
  #   - SpectrumShow (show.spectrum)
  #   - SpectrumHide (hide.spectrum)
  #   - SpectrumDragStart (dragStart.spectrum)
  #   - SpectrumDragEnd (dragEnd.spectrum)
  # =================================================
  root.ColorPicker = class ColorPicker extends Widget

    constructor: (parent, id, options = {}) ->
      root.util.validateObject "options", options

      #default Spectrum options
      #(set if not defined)
      options.showPalette ?= typeof options.palette is "object" and options.palette.constructor is Array
      options.showInput ?= true
      options.showAlpha ?= true
      options.showInital ?= true
      options.showButtons ?= false
      options.containerClassName = "" if typeof options.containerClassName isnt "string"
      options.containerClassName = "ColorPickerContainer " + options.containerClassName
      options.replacerClassName = "" if typeof options.replacerClassName isnt "string"
      options.replacerClassName = "ColorPickerReplacer " + options.replacerClassName
      options.preferredFormat ?= "hex3"

      @__options = $.extend {}, options
      super parent, id

    setOption: (option, value) ->
      root.util.validateString "option", option
      @__spectrum "option", option, value
      return @
    setOptions: (options) ->
      root.util.validateObject "options", options
      for k, v of options
        setOption k, v if typeof k is "string" and (typeof v isnt "object" or root.util.isArray v)
      return @
    getOption: (option) ->
      root.util.validateString "option", option
      return @__spectrum option

    hide: ->
      @__checkDisposeState()
      @__spectrum "hide"
      return @
    show: ->
      @__checkDisposeState()
      @__spectrum "show"
      return @
    toggle: ->
      @__checkDisposeState()
      @__spectrum "toggle"
      return @

    setColor: (color) ->
      @__checkDisposeState()
      root.util.validateString "color", color
      @__spectrum "set", color
      return @
    getColor: -> @__spectrum "get"

    __hookEvent: (event, eventName) ->
      @__options[event] = =>
        eventData = {}
        switch event
          when "move", "hide", "show", "beforeShow", "change"
            eventData.color = arguments[0]
          else #dragStart dragEnd
            eventData.spectrumEvent = arguments[0]
            eventData.color = arguments[1]
        @notifyListeners eventName, eventData

    setEnabled: (enabled) ->
      super enabled
      if enabled
        @__spectrum "enable"
      else
        @__spectrum "disable"
      return @

    dispose: ->
      @__spectrum "destroy"
      super

    __spectrum: ->
      @$__element.spectrum.apply @$__element, arguments

    __getTooltipElement: -> if @__replacer is null then @$__element else @__replacer

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<input id='#{@__id}' type='text'>").appendTo @$__parent
        @__hookEvent "change", root.event.SpectrumChange
        @__hookEvent "move", root.event.SpectrumMove
        @__hookEvent "hide", root.event.SpectrumHide
        @__hookEvent "show", root.event.SpectrumShow
        @__hookEvent "dragStart", root.event.DragStart
        @__hookEvent "dragEnd", root.event.DragEnd
        @__options.beforeShow = (color) =>
          event =
            color: color
            canceled: false
          @notifyListeners root.event.Show, event
          return false if event.canceled is true
        @__spectrum @__options
        # Note: The method 'replacer' does not exist within Spectrum.
        # It has been added to the provided version of spectrum
        @__replacer = $ @__spectrum "replacer"
        @__getTooltipElement().mouseenter => @notifyListeners root.event.Hover
        @__afterAppend()
        return
