const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
const YouTube = require("youtube-sr").default;
const YTSuggest = require("youtube-suggest");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send("App is running")
} )

app.post("/suggestions", (req, res) => {
    const query = JSON.stringify(req.body)
    YTSuggest(query).then( x => {
        // console.log(res)
        return res.json(x)
    } )
} )

app.post("/search", (req, res) => {
    const { query } = req.body

    YouTube.search( query , { limit: 20 } )
    .then( i => {
        return res.json({ success: true, result: [{
            id: i.id, // yt id
            title: i.title,
            url: i.url,
            duration: i.duration,
            channelName: i.channel.name,
            channelIcon: i.channel.icon,
            uploaded: i.uploadedAt,
            views: Intl.NumberFormat('en', { notation: 'compact' }).format(i.views)
        }] });
    })
    .catch( err => {
        return res.status(404).json({ success: false, err: err })
    });

})

app.listen( port, () => console.log(`Listening on port ${port}`)  )
