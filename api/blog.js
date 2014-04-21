var perPage = 42,
    cacheBlogName = {};
exports = module.exports = {
    info: function( blog, util, user ){
        Z.doAfter( function( callback ){
            if(cacheBlogName[blog]){
                callback();
            }else{
                db.query('SELECT * from blog where shortName=?', [blog], function(err, data) {
                    if( !err && data.length ){
                        cacheBlogName[blog] = data[0];
                        util.ok(data[0]);
                    }
                    callback();
                });
            }
        }, function(  ){
            var data = cacheBlogName[blog];
            if( data ){
                db.query('SELECT count(blog) as count FROM post WHERE blog = ?', data.bid, function( err, rows ){
                    if( !err ){
                        data.length = (rows[0] || {count: 0}).count || 0;
                        util.ok(data);
                    }else{
                        util.error('cornhollio');
                    }
                });
            }else{
                util.error('bullshit')
            }
        });

        return util.wait;
    },
    get: function( blog, page, user, util ){
        Z.doAfter( function( callback ){
            if( cacheBlogName[blog] )
                callback();
            else
                api.blog.info({blog: blog, user: user}, callback);
        }, function(  ){
            var query = db.query('SELECT post.*, user.login as userName, user.sex as sex FROM post '+
                'left join user on (user.uid = post.creator) '+
                'WHERE post.blog = ? LIMIT ?,?', [cacheBlogName[blog].bid, page * perPage, perPage], function( err, rows ){
                if( err ){
                    util.error('dickhead');
                }else{
                    util.ok(rows);
                }
            });
            debug && console.log(query.sql);
        });

        return util.wait;
    }
};