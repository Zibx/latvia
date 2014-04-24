exports = module.exports = {
    create: function( text, parent, post, util, user ){


        var data = {
            post: post,
            creator: user.uid,
            creation: Z.sqlDate(new Date() ),
            content: text,
            vote: 0,
            voteCount: 0,
            parent: parent
        };

        db.query( 'INSERT INTO comment SET ?', data, function( err, result ){
            debugger;
            util.ok(result.insertId);
        });



        return util.wait;
    }
};