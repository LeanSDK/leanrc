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
    var FuncG, MaybeG, Mixin, ModuleClass, _, filesListSync;
    ({
      FuncG,
      MaybeG,
      Module: ModuleClass,
      Mixin,
      Utils: {_, filesListSync}
    } = Module.prototype);
    return Module.defineMixin(Mixin('SchemaModuleMixin', function(BaseClass = ModuleClass) {
      return (function() {
        var _Class, ref, ref1, ref2;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        // TODO: после того как все приложения будут переведены на использование связки loadMigrations-requireMigrations, этот метод надо удалить.
        _Class.public(_Class.static({
          defineMigrations: FuncG([MaybeG(String)]) // deprecated
        }, {
          default: function(asRoot = (ref = this.prototype.ROOT) != null ? ref : '.') {
            var files, vlMigrationNames, vsMigratonsDir;
            vsMigratonsDir = `${asRoot}/migrations`;
            files = filesListSync(vsMigratonsDir);
            vlMigrationNames = _.orderBy(_.compact((files != null ? files : []).map((i) => {
              var migrationName, vsMigrationPath;
              migrationName = i.replace(/\.js|\.coffee/, '');
              if (migrationName !== 'BaseMigration' && !/^\.|\.md$/.test(migrationName)) {
                vsMigrationPath = `${vsMigratonsDir}/${migrationName}`;
                require(vsMigrationPath)(this.Module);
                return migrationName;
              } else {
                return null;
              }
            })));
            this.const({
              MIGRATION_NAMES: vlMigrationNames
            });
          }
        }));

        _Class.public(_Class.static({
          loadMigrations: FuncG([MaybeG(String)])
        }, {
          default: function(asRoot = (ref1 = this.prototype.ROOT) != null ? ref1 : '.') {
            var files, vlMigrationNames, vsMigratonsDir;
            vsMigratonsDir = `${asRoot}/migrations`;
            files = filesListSync(vsMigratonsDir);
            vlMigrationNames = _.orderBy(_.compact((files != null ? files : []).map((i) => {
              var migrationName;
              migrationName = i.replace(/\.js|\.coffee/, '');
              if (migrationName !== 'BaseMigration' && !/^\.|\.md$/.test(migrationName)) {
                return migrationName;
              } else {
                return null;
              }
            })));
            this.const({
              MIGRATION_NAMES: vlMigrationNames
            });
          }
        }));

        _Class.public(_Class.static({
          requireMigrations: FuncG([MaybeG(String)])
        }, {
          default: function(asRoot = (ref2 = this.prototype.ROOT) != null ? ref2 : '.') {
            var vsMigratonsDir;
            vsMigratonsDir = `${asRoot}/migrations`;
            this.prototype.MIGRATION_NAMES.forEach((i) => {
              var migrationName, vsMigrationPath;
              migrationName = i.replace(/\.js|\.coffee/, '');
              vsMigrationPath = `${vsMigratonsDir}/${migrationName}`;
              return require(vsMigrationPath)(this.Module);
            });
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
