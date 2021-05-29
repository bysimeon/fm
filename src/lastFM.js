const apikey = process.env.REACT_APP_LASTFM_API_KEY
const apibase = "https://ws.audioscrobbler.com/2.0/"
const timespan = {
    "7": "7day",
    "30": "1month",
    "90": "3month",
    "180": "6month",
    "365": "12month",
    "???": "overall"
}

function fetchFM(request, time = false, user, limit = 50, page = 1) {
    return new Promise(async (resolve, reject) => {
        time = time ? timespan[time] : false

        const url = `${apibase}?method=user.${request}&user=${user}&api_key=${apikey}&limit=${limit}&format=json${time ? '&period='+time : ''}`
        const response = await fetch(url)

        if (response.ok) {
            resolve(response.json())
        } else {
            resolve(false)
        }
    })
}

module.exports = { fetchFM }
