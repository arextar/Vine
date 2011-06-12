vine=(function(expando,uid,data,defaultPrevented,addEventListener,attachEvent,vine){
    
    function _data(object,id){
        id=object[expando]=object[expando]||uid++
        return data[id]=data[id]||{b:{},e:{}};
    }
    
    function id(object){
        return object.charAt?document.getElementById(object):object;
    }
    
    function filter(arr,fn,x,stack,i){
            i=0;
            stack=[];
            for(x=0;x<arr.length;x++){
                       fn&&(stack[i++]=arr[x])
            }
            return stack;
}
    
    vine={
        Event:function(e,x,t){
            t=this;
            for(x in e) t[x]=t[x]||e[x];
            t.timestamp=+new Date;
            t.target=t.target||t.srcElement;
        },
        bind:function(object,type,fn,evt_dat,dat,ns,i,arr){
            if((arr=type.split(" ")).length>1){
                for(i=0;i<arr.length;i++) vine.bind(object,arr[i],fn)
            }
            else
            {
                object=id(object);
                dat=_data(object);
                
                i=type.lastIndexOf(".");
                
                ns=i>=0?type.slice(0,i):"";
                type=type.slice(i+1);
                
                (dat.e[type]=dat.e[type]||[]).push({
                    n:ns,
                    f:fn,
                    d:evt_dat||{}
                });
                
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
        trigger:function(object,type,evt,handlers,x,event,prev){
            object=id(object);
            
            
            if(!evt&&object.nodeType){
                
                
                
                if (object.fireEvent) {
                    if(type=="click") return object.click();
                    try{
return new vine.Event({defaultPrevented:object.fireEvent("on"+type)})
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
            event=new vine.Event(evt||{});
            
            handlers=_data(object).e[type]||[];
            
            for(x=0;handlers[x];x++){
                event.namespace=handlers[x].n;
                event.data=handlers[x].d;
                prev=prev||handlers[x].f.call(object,event)===false;
            }
            
            event[defaultPrevented]=event[defaultPrevented]||prev;
            
            return event;
        },
        unbind:function(object,type,fn,dat,stack,x,y,filt){
            filt=function(f){
                                                return f.f!=fn;
                                    }
            object=id(object);
            dat=_data(object);
            if(!type){
                        delete object[expando];
            }
            else if(type.charAt){
                        if(type.charAt(0)=="."){
                                    type=type.slice(1);
                                    for(x in dat.e){
                                                dat.e[x]=filter(dat.e[x],function(f){
                                                            return f.n!=type&&(!fn||f.f!=fn)
                                                })
                                    }
                        }
                        else
                        {
                                    dat.e[type]=fn?filter(dat.e[type],filt):[];
                        }
            }else{
                        for(x in dat.e){
                                    dat.e[x]=filter(dat.e[x],filt);
                        }
            }
}
    }
    
    vine.Event.prototype={
        defaultPrevented:false,
        preventDefault:function(){
            this[defaultPrevented]=true;
        }
    }
    
    return vine;
    
})(Math.random(),1,{},"defaultPrevented","addEventListener","attachEvent");