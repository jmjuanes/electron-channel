//Import dependencies
var electron = require('electron');

//Import electron modules
var ipcMain = electron.ipcMain;

//Channels
var _channels = {};

//Listen to a new channel
module.exports = function(channel, listener)
{
  //Register the channel
  _channels[channel] = listener;
};

//Request handler
ipcMain.on('channel-request', function(event, channel, id, data)
{
  //Check if the channel exists
  if(typeof _channels[channel] !== 'function')
  {
    //Return the error and exit
    throw new Error('Channel "' + channel + '" not registered on main process');
  }

  //Emit the channel listener
  return _channels[channel](data, function()
  {
    //Get the response arguments
    var args = [].slice.call(arguments);

    //Emit the channel response
    return event.sender.send('channel-response', id, args);
  });
});
