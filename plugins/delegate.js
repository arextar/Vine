vine.is=document.createElement("a").webkitMatchesSelector?function(elem,sel){
  return elem.webkitMatchesSelector(sel)
}:function(elem,d){
    return elem.nodeName.toLowerCase()==d;
}

vine.delegate=function(context,selector,type,handler,data){
    var dat=vine.d(context),
    delegated=dat.d=dat.d||{};
    dat.a=dat.a||{};

    (delegated=delegated[type]=delegated[type]||[]).push({
        s:selector,
        h:handler,
        d:data
    })

    if(!dat.a[type]){
    
        dat.a[type]=1;
    
        vine.bind(context,type,function(e,d,l){
            var delegated=vine.d(context).d
            l=delegated.length;
            while(l--){
                d=delegated[l];
                if(vine.is(e.target,d.s)){
                    e.data=d.d;
                    d.h.call(e.target,e);
                };
            }
        })
    
    }
}

vine.undelegate=function(context,selector,type){
    var dat=vine.d(context),x,ret=[]
    ,list=(dat.d=dat.d||{})[type]||[];
    
    for(x=0;x<list.length;x++){
        if(list[x].s!=selector) ret.push(list[x]);
    }
    alert(ret)
    dat.d[type]=ret;
}