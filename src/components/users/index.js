import React, { Component } from "react"
import { fetchFM } from "../../lastFM"

const user = "dotdotdashdot"

class Users extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            friends: false,
            added: [],
        }
    }

    addUser(username) {
        this.setState({
            added: this.state.added.push(username),
        })
    }

    currentTracks() {
        if (this.state.friends) {
            console.log(this.state.friends)
            this.state.friends.forEach((friend) => {
                friend.recent = this.getJSON(
                    "getrecenttracks",
                    friend.name,
                    "1"
                )
            })
        }
    }

    updateFriends(user, recent) { }

    async getJSON(request, user, limit = 50, page = 1) {
        const response = await fetchFM(request, user, limit, page)

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
                    Object.entries(raw.friends).forEach((friend) => {
                        friends.push(friend[1][0])
                    })
                    friends.pop()
                    this.setState({
                        friends: friends,
                    })
                    break
                default:
                    break
            }
        }
    }

    updateData() {
        this.getJSON("getinfo", user)
        this.getJSON("getfriends", user)
    }

    componentWillMount() {
        this.setState(
            {
                user: user,
            },
            this.updateData()
        )
        let recentInterval = setInterval(() => {
            this.currentTracks()
        }, 1000)
        this.setState({
            setInterval: recentInterval,
        })
    }

    componentDidMount() {
        let recentInterval = setInterval(() => {
            if (this.props.topArtists) {
                this.setState({
                    topArtists: this.props.topArtists,
                    topTracks: this.props.topTracks,
                    topAlbums: this.props.topAlbums,
                    recentTracks: this.props.recentTracks,
                    userInfo: this.props.userInfo,
                    timespan: this.props.timespan,
                })
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

        return (
            <section className="users">
                <h1>debug: {this.state.user}</h1>
            </section>
        )
    }
}

export default Users
