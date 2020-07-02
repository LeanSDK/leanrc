# This file is part of LeanRC.
#
# LeanRC is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# LeanRC is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.

module.exports = (Module)->
  {
    APPLICATION_MEDIATOR
    AnyT, PointerT
    FuncG, SubsetG, MaybeG, UnionG, ListG, InterfaceG, DictG, StructG, EnumG
    RecordInterface, QueryInterface, CursorInterface
    Collection, Cursor, Mixin
    Utils: { _, inflect, request }
  } = Module::

  Module.defineMixin Mixin 'HttpCollectionMixin', (BaseClass = Collection) ->
    class extends BaseClass
      @inheritProtected()

      ipsRecordMultipleName = PointerT @private recordMultipleName: MaybeG String
      ipsRecordSingleName = PointerT @private recordSingleName: MaybeG String

      @public recordMultipleName: FuncG([], String),
        default: ->
          @[ipsRecordMultipleName] ?= inflect.pluralize @recordSingleName()

      @public recordSingleName: FuncG([], String),
        default: ->
          @[ipsRecordSingleName] ?= inflect.underscore @delegate.name.replace /Record$/, ''

      @public @async push: FuncG(RecordInterface, RecordInterface),
        default: (aoRecord)->
          params = {}
          params.requestType = 'push'
          params.recordName = @delegate.name
          params.snapshot = yield @serialize aoRecord

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            voRecord = yield @normalize body[@recordSingleName()]
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voRecord

      @public @async remove: FuncG([UnionG String, Number]),
        default: (id)->
          params = {}
          params.requestType = 'remove'
          params.recordName = @delegate.name
          params.id = id

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "
          yield return

      @public @async take: FuncG([UnionG String, Number], MaybeG RecordInterface),
        default: (id)->
          params = {}
          params.requestType = 'take'
          params.recordName = @delegate.name
          params.id = id

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            voRecord = yield @normalize body[@recordSingleName()]
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voRecord

      @public @async takeBy: FuncG([Object, MaybeG Object], CursorInterface),
        default: (query, options = {})->
          params = {}
          params.requestType = 'takeBy'
          params.recordName = @delegate.name
          params.query = $filter: query
          params.query.$sort = options.$sort if options.$sort?
          params.query.$limit = options.$limit if options.$limit?
          params.query.$offset = options.$offset if options.$offset?

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            vhRecordsData = body[@recordMultipleName()]
            voCursor = Cursor.new @, vhRecordsData
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voCursor

      @public @async takeMany: FuncG([ListG UnionG String, Number], CursorInterface),
        default: (ids)->
          params = {}
          params.requestType = 'takeBy'
          params.recordName = @delegate.name
          params.query = $filter: '@doc.id': {$in: ids}

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            vhRecordsData = body[@recordMultipleName()]
            voCursor = Cursor.new @, vhRecordsData
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voCursor

      @public @async takeAll: FuncG([], CursorInterface),
        default: ->
          params = {}
          params.requestType = 'takeAll'
          params.recordName = @delegate.name
          params.query = {}

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            vhRecordsData = body[@recordMultipleName()]
            voCursor = Cursor.new @, vhRecordsData
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voCursor

      @public @async override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface),
        default: (id, aoRecord)->
          params = {}
          params.requestType = 'override'
          params.recordName = @delegate.name
          params.snapshot = yield @serialize aoRecord
          params.id = id

          requestObj = @requestFor params
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res
          if body? and body isnt ''
            body = JSON.parse body if _.isString body
            voRecord = yield @normalize body[@recordSingleName()]
          else
            throw new Error "
              Record payload has not existed in response body.
            "
          yield return voRecord

      @public @async includes: FuncG([UnionG String, Number], Boolean),
        default: (id)->
          voQuery =
            $forIn: '@doc': @collectionFullName()
            $filter: '@doc.id': {$eq: id}
            $limit: 1
            $return: '@doc'
          return yield (yield @query voQuery).hasNext()

      @public @async length: FuncG([], Number),
        default: ->
          voQuery =
            $forIn: '@doc': @collectionFullName()
            $count: yes
          return (yield (yield @query voQuery).first()).count

      @public headers: MaybeG DictG String, String
      @public host: String,
        default: 'http://localhost'
      @public namespace: String,
        default: ''
      @public queryEndpoint: String,
        default: 'query'

      @public headersForRequest: FuncG(MaybeG(InterfaceG {
        requestType: String
        recordName: String
        snapshot: MaybeG Object
        id: MaybeG String
        query: MaybeG Object
        isCustomReturn: MaybeG Boolean
      }), DictG String, String),
        default: (params = {})->
          headers = @headers ? {}
          headers['Accept'] = 'application/json'
          if params.requestType in ['query', 'patchBy', 'removeBy']
            headers['Authorization'] = "Bearer #{@configs.apiKey}"
          else
            if params.requestType in ['takeAll', 'takeBy']
              headers['NonLimitation'] = @configs.apiKey
            service = @facade.retrieveMediator APPLICATION_MEDIATOR
              ?.getViewComponent()
            if service?.context?
              if service.context.headers['authorization'] is "Bearer #{@configs.apiKey}"
                headers['Authorization'] = "Bearer #{@configs.apiKey}"
              else
                sessionCookie = service.context.cookies.get @configs.sessionCookie
                headers['Cookie'] = "#{@configs.sessionCookie}=#{sessionCookie}"
            else
              headers['Authorization'] = "Bearer #{@configs.apiKey}"
          headers

      @public methodForRequest: FuncG(InterfaceG({
        requestType: String
        recordName: String
        snapshot: MaybeG Object
        id: MaybeG String
        query: MaybeG Object
        isCustomReturn: MaybeG Boolean
      }), String),
        default: ({requestType})->
          switch requestType
            when 'query' then 'POST'
            when 'patchBy' then 'POST'
            when 'removeBy' then 'POST'
            when 'takeAll' then 'GET'
            when 'takeBy' then 'GET'
            when 'take' then 'GET'
            when 'push' then 'POST'
            when 'remove' then 'DELETE'
            when 'override' then 'PUT'
            else
              'GET'

      @public dataForRequest: FuncG(InterfaceG({
        requestType: String
        recordName: String
        snapshot: MaybeG Object
        id: MaybeG String
        query: MaybeG Object
        isCustomReturn: MaybeG Boolean
      }), MaybeG Object),
        default: ({recordName, snapshot, requestType, query})->
          if snapshot? and requestType in ['push', 'override']
            return snapshot
          else if requestType in ['query', 'patchBy', 'removeBy']
            return {query}
          else
            return

      @public urlForRequest: FuncG(InterfaceG({
        requestType: String
        recordName: String
        snapshot: MaybeG Object
        id: MaybeG String
        query: MaybeG Object
        isCustomReturn: MaybeG Boolean
      }), String),
        default: (params)->
          {recordName, snapshot, id, requestType, query} = params
          @buildURL recordName, snapshot, id, requestType, query

      @public pathForType: FuncG(String, String),
        default: (recordName)->
          inflect.pluralize inflect.underscore recordName.replace /Record$/, ''

      @public urlPrefix: FuncG([MaybeG(String), MaybeG String], String),
        default: (path, parentURL)->
          if not @host or @host is '/'
            @host = ''

          if path
            # Protocol relative url
            if /^\/\//.test(path) or /http(s)?:\/\//.test(path)
              # Do nothing, the full @host is already included.
              return path

            # Absolute path
            else if path.charAt(0) is '/'
              return "#{@host}#{path}"
            # Relative path
            else
              return "#{parentURL}/#{path}"

          # No path provided
          url = []
          if @host then url.push @host
          if @namespace then url.push @namespace
          return url.join '/'

      @public makeURL: FuncG([String, MaybeG(Object), MaybeG(UnionG Number, String), MaybeG Boolean], String),
        default: (recordName, query, id, isQueryable)->
          url = []
          prefix = @urlPrefix()

          if recordName
            path = @pathForType recordName
            url.push path if path

          if isQueryable and @queryEndpoint?
            url.push encodeURIComponent @queryEndpoint
          url.unshift prefix if prefix

          url.push id if id?

          url = url.join '/'
          if not @host and url and url.charAt(0) isnt '/'
            url = '/' + url
          if query?
            query = encodeURIComponent JSON.stringify query ? ''
            url += "?query=#{query}"
          return url

      @public urlForQuery: FuncG([String, MaybeG Object], String),
        default: (recordName, query)->
          @makeURL recordName, null, null, yes

      @public urlForPatchBy: FuncG([String, MaybeG Object], String),
        default: (recordName, query)->
          @makeURL recordName, null, null, yes

      @public urlForRemoveBy: FuncG([String, MaybeG Object], String),
        default: (recordName, query)->
          @makeURL recordName, null, null, yes

      @public urlForTakeAll: FuncG([String, MaybeG Object], String),
        default: (recordName, query)->
          @makeURL recordName, query, null, no

      @public urlForTakeBy: FuncG([String, MaybeG Object], String),
        default: (recordName, query)->
          @makeURL recordName, query, null, no

      @public urlForTake: FuncG([String, String], String),
        default: (recordName, id)->
          @makeURL recordName, null, id, no

      @public urlForPush: FuncG([String, Object], String),
        default: (recordName, snapshot)->
          @makeURL recordName, null, null, no

      @public urlForRemove: FuncG([String, String], String),
        default: (recordName, id)->
          @makeURL recordName, null, id, no

      @public urlForOverride: FuncG([String, Object, String], String),
        default: (recordName, snapshot, id)->
          @makeURL recordName, null, id, no

      @public buildURL: FuncG([String, MaybeG(Object), MaybeG(String), String, MaybeG Object], String),
        default: (recordName, snapshot, id, requestType, query)->
          switch requestType
            when 'query'
              @urlForQuery recordName, query
            when 'patchBy'
              @urlForPatchBy recordName, query
            when 'removeBy'
              @urlForRemoveBy recordName, query
            when 'takeAll'
              @urlForTakeAll recordName, query
            when 'takeBy'
              @urlForTakeBy recordName, query
            when 'take'
              @urlForTake recordName, id
            when 'push'
              @urlForPush recordName, snapshot
            when 'remove'
              @urlForRemove recordName, id
            when 'override'
              @urlForOverride recordName, snapshot, id
            else
              vsMethod = "urlFor#{inflect.camelize requestType}"
              @[vsMethod]? recordName, query, snapshot, id

      @public requestFor: FuncG(InterfaceG({
        requestType: String
        recordName: String
        snapshot: MaybeG Object
        id: MaybeG String
        query: MaybeG Object
        isCustomReturn: MaybeG Boolean
      }), StructG {
        method: String
        url: String
        headers: DictG String, String
        data: MaybeG Object
      }),
        default: (params)->
          method  = @methodForRequest params
          url     = @urlForRequest params
          headers = @headersForRequest params
          data    = @dataForRequest params
          return {method, url, headers, data}

      @public @async sendRequest: FuncG(StructG({
        method: String
        url: String
        options: InterfaceG {
          json: EnumG [yes]
          headers: DictG String, String
          body: MaybeG Object
        }
      }), StructG {
        body: MaybeG AnyT
        headers: DictG String, String
        status: Number
        message: MaybeG String
      }),
        default: ({method, url, options})->
          return yield request method, url, options

      @public requestToHash: FuncG(StructG({
        method: String
        url: String
        headers: DictG String, String
        data: MaybeG Object
      }), StructG {
        method: String
        url: String
        options: InterfaceG {
          json: EnumG [yes]
          headers: DictG String, String
          body: MaybeG Object
        }
      }),
        default: ({method, url, headers, data})->
          options = {
            json: yes
            headers
          }
          options.body = data if data?
          return {
            method
            url
            options
          }

      @public @async makeRequest: FuncG(StructG({
        method: String
        url: String
        headers: DictG String, String
        data: MaybeG Object
      }), StructG {
        body: MaybeG AnyT
        headers: DictG String, String
        status: Number
        message: MaybeG String
      }),
        default: (requestObj)-> # result of requestFor
          {
            LogMessage: {
              SEND_TO_LOG
              LEVELS
              DEBUG
            }
          } = Module::
          hash = @requestToHash requestObj
          @sendNotification(SEND_TO_LOG, "HttpCollectionMixin::makeRequest hash #{JSON.stringify hash}", LEVELS[DEBUG])
          return yield @sendRequest hash

      @public @async parseQuery: FuncG(
        [UnionG Object, QueryInterface]
        UnionG Object, String, QueryInterface
      ),
        default: (aoQuery)->
          params = {}
          switch
            when aoQuery.$remove?
              if aoQuery.$forIn?
                params.requestType = 'removeBy'
                params.recordName = @delegate.name
                params.query = aoQuery
                params.isCustomReturn = yes
                yield return params
            when aoQuery.$patch?
              if aoQuery.$forIn?
                params.requestType = 'patchBy'
                params.recordName = @delegate.name
                params.query = aoQuery
                params.isCustomReturn = yes
                yield return params
            else
              params.requestType = 'query'
              params.recordName = @delegate.name
              params.query = aoQuery
              params.isCustomReturn = (
                aoQuery.$collect? or
                aoQuery.$count? or
                aoQuery.$sum? or
                aoQuery.$min? or
                aoQuery.$max? or
                aoQuery.$avg? or
                aoQuery.$remove? or
                aoQuery.$return isnt '@doc'
              )
              yield return params

      @public @async executeQuery: FuncG(
        [UnionG Object, String, QueryInterface]
        CursorInterface
      ),
        default: (aoQuery, options)->
          requestObj = @requestFor aoQuery
          res = yield @makeRequest requestObj

          if res.status >= 400
            throw new Error "
              Request failed with status #{res.status} #{res.message}
            "

          { body } = res

          if body? and body isnt ''
            if _.isString body
              body = JSON.parse body
            unless _.isArray body
              body = [body]

            if aoQuery.isCustomReturn
              return Cursor.new null, body
            else
              return Cursor.new @, body
          else
            return Cursor.new null, []


      @initializeMixin()
