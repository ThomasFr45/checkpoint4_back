import dbConnect from '../config/db-config.js';
import Joi from 'joi';

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    content: Joi.string().presence(presence),
    cost: Joi.number().integer().min(1).presence(presence),
    item_id: Joi.number().integer().min(1).presence(presence),
  }).validate(data, {abortEarly: false})
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbConnect.query('SELECT * FROM recipe', (err, results) => {
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
        dbConnect.query('SELECT * FROM recipe WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// DELETE
const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('DELETE FROM recipe WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows);
        })
    })
}

// CREATE
const createNew = (values) => {
    const { cost, content, item_id } = values;
    return new Promise((resolve, reject) => {
        dbConnect.query('INSERT INTO recipe (content, cost, item_id) VALUES (?, ?, ?)', [content, cost, item_id], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        })
    })
}

// UPDATE
const updaterecipe = (newValues, id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('UPDATE recipe SET ? WHERE id = ?', [newValues, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// exporter toutes les fonctions du model
export default { getAll, getOneById, deleteById, createNew, updaterecipe, validate };