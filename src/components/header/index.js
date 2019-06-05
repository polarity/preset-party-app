import { h, render, Component } from 'preact'
import style from './style'
import {shell} from 'electron'

export default class Header extends Component {
  handleClick (link) {
    shell.openExternal(link)
  }

  render () {
    return (<div id='Header' class={style.header}>
      <div onClick={this.handleClick.bind(this, 'https://discord.gg/0g2ZPafIN3eWParf')} title='Bitwig Discord' class={style.inactive}>Discord</div>
      <div onClick={this.handleClick.bind(this, 'https://sso.bitwig.com/login')} class={style.inactive}>Bitwig Account</div>
      <div class={style.active}>Presets</div>
    </div>
    )
  }
}
