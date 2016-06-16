  #FILECHOOSER CLASS DEFINITION
  #At the moment, no way to get the names of files or their content
  #================================================================
  root.FileChooser = class FileChooser extends Widget

    constructor: (parent, id, text = "") ->
      @__files = []
      @__types = []
      @setText text, false
      super parent, id

    setMulti: (multi = true) ->
      @__checkDisposeState()
      root.util.validateBoolean "multi", multi
      @__multi = multi

    accept: (type) ->
      @__checkDisposeState()
      if typeof type is "string"
        @__types.push type
      else if typeof typeof type is "array"
        accept t for t in type

      return @

    getAccepted: ->
      @__checkDisposeState()
      @__types.slice 0
    getAcceptedString: ->
      @__checkDisposeState()
      if typeof @__types is "array" then @__types.join() else ""

    clearAcceptedTypes: ->
      @__checkDisposeState()
      @__types.splice 0, @__types.length

    stopAccepting: (type) ->
      @__checkDisposeState()
      if typeof type is "string"
        index = $.inArray type, @__types
        @__types.splice index, 1 if index > -1
      else if typeof type is "array"
        stopAccepting t for t in type

      return @

    setText: (text, update = true) ->
      @__checkDisposeState()
      root.util.validateString "text", text
      @__text = text
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      @__text

    getFiles: ->
      @__checkDisposeState()
      @__files.slice 0

    __getTooltipElement: -> @$__label

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<input id='#{@__id}' class='FileChooser' type='file'>").appendTo @$__parent
        @$__label =  $("<label class='noselect' for='#{@__id}'>#{@__text}</label>").insertAfter @$__element
        @$__element.change (e) =>
          @__files = e.files
          @notifyListeners root.event.Selection
        @$__element.click (e) =>
          return if not @__enabled
          event =
            canceled: false
          @notifyListeners root.event.Show, event
          e.preventDefault() if event.canceled is true
        @$__element.mouseenter => @notifyListeners root.event.Hover
        @__afterAppend()

      if @__multi
        @$__element.attr "multiple", ""
      else
        @$__element.removeAttr "multiple"
      @$__element.attr "accept", @getAcceptedString()
      @__updateEnabledClass()
      @__updateEnabledAttr()
