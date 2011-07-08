vine._c={};

vine.re=function(str){
  return this._c[str]=this._c[str]||new RegExp(str);
}

vine.is=function(elem,sel,tag,id,x,l,c){
  
  c=sel.split(",")
  l=c.length;
  if(c.length>1){
    for(x=0;x<l;x++){
      if(vine.is(elem,c[x])) return true;
    }
    return false;
  }
  
  sel=sel.split(".");
  tag=/^(\w+)/.exec(sel[0])
  id=/#(\w+)/.exec(sel[0]);
  
  c=elem.className;
  
  sel.shift()
  l=sel.length;
  for(x=0;x<l;x++){
    if(!vine.re("(^|\\s)"+l[x]+"(\\s|$)").test(c)) return false; 
  }
  
    return (!tag||elem.nodeName.toLowerCase()==tag[0])
    &&     (!id||elem.id==id[1]);
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
            var delegated=vine.d(context).d[e.type]
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
    
    dat.d[type]=ret;
}

vine.live=function(sel,type,fn){
  vine.delegate(document,sel,type,fn)
}

vine.die=function(sel,type,fn){
  vine.undelegate(document,sel,type,fn)
}