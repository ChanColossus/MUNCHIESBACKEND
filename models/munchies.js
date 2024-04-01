const mongoose = require('mongoose')

const munchiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter munchies name'],
        trim: true,
        maxLength: [100, 'Munchies name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter munchies price'],
        maxLength: [5, 'Munchies price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter munchies description']
    },
    
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this munchies'],
        enum: {
            values: [
                'Smoked Meats',
                'Rice',
                'Sides',
                'Dessert',
                'Pastry',
                'Pizza',
                'Pasta'
               
            ],
            message: 'Please select correct category for service'
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Munchies', munchiesSchema);