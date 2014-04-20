(function(){
    'use strict';
    var applyDeep,
        toString = Object.prototype.toString,
        getType = function( obj ){
            return toString.call( obj );
        },
        slice = Array.prototype.slice,
        parseFloat = this.parseFloat,

        _delayList = [],
        _delay,
        _delayFn = function(  ){
            _delay = false;
            var i, _i, data;
            for( i = 0, _i = _delayList.length; i < _i; i++ ){
                data = _delayList[i];
                delete data.fn.__delayed;
                delete data.scope.__delayed;
                data.fn.apply( data.scope, data.args || [] );
            }
        },
        bind = Function.prototype.bind;

    this.Math.sgn = function( num ){
        return num >= 0 ? 1 : -1;
    };

    var JS = this.JS = {
        include: function( path ){
            var out = {}, fs = require('fs');
            fs.readdir( path, function(err, data){
                Z.each(data, function( el ){
                    if( el.substr( el.length - 3, 3 ) === '.js' ){
                        try{
                            out[el.substr( 0, el.length - 3 )] = require('.'+path+el );
                        }catch(e){
                            console.dir(e);
                            Z.error('Error loading '+'.'+path+el);

                        }
                    }
                });
            });
            return out;
        },
        delay: function( fn, scope, args ){
            if( fn.__delayed && scope.__delayed )
                return;
            _delayList.push( {fn:fn, scope:scope, args:args} );
            fn.__delayed = true;
            scope.__delayed = true;
            !_delay &&( _delay = setTimeout( _delayFn, 0) );
        },
        getRandom: function( arr ){
            return arr[ Math.rand(0, arr.length - 1 ) ];
        },
        getType: getType,
        getNormalizedType: function( obj ){
            var type = getType( obj );
            return type.substr( 8, type.length - 9 );
        },
        range: function(from, to, step){
            var arr = [], i;
            step = step || 1;
            step = Math.sgn( to - from ) * Math.abs( step );
            if( !step )
                return [];

            for( i = from; i <= to; i += step )
                arr.push(i);
            return arr;
        },
        warn: (function(){
            var c = console || {},
                e = c.error;
            return function( data ){
                if( e )
                    e.call(c, data);
                else
                    setTimeout(function(  ){
                        throw data;
                    }, 0);
            };
        })(),
        bind: function( scope, fn ){
            var subFn = scope[ fn ];
            return bind.apply( subFn, [].concat.apply( [scope],JS.toArray( arguments ).slice(2) ) );
            //return subFn.bind.apply( subFn, [].concat.apply( [scope],JS.toArray( arguments ).slice(2) ) );
        },
        /* take array of values. find exact match el of el that value is before searched one. It's binary search*/
        findBefore: function( arr, el ){
            return arr[ JS.findIndexBefore( arr, el ) ];
        },
        getArrayDate: function(  ){
            var c = new Date();
            c = new Date(+c + c.getTimezoneOffset()*60*1000);
            return [c.getFullYear(), c.getMonth(), c.getDate(), c.getHours(), c.getMinutes(), c.getSeconds(), c.getMilliseconds()];
        },
        findIndexBefore: function( arr, el ){
            var l1 = 0,
                delta = arr.length,
                floor = Math.floor,
                place;
            while( delta > 1 ){
                delta = delta / 2;
                if( arr[floor(l1 + delta)] > el ){
                }else{
                    l1 += delta
                }
            }
            place = floor(l1+delta)-1;
            return place;
        },

        interval: function( from, to, step ){
            var out = [];
            step = Math.abs( step ) || 1;
            if( to < from )
                for( ;from >= to; from -= step )
                    out.push( from );
            else
                for( ;from <= to; from += step )
                    out.push( from );
            return out;
        },
        repeat: function( n, fn, scope ){
            var out = [];
            for( var i = 0; i < n; i++ )
                out.push( fn.call( scope, i, n ) );
            return out;
        },
        parseFloat: function(a){
            return parseFloat(a) || undefined;
        },
        getProperty: function( prop ){
            return function(a){
                return a[ prop ];
            }
        },
        getArgument: function( n ){
            return function(){
                return arguments[ n ];
            }
        },
        or: function(prop){
            return function(a){
                return a || prop;
            }
        },
        getPropertyThroughGet: function( prop ){
            return function(a){
                return a.get( prop );
            }
        },
        sort: {
            number: function( a, b ){
                return a - b;
            },
            numberReverse: function( a, b ){
                return b - a;
            },
            numberByProperty: function( name ){
                return function( a, b ){
                    return a[ name ] - b[ name ];
                }
            },
            stringByProperty: function( name ){
                return function( a, b ){
                    var aKey = a[ name ], bKey = b[ name ];
                    return aKey > bKey ? 1 : aKey < bKey ? -1 : 0;
                }
            }
        },
        checkthisPropertyExist: function (name) {
            return this.checkPropertyExist(name, this);
        },
        checkPropertyExist: function (name, obj) {
            var arr = name.split('.');

            for (var i = 0, l = arr.length; i < l; i++) {
                if (!obj[arr[i]])
                    return false;
                obj = obj[arr[i]];
            }

            return obj;
        },
        mapFn: {
            toUpperCase: function(a){
                return (a || '').toUpperCase();
            }
        },
        reduceFn: {
            min: function( a, b ){
                return a != null ? ( b != null  ? Math.min( a, b ) : a ) : b;
            },
            max: function( a, b ){
                return a != null ? ( b != null ? Math.max( a, b ) : a ) : b;
            },
            sum: function( a, b ){
                return a - (-b);
            },
            diff: function( a, b ){
                return b - a;
            },
            push: function( a ){
                this.push( a );
            },
            concat: function( a, b ){
                return a.concat( b );
            }
        },
        filter: (function(){
            var filterFn = function(fn, out){
                return function(){
                    var data = fn.apply(this, JS.toArray(arguments));
                    if( data !== void 0 )
                        out.push( data );
                }
            };
            return function( arr, fn ){
                var out = [];
                JS.each( arr, filterFn(fn, out) );
                return out;
            }
        })(),
        /* test case:
         JSON.stringify(
         JS.objectDiff( {
         a: 1,
         b: 3,
         c: [1,2,4],
         e: 0,
         f: 33,
         g: {a:1},
         h: {a:1}
         },
         {
         b: 10,
         c: [1,2,3],
         d: 4,
         e: null,
         g: {a:1},
         h: {b:3,a:1}

         }, null
         )
         ,true,2)

         =>

         {
         "d": 4,
         "a": null,
         "c": [
         1,
         2,
         3
         ],
         "e": null,
         "f": null,
         "h": {
         "b": 3,
         "a": 1
         }
         }
         */
        objectDiff: function (old, newOne, emptyValue, similarValues, deep) {
            var getType = JS.getType,

                hash = {},
                diff = {},
                i, j,
                val1, val2,
                type1, type2,
                differences = false,

                similarValues = JS.arrayToObj(similarValues || []);


            deep = deep === void 0 ? true : deep;

            for( i in old )
                old.hasOwnProperty( i ) &&
                ( hash[ i ] = old[i] );

            for( i in newOne )
                newOne.hasOwnProperty( i ) &&
                    ( hash[ i ] === void 0 && newOne[ i ] !== void 0 ) &&
                    ( differences = true ) &&
                ( diff[i] = newOne[ i ] );

            for( i in hash )
                if( hash.hasOwnProperty( i ) ){
                    if( ( val1 = hash[i] ) === ( val2 = newOne[i] ) )
                        continue;

                    if( ( similarValues[ val1 ] === true ) === similarValues[ val2 ] )
                        continue;

                    if( val2 === void 0 ){
                        ( differences = true ) && (diff[i] = emptyValue );
                        continue;
                    }

                    if( ( type1 = getType(val1) ) !== ( type2 = getType(val2) ) ){
                        ( differences = true ) && ( diff[i] = val2 );
                        continue;
                    }

                    // here elements have the same type
                    if( type1 === '[object Array]' ){
                        if( (j = val1.length ) !== val2.length ){
                            ( differences = true ) && ( diff[i] = val2 );
                            continue
                        }

                        for( ;j; ){
                            --j;
                            if( val1[ j ] !== val2[ j ] ){
                                ( differences = true ) && ( diff[i] = val2 );
                                continue;
                            }
                        }
                    }else if( type1 === '[object Object]' ){
                        if (deep === true)
                            if (JS.objectDiff(val1, val2, emptyValue, similarValues, deep) !== false)
                                ( differences = true ) && ( diff[i] = val2 );
                    }else{
                        ( differences = true ) && ( diff[i] = val2 );
                    }


                }

            return differences ? diff : false;
        },
        pipe: function(){
            var args = JS.toArray(arguments);
            return function(){
                var out = JS.toArray(arguments);
                for( var i = 0, _i = args.length; i < _i; i++)
                    out = [args[i].apply( this, out )];
                return out[0];
            }
        },
        /*
         * Let the magic begin
         *
         * magic test:
         *
         var t;
         console.clear();
         t = JS.fnQueue( function(a,b){ console.log(a+'>'+b, a>b);return a>b; }, '&&', function(){console.log('other'); return true} )
         console.log(t(2,1));
         console.log('-----');

         t = JS.fnQueue( function(a,b){ console.log(a+'>'+b, a>b);return a>b; }, '||', function(){console.log('other'); return true} )
         console.log(t(2,1));
         console.log('-----');

         t = JS.fnQueue( function(a,b){ console.log(a+'>'+b, a>b);return a>b; }, '&&', function(){console.log('other'); return true} )
         console.log(t(1,2));
         console.log('-----');

         t = JS.fnQueue( function(a,b){ console.log(a+'>'+b, a>b);return a>b; }, '||', function(){console.log('other'); return true} )
         console.log(t(1,2));
         console.log('-----');
         *
         *
         * */
        fnQueue: (function(){

            var slice = Array.prototype.slice;

            var QueueWrapper = function( FNs, scope, args ){
                var result,
                    fn;

                for( var i = 0, _i = FNs.length; i < _i; i++ ){
                    fn = FNs[ i ];

                    if( // great match begin
                        i === 0 // first element
                            || // or
                            (
                                !result // not result
                                    && // and
                                    (
                                        fn === '||' // fn is ||
                                            && // then
                                            ( i++ ) // take next fn
                                            &&
                                            ( fn = FNs[ i ] )
                                        )
                                )
                            || // or
                            (
                                result // result
                                    && // and
                                    (
                                        fn === '&&' // fn is &&
                                            && // then
                                            ( i++ ) // take next fn
                                            &&
                                            ( fn = FNs[ i ] )
                                        )
                                )
                        ) // great match end
                        result = typeof fn === 'function' ? fn.apply( scope, args ) : fn;
                    else
                        break;
                }
                return result;
            };
            var Queue = function(){
                var FNs = slice.call( arguments );
                return function(){ return QueueWrapper( FNs, this, slice.call( arguments ) ) };
            };

            Queue.IF = function(){};
            Queue.AND = function(){
                var args = slice.call( arguments ),
                    i = args.length - 1;

                for(;i;)
                    args.splice(i--,0,'&&');

                return Queue.apply( this, args );
            };
            Queue.OR = function(){
                var args = slice.call( arguments ),
                    i = args.length - 1;

                for(;i;)
                    args.splice(i--,0,'||');

                return Queue.apply( this, args );
            };


            return Queue;
        })(),
        /*
         Function: doAfter

         Takes lots of functions and executes them with a callback function in parameter. After all callbacks were called it executes last function

         */
        doAfter: function(){
            var i = 0,
                _i = arguments.length - 1,
                counter = _i,
                callback = arguments[ _i ],
                data = {};

            for( ; i < _i; i++ ){
                (function( callFn, i ){
                    var fn = function(){
                        data[ i ] = arguments;

                        if( fn.store != null )
                            data[ fn.store ] = arguments;

                        if( !--counter )
                            callback( data );

                    };

                    callFn( fn )
                })( arguments[i], i );
            }
        },
        zipObject: function( arr1, arr2 ){
            var out = {};
            arr1.forEach(function( el, i ){
                out[el] = arr2[i];
            } );
            return out;
        },
        emptyFn: function(){},
        /*
         proxy config
         {
         fromKey: toKey        = rename
         fromKey: !toValue     = delete property if toKey === value
         !fromKey: toValue     = add value to fromKey if it's not exists
         }
         */
        proxy: function( proxy, obj ){
            var newObj = JS.clone( obj );
            JS.each( proxy, function( key, val ){

                if( val && val.charAt(0) == '!' ){
                    if( obj[ key ] == val.substr( 1 ) )
                        delete newObj[ key ];
                }else if( key.charAt(0) == '!' && newObj[ key.substr( 1 ) ] === undefined ){
                    newObj[ key.substr( 1 ) ] = val;
                }else{
                    if( obj[ key ] && val )
                        newObj[ val ] = obj[ key ];
                    delete newObj[ key ];
                }
            });
            return newObj;
        },
        error: function( text ){
            console.error(text);
            process.exit();
        },
        clone: function( obj, deep ){
            var out, i, cloneDeep = deep != null;
            switch( getType( obj ) ){
                case '[object Array]':
                    out = [];
                    if( cloneDeep )
                        for( i = obj.length; i; ){
                            --i;
                            out[ i ] = JS.clone( obj[ i ], true );
                        }
                    else
                        for( i = obj.length; i; ){
                            --i;
                            out[ i ] = obj[ i ];
                        }
                    return out;
                case '[object Object]':
                    out = {};
                    if( cloneDeep )
                        for( i in obj )
                            out[ i ] = JS.clone( obj[ i ], true );
                    else
                        for( i in obj )
                            out[ i ] = obj[ i ];


                    return out;
            }
            return obj;
        },
        applyIfNot: function( el1, el2 ){
            var i, undefined = void 0;

            for( i in el2 )
                el1[ i ] === undefined && ( el1[ i ] = el2[ i ] );

            return el1;
        },
        /*
         Function: apply

         Applies el2 on el1. Not recursivly

         Parameters:
         el1 - object to apply on
         el2 - applieble object

         Return:
         el1

         See also:
         <JS.applyLots> <JS.applyDeep>
         */
        apply: function( el1, el2 ){
            var i;

            for( i in el2 )
                el1[ i ] = el2[ i ];

            return el1;
        },

        /*
         Function: slice

         Array.prototype.slice usually useful to convert arguments to Array

         Parameters:
         args - Array || arguments
         start - start position
         length - count of items

         Return:
         array

         Example:
         (code)
         (function (){
         return JS.slice.call( arguments, 1 );
         })(1,2,3,4,5)
         // Output:
         //   [2,3,4,5]
         (end code)
         */
        slice: slice,

        toArray: function( obj ){
            return slice.call( obj );
        },

        /*
         Function: applyLots
         Apply more then one objects

         Parameters:
         el1 - object to apply on
         args[ 1-inf ] - applieble objects

         Return:
         el1

         See also:
         <JS.apply> <JS.applyDeep>
         */
        applyLots: function( el1 ){
            var i, j, el2, applyL = arguments.length;
            for( j = 1; j < applyL; j++ ){
                el2 = arguments[ j ];
                for( i in el2 )
                    el1[ i ] = el2[ i ];
            }
            return el1;
        },

        /*
         Function: applyLots
         Recursivly aplly el2 on el1. Work propper only with objects. Was designed to apply plugins.

         Parameters:
         el1 - object to apply on
         el2 - applieble object

         Return:
         el1

         See also:
         <JS.apply> <JS.applyLots>
         */
        applyDeep: function(a,b){
            var me = applyDeep,
                i, el;

            for( i in b ){
                el = a[ i ];
                if( el && typeof el === 'object' ){
                    me( el,  b[ i ] );
                }else
                    a[ i ] = b[ i ];
            }
            return a;
        },

        /*
         Function: isArray
         Test is argument an Array

         Parameters:
         obj - object

         Return:
         bool - true if array, false if not

         */
        isArray: function( obj ){
            return getType( obj ) === '[object Array]';
        },

        /*
         Function: each
         Itterate Objects && Arrays.

         Object gets:
         key  - key
         value  - value

         this  - element

         Array gets:
         value  - value
         i  - index of element in array

         this  - element


         Parameters:
         el - Object || Array
         callback - function which would be called with each item

         See also:
         <eachReverse>
         */
        each: function( el, callback ){
            var i, _i, out;

            if( el === null || el === undefined )
                return false;

            if( JS.isArray( el ) ){
                for( i = 0, _i = el.length; i < _i; i++ ){
                    out = callback.call( el[i], el[i], i );
                    if( out !== undefined )
                        return out;
                }
            }else{
                for( i in el )
                    if( el.hasOwnProperty( i ) ){
                        out = callback.call( el[i], i, el[i] );
                        if( out !== undefined )
                            return out;
                    }

            }
        },
        /*
         Function: eachReverse
         Itterate Objects && Arrays in reverse order.

         Object gets:
         key  - key
         value  - value

         this  - element

         Array gets:
         value  - value
         i  - index of element in array

         this  - element


         Parameters:
         el - Object || Array
         callback - function which would be called with each item

         See also:
         <each>
         */
        eachReverse: function( el, callback ){
            var i, _i, item;

            if( el === null || el === undefined )
                return false;

            if( JS.isArray( el ) ){
                for( i = el.length; i; ){
                    --i;
                    callback.call( el[i], el[i], i );
                }
            }else{
                _i = [];
                for( i in el ){
                    if( el.hasOwnProperty( i ) )
                        _i.push( [ i, el[i] ] )
                }
                for( i = _i.length; i; ){
                    item = _i[ --i ];
                    callback.call( item[1], item[0], item[1] );
                }

            }
        },
        /*
         Function: makeArray
         wraps single element with Array if not

         Parameters:
         el - Element

         Return:
         Array
         */
        makeArray: function( obj ){
            return obj !== void 0 ? ( this.isArray( obj ) ? obj : [ obj ] ) : [];
        },
        /*
         Function: arrayRotate
         Lets imagine an array as a looped object, where after last element goes the first one.

         Parameters:
         arr - Array
         val - offset of rotation

         Return:
         Array

         Example:
         JS.arrayRotate([1,2,3,4,5],2) => (3,4,5,1,2)
         */
        arrayRotate: function( arr, i ){
            return arr.slice(i).concat(arr.slice(0,i));
        },
        /*
         Function: arrayToObj
         Convert Array to hash Object

         Parameters:
         arr - Array
         val [optional] - value that would be setted to each member (default is _true_)

         Return:
         Hash object
         */
        arrayToObj: function( arr, val ){
            var i = 0, _i = arr.length,
                newVal = val || true,
                out = {};
            if( arr === null || arr === undefined ) return out;

            for( ; i < _i; i++ ){
                out[ arr[ i ] ] = newVal;
            }
            return out;
        },
        getComments: function(text){
            var i, _i, m, mOld, inQuote = false, quoteType, stripped = false, inComment = false,
                commentType, tokens = [], token = '', lastTokenType,
                pushToken = function( len ){
                    len !== 0 && ( token = token.substr(0, token.length + len ));
                    if( token !== ''){
                        tokens.push( {type: lastTokenType, text: token } );
                    }
                    token = '';
                };

            for( i = 0, _i = text.length; i < _i; i++){
                m = text.charAt(i);
                if( inComment ){
                    if( (commentType === '*' && m === '/' && mOld === '*') || (commentType === '/' && m === '\n') ){
                        pushToken(-1);
                        inComment = false;
                        lastTokenType = 'code';
                    }
                }else if( stripped ){
                    stripped = false;
                }else{

                    if( !inQuote ){
                        if( m === '\\' ){

                            stripped = true;
                        }else if( m === '"' || m === "'" ){

                            inQuote = true;
                            quoteType = m;
                        }else if( (m === '*' && mOld === '/') || (m === '/' && mOld === '/') ){

                            pushToken();
                            inComment = true;
                            commentType = m;
                            lastTokenType = 'comment';
                            continue;
                        }
                    }else{
                        if( m === '\\' ){
                            stripped = true;
                        }else if( m === quoteType ){
                            inQuote = false;
                            pushToken();
                        }
                    }
                }
                token += m;
                mOld = m;
            }
            pushToken();
            return tokens;
        },
        /*
         arr: [{id: 2,name:'a'},{id:5, name:'b'}]
         makeHash(arr, 'id') => {2:{id: 2,name:'a'}, 5:{id:5, name:'b'}}

         makeHash(arr, function(el){ return el.name+el.id;}) => {a2:{id: 2,name:'a'}, b5:{id:5, name:'b'}}

         makeHash(arr, 'id', JS.getProperty('name')) => {2:'a', 5:'b'}

         makeHash(arr, function(el){ return el.name+el.id;}, JS.getProperty('name')) => {a2:'a', b5:'b'}

         */
        makeHash: function( arr, hash, hashVal ){
            var out = {}, i, item;
            if( typeof hashVal === 'function' )
                if( typeof hash === 'function' ){
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        out[ hash( item ) ] = hashVal(item);
                    }
                }else{
                    for( i = arr.length; i; ){
                        item = arr[ --i ];
                        out[ item[ hash ] ] = hashVal(item);
                    }
                }
            else
            if( typeof hash === 'function' ){
                for( i = arr.length; i; ){
                    item = arr[ --i ];
                    out[ hash( item ) ] = item;
                }
            }else{
                for( i = arr.length; i; ){
                    item = arr[ --i ];
                    out[ item[ hash ] ] = item;
                }
            }
            return out;
        },

        arrObjApply: function( obj, args, need, def ){ // What the fuck is it doing and why I wrote this
            var out = {};
            if( args === null || args === undefined )
                return {};
            else{

                if( args.length === 1 )
                    out = arguments[ 0 ];
                else{
                    this.each( need, function( el, i ){
                        out[ el ] = args[ i ] || def;
                    } );
                }

                this.apply(
                    obj,
                    out
                );
                return out;
            }
        },
        map: function(el, f){
            var out = [],
                toArray = JS.toArray;
            JS.each(el, function(){
                out.push( f.apply( this, toArray(arguments) ) );
            });
            return out;
        },
        isEmpty: function( obj ){
            var undefined = void 0;
            if( getType( obj ) === '[object Object]' )
                for( var i in obj ){
                    if( obj.hasOwnProperty(i) && obj[i] !== undefined )
                        return false
                }
            return true;
        },
        allArgumentsToArray: function(args){
            return Array.prototype.concat.apply([],JS.toArray(args).map( JS.makeArray.bind(JS) ));
        }
    };
    JS.filter = JS.apply( JS.filter, {
        inverse: function( fn ){
            return function(a){
                return !fn(a);
            }
        },
        equal: function( a ){
            return function(el){ return el === a; };
        },
        'typeof': function( a ){
            return function(el){ return typeof el === a; };
        },
        string: function(a){ return typeof a === 'string';},
        'function': function(a){ return typeof a === 'function';},
        not: function(a){ return !a; },
        notEmptyString: function(a){ return a !== ''; },
        notUndefined: function(a){ return a !==void(0); },
        match: function( cfg ) {
            return function(obj) {
                for (var i in cfg)
                    if (cfg.hasOwnProperty(i))
                        if (obj[i] !== cfg[i])
                            return false;
                return true;
            };
        },
        /*use matchFast only if you cache selectors
         generate this fn + filter 50 items speed gets equal to match.
         on lim of items filter speed gets ~= half faster*/
        matchFast: function( cfg ){
            var txt = [],
                params = [];
            for( var i in cfg )
                if( cfg.hasOwnProperty(i) ){
                    params.push('param'+i+'=cfg[\''+i+'\']');
                    txt.push( 'obj[\''+i+'\']!==param'+i );
                }
            var fin = 'var '+params.join(',')+';\nreturn function(obj){'+'return !('+ txt.join(' ||\n\t ')+ ');'+'\n};';

            return (new Function('cfg', fin))(cfg);
        },
        any: function (obj, predicate) {
            var i;

            if (obj === null || obj === undefined)
                return false;

            if (JS.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (predicate.call(obj[i], obj[i], i))
                        return true;
                }
            } else {
                for (i in obj)
                    if (obj.hasOwnProperty(i)) {
                        if (predicate.call(obj[i], obj[i], i))
                            return true;
                    }
            }

            return false;
        },
        all: function (obj, predicate) {
            var i;

            if (obj === null || obj === undefined)
                return false;

            if (JS.isArray(obj)) {
                for (i = 0; i < obj.length; i++) {
                    if (!predicate.call(obj[i], obj[i], i))
                        return false;
                }
            } else {
                for (i in obj)
                    if (obj.hasOwnProperty(i)) {
                        if (!predicate.call(obj[i], obj[i], i))
                            return false;
                    }
            }

            return true;
        }
    });
    applyDeep = JS.applyDeep;
    JS.a2o = JS.arrayToObj;
    //require('./observable');
    this.Z = JS;
    var observable = {

        /*
         Function: fireEvent (fire)
         Fires an event



         Parameters:
         eventName - name of event
         args[ 1 .. inf ] - arguments to event callbacks

         */
        fireEvent : function fire( eventName ) {
            return this._fireDeepEvent( this, eventName, slice.call( arguments, 1 ) );
        },

        /* releasing the beast. generic fire that have got scope */
        _fireDeepEvent: function( scope, eventName, data ){
            var fns,
                prevented = false, i;

            if( this.listeners && ( fns = this.listeners[ eventName ] ) )
                if( typeof fns === 'function' )
                    prevented = fns.apply( scope, data ) === false;
                else{
                    for( i = fns.length; i ; ){
                        prevented = prevented || fns[ --i ].apply( scope, data ) === false;
                    }
                }

            return prevented ? false : (this._base ? this._base._fireDeepEvent( scope, eventName, data ) : this );
        },

        /*
         Function: on

         Subscribe callback on event

         Parameters:
         eventName - name of event
         fn - callback function
         [ caller = this ] - scope to call on ( default: this )

         */
        on : function( eventName, fn ){
            var i, _i, tokens;
            if( typeof eventName !== 'string' ){ // object of events
                for( i in eventName )
                    if( eventName.hasOwnProperty( i ) )
                        this.on.call( this, i, eventName[ i ] );

            }else{
                if( eventName.indexOf(',') > -1 ){
                    for( i = 0, tokens = eventName.split(','), _i = tokens.length; i < _i; i++ )
                        this.on.call( this, tokens[ i ], fn );

                }else{
                    if( typeof fn !== 'function' ){
                        for( i = 0, _i = fn.length; i < _i; i++ )
                            this.on.call( this, eventName, fn[ i ] );
                    }else{
                        this.listeners === undefined && ( this.listeners = {} );

                        if( this.listeners[ eventName ] === undefined ){
                            this.listeners[ eventName ] = [ fn ];
                        }else if( typeof this.listeners[ eventName ] === 'function' ){
                            this.listeners[ eventName ] = [ this.listeners[ eventName ], fn ];
                        }else{
                            this.listeners[ eventName ].push( fn );
                        }
                    }
                }
            }
            return this;
        },

        /*
         Function: un

         Unsubscribe callback for event. It's important that fn shoul be same function pointer, that was pased in <on>

         Parameters:
         eventName - name of event
         fn - callback function

         */
        un : function un( eventName, fn ){
            var fns,
                i;

            if (typeof eventName !== 'string') { // object of events
                for (i in eventName)
                    if (eventName.hasOwnProperty(i))
                        this.un.call(this, i, eventName[i]);
            }
            else if (eventName !== undefined) {
                fns = this.listeners[eventName];
                if (fns === void 0) return this;
                if( fn === undefined )
                    delete this.listeners[ eventName ];
                else
                if( typeof fns === 'function' ){
                    if( fns === fn )
                        delete this.listeners[ eventName ];

                }else
                    for( i = fns.length; i; )
                        if( fns[ --i ] === fn )
                            fns.splice( i, 1 );
            }

            return this;

        },
        /*
         Function: set

         Set parameter with events
         */

        set: function( param, value ){
            var oldValue = this[ param ];
            if( oldValue === value )
                return false;

            if( this.fireEvent( param + 'BeforeSet', value, oldValue ) === false )
                return false;
            this[ param ] = value;
            this.fireEvent( param + 'Set', value, oldValue );
            this.fire( '_changed', param, value, oldValue );
            return this;
        }


    };
    observable.fire = observable.fireEvent;
    Z.observable = function( obj ){
        Z.apply(obj, observable);
    };
}).call(GLOBAL);