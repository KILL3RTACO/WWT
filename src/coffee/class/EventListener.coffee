  root.EventListener = class EventListener

    addListener: (eventType, listener) ->
      @__checkDisposeState()
      root.util.validateString "eventType", eventType
      root.util.validateFunction "listener", listener
      @__getListeners(eventType).push listener
      return @
    removeAllListeners: (eventType = null) ->
      if eventType is null
        for k, v of @__listeners
          @__listeners[k].splice 0 if root.util.isArray @__listeners[k]
        return @
      __getListeners(eventType).splice 0
    removeListener: (eventType, listener) ->
      index = -1
      listeners = @__getListeners eventType
      return if listeners.length is 0
      for fn, i in listeners
        if fn is listener
          index = i
          break
      return if index < 0
      listeners.splice index, 1

    __getListeners: (eventType) ->
      list = @__listeners[eventType]
      list = (@__listeners[eventType] = []) if not root.util.isArray list
      return list

    notifyListeners: (eventType, eventData) ->
      @__checkDisposeState()
      root.util.validateString eventType, "string"
      listenerList = @__listeners[eventType]
      return if not root.util.isArray listenerList
      eventData = {} if typeof eventData isnt "object"
      l.call @, eventData for l in listenerList when typeof l is "function"
      return @
