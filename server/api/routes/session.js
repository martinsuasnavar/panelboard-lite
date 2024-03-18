//sessions.js

const express = require('express');
const router = express.Router();
const db = require('../../db-module.js');

router.get('/sessions', async (req, res) => {
    try {
        const sessions = await db.getAll('session');
        console.log(`Fetching sessions...`);
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/create-session', async (req, res) => {
    const { id } = req.params;
    const { body: { key } } = req.body;
    try {
        await db.create('session', { key: key });
        res.status(201).json({ key: key });
        console.log("Creating a new note...");
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;