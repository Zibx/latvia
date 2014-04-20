(function(){
    'use strict';
    var errorHandler = function( data ){

    };
    Z.query = function( obj, callback ){
        if(typeof callback === 'string'){
            return Z.query({url: 'api/'+arguments[0]+'/'+arguments[1], data: arguments[2]},arguments[3]);
        }
        var data = obj.data,
            url = '/'+obj.url,
            state = obj.state,
            errorFn = obj.error || errorHandler;
        console.info('QUERY api '+ obj.url);
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                if( data.error )
                    errorFn(data.data);
                else{
                    state && Z.stateMachine(state, data.data, Z.run.bind(data));
                    callback && callback( data )
                }
            },
            failure: function(errMsg) {
                errorFn('Server error');
            }
        });
    }

})();