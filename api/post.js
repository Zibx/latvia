exports = module.exports = {
    create: function( text, title, blog, util, user ){
        api.blog.getBlogId({blog: blog}, function(bid){
            if( bid ){
                var data = {
                    creator: user.uid,
                    blog: bid,
                    content: text,
                    title: title || '',
                    private: 0,
                    vote: 0,
                    voteCount: 0,
                    lastCommentDate: Z.sqlDate(new Date()),
                    creation: Z.sqlDate(new Date())
                };

                db.query( 'INSERT INTO post SET ?', data, function( err, result ){
                    util.ok(result.insertId);
                });
            }else{
                util.error('Homodril')
            }

        });
        return util.wait;
    },
    get: function( pid, util, user ){
        db.query('SELECT post.*, user.login as userName, user.sex as sex FROM post '+
            'left join user on (user.uid = post.creator) '+
            'WHERE post.pid = ?', [pid], function(err, post) {
            if( err ){
                util.error('Cunt');
            }else{
                post = post[0];
                db.query('SELECT * from comment where post=?', [pid], function(err, data) {
                    post.comments = Z.toArray(data);
                    util.ok(post);
                });
            }
        });
        return util.wait;
    }
};