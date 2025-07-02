const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Favorite = require('../models/Favorite');

router.get('/', authMiddleware, async (req, res) => {
    try { res.json(await Favorite.find({ user: req.user.id }).sort({ date_added: -1 })); }
    catch (err) { res.status(500).send('Server Error'); }
});

router.post('/', authMiddleware, async (req, res) => {
    const { city, country } = req.body;
    if (!city || !country) return res.status(400).json({ msg: 'City and country are required' });
    try { res.json(await new Favorite({ user: req.user.id, city, country }).save()); }
    catch (err) {
        if (err.code === 11000) return res.status(400).json({ msg: 'This city is already in your favorites.' });
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const favorite = await Favorite.findById(req.params.id);
        if (!favorite) return res.status(404).json({ msg: 'Favorite not found' });
        if (favorite.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await Favorite.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Favorite removed' });
    } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;
