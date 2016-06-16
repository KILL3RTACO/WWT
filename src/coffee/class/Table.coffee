  # TABLE CLASS DEFINITION
  #=======================
  root.Table = class Table extends Widget

    root.util.defineConstant Table, "Header", class Header extends CssController

      #Table.Header
      constructor: (value, id = "") ->
        super $("<th class='TableHeader noselect'></th>"), id
        @setValue value

      setValue: (value) ->
        root.util.validateString "value", value
        @__value = value
        @$__element.text @__value
        return @
      getValue: -> @__value

    root.util.defineConstant Table, "Row", class Row extends CssController

      root.util.defineConstant Row, "Value", class Value extends CssController

        #Table.Row.Value
        constructor: (value, id = "") ->
          super $("<td class='TableRowValue'></td>"), id
          @setValue value

        setValue: (value) ->
          throw new Error("value must be a string or a number") if typeof value isnt "string" and typeof value isnt "number"
          @__value = value
          @$__element.text @__value
          return @
        getValue: -> @__value

      makeValue = (value) ->
        if value instanceof Value then value else (if typeof value is "string" or typeof value is "number" then new Value(value) else null)

      #Table.Row
      constructor: (values, id = "") ->
        root.util.validateArray "values", values
        @__values = []
        (@__values.push v_ if (v_ = makeValue v) instanceof Value) for v in values
        super $("<tr class='TableRow'></tr>"), id

      setValue: (index, value) ->
        root.util.validateInt "index", index
        if not value instanceof Value
          throw new Error("value must be an instance of Table.Row.Value, a string, or a number") if typeof value isnt "string" and typeof value isnt "number"
          value = new Value(value)
        @__values[index] = value
        return @
      getValue: (index) ->
        return @getValues() if index is null
        root.util.validateInt "index", index
        @__values[index]
      getValues: ->
        arr = []
        (arr.push v if v instanceof Value) for v in @__values
        return arr
      __getValues: ->
        arr = []
        (arr.push if v instanceof Value then v else $("<td></td>")) for v in @__values
        return arr

    # Table
    constructor: (parent, id) ->
      @__headers = []
      @__rows = []
      super parent, id

    getHeaders: ->
      @__checkDisposeState()
      arr = []
      arr.push header for header in @__headers
      return arr

    update: ->
      @__checkDisposeState()
      if not @__appended
        @$__element = $("
          <table class='Table' id='#{@__id}'>
            <thead>
            </thead>
            <tbody></tbody>
          </table>
        ").appendTo @$__parent
        @__afterAppend()

      $headers = @$__parent.find "thead"
      $body = @$__parent.find "tbody"

      #empty headers and body
      $body.empty()
      $headers.empty()

      $headers.append h.$__element for h in @__headers
      for r in @__rows
        $row = r.$__element
        $row.empty()
        ($row.append if v instanceof Row.Value then v.$__element else v) for v in r.__getValues()
        $row.appendTo $body

      @__updateEnabledClass()
      #TODO: sortable?

    makeHeader = (header, id = "") ->
      header_ = header
      if typeof header is "string"
        header_ = new Header(header, if typeof id is "string" then id else "")
      throw new Error("header must be a string or an instance of Table.Header") if not header instanceof Header
      return header_

    makeRow = (row, id = "") ->
      row_ = row
      if root.util.isArray row
        row_ = new Row(row, if typeof id is "string" then id else "")
      throw new Error("row must be an array or an instance of Table.Row") if not row instanceof Row
      return row_

    set = (index, arr, make, thing, id, _this) ->
      indexCheck arr, index
      thing_ = make thing, id
      arr[index] = thing_
      _this.update()

    add = (thing, make, arr, _this) ->
      thing_ = make thing
      arr.push thing_
      _this.update()
      return thing_

    get = (index, arr, _this) ->
      indexCheck arr, index
      arr[index]
      _this.update()

    remove = (thing, arr, instanceClass) -> #index or Row|Header
      index = if Number.isInteger thing then thing else if thing instanceof instanceClass then $.inArray thing, arr else -1
      arr.splice index, 1 if -1 > index < arr.length
      return null

    setHeader: (index, header, id = "") -> #indexCheck
      @__checkDisposeState()
      set index, @__headers, makeHeader, header, id, @
      return @
    addHeader: (header) ->
      @__checkDisposeState()
      add header, makeHeader, @__headers, @
    getHeader: (index) ->
      @__checkDisposeState()
      get index, @__headers, @
    removeHeader: (header) ->
      @__checkDisposeState()
      remove header, @__headers, Header

    setRow: (index, row, id = "") ->
      @__checkDisposeState()
      set index, @__rows, makeRow, row, id, @
      return @
    addRow: (row) ->
      @__checkDisposeState()
      add row, makeRow, @__rows, @
    getRow: (index) ->
      @__checkDisposeState()
      get index, @__rows, @
    removeRow: (row) ->
      @__checkDisposeState()
      remove row, @__rows, Row, @
