(function(  ){
    'use strict';
    var currentHash;
    Z.router = {};
    var hashChange = Z.router.hashChange = function( ){
        var hash = decodeURIComponent(window.location.hash);
        var data = hash.split('/' ).filter( function( el ){
            return el.trim() !== '' && el !== '#';
        });
        Z.currentHash = data;

        !data[0] && (data[0] = Z.user?'blog':'login');

        if( Z.controller[data[0]] ){
            if(currentHash !== data[0]){

                var controller = Z.controller[currentHash];
                if(controller && controller.destroy && controller.destroy()===false)
                    console.log('destroy '+currentHash);
                else{

                    controller = Z.controller[currentHash = data[0]];
                    Z.loadTpls(controller.tpls || [], function(  ){
                        controller.init();
                        controller.router && controller.router(data.slice(1));
                    });
                }

            }else{
                Z.controller[currentHash].router && Z.controller[currentHash].router(hash.slice(1));
            }
        }

    };
    DOM.ready(function(  ){

        if( Z.user.data )
            hashChange();

        if (("onhashchange" in window)) {
            window.onhashchange = hashChange;
        }
        else {
            var prevHash = window.location.hash;
            window.setInterval(function () {
                if (window.location.hash != prevHash) {
                    prevHash = window.location.hash;
                    hashChange();
                }
            }, 100);
        }
        hashChange();
    });
})();