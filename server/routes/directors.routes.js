const { Router } = require('express');
const Directors = require('../models/Director');
const Movies = require('../models/Movie');
const router = Router();

router.post('/generate', async (req, res) => {
    try {
        const { name, age, movies } = req.body;

        const existing = await Directors.findOne({ name });

        if (existing) {
            return res.json({ director: existing });
        }

        const directorModel = new Directors({
            name, age
        });

        await directorModel.save();

        if (movies) {
            movies.map(el => {
                switch(el) {
                    case !el.hasOwnProperty('name'):
                        throw new Error(`Movie has no name property: ${el}`);
                    case !el.hasOwnProperty('genre'):
                        throw new Error(`Movie has no genre property: ${el}`);
                };
                el.director = directorModel._id;
            });

            await Movies.insertMany(movies);
        }

        res.status(201).json({ directorModel });

    } catch (e) {
        res.status(500).json({message: `Failed to generate director: ${e.message}`});
    }
});

router.get('/', async (req, res) => {
    try {
        const directors = await Directors.find({});
        res.status(201).send(`<code
            style="display: inline-block; background: #9e9e9e; color: #ffffff; padding: 25px 10px; margin: 10px; border-radius: 4px;"
        >${directors}</code>`);
        // res.json(directors);
    } catch (e) {
        res.status(500).json({message: 'Something wrong. Try again!'});
    }
});

module.exports = router;