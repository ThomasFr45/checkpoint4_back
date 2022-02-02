import express from 'express';
import Items from '../models/itemModel.js';
const router = express.Router();

// Dans ce controller, toutes les routes commencent par /Items cf(routes/routings.js L:8)
router.get('/', (req, res) => {
    Items.getAll().then(items => {
        res.json(items);
    }).catch(err => {

        res.status(500).json({error : err.message})
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Items.getOneById(id).then(item => {
        if (item[0]) res.status(200).json(item);
        else res.status(404).send('Not Found, please check the ID.');
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

router.post('/', (req, res) => {
    const { name, price, toggle } = req.body;
    const validInput = Items.validate({ name, price, toggle });
      if (!validInput.error) {
        Items.createNew(validInput.value).then(id => {
            const newitem = { id, ...validInput.value };
            res.status(200).json(newitem);
        }).catch(err => {
            res.status(500).json({error : err.message})
        })
    }
    else res.status(422).json({Error : validInput.error.details[0].message});
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const validInput = Items.validate(req.body, false);
    const itemExist = await Items.getOneById(id);
      if (!itemExist[0]) res.status(404).json({ error : "item not found" });
      else {
        if (!validInput.error) {
            Items.updateItem(validInput.value, id).then(() => {
                Items.getOneById(id).then(newitem => {
                    res.status(200).json(newitem)
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
    Items.deleteById(id).then(result => {
        if (result > 0) res.status(200).send('item removed succesfully.');
        else res.status(404).json({ error : "item not found, check the ID or make sure you haven't already deleted it." });
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

export default router;