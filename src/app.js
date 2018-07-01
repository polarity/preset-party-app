import './stylesheets/main.css'
import './helpers/context_menu.js'
import './helpers/external_links.js'

import { h, render } from 'preact'
import Main from './components/mainApp/index.js'
import env from 'env'

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
// const manifest = appDir.read('package.json', 'json')

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux'
}

// document.querySelector('#os').innerHTML = osMap[process.platform]
render(<Main />, document.body)
