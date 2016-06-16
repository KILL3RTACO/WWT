  # SPINNER CLASS DEFINITION
  # Spinners are textboxes that only takes numerical input and have two arrows next to them.
  # The arrows control whether the input increments or decrements.
  # The minimum and maximum value of the spinner can be altered, as well as the interval
  # for when the arrows are clicked.
  # The user can click and hold the mouse button over the arrows to continously increment
  # or decrement the value of the Spinner.
  #========================================================================================
  root.Spinner = class Spinner extends Widget

    constructor: (parent, id, num = 0) ->
      super parent, id, false
      @setValue num
      @__min = Number.NEGATIVE_INFINITY
      @__max = Number.POSATIVE_INFINITY
      @__interval = 1

    setDecimalAllowed: ->
      @__checkDisposeState()
      @__allowDecimal = allowDecimal is true
      return @
    isDecimalAllowed: ->
      @__checkDisposeState()
      @__allowDecimal

    __testInputAllowed = (input, allowDecimal) ->
      throw new Error("decimals are not allowed for this Spinner") if not allowDecimal and not Number.isInteger input

    setInterval: (interval) ->
      @__checkDisposeState()
      root.util.validateNumber "interval", interval
      __testInputAllowed interval, @__allowDecimal
      throw new Error("interval cannot be 0") if interval is 0
      @__interval = interval
      return @
    getInterval: ->
      @__checkDisposeState()
      @__interval

    setMinimum: (min) ->
      @__checkDisposeState()
      root.util.validateNumber "min", min
      __testInputAllowed min, @__allowDecimal
      throw new Error("Given minimum (#{min}) cannot more than the current maximum (#{@__max})") if min > @__max
      @__min = min
      @setValue @__num
      return @
    getMinimum: ->
      @__checkDisposeState()
      @__min

    setMaximum: (max) ->
      @__checkDisposeState()
      root.util.validateNumber "max", max
      __testInputAllowed max, @__allowDecimal
      throw new Error("Given maximum (#{max}) cannot less than the current minimum (#{@__min})") if max < @__min
      @__max = max
      @setValue @__num
      return @
    getMaximum: ->
      @__checkDisposeState()
      @__max

    setValue: (num, update = true) ->
      @__checkDisposeState()
      root.util.validateNumber "num", num
      __testInputAllowed num, @__allowDecimal
      @__num = if num < @__min then @__min else if num > @__max then @__max else num
      @update() if update
      return @
    getValue: ->
      @__checkDisposeState()
      @__num

    increment: (steps = 1) ->
      @__checkDisposeState()
      root.util.validateInt "steps", steps
      @setValue @__num + (steps * @__interval), true

    decrement: (steps = 1) ->
      @__checkDisposeState()
      root.util.validateInt "steps", steps
      @setValue @__num - (steps * @__interval), true

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("<div id='#{@__id}' class='Spinner'></div>").appendTo @$__parent
        @$__number = $("<input type='text' class='Text SpinnerNumber'/>").appendTo @$__element
        @$__buttonContainer = $("<div class='SpinnerButtonsContainer'></div>").appendTo @$__element
        @$__upButton = $("<div class='SpinnerIncrement'><div class='SpinnerUpArrow'></div></div>").appendTo @$__buttonContainer
        @$__downButton = $("<div class='SpinnerDecrement'><div class='SpinnerDownArrow'></div></div>").appendTo @$__buttonContainer
        @__afterAppend()

        @$__element.mouseenter => @notifyListeners root.event.Hover

        intervalId = 0
        updateInterval = 100

        fireEvent = (num, increment, arrow) =>
          event =
            value: num + increment
            arrow: arrow
            canceled: false
          fire = =>
            event.canceled = false
            @notifyListeners root.event.Modify, event
            return false if event.canceled is true
            @setValue event.value if typeof event.value is "number"
            @notifyListeners root.event.AfterModify, {arrow: event.arrow}
            return true
          return if not fire()
          intervalId = window.setInterval =>
            event.value += increment
            fire()
          , updateInterval

        hookEvents = (increment) =>
          $e = if increment then @$__upButton else @$__downButton
          $e.mousedown =>
            return if not @isEnabled()
            fireEvent @__num, (if increment then @__interval else -@__interval), if increment then 0 else 1
          .mouseup =>
            return if not @isEnabled()
            window.clearInterval intervalId

        hookEvents true
        hookEvents false

        @$__number.on "input", (e) =>

          numString = @$__number.val()
          newNum = null
          zeroAlias = numString is "." or numString is "-" or numString is ""
          if zeroAlias
            newNum = 0
          else
            newNum = Number numString
            if Number.isNaN(newNum) or newNum < @__min or newNum > @__max
              @$__number.val @__num
              return

          event =
            value: newNum
            arrow: false
            canceled: false
          @notifyListeners root.event.Modify, event

          if event.canceled is true
            @$__number.val @__num
            return
          else
            @__num = if typeof event.value is "number" then event.value else newNum
            @__updateClassAndAttr not zeroAlias

          @notifyListeners root.event.AfterModify, {arrow: event.arrow}

      @__updateClassAndAttr true
      return @

    __updateClassAndAttr: (number) ->
      @__updateEnabledClass()
      @$__number.val(@__num) if number
      @__updateEnabledAttr @$__number
