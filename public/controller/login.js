Z.controller.login = Z.observable({
    tpls: ['login'],
    init: function(){
        document.body.innerHTML = DOM.tplRenderer('login')();
        document.querySelector('.login_back' ).src = '/img/back/back'+ ((Math.random()*2+1)|0) +'.jpg';
        ['click','keyup'].forEach( function( event ){
            DOM.addListener( document.querySelector('input[type=button]'), event, function( e ){
                e.preventDefault();
                e.stopPropagation();
                var inputs = Z.toArray(document.querySelectorAll('input'));
                var data = {
                    login: inputs[0].value,
                    password: inputs[1].value
                };
                Z.query('auth','login', data, function( data ){
                    Z.user = data;
                    Z.cookie.set('u', data.session);
                    Z.router.hashChange();
                }, function( data ){
                    alert('Ебучий караул, нет!');
                })
            });
        } );
    }
});
