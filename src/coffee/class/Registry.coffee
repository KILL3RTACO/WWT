  root.registry = registry = new class Registry

    constructor: () ->
      @__widgets = []

    add: (widget) -> @__widgets.push widget if widget instanceof Widget
    getByType: (type, strict = false) ->
      if type isnt null then (w for w in @__widgets when (if not strict then w instanceof type else w.constructor is type)) else []
    getById: (id) ->
      root.util.validateString "id", id
      return null if id.length is 0
      for w in @__widgets
        return w if w.getId() is id
      return null
