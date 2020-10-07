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

  // миксин может подмешиваться в наследники класса Module
  module.exports = function(Module) {
    var MaybeG, Mixin, ModuleClass, PointerT, _, filesTreeSync, inflect;
    ({
      PointerT,
      MaybeG,
      Mixin,
      Module: ModuleClass,
      Utils: {_, inflect, filesTreeSync}
    } = Module.prototype);
    return Module.defineMixin(Mixin('NamespaceModuleMixin', function(BaseClass = ModuleClass) {
      return (function() {
        var _Class, cphPathMap, cpmHandler, cpoNamespace;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        cphPathMap = PointerT(_Class.private(_Class.static({
          pathMap: MaybeG(Object)
        })));

        cpmHandler = PointerT(_Class.private(_Class.static({
          handler: Function
        }, {
          default: function(Class) {
            return {
              get: function(aoTarget, asName) {
                var vsPath;
                if (!Reflect.get(aoTarget, asName)) {
                  vsPath = Class[cphPathMap][asName];
                  if (vsPath) {
                    require(vsPath)(Class);
                  }
                }
                return Reflect.get(aoTarget, asName);
              }
            };
          }
        })));

        cpoNamespace = PointerT(_Class.private(_Class.static({
          proto: MaybeG(Object)
        })));

        _Class.public(_Class.static({
          NS: Object
        }, {
          get: function() {
            var vsRoot;
            vsRoot = this.prototype.ROOT;
            if (this[cphPathMap] == null) {
              this[cphPathMap] = filesTreeSync(vsRoot, {
                filesOnly: true
              }).reduce(function(vhResult, vsItem) {
                var blackhole, ref, vsName;
                if (/\.(js|coffee)$/.test(vsItem)) {
                  [blackhole, vsName] = (ref = vsItem.match(/(\w+)\.(js|coffee)$/)) != null ? ref : [];
                  if (vsItem && vsName) {
                    vhResult[vsName] = `${vsRoot}/${vsItem}`;
                  }
                }
                return vhResult;
              }, {});
            }
            return this[cpoNamespace] != null ? this[cpoNamespace] : this[cpoNamespace] = new Proxy(this.prototype, this[cpmHandler](this));
          }
        }));

        _Class.public(_Class.static({
          inheritProtected: Function
        }, {
          default: function(...args) {
            this.super(...args);
            this[cphPathMap] = void 0;
            this[cpoNamespace] = void 0;
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

  /*
Module.NS.CoreObject
{ CoreObject } = Module.NS
*/

}).call(this);
