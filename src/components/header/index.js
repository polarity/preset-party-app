import { h, render, Component } from 'preact'
import style from './style'

export default class Header extends Component {
  render () {
    return (<div id='Header' class={style.header}>
      <div class={style.buttons}>Login</div>
      <div class={style.buttons}>Chat</div>
      <div class={style.buttons}>Projects</div>
      <div class={style.active}>Presets</div>
    </div>
    )
  }
}
