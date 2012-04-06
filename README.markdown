# Vine.js
* 1.6KB (about .9k gzipped)
* Can be used with or without the DOM

## Goal
* <2KB
* Cross-browser
* Easily embedded and used in libraries
* usable stand-alone

## Tested in:
* Chrome 11
* IE 8
* FF 4
* Opera 11

## API:

* vine.bind(target, type, handler \[, data\]\)
   * binds a handler to the element
   * target:Object/Element -- object event is bound to
   * type:String -- type, or space seperated list of types, of event(s) to bind
   * handler:Function(event:vine.Event) -- handler to bind
   * data:Object -- optional data to be set as the event's .data field
* vine.unbind(target[, type\]\[, handler\)
   * unbinds a handler based on criteria (unbinds all events if only a target is passed)
   * target:Object/Element -- object event is unbound from
   * type:String -- type of event to unbind
   * handler:Function -- handler to unbind
* vine.trigger(target\[, type\]\[, event\]\)
   * triggers an event and returns event object after handler execution
   * target:Object/Element -- object event is triggered on
   * type:String -- type of event to trigger
   * event:Object/Event -- event to use as the base event
* new vine.Event(event:Object/Event)
   * normalizes an event (internal)

## Examples:


````js
//if passed a string it looks for an element with that id
vine.bind("ch", "click", function(e){
   e.preventDefault();
});
````


````js
//This will simulate a mouse click and check a checkbox if no events are bound that prevent it
vine.trigger("ch", "click");
````


````js
//Focus a textbox
vine.trigger("text", "focus");
````
   
   

   

## Plugins:
* delegate
   * vine.delegate(context:DOMElement,target:String,type:String,handler:Function[,data:Object])
   * vine.undelegate(context:DOMElement,target:String,type:String[,handler:Function])
* once
   * vine.once(target:Object/DOMElement,type:String,handler:Function[,data:Object])