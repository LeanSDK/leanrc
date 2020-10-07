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
  var hasProp = {}.hasOwnProperty;

  /*
  в Ember app это может выглядить так.
  ```coffee
  cucumber = {id: 123}
  @store.query 'user',
    $and: [
      '@doc.cucumberId': {$eq: cucumber.id}
      '@doc.price': {$gt: 85}
    ]
  ```
  */
  // надо определить символ, который будет говорить об использовании объявленной переменной (ссылки), чтобы в случае когда должна ретюрниться простая строка, в объявлении просто не было символа. можно заиспользовать '@'
  /*
  example

  ```coffee
  new Query()
    .forIn '@doc': 'users'
    .forIn '@tomato': 'tomatos'
    .let
      '@user_cucumbers':
        $forIn: '@cucumber': 'cucumbers'
        $filter:
          $and: [
            '@doc.cucumberId': {$eq: '@cucumber._key'}
            '@cucumber.price': {$gt: 85}
          ]
        $return: '@cucumber'
    .join
      '@doc.tomatoId': {$eq: '@tomato._key'}
      '@tomato.active': {$eq: yes}
    .filter '@doc.active': {$eq: yes}
    .sort '@doc.firstName': 'DESC'
    .limit 10
    .offset 10
    .return {user: '@user', cucumbers: '@user_cucumbers', tomato: '@tomato'}
  ```

  But it equvalent json
  ```
  {
    $forIn: '@doc': 'users', '@tomato': 'tomatos'
    $let:
      '@user_cucumbers':
        $forIn: '@cucumber': 'cucumbers'
        $filter:
          $and: [
            '@doc.cucumberId': {$eq: '@cucumber._key'}
            '@cucumber.price': {$gt: 85}
          ]
         $return: '@cucumber'
    $join: $and: [
      '@doc.tomatoId': {$eq: '@tomato._key'}
      '@tomato.active': {$eq: yes}
    ]
    $filter: '@doc.active': {$eq: yes}
    $sort: ['@doc.firstName': 'DESC']
    $limit: 10
    $offset: 10
    $return: {user: '@user', cucumbers: '@user_cucumbers', tomato: '@tomato'}
  }
  ```

  example for collect
  ```
  {
    $forIn: '@doc': 'users'
    $filter: '@doc.active': {$eq: yes}
    $collect: '@country': '@doc.country', '@city': '@doc.city'
    $into: '@groups': {name: '@doc.name', isActive: '@doc.active'}
    $having: '@country': {$nin: ['Australia', 'Ukraine']}
    $return: {country: '@country', city: '@city', usersInCity: '@groups'}
  }

   * or

  {
    $forIn: '@doc': 'users'
    $filter: '@doc.active': {$eq: yes}
    $collect: '@ageGroup': 'FLOOR(@doc.age / 5) * 5'
    $aggregate: '@minAge': 'MIN(@doc.age)', '@maxAge': 'MAX(@doc.age)'
    $return: {ageGroup: '@ageGroup', minAge: '@minAge', maxAge: '@maxAge'}
  }
  ```
   */
  module.exports = function(Module) {
    var AnyT, CoreObject, FuncG, MaybeG, Query, QueryInterface, SubsetG, UnionG, _;
    ({
      AnyT,
      FuncG,
      SubsetG,
      UnionG,
      MaybeG,
      QueryInterface,
      CoreObject,
      Utils: {_}
    } = Module.prototype);
    return Query = (function() {
      class Query extends CoreObject {};

      Query.inheritProtected();

      Query.implements(QueryInterface);

      Query.module(Module);

      // TODO: это надо переделать на нормальную проверку типа в $filter
      Query.public(Query.static({
        operatorsMap: Object
      }, {
        default: {
          $and: Array,
          $or: Array,
          $not: Object,
          $nor: Array, // not or # !(a||b) === !a && !b
          
          // без вложенных условий и операторов - value конечное значение для сравнения
          $eq: AnyT, // ==
          $ne: AnyT, // !=
          $lt: AnyT, // <
          $lte: AnyT, // <=
          $gt: AnyT, // >
          $gte: AnyT, // >=
          $in: Array, // check value present in array
          $nin: Array, // ... not present in array
          
          // field has array of values
          $all: Array, // contains some values
          $elemMatch: Object, // conditions for complex item
          $size: Number, // condition for array length
          $exists: Boolean, // condition for check present some value in field
          $type: String, // check value type
          $mod: Array, // [divisor, remainder] for example [4,0] делится ли на 4
          $regex: UnionG(RegExp, String), // value must be string. ckeck it by RegExp.
          $td: Boolean, // this day (today)
          $ld: Boolean, // last day (yesterday)
          $tw: Boolean, // this week
          $lw: Boolean, // last week
          $tm: Boolean, // this month
          $lm: Boolean, // last month
          $ty: Boolean, // this year
          $ly: Boolean // last year
        }
      }));

      Query.public({
        $forIn: MaybeG(Object)
      });

      Query.public({
        $join: MaybeG(Object)
      });

      Query.public({
        $let: MaybeG(Object)
      });

      Query.public({
        $filter: MaybeG(Object)
      });

      Query.public({
        $collect: MaybeG(Object)
      });

      Query.public({
        $into: MaybeG(UnionG(String, Object))
      });

      Query.public({
        $having: MaybeG(Object)
      });

      Query.public({
        $sort: MaybeG(Array)
      });

      Query.public({
        $limit: MaybeG(Number)
      });

      Query.public({
        $offset: MaybeG(Number)
      });

      Query.public({
        $avg: MaybeG(String) // '@doc.price'
      });

      Query.public({
        $sum: MaybeG(String) // '@doc.price'
      });

      Query.public({
        $min: MaybeG(String) // '@doc.price'
      });

      Query.public({
        $max: MaybeG(String) // '@doc.price'
      });

      Query.public({
        $count: MaybeG(Boolean) // yes or not present
      });

      Query.public({
        $distinct: MaybeG(Boolean) // yes or not present
      });

      Query.public({
        $remove: MaybeG(UnionG(String, Object))
      });

      Query.public({
        $patch: MaybeG(Object)
      });

      Query.public({
        $return: MaybeG(UnionG(String, Object))
      });

      Query.public({
        forIn: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinitions) {
          var k, v;
          for (k in aoDefinitions) {
            if (!hasProp.call(aoDefinitions, k)) continue;
            v = aoDefinitions[k];
            this.$forIn[k] = v;
          }
          return this;
        }
      });

      Query.public({
        join: FuncG(Object, QueryInterface) // критерии связывания как в SQL JOIN ... ON
      }, {
        default: function(aoDefinitions) {
          this.$join = aoDefinitions;
          return this;
        }
      });

      Query.public({
        filter: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinitions) {
          this.$filter = aoDefinitions;
          return this;
        }
      });

      Query.public({
        let: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinitions) {
          var k, v;
          if (this.$let == null) {
            this.$let = {};
          }
          for (k in aoDefinitions) {
            if (!hasProp.call(aoDefinitions, k)) continue;
            v = aoDefinitions[k];
            this.$let[k] = v;
          }
          return this;
        }
      });

      Query.public({
        collect: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinition) {
          this.$collect = aoDefinition;
          return this;
        }
      });

      Query.public({
        into: FuncG([UnionG(String, Object)], QueryInterface)
      }, {
        default: function(aoDefinition) {
          this.$into = aoDefinition;
          return this;
        }
      });

      Query.public({
        having: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinition) {
          this.$having = aoDefinition;
          return this;
        }
      });

      Query.public({
        sort: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinition) {
          if (this.$sort == null) {
            this.$sort = [];
          }
          this.$sort.push(aoDefinition);
          return this;
        }
      });

      Query.public({
        limit: FuncG(Number, QueryInterface)
      }, {
        default: function(anValue) {
          this.$limit = anValue;
          return this;
        }
      });

      Query.public({
        offset: FuncG(Number, QueryInterface)
      }, {
        default: function(anValue) {
          this.$offset = anValue;
          return this;
        }
      });

      Query.public({
        distinct: FuncG([], QueryInterface)
      }, {
        default: function() {
          this.$distinct = true;
          return this;
        }
      });

      Query.public({
        remove: FuncG([UnionG(String, Object)], QueryInterface)
      }, {
        default: function(expr = true) {
          this.$remove = expr;
          return this;
        }
      });

      Query.public({
        patch: FuncG(Object, QueryInterface)
      }, {
        default: function(aoDefinition) {
          this.$patch = aoDefinition;
          return this;
        }
      });

      Query.public({
        return: FuncG([UnionG(String, Object)], QueryInterface)
      }, {
        default: function(aoDefinition) {
          this.$return = aoDefinition;
          return this;
        }
      });

      Query.public({
        count: FuncG([], QueryInterface)
      }, {
        default: function() {
          this.$count = true;
          return this;
        }
      });

      Query.public({
        avg: FuncG(String, QueryInterface)
      }, {
        default: function(asDefinition) {
          this.$avg = asDefinition;
          return this;
        }
      });

      Query.public({
        min: FuncG(String, QueryInterface)
      }, {
        default: function(asDefinition) {
          this.$min = asDefinition;
          return this;
        }
      });

      Query.public({
        max: FuncG(String, QueryInterface)
      }, {
        default: function(asDefinition) {
          this.$max = asDefinition;
          return this;
        }
      });

      Query.public({
        sum: FuncG(String, QueryInterface)
      }, {
        default: function(asDefinition) {
          this.$sum = asDefinition;
          return this;
        }
      });

      Query.public(Query.static(Query.async({
        restoreObject: FuncG([SubsetG(Module), Object], QueryInterface)
      }, {
        default: function*(_Module, replica) {
          var instance;
          if ((replica != null ? replica.class : void 0) === this.name && (replica != null ? replica.type : void 0) === 'instance') {
            instance = this.new(replica.query);
            return instance;
          } else {
            return (yield this.super(_Module, replica));
          }
        }
      })));

      Query.public(Query.static(Query.async({
        replicateObject: FuncG(QueryInterface, Object)
      }, {
        default: function*(instance) {
          var replica;
          replica = (yield this.super(instance));
          replica.query = instance.toJSON();
          return replica;
        }
      })));

      Query.public({
        init: FuncG([MaybeG(Object)])
      }, {
        default: function(aoQuery) {
          var key, value;
          this.super(...arguments);
          this.$forIn = {};
          if (aoQuery != null) {
            for (key in aoQuery) {
              if (!hasProp.call(aoQuery, key)) continue;
              value = aoQuery[key];
              ((key, value) => {
                return this[key] = value;
              })(key, value);
            }
          }
        }
      });

      Query.public({
        toJSON: FuncG([], Object)
      }, {
        default: function() {
          var i, k, len, ref, res;
          res = {};
          ref = ['$forIn', '$join', '$let', '$filter', '$collect', '$into', '$having', '$sort', '$limit', '$offset', '$avg', '$sum', '$min', '$max', '$count', '$distinct', '$remove', '$patch', '$return'];
          for (i = 0, len = ref.length; i < len; i++) {
            k = ref[i];
            if (this[k] != null) {
              res[k] = this[k];
            }
          }
          return res;
        }
      });

      Query.initialize();

      return Query;

    }).call(this);
  };

}).call(this);
