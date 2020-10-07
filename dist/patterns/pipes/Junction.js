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
  var splice = [].splice;

  module.exports = function(Module) {
    var CoreObject, DictG, EnumG, FuncG, Junction, ListG, PipeFittingInterface, PipeListener, PipeMessageInterface, PointerT;
    ({PointerT, FuncG, ListG, DictG, EnumG, PipeFittingInterface, PipeMessageInterface, PipeListener, CoreObject} = Module.prototype);
    return Junction = (function() {
      var iplInputPipes, iplOutputPipes, iplPipeTypesMap, iplPipesMap;

      class Junction extends CoreObject {};

      Junction.inheritProtected();

      Junction.module(Module);

      Junction.public(Junction.static({
        INPUT: String
      }, {
        default: 'input'
      }));

      Junction.public(Junction.static({
        OUTPUT: String
      }, {
        default: 'output'
      }));

      iplInputPipes = PointerT(Junction.protected({
        inputPipes: ListG(String)
      }));

      iplOutputPipes = PointerT(Junction.protected({
        outputPipes: ListG(String)
      }));

      iplPipesMap = PointerT(Junction.protected({
        pipesMap: DictG(String, PipeFittingInterface)
      }));

      iplPipeTypesMap = PointerT(Junction.protected({
        pipeTypesMap: DictG(String, EnumG([Junction.INPUT, Junction.OUTPUT]))
      }));

      Junction.public({
        registerPipe: FuncG([String, String, PipeFittingInterface], Boolean)
      }, {
        default: function(name, type, pipe) {
          var vbSuccess;
          vbSuccess = true;
          if (this[iplPipesMap][name] == null) {
            this[iplPipesMap][name] = pipe;
            this[iplPipeTypesMap][name] = type;
            switch (type) {
              case Junction.INPUT:
                this[iplInputPipes].push(name);
                break;
              case Junction.OUTPUT:
                this[iplOutputPipes].push(name);
                break;
              default:
                vbSuccess = false;
            }
          } else {
            vbSuccess = false;
          }
          return vbSuccess;
        }
      });

      Junction.public({
        hasPipe: FuncG(String, Boolean)
      }, {
        default: function(name) {
          return this[iplPipesMap][name] != null;
        }
      });

      Junction.public({
        hasInputPipe: FuncG(String, Boolean)
      }, {
        default: function(name) {
          return this.hasPipe(name) && this[iplPipeTypesMap][name] === Junction.INPUT;
        }
      });

      Junction.public({
        hasOutputPipe: FuncG(String, Boolean)
      }, {
        default: function(name) {
          return this.hasPipe(name) && this[iplPipeTypesMap][name] === Junction.OUTPUT;
        }
      });

      Junction.public({
        removePipe: FuncG(String)
      }, {
        default: function(name) {
          var i, j, len, pipe, pipesList, ref, type;
          if (this.hasPipe(name)) {
            type = this[iplPipeTypesMap][name];
            pipesList = (function() {
              switch (type) {
                case Junction.INPUT:
                  return this[iplInputPipes];
                case Junction.OUTPUT:
                  return this[iplOutputPipes];
                default:
                  return [];
              }
            }).call(this);
            for (i = j = 0, len = pipesList.length; j < len; i = ++j) {
              pipe = pipesList[i];
              if (pipe === name) {
                splice.apply(pipesList, [i, i - i + 1].concat(ref = [])), ref;
                break;
              }
            }
            delete this[iplPipesMap][name];
            delete this[iplPipeTypesMap][name];
          }
        }
      });

      Junction.public({
        retrievePipe: FuncG(String, PipeFittingInterface)
      }, {
        default: function(name) {
          return this[iplPipesMap][name];
        }
      });

      Junction.public({
        addPipeListener: FuncG([String, Object, Function], Boolean)
      }, {
        default: function(inputPipeName, context, listener) {
          var pipe, vbSuccess;
          vbSuccess = false;
          if (this.hasInputPipe(inputPipeName)) {
            pipe = this[iplPipesMap][inputPipeName];
            vbSuccess = pipe.connect(PipeListener.new(context, listener));
          }
          return vbSuccess;
        }
      });

      Junction.public({
        sendMessage: FuncG([String, PipeMessageInterface], Boolean)
      }, {
        default: function(outputPipeName, message) {
          var pipe, vbSuccess;
          vbSuccess = false;
          if (this.hasOutputPipe(outputPipeName)) {
            pipe = this[iplPipesMap][outputPipeName];
            vbSuccess = pipe.write(message);
          }
          return vbSuccess;
        }
      });

      Junction.public(Junction.static(Junction.async({
        restoreObject: Function
      }, {
        default: function*() {
          throw new Error(`restoreObject method not supported for ${this.name}`);
        }
      })));

      Junction.public(Junction.static(Junction.async({
        replicateObject: Function
      }, {
        default: function*() {
          throw new Error(`replicateObject method not supported for ${this.name}`);
        }
      })));

      Junction.public({
        init: Function
      }, {
        default: function(...args) {
          this.super(...args);
          this[iplInputPipes] = [];
          this[iplOutputPipes] = [];
          this[iplPipesMap] = {};
          this[iplPipeTypesMap] = {};
        }
      });

      Junction.initialize();

      return Junction;

    }).call(this);
  };

}).call(this);
