  root.TabFolder = class TabFolder extends Widget

    class Tab extends Composite

      constructor: (@__folder, id, @$__tab) ->
        @__items = []
        super @__folder.$__content, id

      update: ->
        if not @__appended
          @$__element = $("<div id='#{@__id}' class='TabContent'></div>").appendTo @$__parent
          @__afterAppend()

        @$__tab.text @__title
        @$__tab.mouseenter =>
          @notifyListeners root.event.Hover

      isDisposed: -> false
      dispose: -> #do nothing, dipose by removeTab() in TabFolder

      __getTooltipElement: -> @$__tab

      getTabFolder: -> @__folder

      setText: (title, update = true) ->
        @__title = title if typeof title is "string"
        @update() if update
        return @
      getText: -> @__title

    constructor: (parent, id) ->
      @__tabs = []
      @__selectedTab = 0
      super parent, id

    remove: (index) ->
      @__checkDisposeState()
      indexCheck @__tabs, index
      @__tabs.splice index, 1
      return @
    append: (title, id) ->
      @__checkDisposeState()
      $t = $("<div class='Tab noselect'></div>")
      tab = new Tab this, id, $t.appendTo @$__tabContainer
      tab.setText title
      $t.click =>
        return if not tab.isEnabled()
        event =
          selection: $t.index()
          tab: tab
          canceled: false
        @notifyListeners root.event.Selection, event
        @setSelectedIndex $t.index() if event.canceled isnt true
      @__tabs.push tab
      @setSelectedIndex @__tabs.length - 1
      return tab
    clear: ->
      @__checkDisposeState()
      @remove 0 while @__tabs.length > 0

    getSelectedIndex: ->
      @__checkDisposeState()
      @__selectedTab
    getSelectedTab: ->
      @__checkDisposeState()
      @__tabs[@__selectedTab]
    setSelectedIndex: (index) ->
      @__checkDisposeState()
      indexCheck @__tabs, index
      selectedTab = @__tabs[@__selectedTab]
      selectedTab.$__tab.removeClass "selected"
      selectedTab.$__element.css display: "none"
      @__selectedTab = index
      selectedTab = @__tabs[index]
      selectedTab.$__tab.addClass "selected"
      selectedTab.$__element.css display: ""

    __getTooltipElement: -> null

    getTabs: ->
      @__checkDisposeState()
      @__tabs.slice 0

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div id='#{@__id}' class='TabFolder'>
          <div class='TabContainer'></div>
          <div class='TabContentContainer'></div>
        </div>").appendTo @$__parent
        @$__tabContainer = @$__element.find ".TabContainer"
        @$__content = @$__element.find ".TabContentContainer"
        @__afterAppend()
