exports = module.exports = (function(  ){
    'use strict';
    var CallbackUtils = function( callback ){
        this.callback = callback;
    };
    CallbackUtils.prototype = {
        error: function(){
            this.callback(false);
        },
        ok: function( data ){
            this.callback(data);
        },
        internal: true
    };
    var _wrapFn = function( fn, args ){
        var needUtil = args.indexOf('util') > -1;
        return function( obj, callback ){
            var fnArguments = [], i, _i, name;
            if( needUtil && !obj.util ){
                obj.util = new CallbackUtils(callback);
            }
            for( i = 0, _i = args.length; i < _i; i++ ){
                name = args[ i ];
                fnArguments.push( name in obj ? obj[name] : void 0 );
            }
            //console.log(obj);
            //console.log(args);
            //console.log( fnArguments );
            return fn.apply( this, fnArguments );

        };
    },
        wrapFn = function( fn ){
            var text = fn.toString(),
                args = text.match(/function[^\(]*\(([^)]*)\)/)[1].split(',').map( function( paramName ){ return paramName.trim(); } ).filter(JS.filter.notEmptyString),
            //comments = JS.getComments( text ),
                wrap = {
                    original: fn,
                    fn: _wrapFn(fn, args),
                    args: args,
                    needUser: args.indexOf('user') > -1
                };
            return wrap;
        },

        fs = require('fs' ),
            api = GLOBAL.api = {
            init: function( dirName ){
                this.controllers = dirName;
                this.initModules();
            },
            initModules: function(){
                this.modules = {};
                fs.readdir( this.controllers, function(err, data){
                    Z.each(data, function( el ){
                        if( el.substr( el.length - 3, 3 ) === '.js' )
                            this._initModule( [ '.'+this.controllers, el ].join( '' ), el.substr( 0, el.length - 3 ) );
                    }.bind(this));
                }.bind(this))
            },
            resolve: function( req, res ){
                var response = App.response(res);
                var url = req.originalUrl.replace(/^\/api\//,'').split('/').filter( function( el ){return el.trim() !== ''; } );

                if( url.length ){
                    var module = this[url[0]];
                    if( module ){
                        var fn = module[url[1]];
                        if( fn ){
                            App.request( req, function( data ){

                                if( !fn.detail.needUser || data.user ){
                                    data.util = response;
                                    var result = fn.call(module, data);
                                    if( result !== false ){
                                        if( !(result instanceof App.wait) ){
                                            response.ok( result );
                                        }
                                    }else
                                        response.error('Error');
                                }else
                                    response.error('Security');
                            });
                        }else{
                            response.error('No such function in a module');
                        }
                    }else{
                        response.error('No such module');
                    }
                }else{
                    response.error('Please specify module');
                }
            },
            getApi: function( wrapped ){
                var systemArguments = Z.a2o(['util', 'user']);
                var out = {}, i, obj, args, j, _j, fnArgs, argName;
                for( i in wrapped ) if( wrapped.hasOwnProperty( i ) ){
                    obj = wrapped[ i ];

                    args = out[ obj.detail.name ] = {};
                    fnArgs = (obj.detail.args || []).slice().sort();
                    for( j = 0, _j = fnArgs.length; j < _j; j++ ){
                        argName = fnArgs[ j ];
                        if( !(argName in systemArguments) ){
                            args[ argName ] = '';
                        }
                    }
                }
                return out;
            },
            _wrapModule: function( obj ){
                var wrapped = {}, wrapper, getApi = this.getApi;
                wrapped.getapi = wrapped.getApi = wrapFn( function(){
                    return getApi( wrapped );
                } );
                wrapped.getapi.name = 'getApi';
                wrapped.getapi.fn.detail = wrapped.getapi;
                wrapped.getApi = wrapped.getapi = wrapped.getapi.fn;
                Z.each( obj, function( k, v ){
                    if( typeof v === 'function' && k.charAt(0) !== '_' ){
                        wrapper = wrapFn( v );
                        wrapper.name = k;
                        wrapper.fn.detail = wrapper;
                        wrapped[ k ] = wrapped[ k.toLowerCase() ] = wrapper.fn;
                    }
                });
                return wrapped;
            },
            _initModule: function( path, name ){
          //      try{
                    var module = require( path ),
                        url = this.url,
                        apiWrapper;
            /*    }catch(e){
                    Z.error( 'Loading `'+ path +'` failed');
                }*/
                try{
                    apiWrapper = this._wrapModule( module );
                    name = module.apiName || name;
                }catch(e){
                    console.log(e);
                    Z.error( 'Wrap module `'+ path +'` failed');
                }
                console.log('Module '+ name +' loaded');

                this[ name ] = this[ name.toLowerCase() ] = apiWrapper;//new module( this );

            }
        };
    return api;
})();