exports = module.exports = {
    //profile: fastWrap('profile'),
    //stats: fastWrap('stats'),
    //payout: fastWrap('payout'),
    //projects: fastWrap('projects'),
    //contacts: fastWrap('contacts'),
    getTpls: function( name ){
        name = Z.makeArray(name);
        var widgets = w.factory();
        var ok = true;
        name.forEach( function( name ){
            ok = ok && widgets.exportTpl(name) !== false;
        });

        return ok ? widgets.js : false;
    }
}