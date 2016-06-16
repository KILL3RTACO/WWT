  #Parent Class for List, Combo, EditableCombo(Better name, Entry maybe?), etc
  #===============================
  class AbstractItemList extends Widget

    constructor: (parent, id, @__itemClassName, @$__itemContainerElement, @__unique = false) ->
      @__items = []
      super parent, id

    addItem: (item, update = true) ->
      @__checkDisposeState()

      if typeof item is "string" and (not (@__unique and @hasItem item))
        @__items.push item
        @update() if update
    setItems: (items, update = true) ->
      @__checkDisposeState()
      root.util.validateArray "items", items
      @__items.splice 0
      @addItem item, false for item in items
      @__itemsChanged = true
      @update() if update
      return @
    getItems: ->
      @__checkDisposeState()
      @__items.slice 0 #return copy of array to prevent modification
    removeItem: (item, update = true) ->
      @__checkDisposeState()
      root.util.validateString "item", item
      index = $.inArray item, @__items
      if index > -1
        @__types.slice index 1
        @__itemsChanged = true
        @update() if update

    hasItem: (item) ->
      @__checkDisposeState()
      return @indexOf(item) > -1

    indexOf: (item) ->
      @__checkDisposeState()
      return -1 if typeof item isnt "string"
      return $.inArray item, @__items

    # Subclasses should override
    __append: ->

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__parent.append @$__element
        @__append()
        @__afterAppend()

      if @__itemsChanged
        @$__itemContainerElement.find(".#{@__itemClassName}").remove()
        @$__itemContainerElement.append @__renderItem item for item in @__items
      @__updateEnabledClass()
