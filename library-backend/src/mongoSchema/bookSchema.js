const mongoose = require('mongoose')

const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            minlength: 5,
        },
        published: {
            type: Number,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'author',
        },
        genres: [{ type: String }],
    },
    { collection: 'book' }
)

schema.plugin(uniqueValidator)

module.exports = mongoose.model('book', schema)
