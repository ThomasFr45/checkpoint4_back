import dbConnect from '../config/db-config.js';
import Joi from 'joi';

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    content: Joi.string().presence(presence),
    total: Joi.number().integer().presence(presence),
    user_id: Joi.number().integer().min(1).presence('optional'),
    buyer: Joi.string().max(250).presence(presence),
  }).validate(data, {abortEarly: false})
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbConnect.query('SELECT * FROM orders', (err, results) => {
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
        dbConnect.query('SELECT * FROM orders WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// DELETE
const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('DELETE FROM orders WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows);
        })
    })
}

// CREATE
const createNew = (values) => {
    const { content, total, buyer, user_id } = values;
    return new Promise((resolve, reject) => {
        dbConnect.query('INSERT INTO orders (content, total, buyer, user_id) VALUES (?, ?, ?, ?)', [content, total, buyer, user_id], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        })
    })
}

// UPDATE
const updateorder = (newValues, id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('UPDATE orders SET ? WHERE id = ?', [newValues, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// exporter toutes les fonctions du model
export default { getAll, getOneById, deleteById, createNew, updateorder, validate };