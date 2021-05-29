import React, { Component } from "react"

class Recent extends Component {
    render() {
        return (
            <div className="music__column__item music__column__item--recent">
                <div className="music__column__item__title">
                    {this.props.track} by {this.props.artist}{" "}
                </div>
                <div className="music__column__item__plays">
                    {this.props.unixTimestamp(this.props.time)}
                </div>
            </div>
        )
    }
}

export default Recent
