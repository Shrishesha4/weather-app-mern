const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false // Make optional for guest searches
    },
    city: { 
        type: String, 
        required: true, 
        trim: true 
    },
    query: { 
        type: String, 
        required: false, 
        trim: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Index for better query performance
SearchSchema.index({ user: 1, timestamp: -1 });
SearchSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Search', SearchSchema);