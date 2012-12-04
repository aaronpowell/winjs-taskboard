'use strict';
var require;
(function (require) {
    var modules = {
    };
    var cache = {
    };
    require.require = function (name) {
        if(!~name.indexOf('.js')) {
            name = name + '.js';
        }
        var mod = modules[name];
        if(!mod) {
            throw new Error('Module "' + name + '" cannot be found');
        }
        var cached = cache[name];
        return cached ? cached.exports : mod();
    };
    require.define = function (name, fn) {
        var _module = {
            id: name,
            exports: {
            },
            loaded: false
        };
        modules[name] = function () {
            cache[name] = _module;
            fn.call(_module.exports, require.require, _module, _module.exports);
            _module.loaded = true;
            return _module.exports;
        };
    };
})(require || (require = {}));
