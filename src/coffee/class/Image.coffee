  root.Image = class Image extends Widget

    constructor: (parent, id, src = "") ->
      super parent, id
      @setSrc src

    setSrc: (src) ->
      @__checkDisposeState()
      return if typeof src isnt "string"
      @__src = src
      @update()
    getSrc: -> @__src

    update: ->
      if not @__appended
        @$__element = $("<image/>").appendTo @$__parent

      @$__element.attr "src", @__src
      @__cssIf {display: "none"}, {display: ""}, @__src is ""
