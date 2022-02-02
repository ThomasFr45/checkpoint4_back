import dbConnect from '../config/db-config.js';
import Joi from 'joi';

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    name: Joi.string().max(255).presence(presence),
    price: Joi.number().integer().min(1).presence(presence),
    toggle: Joi.boolean().default(true),
  }).validate(data, {abortEarly: false})
}

const getAll = () => {
    return new Promise((resolve, reject) => {
        dbConnect.query('SELECT * FROM item', (err, results) => {
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
        dbConnect.query('SELECT * FROM item WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// DELETE
const deleteById = (id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('DELETE FROM item WHERE id = ?', id, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows);
        })
    })
}

// CREATE
const createNew = (values) => {
    const { price, name, toggle } = values;
    return new Promise((resolve, reject) => {
        dbConnect.query('INSERT INTO item (name, price, toggle) VALUES (?, ?, ?)', [name, price, toggle], (err, result) => {
            if (err) reject(err);
            else resolve(result.insertId);
        })
    })
}

// UPDATE
const updateItem = (newValues, id) => {
    return new Promise((resolve, reject) => {
        dbConnect.query('UPDATE item SET ? WHERE id = ?', [newValues, id], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

// exporter toutes les fonctions du model
export default { getAll, getOneById, deleteById, createNew, updateItem, validate };