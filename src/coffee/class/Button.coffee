  # BUTTON CLASS DEFINITION
  # Buttons are boxes that can be clicked to trigger an action
  # Events:
  #   - Hover
  #   - Selection
  #==========================================================
  root.Button = class Button extends Widget

    constructor: (parent, id, title = "") ->
      super parent, id, false
      @setText title

    setText: (title, update = true) ->
      @__checkDisposeState()
      root.util.validateString "title", title
      @__title = title
      @__textInvisible = false if not @__forceInvisibleText
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      getString @__title

    setTextInvisible: (invisible = true) ->
      @__checkDisposeState()
      @__textInvisible = invisible is true
      @update()
      return @
    isTextInvisible: -> @__textInvisible
    forceInvisibleText: (force) ->
      @__forceInvisibleText = force is true
      return @
    isInvisibleTextForced: -> @__forceInvisibleText

    getGroup: ->
      return if @hasGroup then @__group else null
    hasGroup: ->
      @__checkDisposeState()
      return typeof @__group is "object" and @__group instanceof ButtonGroup

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<button id='#{@__id}' class='Button noselect'></button>").appendTo @$__parent
        @$__title = $("<span class='title'></span>").appendTo @$__element
        @__afterAppend()

        @$__element.mouseenter => @notifyListeners root.event.Hover
        @$__element.click =>
          return if not @__enabled
          @notifyListeners root.event.Selection
          @notifyListeners root.event.AfterSelection

      @__updateEnabledClass()
      @$__title.html @__title
      @__classIf "invisible", @__textInvisible, @$__title
