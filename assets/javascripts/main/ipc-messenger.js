const {ipcMain, BrowserWindow, remote} = require('electron')
const SecretOAuth = require('../../../config/secret.json').oauth
const Url          = require('url')
const queryString  = require('querystring')


ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)
  if (arg == "oauth-github") {
    githubOAuth()
  }
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})


let githubOAuth = () => {
  const credentials = {
    client: {
      id: SecretOAuth.github.client_id,
      secret: SecretOAuth.github.client_secret
    },
    auth: {
      tokenHost: 'https://github.com',
      tokenPath: '/login/oauth/access_token',
      authorizePath: '/login/oauth/authorize',
    }
  }
  
  const oauth2 = require('simple-oauth2').create(credentials)
  // Authorization uri definition
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: 'https://localhost/oauth2callback',
    scope: 'notifications',
    state: '3(#0/!~',
  })
  const loginWindow = new BrowserWindow({width: 800, height: 600})
  loginWindow.loadURL(authorizationUri)
  loginWindow.webContents.on('will-navigate', (event, newUrl) => {
    console.log(newUrl);
    // More complex code to handle tokens goes here
  })

  loginWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
    let query = queryString.parse(Url.parse(newUrl).query)
    let options = {
      code: query.code,
      redirect_uri: "https://localhost/oauth2callback",
      scope: "notifications"
    }

    try {
      const result = oauth2.authorizationCode.getToken(options)
      result.then((result) => {
          const token = oauth2.accessToken.create(result);
          console.log(token)
      })
      // console.log('The resulting token: ', result);

      console.log(result)
      // const accessToken = oauth2.accessToken.create(result)
    } catch (error) {
      console.log(error)
    }

    loginWindow.close()
  })

  // 認証が入った時に呼び出される
  loginWindow.webContents.on('will-navigate', (event, url) => {
    console.log('will-navigate');
    // ここはredirect後の処理と一緒
  })

  loginWindow.on('closed', function() {
    console.log('close')
  })
}
