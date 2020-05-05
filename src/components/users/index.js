import React, { Component } from "react"

const apikey = process.env.REACT_APP_LASTFM_API_KEY
const apibase = "https://ws.audioscrobbler.com/2.0/"
const user = "theblindlookout"
const timespanConvert = {
    "7": "7day",
    "30": "1month",
    "90": "3month",
    "180": "6month",
    "365": "12month",
    "???": "overall"
}

class Users extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            friends: false,
            added: []
        }
    }

    addUser(username) {
        this.setState({
            added: this.state.added.push(username)
        })
    }

    currentTracks() {
    if (this.state.friends) {
        console.log(this.state.friends)
        this.state.friends.forEach(friend => {
            friend.recent = this.getJSON("getrecenttracks", friend.name, "1")
        })
    }
    }

    updateFriends(user, recent) {
        
    }

    getJSON(request, user, limit) {
        let xhr = new XMLHttpRequest()
        xhr.open(
            "GET",
            apibase +
            "?method=user." +
            request +
            "&user=" +
            user +
            "&api_key=" +
            apikey +
            "&limit=" + 
            limit +
            "&format=json" 
        )
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    switch (request) {
                        case "getinfo":
                            this.setState({
                                userInfo: JSON.parse(xhr.responseText)
                            })
                            break
                        case "getrecenttracks":
                            this.updateFriends(user, JSON.parse(xhr.responseText))
                            break
                        case "getfriends":
                            let raw = JSON.parse(xhr.responseText)
                            let friends = []
                            Object.entries(raw.friends).forEach(friend => {
                                friends.push(friend[1][0])
                            })
                            friends.pop()
                            this.setState({
                                friends: friends
                            })
                            console.log(friends)
                            break
                        default:
                            break
                    }
                }
            }
        }
        xhr.send()
    }

    updateData() {
        this.getJSON("getinfo", user)
        this.getJSON("getfriends", user)
    }

    componentWillMount() {
        this.setState({
            user: user
        }, this.updateData())
        let recentInterval = setInterval(() => {
           this.currentTracks()
        }, 1000)
        this.setState({
            setInterval: recentInterval
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
                    timespan: this.props.timespan
                })
            }
        }, 80)
        this.setState({
            setInterval: recentInterval
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
               <h1>
                   {/* debug: {this.state.user} */}
                 </h1>
           </section>
        )
    }
}

export default Users
