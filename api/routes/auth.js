const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Please enter all fields' });
    try {
        if (await User.findOne({ username })) return res.status(400).json({ message: 'User already exists' });
        const newUser = new User({ username, password: await bcrypt.hash(password, 10) });
        await newUser.save();
        const payload = { id: newUser.id, username: newUser.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: payload });
    } catch (err) { res.status(500).send('Server error'); }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Please enter all fields' });
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid credentials' });
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: payload });
    } catch (err) { res.status(500).send('Server error'); }
});

router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
