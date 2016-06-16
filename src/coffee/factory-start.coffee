"use strict"
((factory) ->
  throw new Error("WWT cannot run in a windowless environment") if not window

  # Allows jQuery to still be used as a dependency in Electron using the
  # <script>window.$ = window.jQuery = require("./path/to/jquery.js")</script> trick
  # Otherwise, try to load jQuery as a module
  jq = if window.jQuery then window.jQuery else require "jquery"

  throw new Error("WWT requires jQuery to run") if not jq

  if typeof module is "object" and typeof module.exports is "object"
    electron = undefined
    try
      electron = require "electron"
    catch error
      # nothing
    factory jq, module.exports, electron
  else
    factory jq, (window.wwt = {})
)(($, root, electron) ->
