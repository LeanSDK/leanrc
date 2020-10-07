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
    var DictG, FuncG, Mixin, ModuleClass, _, filesTreeSync;
    ({
      FuncG,
      DictG,
      Mixin,
      Module: ModuleClass,
      Utils: {_, filesTreeSync}
    } = Module.prototype);
    return Module.defineMixin(Mixin('TemplatableModuleMixin', function(BaseClass = ModuleClass) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.static({
          templates: DictG(String, Function)
        }, {
          get: function() {
            return this.metaObject.getGroup('templates', false);
          }
        }));

        _Class.public(_Class.static({
          defineTemplate: FuncG([String, Function], Function)
        }, {
          default: function(filename, fun) {
            var ref, templateName, vsRoot, vsTemplatesDir;
            vsRoot = (ref = this.prototype.ROOT) != null ? ref : '.';
            vsTemplatesDir = `${vsRoot}/templates/`;
            templateName = filename.replace(vsTemplatesDir, '').replace(/\.js|\.coffee/, '');
            this.metaObject.addMetaData('templates', templateName, fun);
            return fun;
          }
        }));

        _Class.public(_Class.static({
          resolveTemplate: FuncG([], Function)
        }, {
          default: function(...args) {
            var path, ref, templateName, vsRoot, vsTemplatesDir;
            vsRoot = (ref = this.prototype.ROOT) != null ? ref : '.';
            vsTemplatesDir = `${vsRoot}/templates/`;
            path = require('path');
            templateName = path.resolve(...args).replace(vsTemplatesDir, '').replace(/\.js|\.coffee/, '');
            return this.templates[templateName];
          }
        }));

        _Class.public(_Class.static({
          loadTemplates: Function
        }, {
          default: function() {
            var files, ref, vsRoot, vsTemplatesDir;
            vsRoot = (ref = this.prototype.ROOT) != null ? ref : '.';
            vsTemplatesDir = `${vsRoot}/templates`;
            files = filesTreeSync(vsTemplatesDir, {
              filesOnly: true
            });
            (files != null ? files : []).forEach((i) => {
              var templateName, vsTemplatePath;
              templateName = i.replace(/\.js|\.coffee/, '');
              vsTemplatePath = `${vsTemplatesDir}/${templateName}`;
              return require(vsTemplatePath)(this.Module);
            });
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
