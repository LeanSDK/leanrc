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

  // Здесь задекларировано как сейчас этот класс выглядит
  // возможно большая часть этого останется и перейдет в финальный вариант
  // Важно: в финале у инстанса не будет метода `exec` который есть сейчас, но будет метод `query` который будет вызываться извне, а в результате будет возвращатся объект с интерфейсом QueryObjectInterface , чтобы потом на основе этих данных конструировать на нужном языке запрос в базу данных
  module.exports = function(Module) {
    var FuncG, Interface, MaybeG, QueryInterface, QueryInterfaceDefinition, UnionG;
    ({
      FuncG,
      UnionG,
      MaybeG,
      QueryInterface: QueryInterfaceDefinition,
      Interface
    } = Module.prototype);
    return QueryInterface = (function() {
      class QueryInterface extends Interface {};

      QueryInterface.inheritProtected();

      QueryInterface.module(Module);

      QueryInterface.virtual(QueryInterface.static({
        operatorsMap: Object
      }));

      QueryInterface.virtual({
        $forIn: MaybeG(Object)
      });

      QueryInterface.virtual({
        $join: MaybeG(Object)
      });

      QueryInterface.virtual({
        $let: MaybeG(Object)
      });

      QueryInterface.virtual({
        $filter: MaybeG(Object)
      });

      QueryInterface.virtual({
        $collect: MaybeG(Object)
      });

      QueryInterface.virtual({
        $into: MaybeG(UnionG(String, Object))
      });

      QueryInterface.virtual({
        $having: MaybeG(Object)
      });

      QueryInterface.virtual({
        $sort: MaybeG(Array)
      });

      QueryInterface.virtual({
        $limit: MaybeG(Number)
      });

      QueryInterface.virtual({
        $offset: MaybeG(Number)
      });

      QueryInterface.virtual({
        $avg: MaybeG(String) // '@doc.price'
      });

      QueryInterface.virtual({
        $sum: MaybeG(String) // '@doc.price'
      });

      QueryInterface.virtual({
        $min: MaybeG(String) // '@doc.price'
      });

      QueryInterface.virtual({
        $max: MaybeG(String) // '@doc.price'
      });

      QueryInterface.virtual({
        $count: MaybeG(Boolean) // yes or not present
      });

      QueryInterface.virtual({
        $distinct: MaybeG(Boolean) // yes or not present
      });

      QueryInterface.virtual({
        $remove: MaybeG(UnionG(String, Object))
      });

      QueryInterface.virtual({
        $patch: MaybeG(Object)
      });

      QueryInterface.virtual({
        $return: MaybeG(UnionG(String, Object))
      });

      QueryInterface.virtual({
        forIn: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        join: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        filter: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        let: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        collect: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        into: FuncG([UnionG(String, Object)], QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        having: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        sort: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        limit: FuncG(Number, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        offset: FuncG(Number, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        distinct: FuncG([], QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        return: FuncG([UnionG(String, Object)], QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        remove: FuncG([UnionG(String, Object)], QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        patch: FuncG(Object, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        count: FuncG([], QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        avg: FuncG(String, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        min: FuncG(String, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        max: FuncG(String, QueryInterfaceDefinition)
      });

      QueryInterface.virtual({
        sum: FuncG(String, QueryInterfaceDefinition)
      });

      QueryInterface.initialize();

      return QueryInterface;

    }).call(this);
  };

}).call(this);
