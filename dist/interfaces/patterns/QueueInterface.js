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
    var AnyT, FuncG, Interface, ListG, MaybeG, QueueInterface, ResqueInterface, UnionG;
    ({AnyT, FuncG, MaybeG, UnionG, ListG, ResqueInterface, Interface} = Module.prototype);
    return QueueInterface = (function() {
      class QueueInterface extends Interface {};

      QueueInterface.inheritProtected();

      QueueInterface.module(Module);

      QueueInterface.virtual({
        resque: ResqueInterface
      });

      QueueInterface.virtual({
        name: String
      });

      QueueInterface.virtual({
        concurrency: Number
      });

      QueueInterface.virtual(QueueInterface.async({
        delay: FuncG([String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }));

      QueueInterface.virtual(QueueInterface.async({
        push: FuncG([String, AnyT, MaybeG(Number)], UnionG(String, Number))
      }));

      QueueInterface.virtual(QueueInterface.async({
        get: FuncG([UnionG(String, Number)], MaybeG(Object))
      }));

      QueueInterface.virtual(QueueInterface.async({
        delete: FuncG([UnionG(String, Number)], Boolean)
      }));

      QueueInterface.virtual(QueueInterface.async({
        abort: FuncG([UnionG(String, Number)])
      }));

      QueueInterface.virtual(QueueInterface.async({
        all: FuncG([MaybeG(String)], ListG(Object))
      }));

      QueueInterface.virtual(QueueInterface.async({
        pending: FuncG([MaybeG(String)], ListG(Object))
      }));

      QueueInterface.virtual(QueueInterface.async({
        progress: FuncG([MaybeG(String)], ListG(Object))
      }));

      QueueInterface.virtual(QueueInterface.async({
        completed: FuncG([MaybeG(String)], ListG(Object))
      }));

      QueueInterface.virtual(QueueInterface.async({
        failed: FuncG([MaybeG(String)], ListG(Object))
      }));

      QueueInterface.initialize();

      return QueueInterface;

    }).call(this);
  };

}).call(this);
