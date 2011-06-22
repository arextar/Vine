vine.once=function(target,type,handler,data,h){
    vine.bind(target,type,h=function(e){
        h.call(target,e);
        vine.unbind(target,h)
    },data)
}