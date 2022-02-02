import express from 'express';
import Recipe from '../models/recipeModel.js';
const router = express.Router();

// Dans ce controller, toutes les routes commencent par /Recipe cf(routes/routings.js L:8)
router.get('/', (req, res) => {
    Recipe.getAll().then(recipe => {
        res.json(recipe);
    }).catch(err => {

        res.status(500).json({error : err.message})
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Recipe.getOneById(id).then(recipe => {
        if (recipe[0]) res.status(200).json(recipe);
        else res.status(404).send('Not Found, please check the ID.');
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

router.post('/', (req, res) => {
    const { content, cost, item_id } = req.body;
    const validInput = Recipe.validate({ content, cost, item_id });
      if (!validInput.error) {
        Recipe.createNew(validInput.value).then(id => {
            const newrecipe = { id, ...validInput.value };
            res.status(200).json(newrecipe);
        }).catch(err => {
            res.status(500).json({error : err.message})
        })
    }
    else res.status(422).json({Error : validInput.error.details[0].message});
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const validInput = Recipe.validate(req.body, false);
    const recipeExist = await Recipe.getOneById(id);
      if (!recipeExist[0]) res.status(404).json({ error : "recipe not found" });
      else {
        if (!validInput.error) {
            Recipe.updaterecipe(validInput.value, id).then(() => {
                Recipe.getOneById(id).then(newrecipe => {
                    res.status(200).json(newrecipe)
                })
            }).catch(err => {
                res.status(500).json({error : err.message})
            })
        }
        else res.status(422).json({Error : validInput.error.details[0].message});
      }
})

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    Recipe.deleteById(id).then(result => {
        if (result > 0) res.status(200).send('recipe removed succesfully.');
        else res.status(404).json({ error : "recipe not found, check the ID or make sure you haven't already deleted it." });
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

export default router;