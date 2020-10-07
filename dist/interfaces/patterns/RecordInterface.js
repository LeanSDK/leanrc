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

  // так как рекорд будет работать с простыми структурами данных в памяти, он не зависит от платформы.
  // если ему надо будет взаимодействовать с платформозависимой логикой - он будет делать это через прокси, но не напрямую (как в эмбере со стором)
  module.exports = function(Module) {
    var AnyT, AttributeConfigT, AttributeOptionsT, CollectionInterface, ComputedConfigT, ComputedOptionsT, DictG, FuncG, JoiT, ListG, MaybeG, PropertyDefinitionT, RecordInterface, RecordInterfaceDef, SubsetG, TransformInterface, TupleG;
    ({
      AnyT,
      JoiT,
      PropertyDefinitionT,
      AttributeOptionsT,
      ComputedOptionsT,
      AttributeConfigT,
      ComputedConfigT,
      FuncG,
      TupleG,
      MaybeG,
      SubsetG,
      DictG,
      ListG,
      CollectionInterface,
      RecordInterface: RecordInterfaceDef,
      TransformInterface
    } = Module.prototype);
    return RecordInterface = (function() {
      class RecordInterface extends TransformInterface {};

      RecordInterface.inheritProtected();

      RecordInterface.module(Module);

      RecordInterface.virtual({
        collection: CollectionInterface
      });

      RecordInterface.virtual(RecordInterface.static({
        schema: JoiT
      }));

      RecordInterface.virtual(RecordInterface.static(RecordInterface.async({
        normalize: FuncG([MaybeG(Object), CollectionInterface], RecordInterfaceDef)
      })));

      RecordInterface.virtual(RecordInterface.static(RecordInterface.async({
        serialize: FuncG([MaybeG(RecordInterfaceDef)], MaybeG(Object))
      })));

      RecordInterface.virtual(RecordInterface.static(RecordInterface.async({
        recoverize: FuncG([MaybeG(Object), CollectionInterface], MaybeG(RecordInterfaceDef))
      })));

      RecordInterface.virtual(RecordInterface.static({
        objectize: FuncG([MaybeG(RecordInterfaceDef), MaybeG(Object)], MaybeG(Object))
      }));

      RecordInterface.virtual(RecordInterface.static({
        makeSnapshot: FuncG([MaybeG(RecordInterfaceDef)], MaybeG(Object))
      }));

      RecordInterface.virtual(RecordInterface.static({
        parseRecordName: FuncG(String, TupleG(String, String))
      }));

      RecordInterface.virtual({
        parseRecordName: FuncG(String, TupleG(String, String))
      });

      RecordInterface.virtual(RecordInterface.static({
        findRecordByName: FuncG(String, SubsetG(RecordInterfaceDef))
      }));

      RecordInterface.virtual({
        findRecordByName: FuncG(String, SubsetG(RecordInterfaceDef))
      });

      /*
        @customFilter ->
          reason:
            '$eq': (value)->
       * string of some aql code for example
            '$neq': (value)->
       * string of some aql code for example
       */
      RecordInterface.virtual(RecordInterface.static({
        customFilters: Object
      }));

      RecordInterface.virtual(RecordInterface.static({
        customFilter: FuncG(Function)
      }));

      RecordInterface.virtual(RecordInterface.static({
        parentClassNames: FuncG([MaybeG(SubsetG(RecordInterfaceDef))], ListG(String))
      }));

      RecordInterface.virtual(RecordInterface.static({
        attributes: DictG(String, AttributeConfigT)
      }));

      RecordInterface.virtual(RecordInterface.static({
        computeds: DictG(String, ComputedConfigT)
      }));

      RecordInterface.virtual(RecordInterface.static({
        attribute: FuncG([PropertyDefinitionT, AttributeOptionsT])
      }));

      RecordInterface.virtual(RecordInterface.static({
        computed: FuncG([PropertyDefinitionT, ComputedOptionsT])
      }));

      RecordInterface.virtual(RecordInterface.static({
        new: FuncG([Object, CollectionInterface], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        save: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        create: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        update: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        delete: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        destroy: Function
      }));

      // NOTE: метод должен вернуть список атрибутов данного рекорда.
      RecordInterface.virtual({
        attributes: FuncG([], Object)
      });

      // NOTE: в оперативной памяти создается клон рекорда, НО с другим id
      RecordInterface.virtual(RecordInterface.async({
        clone: FuncG([], RecordInterfaceDef)
      }));

      // NOTE: в коллекции создается копия рекорда, НО с другим id
      RecordInterface.virtual(RecordInterface.async({
        copy: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        decrement: FuncG([String, MaybeG(Number)], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        increment: FuncG([String, MaybeG(Number)], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        toggle: FuncG(String, RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        touch: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        updateAttribute: FuncG([String, MaybeG(AnyT)], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        updateAttributes: FuncG(Object, RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        isNew: FuncG([], Boolean)
      }));

      RecordInterface.virtual(RecordInterface.async({
        reload: FuncG([], RecordInterfaceDef)
      }));

      RecordInterface.virtual(RecordInterface.async({
        changedAttributes: FuncG([], DictG(String, Array))
      }));

      RecordInterface.virtual(RecordInterface.async({
        resetAttribute: FuncG(String)
      }));

      RecordInterface.virtual(RecordInterface.async({
        rollbackAttributes: Function
      }));

      RecordInterface.initialize();

      return RecordInterface;

    }).call(this);
  };

}).call(this);
