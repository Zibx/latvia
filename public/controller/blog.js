Z.controller.blog = Z.observable({
    tpls: ['post','mainLayout'],
    init: function(){
        document.body.innerHTML = DOM.tplRenderer('mainLayout')();
        var els = this.els = {};
        ['left_menu', 'top', 'content', 'bottom'].forEach( function( name ){
            els[name] = document.querySelector('.'+name);
        });

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
        this.listLoaded && this.navigate();
        var page = route[route.length-1]| 0,
            blog = route[route.length-2] || 'main';

        if( blog !== this.lastBlog ){
            this.lastBlog = blog;
            Z.query('blog', 'info', {blog: blog}, function( data ){
                this.els.content.innerHTML = '';
                this.blogs[blog] = data;
                this.lastPage = void 0;
                this.router(route);
            }.bind(this), function(  ){
                alert('YOU ШELL NO PASS');
            });
            return;
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
