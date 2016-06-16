  $(window).resize ->
    w.__hide() for w in registry.getByType Combo

  $(window).mousemove (e) ->
    # Relative to document
    MOUSE.page.x = e.pageX
    MOUSE.page.y = e.pageY

    # Relative to client area
    MOUSE.client.x = e.clientX
    MOUSE.client.y = e.clientY

    # Relative to entire screen
    MOUSE.screen.x = e.screenX
    MOUSE.screen.y = e.screenY

  return
