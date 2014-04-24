Z.controller.profile = Z.observable({
    tpls: ['profile'],
    init: function(){
        document.body.innerHTML = DOM.tplRenderer('profile')( Z.user );

    },
    router: function( route ){
        console.log(route);
    }
});
