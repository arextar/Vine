(function () {

    function id(obj) {
        return typeof obj == "string" ? document.getElementById(obj) : obj;
    }

    function trigger(elem, type) {

        if (!elem.dispatchEvent) {

            //possibly construct an event and use it, then return like:
            //evt=new Event();
            //elem.fireEvent("on"+type,evt);
            //return evt;
            return;
        }

        //default functions
        var init = "initEvent",
            create = "HTMLEvents",
            event



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
            elem.dispatchEvent(event)
            return event;
    }

    //Misc. variable declarations
    var _data,

    //An identifier to extend objects to condense all the data
    expando = Math.random(),

        //A unique identifier for data
        uid = 1,

        //An object to hold all the data
        data = {},

        //Declare vine object
        vine = this.vine = {
            //A function to access/set data from an object(_data is an alias to this);
            data: _data = function (obj /*Object*/ , key /*String*/ , value /*Any*/ ) {

                //Assign an id if the object does not already have one
                var id = obj[expando] = obj[expando] || uid++,

                    //Extract data using that ID, initializing the data if needed
                    dat = data[id] = data[id] || {
                        e: {},
                        b: {}
                    };

                //If we are looking to set a value
                if (value) {
                    //Set the value and return it
                    return dat[key] = value;
                }

                //Otherwise, access the key
                return dat[key];
            },

            //Bind a handler to a type on a function
            bind: function (obj /*Object*/ , type /*String*/ , fn /*Function*/ ) {

                //Assign an easy id to function
                fn._vine = fn._vine || uid++;

                //If obj is a string, get element
                obj = id(obj);

                //Get events object
                var evt = _data(obj, "e");

                //Init array if not already present...
                (evt[type] = evt[type] || [])
                //and add the function
                .push(fn);

                //If dealing with an element
                if (obj.nodeType) {
                    //get bound types
                    var bound = _data(obj, "b");

                    //If already bound, done
                    if (bound[type]) return;

                    //otherwise:proceed to bind
                    obj.attachEvent ? obj.attachEvent("on" + type, function () {
                        return !vine.trigger(obj, type, window.event).defaultPrevented;
                    }) : obj.addEventListener(type, function (e) {
                        var evt = vine.trigger(obj, type, e)
                        if (evt.defaultPrevented) e.preventDefault();
                    }, null)

                }

            },

            //create a vine event object
            Event: function (e) {
                for (var x in e) this[x] = this[x] || e[x];

                if ("returnValue" in e) this.defaultPrevented = !e.returnValue;

                this.timestamp = new Date().getTime();
            },

            //Trigger an event on an object
            trigger: function (obj, type, evt) {

                obj = id(obj);

                if (obj.nodeType && !evt) {
                    return new vine.Event(trigger(obj, type));
                }

                //Get handlers from data
                var handlers = _data(obj, "e")[type] || [],
                    x, event = new vine.Event(evt || {
                        type: type,
                        target: obj
                    }),
                    ret = false;

                //Iterate through handlers and execute each
                for (x in handlers) {
                    ret = ret || handlers[x].call(obj, event) === false;

                    //factor in returning false to cancel events
                    event.defaultPrevented = event.defaultPrevented || ret;
                    //If immediate propogation is stopped, stop running events
                    if (event.immediatePropogationStopped) return event;
                }

                return event;
            },

            unbind: function (obj, type, fn) {
                obj = id(obj);
                var evt = _data(obj, "e"),
                    tmp = [],
                    x, y;
                if (!type) {
                    return _data(obj, "e", {});
                }
                if (typeof type == "string") {
                    if (fn) {

                        for (x in evt[type]) {
                            evt[type][x]._vine != fn._vine && tmp.push(evt[type][x]);
                        }
                        evt[type] = tmp;
                    }
                    return evt[type] = [];
                } else {
                    for (y in evt) {
                        tmp = [];
                        for (x in evt[y]) {
                            evt[y][x]._vine != type._vine && tmp.push(evt[y][x]);
                        }
                        evt[y] = tmp;
                    }
                }
            }
        }

        //Event properties
        vine.Event.prototype = {
            toString: function () {
                return "[event " + this.type + "]"
            },
            defaultPrevented: false,
            propogationStopped: false,
            immediatePropogationStopped: false,
            preventDefault: function () {
                this.defaultPrevented = true;
            },
            stopPropogation: function () {
                this.propogationStopped = true;
            },
            stopImmediatePropogation: function () {
                this.immediatePropogationStopped = true;
            }
        }

})();