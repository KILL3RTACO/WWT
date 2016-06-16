  class Accelerator

    constructor: (accelerator) ->
      root.util.validateString "accelerator", accelerator
      split = accelerator.split /\+/g
      for k in split
        if k is "CmdOrCtrl"
          if NATIVE_LAF is "cocoa"
            @__meta = true
          else
            @__ctrl = true
        else if k is "Ctrl"
          @__ctrl = true
        else if k is "Cmd" or k is "Meta" or k is "Win"
          @__mod = true
        else if k is "Shift"
          @__shift = true
        else if k.length is 1
          # keycode for character
