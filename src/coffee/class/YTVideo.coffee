  # YTVIDEO CLASS DEFINITION
  # This is a wrapper for YouTube's embedded iframe player. The programmer can also utilize the IFrame API
  # (make sure to set 'enablejsapi' to 1 in the options, or call enableJsApi() in the Options object)
  #=======================================================================================================
  root.YTVideo = class YTVideo extends Widget

    ytConstant = (name, value) ->
      root.util.defineConstant YTVideo, name, value

    # YTVideo.Options CLASS DEFINITION
    # This is a helper class. All values passed are normalized to their correct value.
    # All set... methods return this for chaining
    #=================================================================================
    ytConstant "Options", class Options

      constructor: (videoId = "") ->
        @setVideoId videoId

      setAutoHide: (autohide) ->
        root.util.validateBoolean "autohide", autohide
        @autohide = if autohide then YTVideo.TRUE else YTVideo.FALSE
        return @
      isAutoHide: -> if @autohide is YTVideo.TRUE then true else false

      setAutoPlay: (autoplay) ->
        root.util.validateBoolean "autoplay", autoplay
        @autoplay = if autoplay then YTVideo.TRUE else YTVideo.FALSE
        return @
      isAutoPlay: -> @autoplay

      setSize: (width, height) ->
        @width = width if Number.isInteger width
        @height = width if Number.isInteger height
        return @

      setCcLoadPolicy: (ccLoadPolicy) ->
        root.util.validateInt "ccLoadPolicy", ccLoadPolicy
        @cc_load_policy = ccLoadPolicy
        return @
      getCcLoadPolicy: -> @cc_load_policy

      setColor: (color) ->
        root.util.validateString "color"
        throw new Error("color must be 'red' or 'white'") if color isnt "red" and color isnt "white"
        @color = color
        return @
      getColor: -> @color

      setControlPolicy: (controlPolicy) ->
        root.util.validateInt controlPolicy
        @controls = controlPolicy
        return @
      getControlPolicy: -> @controls

      enableKeyboardControls: ->
        @disablekb = YTVideo.FALSE
        return @
      disableKeyboardControls: ->
        @disablekb = YTVideo.TRUE
        return @

      enableJsApi: ->
        @enablejsapi = YTVideo.TRUE
        return @
      disableJsApi: ->
        @enablejsapi = YTVideo.FALSE
        return @

      setEnd: (end) ->
        root.util.validateNumber "end", end
        @end = end
        return @
      getEnd: -> @end

      setFullscreenAllowed: (fsAllowed) ->
        root.util.validateBoolean "fsAllowed", fsAllowed
        @fs = if fsAllowed then YTVideo.TRUE else YTVideo.FALSE
        return @
      isFullscreenAllowed: -> if @fs is YTVideo.TRUE then true else false

      setInterfaceLanguage: (interfaceLanguage) ->
        root.util.validateString "interfaceString", interfaceString
        @hl = interfaceLanguage
        return @
      getInterfaceLanguage: -> @hl

      setAnnotationsShownByDefault: ->
        @iv_load_policy = YTVideo.ANNOTATIONS_SHOWN_BY_DEFAULT
        return @
      setAnnotationsHiddenByDefault: ->
        @iv_load_policy = YTVideo.ANNOTATIONS_NOT_SHOWN_BY_DEFAULT
        return @
      areAnnotationShownByDefault: -> @iv_load_policy is YTVideo.ANNOTATIONS_SHOWN_BY_DEFAULT

      setListSearch: (query) ->
        root.util.validateString "query", query
        @listType = "search"
        @list = query
        return @

      setListUserUploads: (user) ->
        root.util.validateString "user", user
        @listType = "user_uploads"
        @list = user
        return @

      setListPlaylist: (id) ->
        root.util.validateString "id", id
        @listType = "playlist"
        @list = "PL#{id}"
        return @

      setLooping: (looping) ->
        root.util.validateBoolean "looping", looping
        @loop = if looping then YTVideo.TRUE else YTVideo.FALSE
        return @
      isLooping: -> @loop is YTVideo.TRUE

      setModestBranding: (modestBranding) ->
        root.util.validateBoolean "modestBranding", modestBranding
        @modestbranding = if modestBranding then YTVideo.TRUE else YTVideo.FALSE
        return @
      hasModestBranding: -> @modestbranding is YTVideo.TRUE

      setOrigin: (origin) ->
        root.util.validateString "origin", origin
        @origin = origin
        return @
      getOrigin: -> @origin

      setPlayerApiId: (playerApiId) ->
        root.util.validateString "playerApiId", playerApiId
        @playerapiid = playerApiId
        return @
      getPlayerApiId: -> @playerapiid

      setPlaylist: (playlist) ->
        root.util.validateArray "playlist", playlist
        @playlist = []
        (@playlist_.push id if typeof id is "string") for id in playlist
        return @
      getPlaylist: -> @playlist

      setPlaysInline: (playsInline) ->
        root.util.validateBoolean "playsInline", playsInline
        @playsinline = if playsInline then YTVideo.TRUE else YTVideo.FALSE
        return @
      playsInline: -> if @playsinline is YTVideo.TRUE then true else false

      setShowRelatedVideos: (showRelated) ->
        root.util.validateBoolean "showRelated", showRelated
        @rel = if showRelated then YTVideo.TRUE else YTVideo.FALSE
        return @
      showsRelatedVideos: -> if @rel is YTVideo.TRUE then true else false

      setShowInfo: (showInfo) ->
        root.util.validateBoolean "showInfo", showInfo
        @showinfo = if showInfo then YTVideo.TRUE else YTVideo.FALSE
        return @
      getShowInfo: -> if @showinfo is YTVideo.TRUE then true else false

      setStart: (start) ->
        root.util.validateNumber "start", start
        @start = start
        return @
      getStart: -> @start

      setVideoId: (videoId = "") ->
        root.util.validateString "videoId", videoId
        @videoId = videoId

      setDarkTheme: ->
        @theme = YTVideo.THEME_DARK
        return @
      setLightTheme: ->
        @theme = YTVideo.THEME_LIGHT
        return @
      isDarkTheme: -> @theme is YTVideo.THEME_DARK

    #booleans
    ytConstant "TRUE", 1
    ytConstant "FALSE", 0

    #autohide
    ytConstant "AUTOHIDE_VISIBLE", 0
    ytConstant "AUTOHIDE_AUTO", 1
    ytConstant "AUTOHIDE_AUTO_OR_VISIBLE", 2

    #cc_load_policy
    ytConstant "CC_SHOW_BY_DEFAULT", 1

    #controls
    ytConstant "CONTROLS_HIDDEN", 0
    ytConstant "CONTROLS_VISIBLE_IMMEDIATELY", 1
    ytConstant "CONTROLS_FLASH_LOAD_AFTER_PLAYBACK", 2

    #iv_load_policy (annotations)
    ytConstant "ANNOTATIONS_SHOWN_BY_DEFAULT", 1
    ytConstant "ANNOTATIONS_NOT_SHOWN_BY_DEFAULT", 3

    #theme
    ytConstant "THEME_DARK", "dark"
    ytConstant "THEME_LIGHT", "light"

    createParamList = (options) ->
      params = ""
      (params += "#{k}=#{v}&" if typeof v is "string" or typeof v is "number") for k, v of options
      return params.substring 0, params.length - 1

    createPlayer = ($parent, id, options = {}) ->
      options.videoId ?= ""
      id = if typeof @__id is "string" then "id='#{@__id}''" else ""
      $parent.append "
        <iframe #{id}
        src='https://youtube.com/embed/#{options.videoId}?#{createParamList options}'
        frameborder='0'
        allowfullscreen>
        </iframe>
      "

    constructor: (parent, id, options = {}) ->
      root.util.validateObject "options", options
      super parent, id
      root.util.validateString "options.videoId", options.videoId if options.videoId
      createPlayer @$__parent, id, options
      @__afterAppend()
