vine.once = function(target, type, handler, data, h){
    target = vine.id(target);
    vine.bind(target, type, h = function(e){
        handler.call(target, e);
        vine.unbind(target, h)
    }, data);
}