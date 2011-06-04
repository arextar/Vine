vine=(function(expando,uid,data,defaultPrevented,vine){
    
    function _data(object,id){
        id=object[expando]=object[expando]||uid++
        return data[id]=data[id]||{b:{},e:{}};
    }
    
    function id(object){
        return object.charAt?document.getElementById(object):object;
    }
    
    vine={
        Event:function(e,x){
            for(x in e) this[x]=this[x]||e[x];
            this.timestamp=(new Date).getTime();
            this.target=this.target||this.srcElement;
        },
        bind:function(object,type,fn,evt_dat,dat,ns,i,arr){
if((arr=type.split(" ")).length>1){
for(i=0;i<arr.length;i++) vine.bind(object,arr[i],fn)
return;
}
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
            if(!dat.b[type]&&object.nodeType){
                dat.b[type]=1;
                object.addEventListener?
                    object.addEventListener(type,function(e){
                        vine.trigger(object,type,e)[defaultPrevented]&&e.preventDefault();
                    })
                    :
                    object.attachEvent("on"+type,function(){
                        return !vine.trigger(object,type,window.event)[defaultPrevented];
                    })
            }
        },
        trigger:function(object,type,evt,handlers,x,event,prev){
            object=id(object);
            
            
            if(!evt&&object.nodeType){
                
                
                
                if (object.fireEvent) {
                    if(type=="click") return object.click();

            event={}
            object.fireEvent("on"+type,event)
            return new vine.Event(event);
        }

        //default functions
        init = "initEvent";
            create = "HTMLEvents";



            //if it's a mouse event, use mouse event init
            ({
                click: 1,
                mousedown: 1,
                mouseup: 1,
                mousemove: 1
            }[type]) && (init = "initMouseEvent", create = "MouseEvents")

            //make the event, init it, execute it, then return
            event = document.createEvent(create)
            event[init](type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            object.dispatchEvent(event)
            return event;
                
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
    
    vine.Event.prototype={
        defaultPrevented:false,
        preventDefault:function(){
            this[defaultPrevented]=true;
        }
    }
    
    return vine;
    
})(Math.random(),1,{},"defaultPrevented");