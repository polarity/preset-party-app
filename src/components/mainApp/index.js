import { h, render, Component } from 'preact'
import { remote } from 'electron'
import jetpack from 'fs-jetpack'
import Git from 'nodegit'
import style from './style'

export default class Main extends Component {
  constructor () {
    super()
    this.state = {
      updatingRepo: false,
      settings: {
        repoLocal: false
      }
    }
  }

  componentDidMount () {
    this.app = remote.app
    this.appDir = jetpack.cwd(this.app.getAppPath())

    try {
      this.localStorage = JSON.parse(window.localStorage.getItem('settings'))
    } catch (err) {
      this.localStorage = {}
    }
    this.setState({
      settings: Object.assign({
        repoLocal: this.app.getPath('documents') + '/Bitwig Studio/Library/Presets/preset-party'
      }, this.localStorage)
    })
  }

  /**
   * Update the local repo
  */
  handleUpdate () {
    let repository
    Git.Clone('https://github.com/polarity/bitwig-presets.git', this.state.settings.repoLocal)
    .then(() => {
      console.log('Done')
    })
    .catch((err) => {
      console.log(err)
    }).done(() => {
      this.setState({updatingRepo: true})
      console.log('Update Go!')
      Git.Repository.open(this.state.settings.repoLocal).then((repo) => {
        repository = repo
        return repository.fetchAll()
      }).then(() => {
        return repository.mergeBranches('master', 'origin/master')
      })
      .then(() => {
        return repository.state()
      })
      .done((data) => {
        console.log('Update Done!', data)
        this.setState({updatingRepo: false})
      })
    })
  }

  /**
   * Open a file dialog and
   * change to the selected path
  */
  handleSetPresetPath () {
    remote.dialog.showOpenDialog(remote.mainWindow, {
      defaultPath: this.state.settings.repoLocal,
      properties: ['openDirectory']
    }, (data) => {
      if (data && data.length > 0) {
        this.setState({
          settings: {
            repoLocal: data[0] + '/preset-party'
          }
        })
        window.localStorage.setItem('settings', JSON.stringify(this.state.settings))
      }
    })
  }

  render () {
    /**
     * user can start the sync
     * and the gui shows when a update is in process
     */
    const ElUpdate = () => {
      if (this.state.updatingRepo) {
        return (<p>updating ....</p>)
      } else {
        return (<p><a onclick={this.handleUpdate.bind(this)}>Update</a> local files</p>)
      }
    }

    return (
      <div id='app' class={style.container}>
        <h1>Bitwig Preset Party</h1>
        <p>Preset path: <span class='paths'>{this.state.settings.repoLocal}</span></p>
        <p><a onclick={this.handleSetPresetPath.bind(this)}>Set the path</a> to your Bitwig preset directory</p>
        <ElUpdate />
      </div>
    )
  }
}
