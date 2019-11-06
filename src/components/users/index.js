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
            friends: null,
            added: []

        }
    }

    addUser(username) {
        this.setState({
            added: this.state.added.push(username)
        })
    }

    getJSON(request, time, user) {
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
                            this.setState({
                                recentTracks: JSON.parse(xhr.responseText)
                            })
                            break
                        case "getfriends":
                            this.setState({
                                recentTracks: JSON.parse(xhr.responseText)
                            })
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
        this.getJSON("getinfo")
    }

    componentWillMount() {
        this.updateData()
        let recentInterval = setInterval(() => {
            this.getJSON("getrecenttracks", "30")
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

           </section>
        )
    }
}

export default Users
