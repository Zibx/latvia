Z.controller.post = Z.observable({
    tpls: ['post','comment','mainLayout','newComment', 'greeting','username'],
    init: function(){
        document.body.innerHTML = DOM.tplRenderer('mainLayout')();

        var els = this.els = {};
        ['left_menu', 'top', 'content', 'bottom'].forEach( function( name ){
            els[name] = document.querySelector('.'+name);
        });
        this.buildNewCommentForm();
        Z.query('blog','getGreeting',{},function(greet){
            els.top.innerHTML = DOM.tplRenderer('greeting')({
                text: Z.simpleTpl(greet, Z.apply({
                    username: DOM.tplRenderer('username')( Z.user )
                }, Z.user))
            });
        });
    },
    buildNewCommentForm: function(  ){
        if( this.els.newPost )
            return;

        var div = this.els.newComment = document.createElement('div');
        div.innerHTML = DOM.tplRenderer('newComment')();

        var els = {
                text: div.querySelector('.js_comment_text'),
                button: div.querySelector('.js_comment_button')
            },
            doComment = function(){
                Z.query('comment','create',{
                    text: els.text.value,
                    post: this.lastPost,
                    parent: -1
                }, function( postId ){

                });
            }.bind(this);


        DOM.addListener( els.text, 'keydown', function( e ){
            if( e.which === 13 && e.ctrlKey ){
                e.stopPropagation();
                e.preventDefault();
                doComment();
            }
        });
        DOM.addListener( els.button, 'click', doComment );
    },
    postMapping: function( el ){
        var obj = Z.clone(el);
        obj.text = el.content;
        obj.user = el.userName;
        return obj;
    },
    commentMapping: function( el ){
        return el;
    },
    renderComments: function( data ){
        data.forEach( function( el ){
            var comment = document.createElement('div');
            comment.innerHTML = DOM.tplRenderer('comment')(this.commentMapping(el));
            this.els.comments.appendChild(comment);
        }.bind(this))
    },
    router: function( route ){
        Z.query('post', 'get', {pid: route[1]}, function( data ){
            this.lastPost = route[1];
            this.els.content.innerHTML = DOM.tplRenderer('post')(this.postMapping(data));
            this.els.content.appendChild(this.els.comments = document.createElement('div'));
            this.renderComments(data.comments);
            this.els.content.appendChild(this.els.newComment)
        }.bind(this))
    }
});