const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const weatherRoute = require('./routes/weather');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });

app.use('/api/weather', weatherRoute);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.get('/api', (req, res) => { res.send('API is running...') });

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => console.log(`API Server listening on port ${PORT}`));
}

module.exports = app;
