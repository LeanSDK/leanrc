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
      GenerateUuidIdMixin
    } = Module::

    class MainCollection extends Collection
      @inheritProtected()
      @include QueryableCollectionMixin
      @include ArangoCollectionMixin
      @include IterableMixin
      @include GenerateUuidIdMixin
      @module Module

    MainCollection.initialize()
  ```
  */
  module.exports = function(Module) {
    var Collection, FuncG, Mixin, RecordInterface, uuid;
    ({
      FuncG,
      Collection,
      Mixin,
      RecordInterface,
      Utils: {uuid}
    } = Module.prototype);
    return Module.defineMixin(Mixin('GenerateUuidIdMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          generateId: FuncG([RecordInterface], String)
        }, {
          default: function*() {
            return uuid.v4();
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
