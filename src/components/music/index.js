import React, { Component } from "react"
import "./style.scss"

import Artist from "./artists"
import Album from "./albums"
import Track from "./tracks"
import Recent from "./recents"

const apikey = process.env.REACT_APP_LASTFM_API_KEY
const apibase = "https://ws.audioscrobbler.com/2.0/"
const timespanConvert = {
    "7": "7day",
    "30": "1month",
    "90": "3month",
    "180": "6month",
    "365": "12month",
    "???": "overall"
}

class Music extends Component {
    constructor() {
        super()
        this.state = {
            user: "s_meon",
            limit: 50,
            timespan: "30",
            topArtists: null,
            topTracks: null,
            topAlbums: null,
            recentTracks: null,
            userInfo: null,
            selectedArtist: false,
            selectedArtistID: false,
            hoveredArtist: false,
            hoveredArtistID: false,
            setInterval: false
        }
        this.selectArtist = this.selectArtist.bind(this)
        this.updateTimespan = this.updateTimespan.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.updateData = this.updateData.bind(this)
    }

    updateTimespan(e) {
        this.setState({
            timespan: e.target.value
        }, () => {
            (this.updateData())
        })
    }

    unixTimestamp(t) {
        if (t === "now playing") {
            return t
        }
        var dt = new Date(t * 1000)
        var nd = new Date()
        var milliseconds = nd.getTime() - dt.getTime()
        var days = Math.floor(milliseconds / 86400000) // days
        var hours = Math.floor((milliseconds % 86400000) / 3600000) // hours
        var minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000) // minutes
        if (days > 0) {
            if (days > 1) {
                return days.toString() + " days ago"
            } else {
                return days.toString() + " day ago"
            }
        } else if (hours > 0) {
            if (hours > 1) {
                return hours.toString() + " hours ago"
            } else {
                return hours.toString() + " hour ago"
            }
        } else {
            if (minutes > 1) {
                return minutes.toString() + " mins ago"
            } else {
                return minutes.toString() + " min ago"
            }
        }
    }

    selectArtist(e) {
        this.setState({
            selectedArtist: e.target.getAttribute("artist"),
            selectedArtistID: e.target.getAttribute("artistid")
        })
    }

    hoverArtist(e) {
        this.setState({
            hoveredArtist: e.target.getAttribute("artist"),
            hoveredArtistID: e.target.getAttribute("artistid")
        })
    }

    getJSON(request, time, limit) {
        let xhr = new XMLHttpRequest()
        xhr.open(
            "GET",
            apibase +
            "?method=user." +
            request +
            "&user=" +
            this.state.user +
            "&period=" +
            timespanConvert[time] +
            "&limit=" +
            limit +
            "&api_key=" +
            apikey +
            "&format=json"
        )
        xhr.onload = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    switch (request) {
                        case "gettopartists":
                            this.setState({
                                topArtists: JSON.parse(xhr.responseText)
                            })
                            break
                        case "gettoptracks":
                            this.setState({
                                topTracks: JSON.parse(xhr.responseText)
                            })
                            break
                        case "gettopalbums":
                            this.setState({
                                topAlbums: JSON.parse(xhr.responseText)
                            })
                            break
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
                        default:
                            break
                    }
                }
            }
        }
        xhr.send()
    }

    updateUser(e) {
        let username = e.target.value
        if (username === "") {
            username = "s_meon"
        }
        this.setState({
            user: username
        })
        let timer = 0
        setTimeout(this.updateData, 1000)
    }

    updateData(time) {
        if (!time) {
            time = this.state.timespan
        }
        this.getJSON("getinfo", time, "50")
        this.getJSON("getrecenttracks", time, "1")
        this.getJSON("gettopartists", time, "50")
        this.getJSON("gettoptracks", time, "50")
        this.getJSON("gettopalbums", time, "50")
    }

    componentWillMount() {
        this.updateData()
        let recentInterval = setInterval(() => {
            this.getJSON("getrecenttracks", "30", "50")
        }, 1000)
        this.setState({
            setInterval: recentInterval
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.setInterval)
    }

    render() {
        let artists = []
        let albums = []
        let tracks = []
        let recents = []
        let trackplays = 0

        if (
            this.state.topArtists &&
            this.state.topTracks &&
            this.state.topAlbums
        ) {
            this.state.topArtists.topartists.artist.forEach(artist => {
                artists.push(
                    <Artist
                        artist={artist.name}
                        artistID={artist.mbid}
                        playcount={artist.playcount}
                        url={artist.url}
                        key={artist.name}
                        selected={this.state.selectedArtist}
                        selectedID={this.state.selectedArtistID}
                        selectArtist={this.selectArtist.bind(this)}
                        hovered={this.state.hoveredArtist}
                        hoveredID={this.state.hoveredArtistID}
                        hoverArtist={this.hoverArtist.bind(this)}
                    />
                )
            })

            this.state.topAlbums.topalbums.album.forEach(album => {
                albums.push(
                    <Album
                        album={album.name}
                        artistID={album.artist.mbid}
                        artist={album.artist.name}
                        playcount={album.playcount}
                        url={album.url}
                        key={album.name + album.artist}
                        selected={this.state.selectedArtist}
                        selectedID={this.state.selectedArtistID}
                        selectArtist={this.selectArtist.bind(this)}
                        hovered={this.state.hoveredArtist}
                        hoveredID={this.state.hoveredArtistID}
                        hoverArtist={this.hoverArtist.bind(this)}
                    />
                )
            })

            this.state.topTracks.toptracks.track.forEach(track => {
                trackplays += parseInt(track.playcount)
                tracks.push(
                    <Track
                        track={track.name}
                        artistID={track.artist.mbid}
                        artist={track.artist.name}
                        playcount={track.playcount}
                        url={track.url}
                        key={track.name + track.artist.name}
                        selected={this.state.selectedArtist}
                        selectedID={this.state.selectedArtistID}
                        selectArtist={this.selectArtist.bind(this)}
                        hovered={this.state.hoveredArtist}
                        hoveredID={this.state.hoveredArtistID}
                        hoverArtist={this.hoverArtist.bind(this)}
                    />
                )
            })
        }

        if (this.state.recentTracks) {
            this.state.recentTracks.recenttracks.track.forEach(track => {
                if (track.date) {
                    recents.push(
                        <Recent
                            track={track.name}
                            artistID={track.artist.mbid}
                            artist={track.artist["#text"]}
                            playcount={track.playcount}
                            url={track.url}
                            key={track.name + track.date.uts}
                            selected={this.selectedArtist}
                            selectedID={this.selectedArtistID}
                            time={track.date.uts}
                            unixTimestamp={this.unixTimestamp}
                        />
                    )
                } else {
                    recents.push(
                        <Recent
                            track={track.name}
                            artistID={track.artist.mbid}
                            artist={track.artist["#text"]}
                            playcount={track.playcount}
                            url={track.url}
                            key={track.name + track.time}
                            selected={this.selectedArtist}
                            selectedID={this.selectedArtistID}
                            time="now playing"
                            unixTimestamp={this.unixTimestamp}
                        />
                    )
                }
            })
        }

        return (
            <div className="container container--music">
                <input onKeyUp={this.updateUser} placeholder="s_meon"className="medmedtext medmedtext--music user-input"/>

                <p className="notsmalltext notsmalltext--music">
                    has listened to around{" "}
                    {this.state.userInfo ? (
                        <span>
                            {this.state.userInfo.user.playcount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                        </span>
                    ) : (
                            <span>000,000</span>
                        )}{" "}
                    songs, all tracked through{" "}
                    {this.state.userInfo ? (
                        <span>
                            <a href={this.state.userInfo.user.url}> last.fm </a>
                        </span>
                    ) : (
                            <span>
                                <a href="https://www.last.fm/"> last.fm </a>
                            </span>
                        )}
                    . here's a breakdown of what they've been listening to for the
                    past{" "}
                    <select
                        value={this.state.timespan}
                        onChange={this.updateTimespan}
                        className="dropdown dropdown--music"
                    >
                        <option>7</option>
                        <option>30</option>
                        <option>90</option>
                        <option>180</option>
                        <option>365</option>
                        <option>???</option>
                    </select>{" "}
                    days.
                </p>
                <p className="notsmalltext notsmalltext--music">
                    note: check out your account by typing in your username above!
                </p>
                
                {artists.length >= 1 && albums.length >= 1 && tracks.length >= 1 && recents.length >= 1 ? (
                    <div className="music music--recent">
                        <div className="songs music__column music__column--recent">
                            <div className="music__column__item">
                                <div className="music__column__item__title">
                                    recently played
                            </div>
                                <div className="music__column__item__plays">
                                    {" "}
                                when
                            </div>
                            </div>
                            {recents}
                        </div>
                        {/* <div className="songs music__column music__column--totals">
                                <div className="music__column__item">
                                    {this.state.timespan} day total
                                </div>
                                <div className="music__column__item">
                                    <div className="music__column__item__title">
                                        unique artists
                                    </div>
                                    <div className="music__column__item__plays">
                                        {
                                            this.state.topArtists.topartists[
                                                "@attr"
                                            ].total
                                        }
                                    </div>
                                </div>
                                <div className="music__column__item">
                                    <div className="music__column__item__title">
                                        unique albums
                                    </div>
                                    <div className="music__column__item__plays">
                                        {
                                            this.state.topAlbums.topalbums[
                                                "@attr"
                                            ].total
                                        }
                                    </div>
                                </div>
                                <div className="music__column__item">
                                    <div className="music__column__item__title">
                                        unique tracks
                                    </div>
                                    <div className="music__column__item__plays">
                                        {
                                            this.state.topTracks.toptracks[
                                                "@attr"
                                            ].total
                                        }
                                    </div>
                                </div>
                                <div className="music__column__item">
                                    <div className="music__column__item__title">
                                        total tracks played
                                    </div>
                                    <div className="music__column__item__plays">
                                        {this.state.userInfo.user.playcount}
                                    </div>
                                </div>
                            </div> */}
                    </div>
                ) : (
                        <div className="loading">
                            loading
                        </div>
                    )}
                    
                {artists.length >= 1 && albums.length >= 1 && tracks.length >= 1 && recents.length >= 1 ? (
                <div className="music">
                    <div className="artists music__column">
                        <div className="music__column__item">
                            <div className="music__column__item__title">
                                top artists
                            </div>
                            <div className="music__column__item__plays">
                                plays
                            </div>
                        </div>
                        {artists}
                    </div>
                    <div className="albums music__column">
                        <div className="music__column__item">
                            <div className="music__column__item__title">
                                top albums
                            </div>
                            <div className="music__column__item__plays">
                                plays
                            </div>
                        </div>
                        {albums}
                    </div>
                    <div className="songs music__column">
                        <div className="music__column__item">
                            <div className="music__column__item__title">
                                top tracks
                            </div>
                            <div className="music__column__item__plays">
                                plays
                            </div>
                        </div>
                        {tracks}
                    </div>
                </div>
                ) : (<div/>)}
            </div>
        )
    }
}

export default Music
