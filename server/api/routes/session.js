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
    const { body: { session_key } } = req.body;
    try {
        await db.create('session', { session_key: session_key });
        console.log("Creating a new session...");
        res.status(201).json({ session_key: session_key });
    } catch (error) {
        console.error('Error creating session:', error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;