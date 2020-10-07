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
    var AnyT, FuncG, MaybeG, Mixin, RecordInterface, Serializer, SubsetG, _, inflect;
    ({
      AnyT,
      FuncG,
      SubsetG,
      MaybeG,
      RecordInterface,
      Serializer,
      Mixin,
      Utils: {_, inflect}
    } = Module.prototype);
    return Module.defineMixin(Mixin('HttpSerializerMixin', function(BaseClass = Serializer) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          normalize: FuncG([SubsetG(RecordInterface), MaybeG(AnyT)], RecordInterface)
        }, {
          default: function*(acRecord, ahPayload) {
            if (_.isString(ahPayload)) {
              ahPayload = JSON.parse(ahPayload);
            }
            return (yield acRecord.normalize(ahPayload, this.collection));
          }
        }));

        _Class.public(_Class.async({
          serialize: FuncG([MaybeG(RecordInterface), MaybeG(Object)], MaybeG(AnyT))
        }, {
          default: function*(aoRecord, options = null) {
            var recordName, singular, vcRecord;
            vcRecord = aoRecord.constructor;
            recordName = vcRecord.name.replace(/Record$/, '');
            singular = inflect.singularize(inflect.underscore(recordName));
            return {
              [`${singular}`]: (yield vcRecord.serialize(aoRecord, options))
            };
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
