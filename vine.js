(function () {

    function each(obj, fn) {
        for (var x in obj) fn(obj[x], x)
    }

    function trigger(elem, type, ev) {

        var init = "initEvent",
            create = "HTMLEvents",
            evt
        return elem.fireEvent ? (elem.fireEvent("on" + type, ev), !ev.retVal) : (({
            click: 1,
            mousedown: 1,
            mouseup: 1,
            mousemove: 1
        }[type]) && (init = "initMouseEvent", create = "MouseEvents"), evt = document.createEvent(create), evt[init](type), elem.dispatchEvent(evt))
    }

    function id(target) {
        return document.getElementById(target) || target;
    }

    function initData(obj, type) {
        var id = obj[expando] = obj[expando] || uid++,
            dat = data[id]
        if (!dat) {
            dat = data[id] = {
                e: {},
                b: {}
            }
        }
        dat.e[type] = dat.e[type] || [];
        return dat;
    }

    var expando = Math.random(),
        uid = 1,
        event = 0,
        data = {}
    this.vine = {
        bind: function (target, type, fn) {

            target = id(target);
            each(type.split(" "), function (type) {
                var dat = initData(target, type)
                dat.e[type].push(fn);

                dat.b[type] || (target.nodeType && (target.attachEvent ? target.attachEvent("on" + type, function () {

                    target._v = 1;
                    var ret = !vine.trigger(target, type, vine.Event(e)).cancel;
                    delete target._v;
                    return ret;
                }) : target.addEventListener(type, function (e) {
                    target._v = 1
                    if (vine.trigger(target, type, vine.Event(e)).canceled) e.preventDefault();
                    delete target._v
                })), dat.b[type] = 1)

            })
        },
        Event: function (evt) {
            evt = evt || {}
            each({
                preventDefault: function () {
                    this.defaultPrevented = true
                },
                stopPropogation: function () {
                    this.propogationStopped = this.cancelBubble = true
                },
                target: evt.srcElement,
                timestamp: (new Date).getTime()
            }, function (val, x) {
                evt[x] = typeof evt[x] == "undefined" ? val : evt[x];
            })
            evt._v = 1;
            return evt;
        },
        trigger: function (target, type, data) {
            data = data || {};
            target = id(target)

            var evt = data._v ? data : vine.Event({
                target: target,
                data: data,
                type: type
            }),
                handlers, x;

            evt.canceled = false;

            target.nodeType && !target._v ? evt.canceled = ({
                blur: 1,
                focus: 1
            }[type]) ? target[type]() : trigger(target, type, evt) : each(initData(target).e[type] || [], function (fn, x) {
                evt.canceled = evt.canceled || fn.call(target, evt) === false || evt.defaultPrevented
            })

            return evt;
        },
        unbind: function (target, type, fn) {
            var evt = initData(id(target)).e,
                fake = {};
            type && fn && (fake[type] = evt[type])
            if (type.call || fn) {
                each(type && fn ? fake : evt, function (arr, key) {
                    var ret = []
                    each(arr || [], function (_fn) {
                        if (_fn != (fn ? fn : type)) ret.push(_fn);
                    })
                    evt[key] = ret;
                })
            } else {
                evt[type] = []
            }

        }
    }
})()