import { h, render, Component } from 'preact'
import style from './style'

export default class Header extends Component {
  render () {
    return (<div id='Header' class={style.header}>
      <div class={style.inactive}>Login</div>
      <div class={style.inactive}>Chat</div>
      <div class={style.inactive}>Projects</div>
      <div class={style.active}>Presets</div>
    </div>
    )
  }
}
