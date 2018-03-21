  const {ipcMain} = require('electron')
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg)  // prints "ping"
    event.sender.send('asynchronous-reply', 'pong')
  })
  
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg)  // prints "ping"
    event.returnValue = 'pong'
  })
