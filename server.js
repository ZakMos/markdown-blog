if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path: __dirname + '/.env'})
  }
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const Article = require('./models/article')
const indexRouter = require('./routes/index')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res)=> {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('index', { articles: articles })
})

app.use('/', indexRouter)
app.use('/articles', articleRouter)

const path = require ('path')

const port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});