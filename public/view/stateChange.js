Z.from = {
    notLogged: function(  ){
        $('.b-side__container' ).removeClass('b-side__container_centered');
        $('.b-main__container' ).removeClass('b-main__container_slider-align');

    }
};
Z.to = {
    notLogged: function(  ){
        Z.title('title.notLogged');
        Z.menu([]);
        Z.subMenu([]);
        //document.location.hash = '/authorize/';
        Z.run('pageChange',['authorize']);

        $('.b-side__container' ).addClass('b-side__container_centered');
        $('.b-main__container' ).addClass('b-main__container_slider-align');
        document.getElementById('bottomMenu').innerHTML = DOM.tplRenderer('bottomMenu')([

        ]);
    },
    main: function(){
        Z.title('title.logged');
        Z.query({url: 'api/access/getAvaliable'}, function( result ){
            Z.query({url: 'api/web/getMenu', data: {items: result.data} }, function( result ){

                result.data.forEach( function( el ){
                    if( el.id === 'profile' ){
                        el.img = Z.user.data.avatar;
                    }
                });
                Z.menu( result.data );
                Z.menuInited();

                setTimeout( function(  ){
                    if( document.location.hash.length < 3 )
                        document.location.hash = '/projects/';
                },100);
            });
        });
        document.getElementById('bottomMenu').innerHTML = DOM.tplRenderer('bottomMenu')([
            {id: 'exit', icon: 'big-exit', text: 'Выход', url: '/#/logout'}
        ]);
    },
    pageChange: function(  ){
        debugger;
    }

};