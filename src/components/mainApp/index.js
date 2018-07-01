import { h, render, Component } from 'preact'
import { remote } from 'electron'
import jetpack from 'fs-jetpack'
import PresetsBitwig from '../preset-bitwig'
import Header from '../header'
import Footer from '../footer'
import style from './style'

export default class Main extends Component {
  constructor () {
    super()
    this.app = remote.app
    this.appDir = jetpack.cwd(this.app.getAppPath())
  }
  render () {
    return (<div id='App' class={style.app}>
      <Header />
      <PresetsBitwig app={this.app} title='Bitwig Preset Competition' />
      <PresetsBitwig app={this.app} title='Bitwig Presets' />
      <PresetsBitwig
        app={this.app}
        title='Serum Presets'
        bg='bg-serum.jpg' />
      <Footer />
    </div>
    )
  }
}
