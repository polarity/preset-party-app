import { h, render, Component } from 'preact'
import style from './style'
import {shell} from 'electron'

export default class Footer extends Component {

  handleClick (link) {
    shell.openExternal(link)
  }

  render () {
    return (<div class={style.footer}>
      <p>app made by <a onClick={this.handleClick.bind(this, 'https://github.com/polarity/preset-party-app')}>Polarity</a> ~ <a onClick={this.handleClick.bind(this, 'https://www.patreon.com/polarity_music')} title='Patreon'>Patreon / Donate</a></p>
      <p>Icons made by <a onClick={this.handleClick.bind(this, 'https://www.flaticon.com/authors/smashicons')} title='Smashicons'>Smashicons</a> from
        <a onClick={this.handleClick.bind(this, 'https://www.flaticon.com/')} title='Flaticon'>www.flaticon.com</a> is licensed by
        <a onClick={this.handleClick.bind(this, 'http://creativecommons.org/licenses/by/3.0/')} title='Creative Commons BY 3.0' target='_blank'>CC 3.0 BY</a></p>
    </div>)
  }
}

