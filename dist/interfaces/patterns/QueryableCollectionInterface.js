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

  // методы `parseQuery` и `executeQuery` должны быть реализованы в миксинах в отдельных подлючаемых npm-модулях т.к. будут содержать некоторый платформозависимый код.
  module.exports = function(Module) {
    var CursorInterface, FuncG, Interface, MaybeG, QueryInterface, QueryableCollectionInterface, UnionG;
    ({FuncG, UnionG, MaybeG, QueryInterface, CursorInterface, Interface} = Module.prototype);
    return QueryableCollectionInterface = (function() {
      class QueryableCollectionInterface extends Interface {};

      QueryableCollectionInterface.inheritProtected();

      QueryableCollectionInterface.module(Module);

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        deleteBy: FuncG(Object)
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        destroyBy: FuncG(Object)
      }));

      // NOTE: обращается к БД
      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        removeBy: FuncG(Object)
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        findBy: FuncG([Object, MaybeG(Object)], CursorInterface)
      }));

      // NOTE: обращается к БД
      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        takeBy: FuncG([Object, MaybeG(Object)], CursorInterface)
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        updateBy: FuncG([Object, Object])
      }));

      // NOTE: обращается к БД
      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        patchBy: FuncG([Object, Object])
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        exists: FuncG(Object, Boolean)
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        query: FuncG([UnionG(Object, QueryInterface)], CursorInterface)
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        parseQuery: FuncG([UnionG(Object, QueryInterface)], UnionG(Object, String, QueryInterface))
      }));

      QueryableCollectionInterface.virtual(QueryableCollectionInterface.async({
        executeQuery: FuncG([UnionG(Object, String, QueryInterface)], CursorInterface)
      }));

      QueryableCollectionInterface.initialize();

      return QueryableCollectionInterface;

    }).call(this);
  };

}).call(this);
