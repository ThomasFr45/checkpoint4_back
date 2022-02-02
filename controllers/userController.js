import express from 'express';
import Users from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const saltRounds = 10;

// Dans ce controller, toutes les routes commencent par /Users cf(routes/routings.js L:8)
router.get('/', (req, res) => {
    Users.getAll().then(users => {
        res.json(users);
    }).catch(err => {

        res.status(500).json({error : err.message})
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    Users.getOneById(id).then(user => {
        if (user[0]) res.status(200).json(user);
        else res.status(404).send('Not Found, please check the ID.');
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

router.post('/', (req, res) => {
    const { username, password } = req.body;
    const validInput = Users.validate({ username, password });
      if (!validInput.error) {
        Users.createNew(validInput.value).then(id => {
            const newuser = { id, ...validInput.value };
            res.status(200).json(newuser);
        }).catch(err => {
            res.status(500).json({error : err.message})
        })
    }
    else res.status(422).json({Error : validInput.error.details[0].message});
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const validInput = Users.validate(req.body, false);
    const userExist = await Users.getOneById(id);
      if (!userExist[0]) res.status(404).json({ error : "user not found" });
      else {
        if (!validInput.error) {
            Users.updateuser(validInput.value, id).then(() => {
                Users.getOneById(id).then(newuser => {
                    res.status(200).json(newuser)
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
    Users.deleteById(id).then(result => {
        if (result > 0) res.status(200).send('user removed succesfully.');
        else res.status(404).json({ error : "user not found, check the ID or make sure you haven't already deleted it." });
    }).catch(err => {
        res.status(500).json({error : err.message})
    })
})

router.post('/check-token', async (req, res) => {
  const { token } = req.body;
  try {
      const userExist = await Users.findByToken(token);
      if (userExist) res.json({ message: "Loggedin", user: userExist }).status(200);
      else res.json({ error : 'Invalid Token' }).status(401);
  } catch (error) {
      res.status(500).json({ message: error.message })
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
      const validInput = Users.validate({ username, password });
      if (validInput.error) return res.json({ error: validInput.error.details[0].message }).status(422);
      const userExist = await Users.findOneByUsername(validInput.value.username);
      if (userExist) return res.json({ error: 'This username is already used' }).status(409);
      try {
          const hash = bcrypt.hashSync(validInput.value.password, saltRounds);
          validInput.value.password = hash;
          const userId= await Users.createNew(validInput.value);
          const user = await Users.getOneById(userId);
          res.status(201).json(user);
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const userIsValid = Users.validate({ username, password });
      if (userIsValid.error) return res.json({ error: userIsValid.error.details[0].message }).status(422);
      const userExist = await Users.findOneByUsername(userIsValid.value.username);
      if (userExist) {
          const passwordIsValid = bcrypt.compareSync(userIsValid.value.password, userExist.password);
          if (passwordIsValid) {
              const token = jwt.sign({ username: userExist.username }, process.env.SERVER_SECRET);
              const validated = Users.validate({ token : token }, false)
              if(validated.error) return res.send({error : validated.error.details[0].message})
              Users.tokenUpdate({token: validated.value.token}, userExist.id);
              res.send({ token: token }).status(200);
          }
          else res.json({ error: 'Invalid password' }).status(401);
      } else res.json({ error: 'User not found' }).status(404);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

export default router;