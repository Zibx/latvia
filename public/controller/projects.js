Z.controller.login = Z.observable({
    tpls: ['login'],
    init: function(){

    },
    router: function( route ){
        this.route = route;
        this.listLoaded && this.navigate();
    },

    navigate: function(  ){
            var listName, item;
            if( this.currentActive ){
                item = Z.clone(this.storage.get('id', this.currentActive )[0]);
                item.active = false;
                this.list.edit(item.id, item);
            }

            listName = (this.route[0] || '').trim().toLowerCase() || 'new';
            if( listName === 'new' ){
                this.currentActive = void 0;
                this.fire('tabChange', 'new');
            }else{
                item = this.storage.get('id', listName);
                if(!item)
                    return;
                item = Z.clone(item[0]);
                item.active = true;
                this.list.edit(item.id, item);
                if( this.currentActive !== item.id ){
                    this.currentActive = item.id;
                }
                this.fire( 'tabChange', this.route[1] || 'about');
            }
    }
});
