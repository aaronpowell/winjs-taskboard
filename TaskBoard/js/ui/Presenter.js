require.define('Presenter', function (require, m, exports) {
    var bindingConverters = require('/js/bindingConverters.js');
    var ns = require('WinJS/Namespace');
    var setOptions = require('WinJS/UI').setOptions;
    var binding = require('WinJS/Binding');
    ns.define('bindingHelpers', bindingConverters);
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
            var commands = processCommands(options.ui.commands, options.element);
            document.getElementById('appbar').winControl.hideCommands(commands.filter(function (cmd) {
                return cmd.section === 'selection';
            }));
        }
        if(options.dataContext) {
            binding.processAll(options.element, options.dataContext);
        }
        var backButton = options.element.querySelector('.win-backbutton');
        if(backButton && history.length > 2) {
            backButton.removeAttribute('disabled');
            backButton.addEventListener('click', function () {
                history.back();
            }, false);
        }
    };
});
//@ sourceMappingURL=Presenter.js.map
