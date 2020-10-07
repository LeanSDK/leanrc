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

  // миксин подмешивается к классам унаследованным от Module::Resource
  // если необходимо переопределить экшен list так чтобы он принимал квери (из браузера) и отдавал не все рекорды в коллекции, а только отфильтрованные
  // а также для добавления экшена query который будет использоваться из HttpCollectionMixin'а
  module.exports = function(Module) {
    var ContextInterface, EnumG, FuncG, ListG, Mixin, Resource, StructG, UnionG, _, isArangoDB, joi;
    ({
      FuncG,
      StructG,
      ListG,
      UnionG,
      EnumG,
      ContextInterface,
      Resource,
      Mixin,
      Utils: {_, isArangoDB, joi}
    } = Module.prototype);
    return Module.defineMixin(Mixin('QueryableResourceMixin', function(BaseClass = Resource) {
      return (function() {
        var MAX_LIMIT, _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        MAX_LIMIT = 50;

        _Class.public(_Class.async({
          writeTransaction: FuncG([String, ContextInterface], Boolean)
        }, {
          default: function*(asAction, aoContext) {
            var body, key, parse, query, result;
            result = (yield this.super(asAction, aoContext));
            if (result) {
              if (asAction === 'query') {
                body = isArangoDB() ? aoContext.req.body : (parse = require('co-body'), (yield parse(aoContext.req)));
                ({query} = body != null ? body : {});
                if (query != null) {
                  key = _.findKey(query, function(v, k) {
                    return k === '$patch' || k === '$remove';
                  });
                  result = key != null;
                }
              }
            }
            return result;
          }
        }));

        _Class.public(_Class.async({
          showNoHiddenByDefault: Function
        }, {
          default: function*(...args) {
            if (this.listQuery == null) {
              this.listQuery = {};
            }
            if (this.listQuery.$filter != null) {
              if (!/.*\@doc\.isHidden.*/.test(JSON.stringify(this.listQuery.$filter))) {
                this.listQuery.$filter = {
                  $and: [
                    this.listQuery.$filter,
                    {
                      '@doc.isHidden': false
                    }
                  ]
                };
              }
            } else {
              this.listQuery.$filter = {
                '@doc.isHidden': false
              };
            }
            return args;
          }
        }));

        _Class.action(_Class.async({
          list: FuncG([], StructG({
            meta: StructG({
              pagination: StructG({
                limit: UnionG(Number, EnumG(['not defined'])),
                offset: UnionG(Number, EnumG(['not defined']))
              })
            }),
            items: ListG(Object)
          }))
        }, {
          default: function*() {
            var limit, receivedQuery, ref, ref1, skip, vlItems, voQuery;
            receivedQuery = _.pick(this.listQuery, ['$filter', '$sort', '$limit', '$offset']);
            voQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collection.collectionFullName()
            }).return('@doc');
            if (receivedQuery.$filter) {
              (() => {
                var error;
                ({error} = joi.validate(receivedQuery.$filter, joi.object()));
                if (error != null) {
                  return this.context.throw(400, 'ValidationError: `$filter` must be an object', error.stack);
                }
              })();
              voQuery.filter(receivedQuery.$filter);
            }
            if (receivedQuery.$sort) {
              (() => {
                var error;
                ({error} = joi.validate(receivedQuery.$sort, joi.array().items(joi.object())));
                if (error != null) {
                  return this.context.throw(400, 'ValidationError: `$sort` must be an array');
                }
              })();
              receivedQuery.$sort.forEach(function(item) {
                return voQuery.sort(item);
              });
            }
            if (receivedQuery.$limit) {
              (() => {
                var error;
                ({error} = joi.validate(receivedQuery.$limit, joi.number()));
                if (error != null) {
                  return this.context.throw(400, 'ValidationError: `$limit` must be a number', error.stack);
                }
              })();
              voQuery.limit(receivedQuery.$limit);
            }
            if (receivedQuery.$offset) {
              (() => {
                var error;
                ({error} = joi.validate(receivedQuery.$offset, joi.number()));
                if (error != null) {
                  return this.context.throw(400, 'ValidationError: `$offset` must be a number', error.stack);
                }
              })();
              voQuery.offset(receivedQuery.$offset);
            }
            limit = Number(voQuery.$limit);
            if (this.needsLimitation) {
              voQuery.limit((function() {
                switch (false) {
                  case !(limit > MAX_LIMIT):
                  case !(limit < 0):
                  case !isNaN(limit):
                    return MAX_LIMIT;
                  default:
                    return limit;
                }
              })());
            } else if (!isNaN(limit)) {
              voQuery.limit(limit);
            }
            skip = Number(voQuery.$offset);
            voQuery.offset((function() {
              switch (false) {
                case !(skip < 0):
                case !isNaN(skip):
                  return 0;
                default:
                  return skip;
              }
            })());
            vlItems = (yield ((yield this.collection.query(voQuery))).toArray());
            return {
              meta: {
                pagination: {
                  limit: (ref = voQuery.$limit) != null ? ref : 'not defined',
                  offset: (ref1 = voQuery.$offset) != null ? ref1 : 'not defined'
                }
              },
              items: vlItems
            };
          }
        }));

        _Class.action(_Class.async({
          query: FuncG([], Array)
        }, {
          default: function*() {
            var body;
            ({body} = this.context.request);
            return (yield ((yield this.collection.query(body.query))).toArray());
          }
        }));

        // ------------ Chains definitions ---------
        _Class.chains(['query', 'list']);

        // @initialHook 'requiredAuthorizationHeader', only: ['query']
        _Class.initialHook('parseBody', {
          only: ['query']
        });

        _Class.beforeHook('showNoHiddenByDefault', {
          only: ['list']
        });

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
