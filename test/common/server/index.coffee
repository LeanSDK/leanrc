http = require 'http'
URL = require 'url'
querystring = require 'querystring'
_ = require 'lodash'
inflect = do require 'i'
RC = require '@leansdk/rc/lib'

module.exports = (options) ->

  server =  data: {}

  FIXTURE_NAME = "#{__dirname}/fixtures/#{options.fixture}.json"
  FIXTURE = (try require FIXTURE_NAME catch err then console.log err) ? {
    "/": {
      "OPTIONS": {
        "headers": {
          "Allow": "HEAD, OPTIONS"
        },
        "statusCode": 200,
        "statusMessage": "OK"
      },
      "HEAD": {
        "statusCode": 200,
        "statusMessage": "OK"
      },
    }
  }

  for own pathName, methods of FIXTURE
    for own methodName, methodConfig of methods
      if methodName is '*' or ',' in methodName
        names = if methodName is '*' then [
          'HEAD', 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
        ] else methodName.split ','
        delete methods[methodName]
        for name in names
          methods[name] = methodConfig  unless _.isEmpty name

  server.server = http.createServer (req, res) ->
    res.setHeader 'Content-Type', req.headers['accept'] ? 'text/plain'
    url = URL.parse req.url
    # console.log 'REQ:', url
    # console.log 'METHOD:', req.method
    # console.log 'URL:', req.url
    req.rawBody = Buffer.from []

    req.on 'data', (chunk) ->
      req.rawBody = Buffer.concat [req.rawBody, chunk], req.rawBody.length + chunk.length
      return
    req.on 'end', ->
      req.body = req.rawBody.toString 'utf8'
      # console.log 'BODY:', req.body
      body = if _.isEmpty(req.body) then {} else (try JSON.parse req.body) ? {}
      pathname = _.findKey FIXTURE, (value, key) ->
        if /\:/.test key
          mask = key.replace /(\:[\w\_]+)/g, '([\\w\\-]+)'
          regExp = new RegExp mask
          matches = regExp.test url.pathname
          if matches
            list1 = key.split '/'
            list2 = url.pathname.split '/'
            for i in [ 0 ... list1.length ]
              if list1[i] isnt list2[i]
                url.params ?= {}
                url.params[list1[i]] = list2[i]
          matches
        else
          key is url.pathname
      path = FIXTURE[pathname ? url.pathname]
      if path?
        if (method = path[req.method])?
          if method.redirect?
            res.statusCode = 302
            res.statusMessage = 'Found'
            res.setHeader 'Location', method.redirect
          else
            res.statusCode = method.statusCode
            res.statusCode ?= if req.method is 'DELETE' then 202 else 200
            res.statusMessage = method.statusMessage
            res.statusMessage ?= if req.method is 'DELETE' then 'No Content' else 'OK'
            if method.headers?
              for own headerName, headerValue of method.headers
                res.setHeader headerName, headerValue
            if method.data?
              switch method.data
                when 'SELF'
                  if req.method is 'POST'
                    body.id ?= RC::Utils.uuid.v4()
                    resp = "#{path.single}": body
                    server.data["test_#{path.plural}"] ?= []
                    server.data["test_#{path.plural}"].push body
                  else
                    body = [ body ]  unless _.isArray body
                    resp = "#{path.plural}": body
                  response = JSON.stringify resp
                when 'GET'
                  key = Object.keys(url.params)[0]
                  collectionId = inflect.pluralize key.replace /(^\:|_id$)/g, ''
                  collection = server.data["test_#{path.plural}"] ? []
                  record = _.find collection, id: url.params[key]
                  if record?
                    response = JSON.stringify "#{path.single}": record
                  else
                    res.statusCode = 404
                    res.statusMessage = 'Not Found'
                when 'DELETE'
                  key = Object.keys(url.params)[0]
                  collectionId = inflect.pluralize key.replace /(^\:|_id$)/g, ''
                  collection = server.data["test_#{path.plural}"] ? []
                  record = _.find collection, id: url.params[key]
                  if record?
                    response = JSON.stringify "#{path.single}": record
                    _.remove collection, id: url.params[key]
                  else
                    res.statusCode = 404
                    res.statusMessage = 'Not Found'
                when 'PUT', 'PATCH'
                  key = Object.keys(url.params)[0]
                  collectionId = inflect.pluralize key.replace /(^\:|_id$)/g, ''
                  collection = server.data["test_#{path.plural}"] ? []
                  record = _.find collection, id: url.params[key]
                  if record?
                    for key, value of body when value?
                      record[key] = value
                    response = JSON.stringify "#{path.single}": record
                  else
                    res.statusCode = 404
                    res.statusMessage = 'Not Found'
                when 'QUERY'
                  { query } = querystring.parse url.query
                  query = JSON.parse query  unless _.isEmpty query
                  query ?= body.query  if body.query?
                  collection = server.data[query?['$forIn']?['@doc'] ? "test_#{path.plural}"] ? []
                  filter = (item) ->
                    if query?.$filter?
                      for k, v of query.$filter
                        key = k.replace '@doc.', ''
                        if key is '_key'
                          key = 'id'
                        property = _.get item, key
                        if _.isString v
                          return no  unless property is v
                        else
                          for type, cond of v
                            switch type
                              when '$eq'
                                return no  unless property is cond
                              when '$in'
                                return no  unless property in cond
                              else
                                return no
                    yes
                  switch req.method
                    when 'POST'
                      if query['$insert']?
                        collection.push query['$insert']
                        response = JSON.stringify "#{path.plural}": [
                          query['$insert']
                        ]
                      else if query['$update']? or query['$replace']?
                        records = _.filter collection, filter
                        newBody = query['$update'] ? query['$replace']
                        for record in records
                          for key, value of newBody when key not in [ '_key', 'id' ]
                            record[key] = value
                        response = JSON.stringify "#{path.plural}": records
                      else if query['$remove']?
                        records = _.filter collection, filter
                        response = JSON.stringify "#{path.plural}": records
                        _.remove collection, filter
                      else
                        records = _.filter collection, filter
                        if query?['$count']
                          response = JSON.stringify count: records.length
                        else
                          response = JSON.stringify "#{path.plural}": records
                    when 'GET'
                      records = _.filter collection, filter
                      if query?['$count']
                        response = JSON.stringify count: records.length
                      else
                        response = JSON.stringify "#{path.plural}": records
                    when 'DELETE'
                      records = _.filter collection, filter
                      response = JSON.stringify "#{path.plural}": records
                      _.remove collection, filter
                    when 'PUT', 'PATCH'
                      records = _.filter collection, filter
                      for record in records
                        for key, value of body when key not in [ '_key', 'id' ]
                          record[key] = value
                      response = JSON.stringify "#{path.plural}": records
                else
                  response = JSON.stringify method.data  if method.data?
        else
          res.statusCode = 405
          res.statusMessage = 'Method Not Allowed'
      else
        res.statusCode = 404
        res.statusMessage = 'Not Found'
      if response?
        res.write response, 'utf8'
      res.end()
      return
    return

  server.listen = (args...) ->
    @server.listen args...
    return

  server.close = (callback) ->
    server.data = {}
    @server.close callback

  server
