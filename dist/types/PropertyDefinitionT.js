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
    var ANY, Class, DictG, EnumG, Generic, Interface, LAMBDA, Mixin, NILL, PropertyDefinitionT, TypeT, UnionG;
    ({ANY, NILL, LAMBDA, TypeT, Generic, Class, Mixin, Interface, DictG, UnionG, EnumG, PropertyDefinitionT} = Module.prototype);
    return PropertyDefinitionT.define(DictG(String, UnionG(EnumG([ANY, NILL, LAMBDA, Promise, Module.prototype.Promise, Generic, Class, Mixin, Module.prototype.Module, Interface, Function, String, Number, Boolean, Date, Object, Array, Map, Set, RegExp, Symbol, Error, Buffer, require('stream'), require('events')]), TypeT)));
  };

}).call(this);
