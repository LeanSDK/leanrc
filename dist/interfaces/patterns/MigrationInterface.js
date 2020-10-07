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
    var AnyT, AsyncFuncG, AsyncFunctionT, EnumG, FuncG, Interface, InterfaceG, ListG, MaybeG, MigrationInterface, StructG, UnionG;
    ({AnyT, AsyncFunctionT, FuncG, ListG, StructG, EnumG, MaybeG, UnionG, InterfaceG, AsyncFuncG, Interface} = Module.prototype);
    return MigrationInterface = (function() {
      var DOWN, SUPPORTED_TYPES, UP;

      class MigrationInterface extends Interface {};

      MigrationInterface.inheritProtected();

      MigrationInterface.module(Module);

      MigrationInterface.const({
        UP: UP = Symbol('UP')
      });

      MigrationInterface.const({
        DOWN: DOWN = Symbol('DOWN')
      });

      MigrationInterface.const({
        SUPPORTED_TYPES: SUPPORTED_TYPES = {
          json: 'json',
          binary: 'binary',
          boolean: 'boolean',
          date: 'date',
          datetime: 'datetime',
          number: 'number',
          decimal: 'decimal',
          float: 'float',
          integer: 'integer',
          primary_key: 'primary_key',
          string: 'string',
          text: 'text',
          time: 'time',
          timestamp: 'timestamp',
          array: 'array',
          hash: 'hash'
        }
      });

      MigrationInterface.virtual({
        steps: ListG(StructG({
          args: Array,
          method: EnumG(['createCollection', 'createEdgeCollection', 'addField', 'addIndex', 'addTimestamps', 'changeCollection', 'changeField', 'renameField', 'renameIndex', 'renameCollection', 'dropCollection', 'dropEdgeCollection', 'removeField', 'removeIndex', 'removeTimestamps', 'reversible'])
        }))
      });

      MigrationInterface.virtual(MigrationInterface.static({
        createCollection: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        createCollection: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        createEdgeCollection: FuncG([String, String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        createEdgeCollection: FuncG([String, String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        addField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES),
            default: AnyT
          }))
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        addField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES),
            default: AnyT
          }))
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        addIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        addIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        addTimestamps: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        addTimestamps: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        changeCollection: FuncG([String, Object])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        changeCollection: FuncG([String, Object])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        changeField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES)
          }))
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        changeField: FuncG([
          String,
          String,
          UnionG(EnumG(SUPPORTED_TYPES),
          InterfaceG({
            type: EnumG(SUPPORTED_TYPES)
          }))
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        renameField: FuncG([String, String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        renameField: FuncG([String, String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        renameIndex: FuncG([String, String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        renameIndex: FuncG([String, String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        renameCollection: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        renameCollection: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        dropCollection: FuncG(String)
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        dropCollection: FuncG(String)
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        dropEdgeCollection: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        dropEdgeCollection: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        removeField: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        removeField: FuncG([String, String])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        removeIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        removeIndex: FuncG([
          String,
          ListG(String),
          InterfaceG({
            type: EnumG('hash',
          'skiplist',
          'persistent',
          'geo',
          'fulltext'),
            unique: MaybeG(Boolean),
            sparse: MaybeG(Boolean)
          })
        ])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        removeTimestamps: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        removeTimestamps: FuncG([String, MaybeG(Object)])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        reversible: FuncG(AsyncFuncG(StructG({
          up: AsyncFuncG(AsyncFunctionT),
          down: AsyncFuncG(AsyncFunctionT)
        })))
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        execute: FuncG(AsyncFunctionT)
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        migrate: FuncG([EnumG(UP, DOWN)])
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        change: FuncG(Function)
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        up: Function
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        up: FuncG(AsyncFunctionT)
      }));

      MigrationInterface.virtual(MigrationInterface.async({
        down: Function
      }));

      MigrationInterface.virtual(MigrationInterface.static({
        down: FuncG(AsyncFunctionT)
      }));

      MigrationInterface.initialize();

      return MigrationInterface;

    }).call(this);
  };

}).call(this);
