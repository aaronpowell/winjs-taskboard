'use strict';

module require {
    var modules = {};
    var cache = {};

    export var require = function (name: string) {
        if (!~name.indexOf('.js')) {
            name = name + '.js';
        }
        var mod = modules[name];
        if (!mod) {
            throw new Error('Module "' + name + '" cannot be found');
        }

        var cached = cache[name];
        return cached ? cached.exports : mod();
    }

    export var define = function (name: string, fn: () => void ) {
        var _module = {
            id: name,
            exports: {},
            loaded: false
        };
        modules[name] = function () {
            cache[name] = _module;

            fn.call(
                _module.exports,
                require,
                _module,
                _module.exports
            );

            _module.loaded = true;
            return _module.exports;
        };
    }
}