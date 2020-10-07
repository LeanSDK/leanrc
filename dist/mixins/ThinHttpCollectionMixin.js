(function() {
  // This file is part of LeanRC.

  // LeanRC is free software: you can redistribute it and/or modify
  // it under the terms of the GNU Lesser General Public License as published by
  // the Free Software Foundation, either version 3 of the License, or
  // (at your option) any later version.

  // LeanRC is distributed in the hope that it will be useful,
  // but WITHOUT ANY WARRANTY; without even the implied warranty of
  // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  // GNU Lesser General Public License for more details.

  // You should have received a copy of the GNU Lesser General Public License
  // along with LeanRC.  If not, see <https://www.gnu.org/licenses/>.
  module.exports = function(Module) {
    var AnyT, Collection, Cursor, CursorInterface, DictG, EnumG, FuncG, InterfaceG, ListG, MaybeG, Mixin, PointerT, QueryInterface, RecordInterface, StructG, UnionG, _, inflect, request;
    ({
      AnyT,
      PointerT,
      FuncG,
      MaybeG,
      UnionG,
      ListG,
      DictG,
      StructG,
      EnumG,
      InterfaceG,
      RecordInterface,
      QueryInterface,
      CursorInterface,
      Collection,
      Cursor,
      Mixin,
      Utils: {_, inflect, request}
    } = Module.prototype);
    return Module.defineMixin(Mixin('ThinHttpCollectionMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class, ipsRecordMultipleName, ipsRecordSingleName;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        ipsRecordMultipleName = PointerT(_Class.private({
          recordMultipleName: MaybeG(String)
        }));

        ipsRecordSingleName = PointerT(_Class.private({
          recordSingleName: MaybeG(String)
        }));

        _Class.public({
          recordMultipleName: FuncG([], String)
        }, {
          default: function() {
            return this[ipsRecordMultipleName] != null ? this[ipsRecordMultipleName] : this[ipsRecordMultipleName] = inflect.pluralize(this.recordSingleName());
          }
        });

        _Class.public({
          recordSingleName: FuncG([], String)
        }, {
          default: function() {
            return this[ipsRecordSingleName] != null ? this[ipsRecordSingleName] : this[ipsRecordSingleName] = inflect.underscore(this.delegate.name.replace(/Record$/, ''));
          }
        });

        _Class.public(_Class.async({
          push: FuncG(RecordInterface, RecordInterface)
        }, {
          default: function*(aoRecord) {
            var body, requestObj, res, voRecord;
            requestObj = this.requestFor({
              requestType: 'push',
              recordName: this.delegate.name,
              snapshot: (yield this.serialize(aoRecord))
            });
            res = (yield this.makeRequest(requestObj));
            if (res.status >= 400) {
              throw new Error(`Request failed with status ${res.status} ${res.message}`);
            }
            ({body} = res);
            if ((body != null) && body !== '') {
              if (_.isString(body)) {
                body = JSON.parse(body);
              }
              voRecord = (yield this.normalize(body[this.recordSingleName()]));
            } else {
              throw new Error("Record payload has not existed in response body.");
            }
            return voRecord;
          }
        }));

        _Class.public(_Class.async({
          remove: FuncG([UnionG(String, Number)])
        }, {
          default: function*(id) {
            var requestObj, res;
            requestObj = this.requestFor({
              requestType: 'remove',
              recordName: this.delegate.name,
              id: id
            });
            res = (yield this.makeRequest(requestObj));
            if (res.status >= 400) {
              throw new Error(`Request failed with status ${res.status} ${res.message}`);
            }
          }
        }));

        _Class.public(_Class.async({
          take: FuncG([UnionG(String, Number)], MaybeG(RecordInterface))
        }, {
          default: function*(id) {
            var body, requestObj, res, voRecord;
            requestObj = this.requestFor({
              requestType: 'take',
              recordName: this.delegate.name,
              id: id
            });
            res = (yield this.makeRequest(requestObj));
            if (res.status >= 400) {
              throw new Error(`Request failed with status ${res.status} ${res.message}`);
            }
            ({body} = res);
            if ((body != null) && body !== '') {
              if (_.isString(body)) {
                body = JSON.parse(body);
              }
              voRecord = (yield this.normalize(body[this.recordSingleName()]));
            } else {
              throw new Error("Record payload has not existed in response body.");
            }
            return voRecord;
          }
        }));

        _Class.public(_Class.async({
          takeMany: FuncG([ListG(UnionG(String, Number))], CursorInterface)
        }, {
          default: function*(ids) {
            var records;
            records = (yield ids.map((id) => {
              return this.take(id);
            }));
            return Cursor.new(null, records);
          }
        }));

        _Class.public(_Class.async({
          takeAll: FuncG([], CursorInterface)
        }, {
          default: function*() {
            var body, requestObj, res, vhRecordsData, voCursor;
            requestObj = this.requestFor({
              requestType: 'takeAll',
              recordName: this.delegate.name
            });
            res = (yield this.makeRequest(requestObj));
            if (res.status >= 400) {
              throw new Error(`Request failed with status ${res.status} ${res.message}`);
            }
            ({body} = res);
            if ((body != null) && body !== '') {
              if (_.isString(body)) {
                body = JSON.parse(body);
              }
              vhRecordsData = body[this.recordMultipleName()];
              voCursor = Cursor.new(this, vhRecordsData);
            } else {
              throw new Error("Record payload has not existed in response body.");
            }
            return voCursor;
          }
        }));

        _Class.public(_Class.async({
          override: FuncG([UnionG(String, Number), RecordInterface], RecordInterface)
        }, {
          default: function*(id, aoRecord) {
            var body, requestObj, res, voRecord;
            requestObj = this.requestFor({
              requestType: 'override',
              recordName: this.delegate.name,
              snapshot: (yield this.serialize(aoRecord)),
              id: id
            });
            res = (yield this.makeRequest(requestObj));
            if (res.status >= 400) {
              throw new Error(`Request failed with status ${res.status} ${res.message}`);
            }
            ({body} = res);
            if ((body != null) && body !== '') {
              if (_.isString(body)) {
                body = JSON.parse(body);
              }
              voRecord = (yield this.normalize(body[this.recordSingleName()]));
            } else {
              throw new Error("Record payload has not existed in response body.");
            }
            return voRecord;
          }
        }));

        _Class.public(_Class.async({
          includes: FuncG([UnionG(String, Number)], Boolean)
        }, {
          default: function*(id) {
            var record;
            record = (yield this.take(id));
            return record != null;
          }
        }));

        _Class.public(_Class.async({
          length: FuncG([], Number)
        }, {
          default: function*() {
            var cursor;
            cursor = (yield this.takeAll());
            return (yield cursor.count());
          }
        }));

        _Class.public({
          headers: MaybeG(DictG(String, String))
        });

        _Class.public({
          host: String
        }, {
          default: 'http://localhost'
        });

        _Class.public({
          namespace: String
        }, {
          default: ''
        });

        _Class.public({
          queryEndpoint: String
        }, {
          default: 'query'
        });

        _Class.public({
          headersForRequest: FuncG(MaybeG(InterfaceG({
            requestType: String,
            recordName: String,
            snapshot: MaybeG(Object),
            id: MaybeG(String),
            query: MaybeG(Object),
            isCustomReturn: MaybeG(Boolean)
          })), DictG(String, String))
        }, {
          default: function(params) {
            var headers, ref;
            headers = (ref = this.headers) != null ? ref : {};
            headers['Accept'] = 'application/json';
            return headers;
          }
        });

        _Class.public({
          methodForRequest: FuncG(InterfaceG({
            requestType: String,
            recordName: String,
            snapshot: MaybeG(Object),
            id: MaybeG(String),
            query: MaybeG(Object),
            isCustomReturn: MaybeG(Boolean)
          }), String)
        }, {
          default: function({requestType}) {
            switch (requestType) {
              case 'takeAll':
                return 'GET';
              case 'take':
                return 'GET';
              case 'push':
                return 'POST';
              case 'override':
                return 'PUT';
              case 'remove':
                return 'DELETE';
              default:
                return 'GET';
            }
          }
        });

        _Class.public({
          dataForRequest: FuncG(InterfaceG({
            requestType: String,
            recordName: String,
            snapshot: MaybeG(Object),
            id: MaybeG(String),
            query: MaybeG(Object),
            isCustomReturn: MaybeG(Boolean)
          }), MaybeG(Object))
        }, {
          default: function({recordName, snapshot, requestType, query}) {
            if ((snapshot != null) && (requestType === 'push' || requestType === 'override')) {
              return snapshot;
            } else {

            }
          }
        });

        _Class.public({
          urlForRequest: FuncG(InterfaceG({
            requestType: String,
            recordName: String,
            snapshot: MaybeG(Object),
            id: MaybeG(String),
            query: MaybeG(Object),
            isCustomReturn: MaybeG(Boolean)
          }), String)
        }, {
          default: function(params) {
            var id, query, recordName, requestType, snapshot;
            ({recordName, snapshot, id, requestType, query} = params);
            return this.buildURL(recordName, snapshot, id, requestType, query);
          }
        });

        _Class.public({
          pathForType: FuncG(String, String)
        }, {
          default: function(recordName) {
            return inflect.pluralize(inflect.underscore(recordName.replace(/Record$/, '')));
          }
        });

        _Class.public({
          urlPrefix: FuncG([MaybeG(String), MaybeG(String)], String)
        }, {
          default: function(path, parentURL) {
            var url;
            if (!this.host || this.host === '/') {
              this.host = '';
            }
            if (path) {
              // Protocol relative url
              if (/^\/\//.test(path) || /http(s)?:\/\//.test(path)) {
                // Do nothing, the full @host is already included.
                return path;
              // Absolute path
              } else if (path.charAt(0) === '/') {
                return `${this.host}${path}`;
              } else {
                // Relative path
                return `${parentURL}/${path}`;
              }
            }
            // No path provided
            url = [];
            if (this.host) {
              url.push(this.host);
            }
            if (this.namespace) {
              url.push(this.namespace);
            }
            return url.join('/');
          }
        });

        _Class.public({
          makeURL: FuncG([String, MaybeG(Object), MaybeG(UnionG(Number, String)), MaybeG(Boolean)], String)
        }, {
          default: function(recordName, query, id, isQueryable) {
            var path, prefix, url;
            url = [];
            prefix = this.urlPrefix();
            if (recordName) {
              path = this.pathForType(recordName);
              if (path) {
                url.push(path);
              }
            }
            if (isQueryable && (this.queryEndpoint != null)) {
              url.push(encodeURIComponent(this.queryEndpoint));
            }
            if (prefix) {
              url.unshift(prefix);
            }
            if (id != null) {
              url.push(id);
            }
            url = url.join('/');
            if (!this.host && url && url.charAt(0) !== '/') {
              url = '/' + url;
            }
            if (query != null) {
              query = encodeURIComponent(JSON.stringify(query != null ? query : ''));
              url += `?query=${query}`;
            }
            return url;
          }
        });

        _Class.public({
          urlForTakeAll: FuncG([String, MaybeG(Object)], String)
        }, {
          default: function(recordName, query) {
            return this.makeURL(recordName, query, null, false);
          }
        });

        _Class.public({
          urlForTake: FuncG([String, String], String)
        }, {
          default: function(recordName, id) {
            return this.makeURL(recordName, null, id, false);
          }
        });

        _Class.public({
          urlForPush: FuncG([String, Object], String)
        }, {
          default: function(recordName, snapshot) {
            return this.makeURL(recordName, null, null, false);
          }
        });

        _Class.public({
          urlForRemove: FuncG([String, String], String)
        }, {
          default: function(recordName, id) {
            return this.makeURL(recordName, null, id, false);
          }
        });

        _Class.public({
          urlForOverride: FuncG([String, Object, String], String)
        }, {
          default: function(recordName, snapshot, id) {
            return this.makeURL(recordName, null, id, false);
          }
        });

        _Class.public({
          buildURL: FuncG([String, MaybeG(Object), MaybeG(String), String, MaybeG(Object)], String)
        }, {
          default: function(recordName, snapshot, id, requestType, query) {
            var vsMethod;
            switch (requestType) {
              case 'takeAll':
                return this.urlForTakeAll(recordName, query);
              case 'take':
                return this.urlForTake(recordName, id);
              case 'push':
                return this.urlForPush(recordName, snapshot);
              case 'remove':
                return this.urlForRemove(recordName, id);
              case 'override':
                return this.urlForOverride(recordName, snapshot, id);
              default:
                vsMethod = `urlFor${inflect.camelize(requestType)}`;
                return typeof this[vsMethod] === "function" ? this[vsMethod](recordName, query, snapshot, id) : void 0;
            }
          }
        });

        _Class.public({
          requestFor: FuncG(InterfaceG({
            requestType: String,
            recordName: String,
            snapshot: MaybeG(Object),
            id: MaybeG(String),
            query: MaybeG(Object),
            isCustomReturn: MaybeG(Boolean)
          }), StructG({
            method: String,
            url: String,
            headers: DictG(String, String),
            data: MaybeG(Object)
          }))
        }, {
          default: function(params) {
            var data, headers, method, url;
            method = this.methodForRequest(params);
            url = this.urlForRequest(params);
            headers = this.headersForRequest(params);
            data = this.dataForRequest(params);
            return {method, url, headers, data};
          }
        });

        // может быть переопределно другим миксином, который будет посылать запросы через jQuery.ajax например
        _Class.public(_Class.async({
          sendRequest: FuncG(StructG({
            method: String,
            url: String,
            options: InterfaceG({
              json: EnumG([true]),
              headers: DictG(String, String),
              body: MaybeG(Object)
            })
          }), StructG({
            body: MaybeG(AnyT),
            headers: DictG(String, String),
            status: Number,
            message: MaybeG(String)
          }))
        }, {
          default: function*({method, url, options}) {
            return (yield request(method, url, options));
          }
        }));

        // может быть переопределно другим миксином, который будет посылать запросы через jQuery.ajax например
        _Class.public({
          requestToHash: FuncG(StructG({
            method: String,
            url: String,
            headers: DictG(String, String),
            data: MaybeG(Object)
          }), StructG({
            method: String,
            url: String,
            options: InterfaceG({
              json: EnumG([true]),
              headers: DictG(String, String),
              body: MaybeG(Object)
            })
          }))
        }, {
          default: function({method, url, headers, data}) {
            var options;
            options = {
              json: true,
              headers
            };
            if (data != null) {
              options.body = data;
            }
            return {method, url, options};
          }
        });

        _Class.public(_Class.async({
          makeRequest: FuncG(StructG({
            method: String,
            url: String,
            headers: DictG(String, String),
            data: MaybeG(Object)
          }), StructG({
            body: MaybeG(AnyT),
            headers: DictG(String, String),
            status: Number,
            message: MaybeG(String)
          }))
        }, {
          default: function*(requestObj) { // result of requestFor
            var DEBUG, LEVELS, SEND_TO_LOG, hash;
            ({
              LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
            } = Module.prototype);
            hash = this.requestToHash(requestObj);
            this.sendNotification(SEND_TO_LOG, `ThinHttpCollectionMixin::makeRequest hash ${JSON.stringify(hash)}`, LEVELS[DEBUG]);
            return (yield this.sendRequest(hash));
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
