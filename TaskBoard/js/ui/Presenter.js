require.define('Presenter', function (require, m, exports) {
    var binding = require('/js/bindingConverters.js');
    var ns = require('WinJS/Namespace');
    ns.define('bindingHelpers', binding);
    var setOptions = require('WinJS/UI').setOptions;
    var processCommands = function (commands, element) {
        var processedCommands = [];
        commands.forEach(function (cmd) {
            var el = element.querySelector('#' + cmd.id).winControl;
            setOptions(el, cmd);
            processedCommands.push(el);
        });
        return processedCommands;
    };
    m.exports = function (options) {
        this.element = options.element;
        options.ui = options.ui || {
        };
        if(options.ui.commands && options.ui.commands.length) {
            processCommands(options.ui.commands, options.element);
        }
    };
});
