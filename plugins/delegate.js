vine._c={};

vine.re=function(str){
  return this._c[str]=this._c[str]||new RegExp(str);
}

vine.is=function(re,r_id,r_tag,r_attrs,r_attr,r_stripQuot){
  
  function attr(elem,attr,val,op,eq,ret){
    attr=r_attr.exec(attr)
    
    val=elem.getAttribute(attr[1])
    eq=r_stripQuot.exec(attr[3])
    op=attr[2]
    
    eq=eq[1]||eq[2]||eq[3]
    
    switch(op){
        case '=':
            ret=val==eq;
        break;
        case "~":
            ret=pavo.re(eq).test(val)
        break;
        case "^":
            ret=pavo.re("^"+eq).test(val)
        break;
        case "$":
            ret=pavo.re(eq+"$").test(val)
        break;
        
    }
    
    return ret;
}
  
          function cName(elems,cls,y,ret,i,e){
    ret=[];
    i=0
    
    
    for(y=0;e=elems[y];y++){
    
    (function(x,l,c){
      
      for(;x<l;x++){
        c="(^| )"+cls[x]+"( |$)"
        if(!(re[c]=re[c]||RegExp(c).test(elems[y].className))) return 0;
      }
      return 1;
    }(0,cls.length))&&(ret[i++]=e);
    
    }
    return ret;
}
  
  return function(elem,sel,f,a,x){
        
           r_attrs.exec("");
        if(r_attrs.test(sel)){
            a=sel.match(r_attrs);
            sel=sel.replace(r_attrs,"");
            
            for(x=0;x<a.length;x++){
              if(!attr(elem,a[x])) return false;
            }
        }
        if(!sel) return true;
        
        sel=sel.split(".")
        f=sel.shift();
        return elem&&elem.nodeType==1
        &&(!r_id.test(f)||elem.id==r_id.exec(f)[1])
        &&(!r_tag.test(f)||elem.nodeName==r_tag.exec(f)[1].toUpperCase())
        &&(!sel.length||cName([elem],sel).length)
    }
  
}({},/#([\w-]+)/,/^(\w+)/,/\[[\w-]+.=?[\w-'"]+\]/g,/\[([\w-]+)(.)=?((?:'[\w-]+'|"[\w-]+"|[\w-]+))\]/,/'(.+)'|"(.+)"|(.+)/)

vine.delegate=function(context,selector,type,handler,data){
  if(!vine.bubblySubmit&&type=='submit') type+=":delegated"
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
            var delegated=vine.d(context).d[e.type],ret
            l=delegated.length;
            while(l--){
                d=delegated[l];
                if(vine.is(e.target,d.s)){
                    e.data=d.d;
                    d.h.call(e.target,e)==false&&(ret=false);
                };
            }
            return ret;
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

!(vine.bubblySubmit=function(document,ce){
  var d=document[ce]('div'),ret=false,html=document.documentElement;
  vine.bind(d,'submit',function(){
    ret=true;
  })
  
  html.appendChild(d)
  
  vine.trigger(d.appendChild(document[ce]('form')),"submit");
  
  html.removeChild(d)
  d.innerHTML="";
  d=null;
  
  return ret;
}(document,'createElement'))&&vine.live('form input','click',function(e){
        if(e.target.type=='submit'){
            
            var elem=e.target,ret;
            
            while(elem=elem.parentNode){
                if(elem.nodeName=="FORM"){
                        if(vine.trigger(elem,"submit:delegated").defaultPrevented) ret=false;
                    break;
                }
            }
            return ret;
        }
    })