var cache = {};
exports = module.exports = {
    register: function( login, password, invite ){
        db.query('SELECT * from invite where invite=?', [invite], function(err, data) {

        });

    },
    login: function( login, password, util ){
        login = 'latvia';
        password = '777';
        db.query('SELECT * from user where login=? AND password=?', [login, password], function(err, data) {
            if(!err){
                delete data[0].password;
                if( data.session ){
                    cache[ data.session ] = data;
                    util.ok(data[0]);
                }else{
                    cache[ data.session = Z.UUID.getRandom() ] = data;
                    db.query('UPDATE user SET session=? WHERE uid=?', [data.session, data.uid]);
                    util.ok(data[0]);
                }
            }else{
                util.error('shit');
            }
        });
        return util.wait;
    },
    getUserBySession: function( session, util ){
        db.query('SELECT * from user where session=?', [session], function(err, data) {
            if(!err){
                delete data[0].password;
                util.ok(data[0])
            }else{
                util.error('shit');
            }
        });
        return util.wait;
    }
};