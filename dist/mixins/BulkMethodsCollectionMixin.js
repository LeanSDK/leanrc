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
    var Collection, FuncG, Mixin;
    ({FuncG, Collection, Mixin} = Module.prototype);
    return Module.defineMixin(Mixin('BulkMethodsCollectionMixin', function(BaseClass = Collection) {
      return (function() {
        var _Class;

        _Class = class extends BaseClass {};

        _Class.inheritProtected();

        _Class.public(_Class.async({
          bulkDelete: FuncG(String)
        }, {
          default: function*(query) {
            var DEBUG, LEVELS, SEND_TO_LOG, batchSize, count, deleteQuery, deletedAt, editorId, fetchQuery, filter, isHidden, offset, removerId, updatedAt;
            ({
              LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
            } = Module.prototype);
            ({deletedAt, removerId, filter, offset = 0} = JSON.parse(query));
            batchSize = 1000;
            fetchQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collectionFullName()
            }).filter(filter).sort({
              '@doc.createdAt': 'ASC'
            }).offset(offset).limit(batchSize).count('@doc');
            this.sendNotification(SEND_TO_LOG, `BulkMethodsCollectionMixin::bulkDelete fetchQuery = ${JSON.stringify(fetchQuery)}`, LEVELS[DEBUG]);
            count = (yield ((yield this.query(fetchQuery))).first());
            if (count > 0) {
              updatedAt = deletedAt;
              isHidden = true;
              editorId = removerId;
              deleteQuery = Module.prototype.Query.new().forIn({
                '@doc': this.collectionFullName()
              }).filter(filter).sort({
                '@doc.createdAt': 'ASC'
              }).offset(offset).limit(batchSize).patch({updatedAt, deletedAt, isHidden, editorId, removerId}).into(this.collectionFullName());
              this.sendNotification(SEND_TO_LOG, `BulkMethodsCollectionMixin::bulkDelete deleteQuery = ${JSON.stringify(deleteQuery)}`, LEVELS[DEBUG]);
              yield this.query(deleteQuery);
              if (count === batchSize) {
                yield this.delay(this.facade).bulkDelete(JSON.stringify({
                  deletedAt,
                  removerId,
                  filter,
                  offset: offset + batchSize
                }));
              }
            }
          }
        }));

        _Class.public(_Class.async({
          bulkDestroy: FuncG(String)
        }, {
          default: function*(query) {
            var DEBUG, LEVELS, SEND_TO_LOG, batchSize, count, fetchQuery, filter, removeQuery;
            ({
              LogMessage: {SEND_TO_LOG, LEVELS, DEBUG}
            } = Module.prototype);
            ({filter} = JSON.parse(query));
            batchSize = 1000;
            fetchQuery = Module.prototype.Query.new().forIn({
              '@doc': this.collectionFullName()
            }).filter(filter).sort({
              '@doc.createdAt': 'ASC'
            }).offset(0).limit(batchSize).count('@doc');
            this.sendNotification(SEND_TO_LOG, `BulkMethodsCollectionMixin::bulkDestroy fetchQuery = ${JSON.stringify(fetchQuery)}`, LEVELS[DEBUG]);
            count = (yield ((yield this.query(fetchQuery))).first());
            if (count > 0) {
              removeQuery = Module.prototype.Query.new().forIn({
                '@doc': this.collectionFullName()
              }).filter(filter).sort({
                '@doc.createdAt': 'ASC'
              }).offset(0).limit(batchSize).remove('all').into(this.collectionFullName());
              this.sendNotification(SEND_TO_LOG, `BulkMethodsCollectionMixin::bulkDestroy removeQuery = ${JSON.stringify(removeQuery)}`, LEVELS[DEBUG]);
              yield this.query(removeQuery);
              if (count === batchSize) {
                yield this.delay(this.facade).bulkDestroy(JSON.stringify({filter}));
              }
            }
          }
        }));

        _Class.initializeMixin();

        return _Class;

      }).call(this);
    }));
  };

}).call(this);
