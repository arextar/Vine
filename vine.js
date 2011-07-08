vine=(function(
               expando,//The amount of milliseconds right now, unique identifier shorter than Math.random()
               uid,//A unique identifier, attached with expando to link to stored data
               data,//An object storing data(stored in central store for simplicity and to prevent leakage)
               defaultPrevented,//Shortening of .defaultPrevented
               addEventListener,//Shortening of .addEventListener
               attachEvent,//Shortening of .attachEvent
               vine,//Placeholder for vine object
               Event//Placeholder for vine.Event
               ){
    
    //Initialize and fetch the data on an object
    function _data(
                   object,//Object to get data from
                   id//Placeholder for unique id
                   ){
        id=object[expando]=object[expando]||uid++
        return data[id]=data[id]||{b:{},e:{}};
    }
    
    //If an object is a string, get the element with that ID
    function id(
                object//Object to test
                ){
        return object.charAt?document.getElementById(object):object;
    }
    
    //Create vine object
    vine={
        
        //Expose data function for plugins
        d:_data,
        
        //A constructor to build a normalized event
        Event:Event=function(
                             e,//Objects to mix in properties of
                             x,//Placeholder for iteration
                             t//Placeholder for 'this' to shorten code
                             ){
            t=this;
            for(x in e) t[x]=t[x]||e[x];
            t.timestamp=+new Date;
            t.target=t.target||t.srcElement;
        },
        
        //Bind a function to an element
        bind:function(
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
            if((l=(arr=type.split(" ")).length)>1){
                while(l--) vine.bind(object,arr[l],fn)
            }
            
            //otherwise...
            else
            {
                //Get the element if object is a string
                object=id(object);
                
                //Get data
                dat=_data(object);
                
                //Check for a namespace, if one is present assign to namespace variable
                if(ns=/^(.+)\.([^\.]+)$/.exec(type)){
                type=ns[2];
                ns=ns[1];
                }
                
                //Initialize the array of functions, then push the handler and other data to it
                (dat.e[type]=dat.e[type]||[]).push({
                    n:ns,
                    f:fn,
                    d:evt_dat||{}
                });
                
                //Bind if the object is an element
                !dat.b[type]&&(dat.b[type]=1,object[addEventListener]?
                        object[addEventListener](type,function(e){
                            vine.trigger(object,type,e)[defaultPrevented]&&e.preventDefault();
                        },null)
                        :object[attachEvent]?
                        object[attachEvent]("on"+type,function(){
                            return !vine.trigger(object,type,window.event)[defaultPrevented];
                        }):0);
            }
        },
        trigger:function(
                         object,//Object to trigger event on
                         type,//Type of event to trigger
                         evt,//Optional object to mix in to the event passed
                         handlers,//Placeholder for an array of handlers
                         x,//Placeholder for iteration
                         event,//Placeholder for genereated event
                         prev,//Placeholder for determining if default is prevented
                         handler//Placeholder for specific handler
                         ){
            object=id(object);
            
            
            if(!evt&&object.nodeType){
                
                
                
                if (object.fireEvent) {
                    if(type=="click") return object.click();
                    try{
return new Event({defaultPrevented:object.fireEvent("on"+type)})
}catch(e){}
        }else{



            //if it's a mouse event, use mouse event init
            init=({
                click: 1,
                mousedown: 1,
                mouseup: 1,
                mousemove: 1
            }[type])

            //make the event, init it, execute it, then return
            event = document.createEvent(init?"MouseEvents":"HTMLEvents")
            event[init?"initMouseEvent":"initEvent"](type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            object.dispatchEvent(event)
            return event;
            }
            }
            event=new Event(evt||{});
            
            handlers=_data(object).e[type]||[];
            
            for(x=0;handler=handlers[x];x++){
                event.namespace=handler.n;
                event.data=handler.d;
                prev=prev||handler.f.call(object,event)===false;
            }
            
            event[defaultPrevented]=event[defaultPrevented]||prev;
            
            return event;
        },
        unbind:function(object,type,dat,stack,x,y,fn){
            object=id(object);
            if(!type){
                delete object[expando];
                return;
            }
            dat=_data(object);
            if(type.charAt){
                if(type.charAt(0)=="."){
                    type=type.slice(1)
                    for(y in dat.e){
                        stack=[]
                        for(x=0;x<dat.e[y].length;x++){
                            dat.e[y][x].n!=type&&stack.push(dat.e[y][x]);
                        }
                        dat.e[y]=stack
                    }
                    
                    return;
                }
                dat.e[type]=[]
            }else{
                        for(y in dat.e){
                        stack=[]
                        for(x=0;x<dat.e[y].length;x++){
                            dat.e[y][x].f!=type&&stack.push(dat.e[y][x]);
                        }
                        dat.e[y]=stack
                    }
            }
        }
    }
    
    Event.prototype={
        defaultPrevented:false,
        preventDefault:function(){
            this[defaultPrevented]=true;
        }
    }
    
    return vine;
    
})(+new Date,1,{},"defaultPrevented","addEventListener","attachEvent");