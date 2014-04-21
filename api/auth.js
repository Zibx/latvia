var cache = {};
exports = module.exports = {
    register: function( login, password, invite ){
        db.query('SELECT * from invite where invite=?', [invite], function(err, data) {

        });

    },
    login: function( login, password, util ){
        var query = db.query('SELECT * from user where login=? AND password=?', [login, password], function(err, data) {
            if(!err && data.length ){
                data = data[0];
                delete data.password;
                if( data.session ){
                    cache[ data.session ] = data;
                    util.ok(data);
                }else{
                    cache[ data.session = Z.UUID.getRandom() ] = data;
                    db.query('UPDATE user SET session=? WHERE uid=?', [data.session, data.uid]);
                    util.ok(data);
                }
            }else{
                util.error('shit');
            }
        });
        debug && console.log(query.sql);
        return util.wait;
    },
    getUserBySession: function( session, util ){
        if( session )
            db.query('SELECT * from user where session=?', [session], function(err, data) {
                if(!err && data.length){
                    delete data[0].password;
                    util.ok(data[0]);
                }else{
                    util.error('shit');
                }
            });
        else
            util.ok(false);
        return util.wait;
    }
};