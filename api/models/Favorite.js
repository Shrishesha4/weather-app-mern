const mongoose = require('mongoose');
const FavoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    date_added: { type: Date, default: Date.now }
});
FavoriteSchema.index({ user: 1, city: 1 }, { unique: true });
module.exports = mongoose.model('Favorite', FavoriteSchema);
