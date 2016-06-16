  # LIST CLASS DEFINITION
  #======================
  root.List = class List extends AbstractItemList

    constructor: (parent, id, items = []) ->
      @__lastSelected = -1
      @__hScroll = true
      @$__element = $("<div id='#{id}' class='List'></div>")
      super parent, id, "ListItem", @$__element
      @setItems items

    setMultiSelect: (multi) ->
      @__checkDisposeState()
      @__multi = multi is true
      setItemSelected @__lastSelected if not @__multi
      return @
    isMultiSelect: ->
      @__checkDisposeState()
      return @__multi

    setItems: (items, update = true) ->
      @__checkDisposeState()
      @__selected = []
      super items, update

    getSelectedItems: ->
      @__checkDisposeState()
      return for i in @__selected when @__items.length > i > 0

    getLastSelectedItem: ->
      @__checkDisposeState()
      @__lastSelected

    setItemSelected: (item, selected = true) ->
      @__checkDisposeState()
      index = -1
      if typeof item is "string"
        index = $.inArray item, @__items
      else if typeof item is "number"
        index = item
      else
        throw new Error("item must be a string or number")

      return if index < 0

      isSelected = @isSelected index

      @deselectAll() if selected and not @__multi
      @__selected.push item if selected and not isSelected
      @__selected.splice $.inArray(index, @__selected), 1 if not selected
      @__selectionChanged = true
      @update()
      return @

    toggleItemSelected: (item) ->
      @__checkDisposeState()
      @setItemSelected item, not @isSelected item

    isSelected: (item) ->
      @__checkDisposeState()
      if typeof item is "number"
        return $.inArray(item, @__selected) > -1
      else if typeof item is "string"
        index = $.inArray item, @items
        return index > -1 and $.inArray(index, @__selected) > -1
      else
        return false

    #items = number, string, array[number or string]
    setSelectedItems: (items, update = true) ->
      @__checkDisposeState()
      throw new Error("list is not multi select") if not @__multi
      @__selectionChanged = true
      @__selected = []
      root.util.validateArray "items", items
      @setItemSelected item for item in items
      @update() if update
      return @

    getSelectedIndices: ->
      @__checkDisposeState()
      @__selected.slice 0

    selectAll: ->
      @__checkDisposeState()
      @setItemSelected item, selected for item in @__items
    deselectAll: ->
      @__checkDisposeState()
      @__selected.splice 0
      @__selectionChanged = true

    __renderItem: (item) ->
      return "<div class='#{@__itemClassName} noselect'>#{item}</div>"

    __append: ->
      @$__element.mouseenter => @notifyListeners root.event.Hover

    update: ->
      @__checkDisposeState()
      super
      if @__itemsChanged
        @$__element.find(".ListItem").click (e) =>
          currentIndex = $(e.target).index()

          fireEvent = (indices) =>
            event =
              index: indices[0]
              indices: indices
              canceled: false
            @notifyListeners root.event.Selection, event
            return event

          afterEvent: (e) -> @notifyListeners root.event.AfterSelection, {index: e.index, indices: e.indices}

          if (NATIVE_LAF is "aqua" and e.metaKey) or (NATIVE_LAF isnt "aqua" and e.ctrlKey)
            event = fireEvent [currentIndex]
            return if event.canceled is true
            @toggleItemSelected index for index in event.indices if root.util.isArray event.indices
            afterEvent event
          else if e.shiftKey
            allSelected = true
            indices = [@__lastSelected..currentIndex]
            for item in indices
              allSelected = allSelected and @isSelected item
              break if not allSelected

            event = fireEvent indices
            return if event.canceled is true

            @setItemSelected item, not allSelected for item in event.indices if root.util.isArray event.indices
            afterEvent event
          else
            event = fireEvent [currentIndex]
            return if event.canceled is true
            @deselectAll()
            @toggleItemSelected currentIndex
            afterEvent event

          @__lastSelected = currentIndex

        @__itemsChanged = false

      if @__selectionChanged
        @$__element.find(".ListItem").each (i, e) =>
          $e = $(e)
          if @isSelected i
            $e.addClass "selected"
          else
            $e.removeClass "selected"
        @__selectionChanged = false
