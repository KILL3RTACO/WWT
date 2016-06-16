  # TEXT CLASS DEFINITION
  # Texts are textboxes. This is more of a wrapper for input[type="text(area)"]
  #============================================================================
  root.Text = class Text extends Widget

    getAttributes = (text) ->
      "id='#{text.__id}' class='Text#{if text.isMulti() then "Area" else ""}' placeholder='#{text.getPlaceholder()}'"

    getCurrentText = (multi, element) -> return if multi then element.text() else element.val()

    constructor: (parent, id, type = "") ->
      root.util.validateString "type", type
      @__type = if $.inArray type, ["multi", "password"] >= 0 then type else ""
      @__text = ""
      super parent, id

    setPlaceholder: (placeholder, update = true) ->
      @__checkDisposeState()
      root.util.validateString "placeholder", placeholder
      @__placeholder = placeholder
      @update() if update
      return @
    getPlaceholder:  ->
      @__checkDisposeState()
      getString @__placeholder

    setText: (text, update = true) ->
      @__checkDisposeState()
      root.util.validateString "text", text
      @__text = text
      @update() if update
      return @
    getText: ->
      @__checkDisposeState()
      @__text

    isMulti: ->
      @__checkDisposeState()
      return @__type is "multi"

    isPassword: ->
      @__checkDisposeState()
      return @__type is "password"

    isNormal: ->
      return not (@isMulti() or @isPassword())

    # Somewhat experimental via some internet stuff
    # It is surprising to me that JavaScript doesn't have something native
    getCarsetPosition: ->
      pos = 0
      e = @$__element[0]

      # IE
      if document.selection
        e.focus()
        sel = document.selection.createRange()
        length = sel.text.length
        sel.moveStart("character", -(getCurrentText(@isMulti(), @$__element).length))
        pos = sel.text.length - length

      # Everything else?
      else if e.selectionStart
        # selectionStart may be greator than selectionEnd (if backwards), so we use min of start and end
        pos = Math.min e.selectionStart, e.selectionEnd

      return pos

    # Also kinda experimental
    setCaretPosition: (pos) ->
      e = @$__element[0]
      if e.setSelectionRange
        e.setSelectionRange(pos, pos)
      else if e.createTextRange
        range = e.createTextRange()
        range.collapse true
        if pos < 0
          pos = @getCurrentText.length + pos
          range.moveStart("character", pos)
          range.moveEnd("character", pos)
          range.select()

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element =
          if @isMulti() then $("<textarea #{getAttributes @}'></textarea>")
          else $("<input type='#{if @isPassword() then "password" else "text"}' #{getAttributes @}/>")
        @$__element.appendTo @$__parent
        @__afterAppend()
        @$__element.focus ->
          $(this).attr "placeholder", ""
        @$__element.blur (e) =>
          $(e.target).attr "placeholder", @getPlaceholder()
        @$__element.on "input", =>
          event =
            value: getCurrentText(@isMulti(), @$__element)
            canceled: false
          @notifyListeners root.event.Modify, event
          if event.canceled
            caret = @getCarsetPosition()
            cachedLength = @__text.length
            currentLength = getCurrentText(@isMulti(), @$__element).length
            caret -= Math.max(cachedLength, currentLength) - Math.min(cachedLength, currentLength)
            @setText @__text
            @setCaretPosition caret
          else
            @__text = getCurrentText(@isMulti(), @$__element)
          @notifyListeners root.event.AfterModify if not event.canceled
        @$__element.mouseenter => @notifyListeners root.event.Hover

      @__updateEnabledClass()
      if @isMulti()
        @$__element.text @getText()
      else
        @$__element.val @getText()
      @$__element.attr "placeholder", @getPlaceholder()
      @__updateEnabledAttr()

    setResize: (resize) ->
      @__checkDisposeState()
      @$__element.removeClass "no-resize resize-v resize-h resize-all"
      if resize is "none" or resize is false
        @$__element.addClass "no-resize"
      else if resize is "all" or resize is "*" or resize is "both" or resize is true
        @$__element.addClass "resize-all"
      else if typeof resize is "object"
        if resize.h and not resize.v
          @$__element.addClass "resize-h"
        else if resize.v and not resize.h
          @$__element.addClass "resize-v"
        else if resize.v and resize.h
          @$__element.addClass "resize-all"
        else if not resize.h and not resize.v
          @$__element.addClass "no-resize"
