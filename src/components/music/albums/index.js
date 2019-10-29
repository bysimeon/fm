import React, { Component } from "react"
import "./styles.scss"

class Album extends Component {
    render() {
        let classes = "music__column__item"
        if (
            this.props.selected === this.props.artist ||
            (this.props.selectedID === this.props.artistID &&
                this.props.artistID !== "")
        ) {
            classes += " music__column__item--selected"
        }
        if (
            this.props.hovered === this.props.artist ||
            (this.props.hoveredID === this.props.artistID &&
                this.props.artistID !== "")
        ) {
            classes += " music__column__item--hovered"
        }
        return (
            <div
                className={classes}
                onClick={this.props.selectArtist}
                onMouseOver={this.props.hoverArtist}
                artist={this.props.artist}
                artistid={this.props.artistID}
            >
                <div
                    className="music__column__item__title"
                    artist={this.props.artist}
                    artistid={this.props.artistID}
                >
                    {this.props.album}
                </div>
                <div
                    className="music__column__item__plays"
                    artist={this.props.artist}
                    artistid={this.props.artistID}
                >
                    {this.props.playcount}
                </div>
            </div>
        )
    }
}

export default Album
