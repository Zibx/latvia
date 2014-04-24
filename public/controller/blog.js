Z.controller.blog = Z.observable({
    tpls: ['post','mainLayout', 'greeting','username','newPost'],
    init: function(){
        document.body.innerHTML = DOM.tplRenderer('mainLayout')();

        var els = this.els = {};
        ['left_menu', 'top', 'content', 'bottom'].forEach( function( name ){
            els[name] = document.querySelector('.'+name);
        });
        this.buildNewPostForm();
        Z.query('blog','getGreeting',{},function(greet){
            els.top.innerHTML = DOM.tplRenderer('greeting')({
                text: Z.simpleTpl(greet, Z.apply({
                    username: DOM.tplRenderer('username')( Z.user )
                }, Z.user))
            });
        });

    },
    buildNewPostForm: function(  ){
        if( this.els.newPost )
            return;

        var div = this.els.newPost = document.createElement('div');
        div.innerHTML = DOM.tplRenderer('newPost')( Z.user );

        var els = {
            show: div.querySelector('.js_show_form'),
            form: div.querySelector('.new_post_form_js'),
            text: div.querySelector('.js_post_text'),
            button: div.querySelector('.js_post_button')
        },
            doPost = function(){
                Z.query('post','create',{
                    text: els.text.value,
                    blog: this.lastBlog
                }, function( postId ){
                    document.location.hash = '/post/'+ postId;
                });
            }.bind(this);
        DOM.addListener( els.show, 'click', DOM.toggleClass.bind(DOM, els.form, 'hidden') );
        DOM.addListener( els.text, 'keydown', function( e ){
            if( e.which === 13 && e.ctrlKey ){
                e.stopPropagation();
                e.preventDefault();
                doPost();
            }
        });
        DOM.addListener( els.button, 'click', doPost );
    },
    blogs: {},
    postMapping: function( el ){
        var obj = Z.clone(el);
        obj.text = el.content;
        obj.user = el.userName;
        return obj;
    },
    router: function( route ){

        this.route = route;
        var page = route[route.length-1]| 0,
            blog = route[route.length-2] || 'main';

        if( blog !== this.lastBlog ){ // if blog changed => we need to query new blog info
            this.lastBlog = blog;
            Z.query('blog', 'info', {blog: blog}, function( data ){
                this.els.content.innerHTML = '';
                this.els.content.appendChild(this.els.newPost);



                this.blogs[blog] = data;
                this.lastPage = void 0;
                this.router(route); // after that we would reroute
            }.bind(this), function(  ){
                alert('YOU ШELL NO PASS');
            });
            return; // and do nothing
        }
        if( page !== this.lastPage ){
            var doc = document;
            Z.query('blog', 'get', {blog: blog, page: page}, function( posts ){
                var visible = this.blogs[blog].visible;
                !visible && (visible = this.blogs[blog].visible = {});
                var fragment = doc.createDocumentFragment(),
                    renderer = DOM.tplRenderer('post' ),
                    mapping = this.postMapping;
                posts.forEach( function( post ){
                    if( !visible[post.pid] ){
                        visible[post.pid] = true;
                        var div = doc.createElement('div');
                        div.innerHTML = renderer(mapping(post));
                        fragment.appendChild(div.childNodes[0]);
                    }
                });
                this.els.content.appendChild(fragment);
            }.bind(this))
        }


    }
});
