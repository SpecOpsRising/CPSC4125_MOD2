var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const uri = "mongodb+srv://cadetfalls:NiraAZ4XeyOw3qzV@cluster0.lr3hnhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const lCModel = require('./models/lc.model');

//MSFUup4WW5fpBrW6zQixjjXVYylm52ZvlppLEE19 = NASA API Key

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: false}));

app.get('/', async function (req, res) {
    axios.get('https://api.nasa.gov/planetary/apod?api_key=MSFUup4WW5fpBrW6zQixjjXVYylm52ZvlppLEE19')
    .then(async (response) => {
        // console.log(response.data);
        let picture = {date: null, liked: null};
        // console.log(picture);
        picture = await lCModel.find({date: response.data.date});
        // console.log(picture);
        res.render('index', {nasa: response.data, picList: picture});
    });
});

app.get('/explore', function (req, res) {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=MSFUup4WW5fpBrW6zQixjjXVYylm52ZvlppLEE19&date=${req.query.date ? req.query.date : ''}`)
    .then(async (response) => {
        // console.log(response.data);
        let picture = {date: null, liked: null};
        // console.log(picture);
        picture = await lCModel.find({date: response.data.date});
        // console.log(picture);
        res.render('explore', {nasa: response.data, picList: picture});
    })
})

app.get('/catalog', async function (req, res) {
    const picList = await lCModel.find({liked: true});
    res.render('catalog', {picList: picList});
})

app.post('/like', async function (req, res) {
    const pictures = await lCModel.find({date: req.body.date});
    if(pictures.length <= 0 && req.body.date !== undefined) {
        const likedPic = new lCModel({
        date: req.body.date,
        liked: true,
        imgUrl: req.body.imgUrl
        })
        const likeDoc = likedPic.save();
        // console.log(likeDoc);
        // console.log(likedPic);
        // console.log("Picture has been created and liked");
    }else {
        console.log(pictures);
        for(let i = 0; i < pictures.length; i++) {
            if(pictures[i].liked === false) {
                await lCModel.findOneAndUpdate({date: req.body.date}, {liked: true}, {imgUrl: req.body.imgUrl});
            }
        }
        // console.log("Picture has been liked");
    }
    res.redirect('back');
})

app.post('/unlike', async function (req, res) {
    let selectedIds = req.body.selected;
    await lCModel.find({'_id': {$in: selectedIds}}).updateMany({liked: false});
    res.redirect('/catalog');
})


mongoose.connect(
    uri,
    clientOptions
).then((result) => {
    console.log("Connected to MongoDB Atlas");
    app.listen(3000, function () {
        console.log('Example app listening on port 3000');
    })
}).catch((err) => {
    console.log(err);
});










