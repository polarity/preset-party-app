import { h, render, Component } from 'preact'
import style from './style'

export default class Footer extends Component {
  render () {
    return (<div class={style.footer}>
      <p>App made by <a href='https://github.com/polarity/preset-party-app' target='_blank'>Robert Agthe (Polarity)</a></p>
      <p>Icons made by <a href='https://www.flaticon.com/authors/smashicons' title='Smashicons' target='_blank'>Smashicons</a> from <a href='https://www.flaticon.com/' title='Flaticon' target='_blank'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/' title='Creative Commons BY 3.0' target='_blank'>CC 3.0 BY</a></p>
    </div>)
  }
}

