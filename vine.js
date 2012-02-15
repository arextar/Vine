vine=(function(
               expando,//The amount of milliseconds right now, unique identifier shorter than Math.random()
               uid,//A unique identifier, attached with expando to link to stored data
               data,//An object storing data(stored in central store for simplicity and to prevent leakage)
               defaultPrevented,//Shortening of .defaultPrevented
               addEventListener,//Shortening of .addEventListener
               attachEvent,//Shortening of .attachEvent
               document,//Reference to document
               vine,//Placeholder for vine object
               Event//Placeholder for vine.Event
               ){
    
    //Initialize and fetch the data on an object
    function _data(
                   object,//Object to get data from
                   id//Placeholder for unique id
                   ){
        id = object[expando] = object[expando] || uid++
        return data[id] = data[id] || {b: {}, e: {}};
    }
    
    //If an object is a string, get the element with that ID
    function id(
                object//Object to test
                ){
        return object.charAt ? document.getElementById(object) : object;
    }
    
    //Create vine object
    vine={
        
        //Expose data function for plugins
        d: _data,
        id: id,
        
        //A constructor to build a normalized event
        Event: Event = function(
                             e,//Objects to mix in properties of
                             x,//Placeholder for iteration
                             t//Placeholder for 'this' to shorten code
                             ){
            t = this;
            for(x in e) t[x] = t[x] || e[x];
            t.timestamp = +new Date;
            t.target = t.target || t.srcElement;
        },
        
        //Bind a function to an element
        bind: function(
                      object,//Object to attach event to
                      type,//Type of event (optinally prefixed with a namespace)
                      fn,//Handler to bind
                      evt_dat,//Data to bind with
                      dat,//Placeholder for element's data
                      ns,//Placeholder for namespace
                      arr,//Placeholder for an array
                      l//Placeholder for length
                      ){
            
            //If multiple types are provided, bind for each
            if((l = (arr = type.split(" ")).length) > 1){
                while(l--) vine.bind(object, arr[l], fn)
            }
            
            //otherwise...
            else
            {
                //Get the element if object is a string
                object = id(object);
                
                //Get data
                dat = _data(object);
                
                //Check for a namespace, if one is present assign to namespace variable
                if(ns = /^(.+)\.([^\.]+)$/.exec(type)){
                    type = ns[2];
                    ns = ns[1];
                }
                
                //Initialize the array of functions, then push the handler and other data to it
                (dat.e[type] = dat.e[type] || []).push({
                    n: ns,
                    f: fn,
                    d: evt_dat || {}
                });
                
                //Bind if the object is an element
                !dat.b[type] && (dat.b[type] = 1, object[addEventListener] ?
                        object[addEventListener](type, function(e){
                            vine.trigger(object, type, e)[defaultPrevented] && e.preventDefault();
                        },null)
                        :object[attachEvent]("on" + type, function(){
                            return !vine.trigger(object, type, window.event)[defaultPrevented];
                        }));
            }
        },
        trigger:function(
                         object,//Object to trigger event on
                         type,//Type of event to trigger
                         evt,//Optional object to mix in to the event passed
                         handlers,//Placeholder for an array of handlers
                         x, len,//Placeholders for iteration
                         event,//Placeholder for genereated event
                         prev,//Placeholder for determining if default is prevented
                         handler//Placeholder for specific handler
                         ){
            object = id(object);
            
            
            if(!evt && object.nodeType){
                if(object.fireEvent){
                    try{
                        return new Event({defaultPrevented:object[type === "click" ? type : fireEvent]("on" + type)})
                    }catch(e){}
                }else{
                    //make the event, init it, execute it, then return
                    event = document.createEvent((
                        
                    //if it's a mouse event, use mouse event init
                    init=/click|mousedown|mouseup|mousemove/.test(type)
                    
                    ) ? "MouseEvents" : "HTMLEvents")
                    event[init ? "initMouseEvent" : "initEvent"](type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                    object.dispatchEvent(event);
                    return event;
                }
            }
            event = new Event(evt || {});
            
            handlers = _data(object).e[type] || [];
            
            for(x = 0, len = handlers.length; x < len; x++){
                if(handler = handlers[x]){
                    event.namespace = handler.n;
                    event.data = handler.d;
                    prev = prev || handler.f.call(object, event) === false;
                }
            }
            
            event[defaultPrevented] = event[defaultPrevented] || prev;
            
            return event;
        },
        unbind:function(
                        object,//Object to detach event from
                        type,//Type of event to unbind
                        dat,//Placeholder for data attached to object
                        x, y, len, a//Placeholders for iteration
                        ){
            object = id(object);
            
            //If only an object is given, remove data
            if(!type){
                //remove both the id on the object and the object from data object to reduce memory usage
                return data[object[expando]] = object[expando] = null;
            }
            dat = _data(object);
            
            //If type is a string
            if(type.charAt){
                
                //if it is a namespace
                if(type.charAt(0) === "."){
                    //go through all handlers and test for the namespace
                    type = type.slice(1)
                    for(y in dat.e){
                        a = dat.e[y];
                        len = a.length;
                        for(x = 0; x < len;x++){
                            a[x].n === type && (a[x] = null);
                        }
                    }
                }
                //Otherwise just reset the entire type
                else{
                    dat.e[type] = []
                }
                //If type is instead a function, remove all instances of that function
            }else{
                    for(y in dat.e){
                        a = dat.e[y];
                        len = a.length;
                        for(x = 0; x < len; x++){
                            a[x].f === type && (a[x] = null);
                        }
                    }
            }
        }
    }
    
    //Functions on the event's prototype
    Event.prototype={
        defaultPrevented: false,
        preventDefault: function(){
            this[defaultPrevented] = true;
        }
    }
    
    return vine;
    
})(+(new Date),1,{},"defaultPrevented","addEventListener","attachEvent",document);