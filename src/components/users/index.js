import React, { Component } from "react"
import { fetchFM } from "../../lastFM"

class Users extends Component {
    constructor() {
        super()
        this.state = {
            friends: false,
            added: [],
        }
    }

    changeUser(username) {
        let added = this.state.added
        added.push(username)
        this.props.changeUser({target: { value: username }})
        this.setState({
            user: username,
            added: added,
        }, this.updateData(username))
    }

    async getJSON(request, user, limit = 50, page = 1) {
        const response = await fetchFM(request, false, user, limit, page)
        if (response) {
            switch (request) {
                case "getinfo":
                    this.setState({
                        userInfo: response,
                    })
                    break
                case "getrecenttracks":
                    this.updateFriends(user, response)
                    break
                case "getfriends":
                    let raw = await response
                    let friends = []
                    if (raw) {
                    Object.entries(raw.friends.user).forEach((friend) => friends.push(friend[1]))
                    this.setState({
                        friends: friends,
                    })
                    }
                    break
                default:
                    break
            }
        }
    }

    updateData(user) {
        this.getJSON("getinfo", user)
        this.getJSON("getfriends", user)
    }

    componentWillMount() {
        this.setState(
            { user: "" },
            this.updateData(this.state.user || "")
        )
    }

    componentDidMount() {
        let recentInterval = setInterval(() => {
            if (this.props.user !== this.state.user) {
              this.updateData(this.props.user)
              this.setState({user: this.props.user})
            }
          }, 80)
        this.setState({
            setInterval: recentInterval,
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.setInterval)
    }

    render() {
        let users = []
        let albums = []
        let tracks = []
        let recents = []
        let trackplays = 0

        const friends = this.state.friends ? this.state.friends.map(friend => {
          return <div className="users__user" onClick={() => this.changeUser(friend.name)}> {friend.name} </div>
        }) : []

        return (
            <section className="users">
              {friends}
            </section>
        )
    }
}

export default Users
