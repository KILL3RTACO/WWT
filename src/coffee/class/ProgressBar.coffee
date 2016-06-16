  root.ProgressBar = class ProgressBar extends Widget

    constructor: (parent, id) ->
      @__progress = 0
      super parent, id

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div id='#{@__id}' class='ProgressBar'> </div>").appendTo @$__parent
        @$__inner = $("<div class='ProgressBarInner'></div>").appendTo @$__element
        @$__element.mouseenter => @notifyListeners root.event.Hover
        @__afterAppend()

      @$__inner.css "width", "#{@__progress}%"
      @__classIf "full", @__progress is 100
      @__classIf "indeterminate", @__indeterminate

    setProgress: (progress, denominator = 100) ->
      @__checkDisposeState()
      root.util.validateNumber "progress", progress
      root.util.validateNumber "denominator", denominator
      @__progress = (progress / denominator) * 100
      @update()
      return @
    getProgress: ->
      @__checkDisposeState()
      @__progress

    setIndeterminate: (indeterminate = true) ->
      @__indeterminate = indeterminate is true
      @update()
      return @
    isIndeterminate: -> @__indeterminate
