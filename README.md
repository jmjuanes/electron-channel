# electron-channel

> A dead simple ipc wrapper for electron

[![npm](https://img.shields.io/npm/v/electron-channel.svg?style=flat-square)](https://www.npmjs.com/package/electron-channel)
[![npm](https://img.shields.io/npm/dt/electron-channel.svg?style=flat-square)](https://www.npmjs.com/package/electron-channel)
[![npm](https://img.shields.io/npm/l/electron-channel.svg?style=flat-square)](https://github.com/jmjuanes/electron-channel)

A very simple way to comunicate between the main and the render process in **electron**. It is based on `ipc` but uses callbacks in the render process instead of event listeners. 

## Example 

An example of sending and handling messages between the render and the main process. The render process will send a request to the main process to read a file. The main process will read the file and send the content of the file to the render process.

### Main process

```javascript
//Import dependencies
var fs = require('fs');
var channel = require('electron-channel/main');

//Register a listener that reads the content of a file and return the file content
channel('read-file', function(data, done)
{
  //Data is an object with the following keys 
  // data.filename: path to the file to read 
  // data.encoding: default encoding
  
  //Read the file 
  return fs.readFile(data.filename, data.encoding, function(error, content)
  {
    //Call the done function with the error and the file content
    return done(error, content);
  });
});
```

### Render process 

```javascript
//Import dependencies 
var channel = require('electron-channel/render');

//Read the content of a file in the main process 
channel('read-file', { filename: './file.txt', encoding: 'utf8'}, function(error, content)
{
  //Check the error reading the file 
  if(error){ /* do something with the error */ } 
  
  //Work with the content of the file 
  // ...
});
```

## API 

### Main process 

Import the channel manager in the main process by adding the following line: 

```javascript
var channel = require('electron-channel/main');
```

#### channel(name, listener)

Register a new channel that will listen to all events with the name `name`. For each request to this channel the `listener` function will be executed. 

The `listener` method will be executed with the following arguments: 

- `data`: an object with the data sent by the render process. 
- `done`: a function used to reply to the render process. All the arguments passed to the `done` function will be the arguments of the callback function in the render process, so you can use it to reply data to the render process.

Example: 

```javascript
var channel = require('electron-channel/main'); 

//Register a channel 
channel('name', function(data, done)
{
  //Work with the data object 
  //... 
  
  //Reply to the render process 
  return done();
});
```

### Render process 

Import the channel manager in the render process by adding the following line: 

```javascript
var channel = require('electron-channel/render');
```

#### channel(name, data, callback)

Emit a new request to the main process with the name `name`. The `data` argument must be an object with all the information that will be passed to the main process. 

When the `done` function in the main process is called, the `callback` function will be executed with all the arguments passed to the `done` function in the main process. 

Example: 

```javascript
var channel = require('electron-channel/render');

//Create the object will all the data that you want to pass to the main process 
var obj = { ... };

//Emit a new request/message to the main process 
channel('name', obj, function()
{
  //Work with the response 
  //...
});
```

## License 

[MIT LICENSE](./LICENSE) &copy; Josemi Juanes.
