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

  // example in use
  var slice = [].slice,
    hasProp = {}.hasOwnProperty;

  /*
  ```coffee
    Test.context.use Basis::SessionsUtil.middleware

    class Test::ApplicationRouter extends Module::Router
      @inheritProtected()
      @module Test
      @map ->
        @namespace 'version', module: '', prefix: ':v', ->
          @resource 'invitations', except: 'delete', ->
            @post 'confirm', at: 'collection'
            @member ->
              @post 'sendInvite'
              @resource 'descendants', only: 'list', ->
                @get 'count', at: 'collection'
    module.exports = Test::ApplicationRouter.initialize()
  ```
  */
  module.exports = function(Module) {
    var AnyT, Class, ConfigurableMixin, EnumG, FuncG, InterfaceG, ListG, MaybeG, PointerT, Router, RouterInterface, SampleG, SubsetG, UnionG, _, inflect;
    ({
      AnyT,
      PointerT,
      FuncG,
      MaybeG,
      InterfaceG,
      EnumG,
      ListG,
      UnionG,
      SubsetG,
      SampleG,
      RouterInterface,
      ConfigurableMixin,
      Class,
      Utils: {_, inflect}
    } = Module.prototype);
    return Router = (function() {
      var iplExcept, iplOnly, iplPathes, iplResources, iplRouters, iplRoutes, iplVia, ipoAbove, ipsAt, ipsModule, ipsName, ipsParam, ipsPath, ipsResource, ipsTag, ipsTemplates;

      class Router extends Module.prototype.Proxy {
        constructor(...args) {
          var asAction, asMethod, ref, ref1, ref2, voMethods, voPaths, vsEntityName, vsKeyName, vsRecordName;
          super(...args);
          this.init(...args);
          this.map();
          if (_.isString(this[iplOnly])) {
            this[iplOnly] = [this[iplOnly]];
          }
          if (_.isString(this[iplVia])) {
            this[iplVia] = [this[iplVia]];
          }
          if (_.isString(this[iplExcept])) {
            this[iplExcept] = [this[iplExcept]];
          }
          voMethods = {
            list: 'get',
            detail: 'get',
            create: 'post',
            update: 'put',
            delete: 'delete'
          };
          voPaths = {
            list: '',
            detail: null,
            create: '',
            update: null,
            delete: null
          };
          // @[iplPathes] ?= []
          if ((this[ipsName] != null) && this[ipsName] !== '') {
            vsKeyName = (ref = this[ipsParam]) != null ? ref.replace(/^\:/, '') : void 0;
            vsEntityName = (ref1 = this[ipoAbove]) != null ? ref1.entityName : void 0;
            if (vsEntityName == null) {
              vsEntityName = this.defaultEntityName();
            }
            vsRecordName = (ref2 = this[ipoAbove]) != null ? ref2.recordName : void 0;
            if (_.isNil(vsRecordName) && !_.isNull(vsRecordName)) {
              vsRecordName = this.defaultEntityName();
            }
            if (this[iplOnly] != null) {
              this[iplOnly].forEach((asAction) => {
                var ref3, vsPath;
                vsPath = voPaths[asAction];
                if (vsPath == null) {
                  vsPath = this[ipsParam];
                }
                return this.defineMethod(this[iplPathes], voMethods[asAction], vsPath, {
                  action: asAction,
                  resource: (ref3 = this[ipsResource]) != null ? ref3 : this[ipsName],
                  template: this[ipsTemplates] + '/' + asAction,
                  keyName: vsKeyName,
                  entityName: vsEntityName,
                  recordName: vsRecordName
                });
              });
            } else if (this[iplExcept] != null) {
              for (asAction in voMethods) {
                if (!hasProp.call(voMethods, asAction)) continue;
                asMethod = voMethods[asAction];
                ((asAction, asMethod) => {
                  var ref3, vsPath;
                  if (!this[iplExcept].includes('all') && !this[iplExcept].includes(asAction)) {
                    vsPath = voPaths[asAction];
                    if (vsPath == null) {
                      vsPath = this[ipsParam];
                    }
                    return this.defineMethod(this[iplPathes], asMethod, vsPath, {
                      action: asAction,
                      resource: (ref3 = this[ipsResource]) != null ? ref3 : this[ipsName],
                      template: this[ipsTemplates] + '/' + asAction,
                      keyName: vsKeyName,
                      entityName: vsEntityName,
                      recordName: vsRecordName
                    });
                  }
                })(asAction, asMethod);
              }
            } else if (this[iplVia] != null) {
              this[iplVia].forEach((asCustomAction) => {
                var ref3, results, vsPath;
                vsPath = voPaths[asCustomAction];
                if (vsPath == null) {
                  vsPath = this[ipsParam];
                }
                if (asCustomAction === 'all') {
                  results = [];
                  for (asAction in voMethods) {
                    if (!hasProp.call(voMethods, asAction)) continue;
                    asMethod = voMethods[asAction];
                    results.push(((asAction, asMethod) => {
                      var ref3;
                      return this.defineMethod(this[iplPathes], asMethod, vsPath, {
                        action: asAction,
                        resource: (ref3 = this[ipsResource]) != null ? ref3 : this[ipsName],
                        template: this[ipsTemplates] + '/' + asAction,
                        keyName: vsKeyName,
                        entityName: vsEntityName,
                        recordName: vsRecordName
                      });
                    })(asAction, asMethod));
                  }
                  return results;
                } else {
                  return this.defineMethod(this[iplPathes], voMethods[asCustomAction], vsPath, {
                    action: asCustomAction,
                    resource: (ref3 = this[ipsResource]) != null ? ref3 : this[ipsName],
                    template: this[ipsTemplates] + '/' + asAction,
                    keyName: vsKeyName,
                    entityName: vsEntityName,
                    recordName: vsRecordName
                  });
                }
              });
            } else {
              for (asAction in voMethods) {
                if (!hasProp.call(voMethods, asAction)) continue;
                asMethod = voMethods[asAction];
                ((asAction, asMethod) => {
                  var ref3, vsPath;
                  vsPath = voPaths[asAction];
                  if (vsPath == null) {
                    vsPath = this[ipsParam];
                  }
                  return this.defineMethod(this[iplPathes], asMethod, vsPath, {
                    action: asAction,
                    resource: (ref3 = this[ipsResource]) != null ? ref3 : this[ipsName],
                    template: this[ipsTemplates] + '/' + asAction,
                    keyName: vsKeyName,
                    entityName: vsEntityName,
                    recordName: vsRecordName
                  });
                })(asAction, asMethod);
              }
            }
          }
          return;
        }

      };

      Router.inheritProtected();

      Router.include(ConfigurableMixin);

      Router.implements(RouterInterface);

      Router.module(Module);

      ipsPath = PointerT(Router.protected({
        path: MaybeG(String)
      }, {
        default: '/'
      }));

      ipsName = PointerT(Router.protected({
        name: MaybeG(String)
      }, {
        default: ''
      }));

      ipsModule = PointerT(Router.protected({
        module: MaybeG(String)
      }));

      iplOnly = PointerT(Router.protected({
        only: MaybeG(UnionG(String, ListG(String)))
      }));

      iplVia = PointerT(Router.protected({
        via: MaybeG(UnionG(String, ListG(String)))
      }));

      iplExcept = PointerT(Router.protected({
        except: MaybeG(UnionG(String, ListG(String)))
      }));

      ipoAbove = PointerT(Router.protected({
        above: MaybeG(Object)
      }));

      ipsAt = PointerT(Router.protected({
        at: MaybeG(EnumG('collection', 'member'))
      }));

      ipsResource = PointerT(Router.protected({
        resource: MaybeG(String)
      }));

      ipsTag = PointerT(Router.protected({
        tag: MaybeG(String)
      }));

      ipsTemplates = PointerT(Router.protected({
        templates: MaybeG(String)
      }));

      ipsParam = PointerT(Router.protected({
        param: MaybeG(String)
      }));

      iplRouters = PointerT(Router.protected({
        routers: MaybeG(ListG(SubsetG(Router)))
      }));

      iplPathes = PointerT(Router.protected({
        pathes: MaybeG(ListG(InterfaceG({
          method: String,
          path: String,
          resource: String,
          action: String,
          tag: String,
          template: String,
          keyName: MaybeG(String),
          entityName: String,
          recordName: MaybeG(String)
        })))
      }));

      iplResources = PointerT(Router.protected({
        resources: MaybeG(ListG(SampleG(Router)))
      }));

      iplRoutes = PointerT(Router.protected({
        routes: MaybeG(ListG(InterfaceG({
          method: String,
          path: String,
          resource: String,
          action: String,
          tag: String,
          template: String,
          keyName: MaybeG(String),
          entityName: String,
          recordName: MaybeG(String)
        })))
      }));

      Router.public({
        path: MaybeG(String)
      }, {
        get: function() {
          return this[ipsPath];
        }
      });

      Router.public({
        name: MaybeG(String)
      }, {
        get: function() {
          var ref;
          return (ref = this[ipsResource]) != null ? ref : this[ipsName];
        }
      });

      Router.public({
        above: MaybeG(Object)
      }, {
        get: function() {
          return this[ipoAbove];
        }
      });

      Router.public({
        tag: MaybeG(String)
      }, {
        get: function() {
          return this[ipsTag];
        }
      });

      Router.public({
        templates: MaybeG(String)
      }, {
        get: function() {
          return this[ipsTemplates];
        }
      });

      Router.public({
        param: MaybeG(String)
      }, {
        get: function() {
          return this[ipsParam];
        }
      });

      Router.public({
        defaultEntityName: FuncG([], String)
      }, {
        default: function() {
          var ref, vsEntityName;
          ref = this[ipsName].replace(/\/$/, '').split('/'), [vsEntityName] = slice.call(ref, -1);
          return inflect.singularize(vsEntityName);
        }
      });

      Router.public(Router.static({
        map: FuncG([MaybeG(Function)])
      }, {
        default: function(lambda) {
          if (lambda == null) {
            lambda = function() {};
          }
          this.public({
            map: Function
          }, {
            default: lambda
          });
        }
      }));

      Router.public({
        map: Function
      }, {
        default: function() {}
      });

      Router.public({
        root: FuncG([
          InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String)
          })
        ])
      }, {
        default: function({to, at, resource, action}) {}
      });

      Router.public({
        defineMethod: FuncG([
          MaybeG(ListG(InterfaceG({
            method: String,
            path: String,
            resource: String,
            action: String,
            tag: String,
            template: String,
            keyName: MaybeG(String),
            entityName: String,
            recordName: MaybeG(String)
          }))),
          String,
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(container, method, path, {
            to,
            at,
            resource,
            action,
            tag: asTag,
            template,
            keyName,
            entityName,
            recordName
          } = {}) {
          var ref, tag, vsName, vsParentTag, vsResource, vsTag;
          if (path == null) {
            throw new Error('path is required');
          }
          path = path.replace(/^[\/]/, '');
          if (to != null) {
            if (!/[#]/.test(to)) {
              throw new Error('`to` must be in format `<resource>#<action>`');
            }
            [resource, action] = to.split('#');
          }
          if ((resource == null) && (vsResource = this[ipsResource]) !== '') {
            resource = vsResource;
          }
          if ((resource == null) && (vsName = this[ipsName]) !== '') {
            resource = vsName;
          }
          if (resource == null) {
            throw new Error('options `to` or `resource` must be defined');
          }
          if (action == null) {
            action = path;
          }
          if (!/[\/]$/.test(resource)) {
            resource += '/';
          }
          if (keyName == null) {
            keyName = (ref = this[ipsParam]) != null ? ref.replace(/^\:/, '') : void 0;
          }
          if (entityName == null) {
            entityName = this.defaultEntityName();
          }
          if (!(_.isString(recordName) || _.isNull(recordName))) {
            recordName = this.defaultEntityName();
          }
          vsParentTag = (this[ipsTag] != null) && this[ipsTag] !== '' ? this[ipsTag] : '';
          vsTag = (asTag != null) && asTag !== '' ? `/${asTag}` : '';
          tag = `${vsParentTag}${vsTag}`;
          path = (function() {
            switch (at != null ? at : this[ipsAt]) {
              case 'member':
                return `${this[ipsPath]}:${inflect.singularize(inflect.underscore(resource.replace(/[\/]/g, '_').replace(/[_]$/g, '')))}/${path}`;
              case 'collection':
                return `${this[ipsPath]}${path}`;
              default:
                return `${this[ipsPath]}${path}`;
            }
          }).call(this);
          if (template == null) {
            template = resource + action;
          }
          container.push({method, path, resource, action, tag, template, keyName, entityName, recordName});
        }
      });

      Router.public({
        get: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'get', asPath, aoOpts);
        }
      });

      Router.public({
        post: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'post', asPath, aoOpts);
        }
      });

      Router.public({
        put: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'put', asPath, aoOpts);
        }
      });

      Router.public({
        delete: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'delete', asPath, aoOpts);
        }
      });

      Router.public({
        head: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'head', asPath, aoOpts);
        }
      });

      Router.public({
        options: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'options', asPath, aoOpts);
        }
      });

      Router.public({
        patch: FuncG([
          String,
          MaybeG(InterfaceG({
            to: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            action: MaybeG(String),
            tag: MaybeG(String),
            template: MaybeG(String),
            keyName: MaybeG(String),
            entityName: MaybeG(String),
            recordName: MaybeG(String)
          }))
        ])
      }, {
        default: function(asPath, aoOpts) {
          // @[iplPathes] ?= []
          this.defineMethod(this[iplPathes], 'patch', asPath, aoOpts);
        }
      });

      Router.public({
        resource: FuncG([
          String,
          MaybeG(UnionG(InterfaceG({
            path: MaybeG(String),
            module: MaybeG(String),
            only: MaybeG(UnionG(String,
          ListG(String))),
            via: MaybeG(UnionG(String,
          ListG(String))),
            except: MaybeG(UnionG(String,
          ListG(String))),
            tag: MaybeG(String),
            templates: MaybeG(String),
            param: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            resource: MaybeG(String),
            above: MaybeG(Object)
          }),
          Function)),
          MaybeG(Function)
        ])
      }, {
        default: function(asName, aoOpts = null, lambda = null) {
          var ResourceRouter, above, alTemplates, asParam, asResource, asTag, at, empty, except, only, path, previously, vcModule, via, vsFullPath, vsModule, vsName, vsParam, vsParentName, vsParentTag, vsParentTemplates, vsPath, vsTag, vsTemplates;
          vcModule = this.Module;
          if (_.isFunction(aoOpts)) {
            lambda = aoOpts;
            aoOpts = {};
          }
          if (aoOpts == null) {
            aoOpts = {};
          }
          ({
            path,
            module: vsModule,
            only,
            via,
            except,
            tag: asTag,
            templates: alTemplates,
            param: asParam,
            at,
            resource: asResource,
            above
          } = aoOpts);
          path = path != null ? path.replace(/^[\/]/, '') : void 0;
          vsPath = (path != null) && path !== '' ? `${path}/` : (path != null) && path === '' ? '' : `${asName}/`;
          vsFullPath = (function() {
            var ref;
            switch (at != null ? at : this[ipsAt]) {
              case 'member':
                ref = this[ipsPath].split('/'), [previously, empty] = slice.call(ref, -2);
                return `${this[ipsPath]}:${inflect.singularize(inflect.underscore(previously))}/${vsPath}`;
              case 'collection':
                return `${this[ipsPath]}${vsPath}`;
              default:
                return `${this[ipsPath]}${vsPath}`;
            }
          }).call(this);
          vsParentName = this[ipsName];
          vsParentTemplates = (this[ipsTemplates] != null) && this[ipsTemplates] !== '' ? `${this[ipsTemplates]}/` : '';
          vsParentTag = (this[ipsTag] != null) && this[ipsTag] !== '' ? this[ipsTag] : '';
          vsName = (vsModule != null) && vsModule !== '' ? `${vsModule}/` : (vsModule != null) && vsModule === '' ? '' : `${asName}/`;
          vsTemplates = (alTemplates != null) && alTemplates !== '' ? alTemplates : (alTemplates != null) && alTemplates === '' ? '' : (vsModule != null) && vsModule !== '' ? vsModule : (vsModule != null) && vsModule === '' ? '' : asName;
          vsTag = (asTag != null) && asTag !== '' ? `/${asTag}` : '';
          vsParam = (asParam != null) && asParam !== '' ? asParam : ':' + inflect.singularize(inflect.underscore((asResource != null ? asResource : `${vsParentName}${vsName}`).replace(/[\/]/g, '_').replace(/[_]$/g, '')));
          ResourceRouter = (function() {
            // @[iplRouters] ?= []
            class ResourceRouter extends Router {};

            ResourceRouter.inheritProtected();

            ResourceRouter.module(vcModule);

            ResourceRouter.protected({
              path: String
            }, {
              default: vsFullPath
            });

            ResourceRouter.protected({
              name: String
            }, {
              default: `${vsParentName}${vsName}`
            });

            ResourceRouter.protected({
              module: String
            }, {
              default: vsModule
            });

            ResourceRouter.protected({
              only: MaybeG(UnionG(String, ListG(String)))
            }, {
              default: only
            });

            ResourceRouter.protected({
              via: MaybeG(UnionG(String, ListG(String)))
            }, {
              default: via
            });

            ResourceRouter.protected({
              except: MaybeG(UnionG(String, ListG(String)))
            }, {
              default: except
            });

            ResourceRouter.protected({
              above: MaybeG(Object)
            }, {
              default: above
            });

            ResourceRouter.protected({
              tag: String
            }, {
              default: `${vsParentTag}${vsTag}`
            });

            ResourceRouter.protected({
              templates: String
            }, {
              default: `${vsParentTemplates}${vsTemplates}`.replace(/[\/][\/]/g, '/')
            });

            ResourceRouter.protected({
              param: String
            }, {
              default: vsParam
            });

            ResourceRouter.protected({
              resource: MaybeG(String)
            }, {
              default: asResource
            });

            ResourceRouter.map(lambda);

            return ResourceRouter;

          }).call(this);
          ResourceRouter.constructor = Class;
          this[iplRouters].push(ResourceRouter);
        }
      });

      Router.public({
        namespace: FuncG([
          MaybeG(String),
          UnionG(InterfaceG({
            module: MaybeG(String),
            prefix: MaybeG(String),
            tag: MaybeG(String),
            templates: MaybeG(String),
            at: MaybeG(EnumG('collection',
          'member')),
            above: MaybeG(Object)
          }),
          Function),
          MaybeG(Function)
        ])
      }, {
        default: function(asName, aoOpts = null, lambda = null) {
          var NamespaceRouter, above, alTemplates, asTag, at, prefix, vcModule, vsModule, vsName, vsParentName, vsParentPath, vsParentTag, vsParentTemplates, vsPath, vsTag, vsTemplates;
          vcModule = this.Module;
          if ((aoOpts != null ? aoOpts.constructor : void 0) === Function) {
            lambda = aoOpts;
            aoOpts = {};
          }
          if (aoOpts == null) {
            aoOpts = {};
          }
          ({
            module: vsModule,
            prefix,
            tag: asTag,
            templates: alTemplates,
            at,
            above
          } = aoOpts);
          vsParentPath = this[ipsPath];
          vsPath = (prefix != null) && prefix !== '' ? `${prefix}/` : (prefix != null) && prefix === '' ? '' : `${asName}/`;
          vsParentName = this[ipsName];
          vsParentTemplates = (this[ipsTemplates] != null) && this[ipsTemplates] !== '' ? `${this[ipsTemplates]}/` : '';
          vsParentTag = (this[ipsTag] != null) && this[ipsTag] !== '' ? this[ipsTag] : '';
          vsName = (vsModule != null) && vsModule !== '' ? `${vsModule}/` : (vsModule != null) && vsModule === '' ? '' : `${asName}/`;
          vsTemplates = (alTemplates != null) && alTemplates !== '' ? alTemplates : (alTemplates != null) && alTemplates === '' ? '' : (vsModule != null) && vsModule !== '' ? vsModule : (vsModule != null) && vsModule === '' ? '' : asName;
          vsTag = (asTag != null) && asTag !== '' ? `/${asTag}` : '';
          NamespaceRouter = (function() {
            // @[iplRouters] ?= []
            class NamespaceRouter extends Router {};

            NamespaceRouter.inheritProtected();

            NamespaceRouter.module(vcModule);

            NamespaceRouter.protected({
              path: String
            }, {
              default: `${vsParentPath}${vsPath}`
            });

            NamespaceRouter.protected({
              name: String
            }, {
              default: `${vsParentName}${vsName}`
            });

            NamespaceRouter.protected({
              except: MaybeG(UnionG(String, ListG(String)))
            }, {
              default: ['all']
            });

            NamespaceRouter.protected({
              tag: String
            }, {
              default: `${vsParentTag}${vsTag}`
            });

            NamespaceRouter.protected({
              templates: String
            }, {
              default: `${vsParentTemplates}${vsTemplates}`.replace(/[\/][\/]/g, '/')
            });

            NamespaceRouter.protected({
              at: MaybeG(EnumG('collection', 'member'))
            }, {
              default: at
            });

            NamespaceRouter.protected({
              above: MaybeG(Object)
            }, {
              default: above
            });

            NamespaceRouter.map(lambda);

            return NamespaceRouter;

          }).call(this);
          NamespaceRouter.constructor = Class;
          this[iplRouters].push(NamespaceRouter);
        }
      });

      Router.public({
        member: FuncG(Function)
      }, {
        default: function(lambda) {
          this.namespace(null, {
            module: '',
            prefix: '',
            templates: '',
            at: 'member'
          }, lambda);
        }
      });

      Router.public({
        collection: FuncG(Function)
      }, {
        default: function(lambda) {
          this.namespace(null, {
            module: '',
            prefix: '',
            templates: '',
            at: 'collection'
          }, lambda);
        }
      });

      Router.public({
        resources: ListG(SampleG(Router))
      }, {
        get: function() {
          return this[iplResources];
        }
      });

      Router.public({
        routes: ListG(InterfaceG({
          method: String,
          path: String,
          resource: String,
          action: String,
          tag: String,
          template: String,
          keyName: MaybeG(String),
          entityName: String,
          recordName: MaybeG(String)
        }))
      }, {
        get: function() {
          var ref, ref1, vlResources, vlRoutes;
          if ((this[iplRoutes] != null) && this[iplRoutes].length > 0) {
            return this[iplRoutes];
          } else {
            vlRoutes = [];
            vlRoutes = vlRoutes.concat((ref = this[iplPathes]) != null ? ref : []);
            vlResources = [];
            if ((ref1 = this[iplRouters]) != null) {
              ref1.forEach((ResourceRouter) => {
                var ref2, ref3, resourceRouter;
                resourceRouter = ResourceRouter.new();
                vlResources.push(resourceRouter);
                vlRoutes = vlRoutes.concat((ref2 = resourceRouter.routes) != null ? ref2 : []);
                return vlResources = vlResources.concat((ref3 = resourceRouter.resources) != null ? ref3 : []);
              });
            }
            this[iplRoutes] = vlRoutes;
            this[iplResources] = vlResources;
          }
          return this[iplRoutes];
        }
      });

      Router.public({
        init: FuncG([MaybeG(String), MaybeG(AnyT)])
      }, {
        default: function(...args) {
          this.super(...args);
          this[iplRouters] = [];
          this[iplPathes] = [];
        }
      });

      Router.initialize();

      return Router;

    }).call(this);
  };

}).call(this);
