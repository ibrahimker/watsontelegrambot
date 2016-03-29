var debug = require('debug')('start');

exports.handle = function(bot, msg) {
    debug('%j', msg);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    //notify user
    bot.sendMessage(msg.from.id, 'Hello ' + msg.from.first_name); // jshint ignore:line
    bot.sendMessage(msg.from.id, 'My name is watson. Feel free to use my command');
    bot.sendMessage(msg.from.id, 'Available function:' +'\n' + '/start' + '\n' + '/dimanaludik' +'\n' + '/e [whatever]' + '\n' + '/tone [whatever]');
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

};
