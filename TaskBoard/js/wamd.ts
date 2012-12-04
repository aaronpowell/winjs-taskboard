'use strict';

module require {
    var modules = {};
    var cache = {};

    export var require = function (name: string) {
        var mod = modules[name];
        if (!mod) {
            throw new Error('Module "' + name + '" cannot be found');
        }

        var cached = cache[name];
        return cached ? cached.exports : mod();
    }

    export var define = function (name: string, fn: (r: require, m: any, e: any) => void ) {
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

(function (global) {
    var walker = function (k: string, t: string, o: Object) {
        if (!t) {
            t = k;
        } else {
            t = t + k + '/';
        }
        if (typeof o !== 'object') {
            if (t) {
                require.define(t.substring(0, t.length - 1), function (r, m, e) {
                    m.exports = o;
                });
            }
            return;
        }

        var keys = Object.keys(o).filter(function (x) {
            return /[A-Z]/.test(x.charAt(0));
        });

        for (var i = 0; i < keys.length; i += 1) {
            walker(keys[i], t, o[keys[i]]);
        }
        require.define(t.substring(0, t.length - 1), function (r, m, e) {
            m.exports = o;
        });
    };

    walker('', 'WinJS', global.WinJS);
    walker('', 'Windows', global.Windows);
})(this);