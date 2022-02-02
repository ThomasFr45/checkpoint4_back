import dbConnect from '../config/db-config.js';
import Joi from 'joi';

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    username: Joi.string().max(255).presence(presence),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).trim(true).presence(presence),
    token : Joi.string().max(255),
  }).validate(data, {abortEarly: false})
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbConnect.query('SELECT * FROM user', (err, results) => {
            // si la requete n'est pas bonne on retourne une erreur
            if (err) reject(err);
            // sinon on retourne les résultats
            else resolve(results);
        })
    })
}

// READ ONE
const getOneById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('SELECT * FROM user WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// DELETE
const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('DELETE FROM user WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows);
        })
    })
}

// CREATE
const createNew = (values) => {
    const { username, password } = values;
    return new Promise((resolve, reject) => {
        dbConnect.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        })
    })
}

// UPDATE
const updateuser = (newValues, id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('UPDATE user SET ? WHERE id = ?', [newValues, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

const findByToken = (token) => {
  return new Promise((resolve, reject) => {
      dbConnect.query('SELECT username, token FROM user WHERE token = ?', token, (err, result) => {
          if(err) reject(err);
          else resolve(result[0]);
      })
  })
}

const findOneByUsername = (username) => {
  return new Promise((resolve, reject) => {
    dbConnect.query('SELECT username, password, id FROM user WHERE username = ?', username, (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    })
  })
}

const tokenUpdate = (token, id) => {
  return new Promise((resolve, reject) => {
      dbConnect.query('UPDATE user SET ? WHERE id = ?', [token, id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
      })
  })
}
// exporter toutes les fonctions du model
export default { getAll, getOneById, deleteById, createNew, updateuser, validate, findByToken, findOneByUsername, tokenUpdate };