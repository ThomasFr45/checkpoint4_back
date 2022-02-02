import express from 'express';
import Orders from '../models/orderModel.js';
const router = express.Router();

// Dans ce controller, toutes les routes commencent par /Orders cf(routes/routings.js L:8)
router.get('/', (req, res) => {
    Orders.getAll().then(orders => {
        res.json(orders);
    }).catch(err => {

        res.status(500).json({error : err.message})
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Orders.getOneById(id).then(order => {
        if (order[0]) res.status(200).json(order);
        else res.status(404).send('Not Found, please check the ID.');
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

router.post('/', (req, res) => {
    const { content, total, buyer, user_id } = req.body;
    const validInput = Orders.validate({ content, total, buyer, user_id });
      if (!validInput.error) {
        Orders.createNew(validInput.value).then(id => {
            const neworder = { id, ...validInput.value };
            res.status(200).json(neworder);
        }).catch(err => {
            res.status(500).json({error : err.message})
        })
    }
    else res.status(422).json({Error : validInput.error.details[0].message});
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const validInput = Orders.validate(req.body, false);
    const orderExist = await Orders.getOneById(id);
      if (!orderExist[0]) res.status(404).json({ error : "order not found" });
      else {
        if (!validInput.error) {
            Orders.updateorder(validInput.value, id).then(() => {
                Orders.getOneById(id).then(neworder => {
                    res.status(200).json(neworder)
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
    Orders.deleteById(id).then(result => {
        if (result > 0) res.status(200).send('order removed succesfully.');
        else res.status(404).json({ error : "order not found, check the ID or make sure you haven't already deleted it." });
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

export default router;