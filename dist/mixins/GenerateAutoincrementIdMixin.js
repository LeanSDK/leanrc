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
  /*
  for example

  ```coffee
  module.exports = (Module)->
    {
      Collection
      QueryableCollectionMixin
      ArangoCollectionMixin
      IterableMixin
      GenerateAutoincrementIdMixin
    } = Module::

    class MainCollection extends Collection
      @inheritProtected()
      @include QueryableCollectionMixin
      @include ArangoCollectionMixin
      @include IterableMixin
      @include GenerateAutoincrementIdMixin
      @module Module

    MainCollection.initialize()
  ```
  */
  module.exports = function(Module) {
    var Collection, FuncG, Mixin, Query, RecordInterface;
    ({FuncG, Collection, Mixin, Query, RecordInterface} = Module.prototype);
    return Module.defineMixin(Mixin('GenerateAutoincrementIdMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          generateId: FuncG([RecordInterface], Number)
        }, {
          default: function*() {
            var maxId, voQuery;
            voQuery = Query.new().forIn({
              '@doc': this.collectionFullName()
            }).max('@doc.id');
            maxId = (yield ((yield this.query(voQuery))).first());
            if (maxId == null) {
              maxId = 0;
            }
            return ++maxId;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
