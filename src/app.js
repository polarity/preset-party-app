import './stylesheets/main.css'
import './helpers/context_menu.js'
import './helpers/external_links.js'

import { remote } from 'electron'
import jetpack from 'fs-jetpack'
import Git from 'nodegit'
import env from 'env'

const app = remote.app
const appDir = jetpack.cwd(app.getAppPath())

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json')

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux'
}

// document.querySelector('#os').innerHTML = osMap[process.platform]

let localStorage
try {
  localStorage = JSON.parse(window.localStorage.getItem('settings'))
} catch (err) {
  console.log('err', err)
  localStorage = {}
}
let settings = Object.assign({
  repoLocal: app.getPath('home') + '/Documents/Bitwig Studio/Library/Presets/preset-party'
}, localStorage)

/**
 * show the current settings in the gui
 * @param {object} settings
 */
window.showSettings = (settings) => {
  document.querySelector('#repoPath').innerHTML = settings.repoLocal
}

/**
 * Open a file dialog and
 * change to the selected path
*/
window.setPresetPath = () => {
  remote.dialog.showOpenDialog(remote.mainWindow, {
    defaultPath: settings.repoLocal,
    properties: ['openDirectory']
  }, (data) => {
    if (data && data.length > 0) {
      settings.repoLocal = data[0] + '/preset-party'
      window.localStorage.setItem('settings', JSON.stringify(settings))
      showSettings(settings)
    }
  })
}

/**
 * Update the local repo
*/
window.update = () => {
  let repository
  Git.Clone('https://github.com/polarity/bitwig-presets.git', settings.repoLocal)
  .then(() => {
    console.log('Done')
  })
  .catch((err) => {
    console.log(err)
  }).done(() => {
    console.log('go')
    Git.Repository.open(settings.repoLocal).then((repo) => {
      repository = repo
      return repository.fetchAll()
    }).then(() => {
      return repository.mergeBranches('master', 'origin/master')
    })
    .done(() => {
      console.log('Done!')
    })
  })
}

// init show
showSettings(settings)
