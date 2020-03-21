const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('articles/index')
})


router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res, next) => {
    try {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
    } catch (err) {
    next (err);
    }
});

router.get('/:slug', async (req, res, next) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug })
        if (article == null) res.redirect('/')
        res.render('articles/show', { article: article })
    } catch (err) {
        next (err);
    }
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('articles/new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

router.put('/:id', (req, res) => {

})

router.delete('/:id', async (req, res, next) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (err) {
        next (err)
    }
    
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (e) {
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router 