(function(){
    'use strict';
    var errorHandler = function( data ){

    };
    Z.query = function( obj, callback ){
        if(typeof callback === 'string'){
            return Z.query({url: 'api/'+arguments[0]+'/'+arguments[1], data: arguments[2], error: arguments[4]},arguments[3]);
        }
        var data = obj.data,
            url = '/'+obj.url,
            state = obj.state,
            errorFn = obj.error || errorHandler;
        console.info('QUERY api '+ obj.url);

        reqwest({
            url: url,
            data: JSON.stringify(data),
            method: 'post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                try{
                    data = JSON.parse( data );
                }catch(e){}

                if( data.error )
                    errorFn(data.data);
                else{
                    callback && callback( data.data );
                }
            },
            failure: function(errMsg) {
                errorFn('Server error');
            }
        });

    }

})();