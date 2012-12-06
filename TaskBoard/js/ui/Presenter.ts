﻿/// <reference path="../winjs.d.ts" />
/// <reference path="../wamd.ts" />
require.define('Presenter', function (require, m, exports) {
    var bindingConverters = require('/js/bindingConverters.js');
    var ns = require('WinJS/Namespace');
    var setOptions = require('WinJS/UI').setOptions;
    var binding = require('WinJS/Binding');

    ns.define('bindingHelpers', bindingConverters);
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

        if (options.dataContext) {
            binding.processAll(options.element, options.dataContext);
        }

        var backButton = options.element.querySelector('.win-backbutton');

        if (backButton && history.length > 2) {
            backButton.removeAttribute('disabled');
            backButton.addEventListener('click', function () {
                history.back();
            }, false);
        }

        if (options.events) {
            Object.keys(options.events).forEach(val => {
                var evt = options.events[val];
                var ctrl = options.element.querySelector(val);

                Object.keys(evt).forEach(e => {
                    ctrl.addEventListener(e, evt[e], false);
                });
            });
        }
    };
});
