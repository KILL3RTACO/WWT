module.exports = (grunt) ->

  SRC_DIR = "src"
  SRC_COFFEE_DIR = "#{SRC_DIR}/coffee/class"
  SRC_SASS_DIR = "#{SRC_DIR}/sass"

  SRC_COFFEE_FILES = []
  SRC_SASS_FILES = []

  pushFiles = (arr, dir) ->
    grunt.file.recurse dir, (abspath, rootdir, subdir, filename) ->
      arr.push "#{rootdir}/#{filename}" if not grunt.file.isDir abspath

  pushFiles SRC_SASS_FILES, SRC_SASS_DIR

  #Order is important, some classes extend others
  SRC_COFFEE_FILES.push "#{SRC_DIR}/coffee/#{file}.coffee" for file in [
    "factory-start"

    "class/Registry"

    "private"
    "public"

    #Classes
    "class/CssController"
    "class/EventListener"
    "class/Widget"
    "class/Composite"
    "class/Label"
    "class/Image"
    "class/Button"
    "class/ToggleButton"
    "class/ButtonGroup"
    "class/Text"
    "class/Spinner"
    "class/Switch"
    "class/Check"
    "class/Radio"
    "class/AbstractItemList"
    "class/List"
    "class/Combo"
    "class/Table"
    "class/TabFolder"
    "class/ProgressBar"
    "class/FileChooser"
    "class/ColorPicker" #Wrappers
    "class/YTVideo"

    "events"

    "factory-end"
  ]

  DIST_DIR = "dist"
  DIST_JS_DIR = "#{DIST_DIR}/js/lib"
  DIST_CSS_DIR = "#{DIST_DIR}/css"

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    banner: """
      Web Widget Toolkit (WWT) v<%= pkg.version %>
      By <%= pkg.author %>
    """
    coffee:
      dist:
        options:
          join: true
          joinExt: ".src.coffee"
        files:
          "#{DIST_JS_DIR}/wwt.js": SRC_COFFEE_FILES
    uglify:
      dist:
        src: "#{DIST_JS_DIR}/wwt.js"
        dest: "#{DIST_JS_DIR}/wwt.min.js"
    sass:
      dist:
        options:
          sourceMap: false
          style: "expanded"
          loadPath: "#{SRC_DIR}/sass-include/"
        files: [
          {
              expand: true
              cwd: "#{SRC_SASS_DIR}/"
              src: ["**/*.sass"]
              ext: ".css"
              dest: "dist/css/"
          }
        ]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-sass"

  grunt.registerTask "default", "Default task", ["coffee", "uglify", "sass"]
