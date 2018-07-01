import { h, render, Component } from 'preact'
import PresetsBitwig from '../preset-bitwig'
import PresetsSerum from '../preset-serum'
import Header from '../header'
import Footer from '../footer'
import style from './style'

export default class Main extends Component {
  render () {
    return (<div id='App' class={style.app}>
      <Header />
      <PresetsBitwig title='Bitwig Preset Competition' />
      <PresetsBitwig title='Bitwig Presets' />
      <PresetsSerum />
      <Footer />
    </div>
    )
  }
}
