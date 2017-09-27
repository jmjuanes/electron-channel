//Import dependencies
var electron = require('electron');

//Import electron modules
var ipcRenderer = electron.ipcRenderer;

//Active requests
var _requests = {};

//Send a request
module.exports = function(channel, data, listener)
{
  //Check the data object
  if(typeof data === 'function' && typeof listener !== 'function')
  {
    //Save the listener function
    listener = data;

    //Reset the data
    data = {};
  }

  //Get the request id
  var id = Math.random().toString().slice(2);

  //Save the listener function
  _requests[id] = listener;

  //Send the request
  return ipcRenderer.send('channel-request', channel, id, data);
};

//Send the request without callback
module.exports.once = function(channel, data)
{
  //Send the request
  return ipcRenderer.send('channel-request', channel, '', data);
};

//Add our channel listener
ipcRenderer.on('channel-response', function(event, id, args)
{
  //Check the id value
  if(id === ''){ return; }

  //Check if the id exists
  if(typeof _requests[id] === 'function')
  {
    //Do the callback
    _requests[id].apply(null, args);

    //Delete the request listener
    delete _requests[id];
  }
});
