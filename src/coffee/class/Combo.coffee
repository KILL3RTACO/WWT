  # COMBO CLASS DEFINITON
  # Inspiration: SWT
  #======================
  root.Combo = class Combo extends AbstractItemList

    constructor: (parent, id, editable = false) ->
      @__editable = editable is true
      @__hideSelectedItem = @__editable
      @__lastSelectedItem = -1
      # Look and Feel decides whether to use both arrow-down and arrow-up or just arrow-down
      # (or even only arrow-up, but the list is always positioned below, so that doesn't make sense)
      #TODO: if not editable then this is a Text, add arrow down
      if @__editable
        @$__element = $("<div class='ComboEditable'></div>")
        @$__textfield = $("<input type='text' class='Text'/>").appendTo @$__element
        @$__button = $("<div class='ComboEditableButtonContainer'>
          <div class='ComboEditableButton'>
            <span class='ComboEditableArrowContainer'><span class='down-arrow'></span></span>
          </div>
        </div>").appendTo @$__element
      else
        @$__element = $("<button id='#{id}' class='Combo'><span class='title'>#{@__text}</span>
            <div class='arrow-container'>
              <div class='arrow-up-container'>
                <div class='arrow-up'></div>
              </div>
              <div class='arrow-down-container'>
                <div class='arrow-down'></div>
              </div>
            </div>
          </button>")
      @__listOverlayed = not @__editable and options.getLookAndFeel() isnt "win"

      super parent, id, "ComboItem", $("<ul class='ComboItemList hidden'></ul>"), true
      @$__itemContainerElement.addClass "overlayed" if @__listOverlayed

    __renderItem: (item) ->
      return "<li class='#{@__itemClassName}'>#{item}</li>"

    setText: (text, update = true) ->
      @__checkDisposeState()
      root.util.validateString "text", text
      @__text = text
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      @__text

    setHideSelected: (hideSelected = true) ->
      @__checkDisposeState()
      @__hideSelectedItem = hideSelected is true if @__editable
    getHideSelected: ->
      @__checkDisposeState()
      @__hideSelectedItem

    setEnabled: (enabled = true) ->
      super
      if @__editable
        @__updateEnabledAttr @$__textfield

      return @

    __hide: ->
      @$__element.removeClass "listShown"
      @$__itemContainerElement.addClass "hidden"
      @__listVisible = false

    __show: ->
      @$__element.addClass "listShown"
      @$__itemContainerElement.removeClass "hidden"
      @__listVisible = true

    __append: ->
      $("body").append @$__itemContainerElement
      @__listVisible = false
      justShown = false

      # Determine position of list.
      # On GTK, Cocoa, and Default LAFs, the list will always be overlayed over the Combo. The exact position depends on the selected item (getText())
      # (The list will be pushed down if the top of the list exceeds the document)
      # On Win LAF, the list will always be below the combo
      # For editable Combos (textfield visibile), the list will always be below the combo
      (if not @__editable then @$__element else @$__button).click (e) =>
        return if not @isEnabled() or @__items.length is 0
        Combo.__CURRENT__.__hide() if typeof Combo.__CURRENT__ is "object" and Combo.__CURRENT__ instanceof Combo
        e.stopPropagation()
        Combo.__CURRENT__ = @
        if @__listVisible
          @__hide()
          return
        listTop = 0

        @$__itemContainerElement.children().each (i, e) =>
          $e = $(e)
          if $e.text() is @__text and @__hideSelectedItem
            $e.addClass "selected"
          else
            $e.removeClass "selected"

        docHeight = $(document).outerHeight()
        docWidth = $(document).outerWidth()

        if @__editable
          event =
            canceled: false
          @notifyListeners root.event.Show, event
          return if event.canceled is true

        @__show()
        itemListBorderWidth = @$__itemContainerElement.outerWidth() - @$__itemContainerElement.innerWidth()
        @$__itemContainerElement.css width: @$__element.outerWidth() - (itemListBorderWidth)
        elemPos  = @$__element.offset()
        if @__listOverlayed
          currIndex = 0
          currItem = null
          offset = 0
          @$__itemContainerElement.children().each (i, e) =>
            $item = $(e)
            if currIndex is @__lastSelectedItem or (@__lastSelectedItem is -1 and $item.text() is @__text)
              currItem = $item
              return false
            else
              offset += $item.outerHeight() if not $item.hasClass "selected"
            currIndex++
          borderTop = @$__itemContainerElement.css("border-top-width")
          listTop = (elemPos.top - offset) - parseInt borderTop.substring(0, borderTop.length - 2), 10 #assumes the border width is in pixels
        else
          listTop = elemPos.top + @$__element.outerHeight()

        css =
          left: elemPos.left
          top: if listTop < 0 then @$__element.css "border-top-width" else listTop
          height: ""
          "max-height": "50%"

        @$__itemContainerElement.css css

        listTop = @$__itemContainerElement.offset().top
        listHeight = @$__itemContainerElement.outerHeight()

        if listTop + listHeight > docHeight
          bottomBorderWith = @$__itemContainerElement.css "border-bottom-width"
          @$__itemContainerElement.css
            height: (listHeight - ((listTop + listHeight) - docHeight)) - 5
          @$__itemContainerElement.css # Done in another invocation to ensure that @$__element's offset is correct after the item list's height correction
            left: @$__element.offset().left

      # When an an item (current or future) is clicked, set the text and hide the list
      @$__itemContainerElement.delegate "li", "click", (e) =>
        $e = $(e.target)
        text = $e.text()
        index = $e.index()
        selectionEvent =
          selection: text
          index: index
          canceled: false
        @notifyListeners root.event.Selection, selectionEvent
        return if selectionEvent.canceled is true
        @notifyListeners root.event.AfterSelection, {index: selectionEvent.index}
        @setText selectionEvent.selection
        @__lastSelectedItem = index

        @__hide()

      # When typing into the text field, update __text
      # The change event is fired when the textfield loses focus, so we use the input event instead
      (@$__textfield.on "input", =>
        event =
          value: @$__textfield.val()
          canceled: false
        @notifyListeners root.event.Modify, event

        if event.canceled is true
          @$__textfield.val @__text
        else
          @__text = event.value

      # This event only applies if the Combo is editable, otherwise @$__textfield would be undefined
      ) if @__editable

      if @__editable
        onHover = (part) =>
          event =
            part: part
          @notifyListeners root.event.Hover, event
        @$__textfield.mouseenter => onHover "textbox"
        @$__button.mouseenter => onHover "button"
      else
        @$__element.mouseenter => @notifyListeners root.event.Hover

      # Hide the list if the user clicks somewhere else
      $("body").click =>
        @__hide() if not justShown
        return null

    update: ->
      super
      @__hide()

      if not @__editable
        @$__element.find(".title").text @__text
      else
        @$__textfield.val @__text

    dispose: ->
      return if @__disposed or not @$__element
      @$__itemContainerElement.remove()
      super
