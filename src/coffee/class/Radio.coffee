  # RADIO CLASS DEFINITION
  # Radio buttons are buttons in which only one can be selected at a time within its group. The programmer
  # can use the setGroup(string) function to set the button group.
  #=======================================================================================================
  root.Radio = class Radio extends Check

    constructor: (parent, id, text = "") ->
      @__classname = "Radio"
      @__inputType = "radio"
      super parent, id, text

    setGroup: (group, update = true) ->
      @__checkDisposeState()
      root.util.validateString "group", group
      @__group = group
      @update() if update
      return @
    getGroup: ->
      @__checkDisposeState()
      getString @__group
