/// <reference path="../lib.d.ts" />
/// <reference path="../winrt.d.ts" />
/// <reference path="../winjs.d.ts" />
/// <reference path="../wamd.ts" />
require.define('Presenter', function (require, m, exports) {
    var binding = require('/js/bindingConverters.js');
    var ns = require('WinJS/Namespace');
    ns.define('bindingHelpers', binding);
    var setOptions = require('WinJS/UI').setOptions;

    var processCommands = function (commands: any[], element: any) {
        var processedCommands = [];
        commands.forEach(cmd => {
            var el = element.querySelector('#' + cmd.id).winControl;
            setOptions(el, cmd);
            processedCommands.push(el);
        });

        return processedCommands;
    };

    m.exports = function (options) {
        this.element = options.element;

        options.ui = options.ui || {};

        if (options.ui.commands && options.ui.commands.length) {
            var commands = processCommands(options.ui.commands, options.element);
            document.getElementById('appbar').winControl.hideCommands(commands.filter(function (cmd) {
                return cmd.section === 'selection';
            }));
        }
    };
});