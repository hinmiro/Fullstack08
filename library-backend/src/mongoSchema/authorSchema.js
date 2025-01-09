const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 4,
        },
        born: {
            type: Number,
            required: false,
        },
    },
    { collection: 'author' }
)

schema.plugin(uniqueValidator)

module.exports = mongoose.model('author', schema)
