import { h, render, Component } from 'preact'
import { remote } from 'electron'
import Git from 'nodegit'
import style from './style'

export default class PresetsBitwig extends Component {
  constructor (props) {
    super()
    // init state
    this.state = {
      repo: {
        remote: props.remoterepo,
        localdir: props.localdir
      },
      gitState: {
        ahead: 0
      },
      updatingRepo: false,
      settings: {
        repoLocal: false
      }
    }

    // try and read the settings from the
    // local storage
    try {
      this.localStorage = JSON.parse(window.localStorage.getItem('settings-' + this.state.repo.localdir))
    } catch (err) {
      this.localStorage = {}
    }

    // update the settings state
    // use the default value for the bitwig preset dir
    // and overwrite it with the found settings from the local storage
    this.setState({
      settings: Object.assign({
        repoLocal: props.app.getPath('documents') + '/Bitwig Studio/Library/Presets/' + this.state.repo.localdir
      }, this.localStorage)
    })
  }

  /**
   * Update the local repo
   * user clicked the update button
  */
  handleUpdate () {
    let repository
    const that = this
    Git.Clone(this.state.repo.remote, this.state.settings.repoLocal)
    .then(() => {
      console.info('Cloning Done')
    })
    .catch((err) => {
      console.info('Local Repo exists, skip cloning', err)
    }).done(() => {
      console.info('Update local working dir!')
      this.setState({updatingRepo: 'process'})
      Git.Repository.open(this.state.settings.repoLocal).then((repo) => {
        console.info('Fetch All from Remote')
        repository = repo
        return repository.fetchAll()
      }).then(() => {
        console.info('Merge Branches')
        return repository.mergeBranches('master', 'origin/master')
      })
      .done((data) => {
        console.info('Update Done!', data)
        this.setState({updatingRepo: 'done'})
        // remove "done" status after a while
        setTimeout(() => {
          that.setState({updatingRepo: false})
        }, 5000)
      })
    })
  }

  /**
   * Open a file dialog and
   * change to the selected path
   * user clicked the folder/dir button
  */
  handleSetPresetPath () {
    remote.dialog.showOpenDialog(remote.mainWindow, {
      defaultPath: this.state.settings.repoLocal,
      properties: ['openDirectory']
    }, (data) => {
      if (data && data.length > 0) {
        this.setState({
          settings: {
            repoLocal: data[0] + '/' + this.state.repo.localdir
          }
        })
        window.localStorage.setItem('settings', JSON.stringify(this.state.settings))
      }
    })
  }

  /**
   * Render the Component
   */
  render () {
    /**
     * user can start the sync
     * and the gui shows when a update is in process
     */
    const ElUpdate = () => {
      if (this.state.updatingRepo === 'process') {
        return (<img class={style.images} title='updating...'src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0zOSw0MGMtMC41NTIsMC0xLDAuNDQ3LTEsMWMwLDQuOTYzLTQuMDM4LDktOSw5cy05LTQuMDM3LTktOXM0LjAzOC05LDktOWMzLDAsNS42NzcsMS41MDYsNy4zMTEsNEgzMCAgIGMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWg4YzAuMDAyLDAsMC4wMDMtMC4wMDEsMC4wMDUtMC4wMDFjMC4wNywwLDAuMTQtMC4wMjcsMC4yMS0wLjA0MiAgIGMwLjA2LTAuMDE0LDAuMTI1LTAuMDE1LDAuMTgxLTAuMDM5YzAuMDAyLTAuMDAxLDAuMDA0LDAsMC4wMDUtMC4wMDFjMC4wMzQtMC4wMTUsMC4wNTYtMC4wNDMsMC4wODctMC4wNjEgICBjMC4wODEtMC4wNDYsMC4xNjItMC4wOTMsMC4yMjctMC4xNTljMC4wNDQtMC4wNDYsMC4wNy0wLjEwMywwLjEwNC0wLjE1NWMwLjAzNi0wLjA1NSwwLjA4LTAuMTA0LDAuMTA1LTAuMTY2ICAgYzAuMDM0LTAuMDg0LDAuMDQzLTAuMTc1LDAuMDU0LTAuMjY1QzM4Ljk4MiwzNy4wNzIsMzksMzcuMDM5LDM5LDM3di0wLjAxMXYtMC4wMDJWMjljMC0wLjU1My0wLjQ0OC0xLTEtMXMtMSwwLjQ0Ny0xLDF2NC42ICAgYy0yLjAxNC0yLjI3Mi00Ljg2NC0zLjYtOC0zLjZjLTYuMDY1LDAtMTEsNC45MzUtMTEsMTFzNC45MzUsMTEsMTEsMTFzMTEtNC45MzUsMTEtMTFDNDAsNDAuNDQ3LDM5LjU1Miw0MCwzOSw0MHoiIGZpbGw9IiNGRkZGRkYiLz4KCTxwYXRoIGQ9Ik00Ny44MzUsMTkuOTg2Yy0wLjEzNy0wLjAxOS0yLjQ1Ny0wLjMzNS00LjY4NCwwLjAwMkM0My4xLDE5Ljk5Niw0My4wNDksMjAsNDIuOTk5LDIwYy0wLjQ4NiwwLTAuOTEyLTAuMzU0LTAuOTg3LTAuODUgICBjLTAuMDgzLTAuNTQ2LDAuMjkyLTEuMDU2LDAuODM4LTEuMTM5YzEuNTMxLTAuMjMzLDMuMDYyLTAuMTk2LDQuMDgzLTAuMTI0QzQ2LjI2MiwxMC4xMzUsMzkuODMsNCwzMi4wODUsNCAgIGMtNC42OTcsMC05LjQxOCwyLjM3OS0xMi4yODUsNi4xMjlDMjEuNzU0LDExLjc4MSwyMywxNC4yNDYsMjMsMTdjMCwwLjU1My0wLjQ0NywxLTEsMXMtMS0wLjQ0Ny0xLTEgICBjMC0yLjQ2Mi0xLjI4MS00LjYyNy0zLjIwOS01Ljg3NmMtMC4yMjctMC4xNDctMC40NjItMC4yNzctMC43MDItMC4zOTZjLTAuMDY5LTAuMDM0LTAuMTM5LTAuMDY5LTAuMjEtMC4xMDEgICBjLTAuMjcyLTAuMTI0LTAuNTUtMC4yMzQtMC44MzUtMC4zMjFjLTAuMDM1LTAuMDEtMC4wNzEtMC4wMTctMC4xMDYtMC4wMjdjLTAuMjU5LTAuMDc1LTAuNTIyLTAuMTMyLTAuNzg5LTAuMTc3ICAgYy0wLjA3OC0wLjAxMy0wLjE1NS0wLjAyNS0wLjIzMy0wLjAzNkMxNC42MTQsMTAuMDI3LDE0LjMwOSwxMCwxNCwxMGMtMy44NTksMC03LDMuMTQxLTcsN2MwLDAuMDgyLDAuMDA2LDAuMTYzLDAuMDEyLDAuMjQ0ICAgbDAuMDEyLDAuMjFsLTAuMDA5LDAuMTZDNy4wMDgsMTcuNzQ0LDcsMTcuODczLDcsMTh2MC42M2wtMC41NjcsMC4yNzFDMi43MDUsMjAuNjg4LDAsMjUsMCwyOS4xNTRDMCwzNS4xMzUsNC44NjUsNDAsMTAuODQ1LDQwICAgaDUuMjA2QzE2LjU2NSwzMy4yOTksMjIuMTY5LDI4LDI5LDI4YzIuMTU3LDAsNC4xOTgsMC41MzIsNiwxLjQ5N1YyOWMwLTEuNjU3LDEuMzQzLTMsMy0zczMsMS4zNDMsMywzdjggICBjMCwwLjAzMS0wLjAwOCwwLjA2MS0wLjAwOSwwLjA5MmMtMC4wMDMsMC4wODgtMC4wMTYsMC4xNzItMC4wMjYsMC4yNTljLTAuMDE2LDAuMTM0LTAuMDM2LDAuMjY0LTAuMDY4LDAuMzkyICAgYy0wLjAyLDAuMDc4LTAuMDQ1LDAuMTUzLTAuMDcxLDAuMjI5Yy0wLjA0NSwwLjEzLTAuMDk3LDAuMjU1LTAuMTU5LDAuMzc2Yy0wLjAyLDAuMDQtMC4wMywwLjA4NC0wLjA1MiwwLjEyMyAgIGMwLjU1NSwwLjM1NSwwLjk2NywwLjg5OCwxLjE5MiwxLjUyOWg0LjE2NUM1MS41MDEsNDAsNTYsMzUuNTAxLDU2LDI5Ljk3MkM1NiwyNS4xNjEsNTIuNDksMjAuODcyLDQ3LjgzNSwxOS45ODZ6IiBmaWxsPSIjRkZGRkZGIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==' />)
      } else if (this.state.updatingRepo === 'done') {
        return (<img class={style.images} src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMjYsNTBDMTIuNzY3LDUwLDIsMzkuMjMzLDIsMjYgICBTMTIuNzY3LDIsMjYsMnMyNCwxMC43NjcsMjQsMjRTMzkuMjMzLDUwLDI2LDUweiIgZmlsbD0iIzkxREM1QSIvPgoJPHBhdGggZD0iTTM4LjI1MiwxNS4zMzZsLTE1LjM2OSwxNy4yOWwtOS4yNTktNy40MDdjLTAuNDMtMC4zNDUtMS4wNjEtMC4yNzQtMS40MDUsMC4xNTZjLTAuMzQ1LDAuNDMyLTAuMjc1LDEuMDYxLDAuMTU2LDEuNDA2ICAgbDEwLDhDMjIuNTU5LDM0LjkyOCwyMi43OCwzNSwyMywzNWMwLjI3NiwwLDAuNTUxLTAuMTE0LDAuNzQ4LTAuMzM2bDE2LTE4YzAuMzY3LTAuNDEyLDAuMzMtMS4wNDUtMC4wODMtMS40MTEgICBDMzkuMjUxLDE0Ljg4NSwzOC42MiwxNC45MjIsMzguMjUyLDE1LjMzNnoiIGZpbGw9IiM5MURDNUEiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K' />)
      } else {
        return (<img class={style.images} onclick={this.handleUpdate.bind(this)} title='Update local files' src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2IDU2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NiA1NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0zNS41ODYsNDEuNTg2TDMxLDQ2LjE3MlYyOGMwLTEuMTA0LTAuODk2LTItMi0ycy0yLDAuODk2LTIsMnYxOC4xNzJsLTQuNTg2LTQuNTg2Yy0wLjc4MS0wLjc4MS0yLjA0Ny0wLjc4MS0yLjgyOCwwICAgcy0wLjc4MSwyLjA0NywwLDIuODI4bDcuOTk5LDcuOTk5YzAuMDkzLDAuMDk0LDAuMTk2LDAuMTc3LDAuMzA3LDAuMjUxYzAuMDQ3LDAuMDMyLDAuMDk5LDAuMDUzLDAuMTQ4LDAuMDgxICAgYzAuMDY1LDAuMDM2LDAuMTI3LDAuMDc1LDAuMTk2LDAuMTAzYzAuMDY1LDAuMDI3LDAuMTMzLDAuMDQyLDAuMiwwLjA2MmMwLjA1OCwwLjAxNywwLjExMywwLjA0LDAuMTczLDAuMDUxICAgQzI4LjczOCw1Mi45ODYsMjguODY5LDUzLDI5LDUzczAuMjYyLTAuMDE0LDAuMzkyLTAuMDRjMC4wNi0wLjAxMiwwLjExNS0wLjAzNCwwLjE3My0wLjA1MWMwLjA2Ny0wLjAyLDAuMTM1LTAuMDM1LDAuMi0wLjA2MiAgIGMwLjA2OS0wLjAyOCwwLjEzMS0wLjA2NywwLjE5Ni0wLjEwM2MwLjA1LTAuMDI3LDAuMTAxLTAuMDQ5LDAuMTQ4LTAuMDgxYzAuMTEtMC4wNzQsMC4yMTMtMC4xNTcsMC4zMDctMC4yNTFsNy45OTktNy45OTkgICBjMC43ODEtMC43ODEsMC43ODEtMi4wNDcsMC0yLjgyOFMzNi4zNjcsNDAuODA1LDM1LjU4Niw0MS41ODZ6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8cGF0aCBkPSJNNDcuODM1LDE4Ljk4NmMtMC4xMzctMC4wMTktMi40NTctMC4zMzUtNC42ODQsMC4wMDJDNDMuMSwxOC45OTYsNDMuMDQ5LDE5LDQyLjk5OSwxOWMtMC40ODYsMC0wLjkxMi0wLjM1NC0wLjk4Ny0wLjg1ICAgYy0wLjA4My0wLjU0NiwwLjI5Mi0xLjA1NiwwLjgzOC0xLjEzOWMxLjUzMS0wLjIzMywzLjA2Mi0wLjE5Niw0LjA4My0wLjEyNEM0Ni4yNjIsOS4xMzUsMzkuODMsMywzMi4wODUsMyAgIEMyNy4zODgsMywyMi42NjcsNS4zNzksMTkuOCw5LjEyOUMyMS43NTQsMTAuNzgxLDIzLDEzLjI0NiwyMywxNmMwLDAuNTUzLTAuNDQ3LDEtMSwxcy0xLTAuNDQ3LTEtMSAgIGMwLTIuNDYyLTEuMjgxLTQuNjI3LTMuMjA5LTUuODc2Yy0wLjIyNy0wLjE0Ny0wLjQ2Mi0wLjI3Ny0wLjcwMi0wLjM5NmMtMC4wNjktMC4wMzQtMC4xMzktMC4wNjktMC4yMS0wLjEwMSAgIGMtMC4yNzItMC4xMjQtMC41NS0wLjIzNC0wLjgzNS0wLjMyMWMtMC4wMzUtMC4wMS0wLjA3MS0wLjAxNy0wLjEwNi0wLjAyN2MtMC4yNTktMC4wNzUtMC41MjItMC4xMzItMC43ODktMC4xNzcgICBjLTAuMDc4LTAuMDEzLTAuMTU1LTAuMDI1LTAuMjMzLTAuMDM2QzE0LjYxNCw5LjAyNywxNC4zMDksOSwxNCw5Yy0zLjg1OSwwLTcsMy4xNDEtNyw3YzAsMC4wODIsMC4wMDYsMC4xNjMsMC4wMTIsMC4yNDQgICBsMC4wMTIsMC4yMWwtMC4wMDksMC4xNkM3LjAwOCwxNi43NDQsNywxNi44NzMsNywxN3YwLjYzbC0wLjU2NywwLjI3MUMyLjcwNSwxOS42ODgsMCwyNCwwLDI4LjE1NEMwLDM0LjEzNSw0Ljg2NSwzOSwxMC44NDUsMzlIMjUgICBWMjhjMC0yLjIwOSwxLjc5MS00LDQtNHM0LDEuNzkxLDQsNHYxMWgyLjM1M2MwLjA1OSwwLDAuMTE2LTAuMDA1LDAuMTc0LTAuMDA5bDAuMTk4LTAuMDExbDAuMjcxLDAuMDExICAgQzM2LjA1MywzOC45OTUsMzYuMTEsMzksMzYuMTY5LDM5aDkuODAzQzUxLjUwMSwzOSw1NiwzNC41MDEsNTYsMjguOTcyQzU2LDI0LjE2MSw1Mi40OSwxOS44NzIsNDcuODM1LDE4Ljk4NnoiIGZpbGw9IiNGRkZGRkYiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K' />)
      }
    }

    return (
      <div class={style.container}>
        <h2>{this.props.title}</h2>
        <div class={style.actionWrapper}>
          <ElUpdate />
          <img class={style.images} onclick={this.handleSetPresetPath.bind(this)} title='Set the path to your Bitwig preset directory' src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0xNCwyMy41Yy0wLjI1NCwwLTAuNDc5LDAuMTcyLTAuNTQ1LDAuNDE3TDIsNTIuNXYxYzAsMC43MzQtMC4wNDcsMSwwLjU2NSwxaDQ0Ljc1OWMxLjE1NiwwLDIuMTc0LTAuNzc5LDIuNDUtMS44MTMgICBMNjAsMjQuNWMwLDAsMC0wLjYyNSwwLTFIMTR6IiBmaWxsPSIjRkZGRkZGIi8+Cgk8cGF0aCBkPSJNMTIuNzMxLDIxLjVINTNoMXYtNi4yNjhjMC0xLjUwNy0xLjIyNi0yLjczMi0yLjczMi0yLjczMkgyNi41MTVsLTUtN0gyLjczMkMxLjIyNiw1LjUsMCw2LjcyNiwwLDguMjMydjQxLjc5NiAgIGwxMC4yODItMjYuNzE3QzEwLjU1NywyMi4yNzksMTEuNTc1LDIxLjUsMTIuNzMxLDIxLjV6IiBmaWxsPSIjRkZGRkZGIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==' />
          <div class={style.pathInfo}>path: <span class={style.paths}>{this.state.settings.repoLocal}</span></div>
        </div>
      </div>
    )
  }
}
