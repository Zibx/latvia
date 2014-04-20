(function(  ){
    var App = GLOBAL.App = {},
        url = require( 'url' );
    var wait = App.wait = function wait(){};

    var response = function( res ){
        this.response = res;
        this.wait = new wait();
    };
    response.prototype = {
        error: function( text ){
            this.answer( text, true );
        },
        ok: function( data ){
            this.answer( data, false );
        },
        iframeOk: function( out ){
            this.response.send('<html><head><script language="JavaScript">parent.Z.iframeAnswer('+JSON.stringify(out)+');</script></head></html>');
            return out;
        },
        answer: function( data, error ){
            var out = {error: error || false, data: data, time: +new Date()};
            if( this.response )
                this.response.send(JSON.stringify(out));
            return data;
        }
    };

    App.response = function(res){
        return new response(res);
    };
    var request = function( req, callback, keyResolver ){
        this.request = req;
        this.callback = callback;
        this.keyResolver = keyResolver;
        this.parse();
    };
    request.prototype = {
        parse: function(){
            var request = this.request,
                parts = url.parse( request.url, true ),
                data = Z.apply({}, parts.query ),
                bodyData,
                callback = this.callback,

                apiKeyValid = false,
                keyResolver = this.keyResolver;/*,
                files = request.files, i;
            if( files ){

                for( i in files ){
                    console.log(files);
                    files.hasOwnProperty(i) && (data[i] = files[i]);
                }
            }*/

            Z.doAfter(
                function( callback ){
                    if( request.cookies.u ){
                        api.authorize.getUserByHash({hash:request.cookies.u}, function( user ){
                            //console.log(user);
                            data.user = user;
                            callback();
                        });
                    }else
                        callback();
                },
                function( callback ){
                    if( request.method === 'POST' ){
                        var body = '';
                        request.on( 'data', function( data ){
                            body += data;
                            if( body.length > 1024*512 ){ //0.5 mb
                                // ddos
                                request.connection.destroy();
                            }
                        } );
                        request.on( 'end', function(){

                            try{
                                bodyData = JSON.parse( body );
                                Z.apply( data, bodyData );
                                if( '_key' in bodyData ){
                                    delete bodyData._key;
                                }
                                if( data._key && keyResolver ){
                                    var apiKey;
                                    Z.doAfter( function( callback ){
                                        if( typeof keyResolver === 'function' )
                                            keyResolver(bodyData, function(key){
                                                apiKey = key;
                                                callback();
                                            });
                                        else{
                                            apiKey = keyResolver;
                                            callback();
                                        }

                                    }, function(  ){
                                        var shasum = crypto.createHash('sha256');
                                        shasum.update( apiKey + JSON.stringify(bodyData), 'utf8' );
                                        shasum = shasum.digest('base64');

                                        if( shasum === data._key ){
                                            apiKeyValid = true;
                                        }
                                        callback();
                                    });


                                    return;
                                }
                                console.log([shasum,apiKeyValid]);
                            }catch(e){
                                callback();
                                return;
                            }
                            // use POST
                            callback();
                        } );
                    }else{
                        callback();
                    }
                },
                function(  ){
                    callback( data, apiKeyValid );
                }
            );

        }
    };
    App.request = function( req, callback, keyResolver ){
        return new request(req, callback, keyResolver);
    }
})();