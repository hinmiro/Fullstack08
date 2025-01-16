const Book = require('./mongoSchema/bookSchema')
const Author = require('./mongoSchema/authorSchema')
const User = require('./mongoSchema/userSchema')
const { GraphQLError } = require('graphql/index')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')

const resolvers = {
    Query: {
        me: async (root, args, context) => {
            return context.currentUser
        },
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const { author, genre } = args
            let books = await Book.find({}).populate('author')

            if (!author && !genre) {
                return books
            }

            if (author && genre) {
                return books.filter(
                    (book) =>
                        book.author.name === author &&
                        book.genres.includes(genre)
                )
            }

            if (genre) {
                return books.filter((book) => book.genres.includes(genre))
            }

            return books.filter((book) => book.author.name === author)
        },
        allAuthors: async () => {
            let authors = await Author.find({})
            const books = await Book.find({}).populate('author')

            return authors.map((author) => {
                const bookCount = books.filter(
                    (book) => book.author.name === author.name
                ).length
                return {
                    ...author.toObject({
                        transform: (doc, ret) => {
                            ret.id = ret._id
                            delete ret._id
                            delete ret.__v
                        },
                    }),
                    bookCount: bookCount,
                }
            })
        },
    },

    Mutation: {
        createUser: async (root, args) => {
            const { username, favoriteGenre } = args
            const user = new User({
                username: username,
                favoriteGenre: favoriteGenre,
            })

            return user.save().catch((error) => {
                throw new GraphQLError('User creation failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: username,
                        error,
                    },
                })
            })
        },

        login: async (root, args) => {
            const { username, password } = args
            const user = await User.findOne({ username: username })

            if (!user || password !== 'supersecret') {
                throw new GraphQLError('Invalid username or password', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }

            const userForJwt = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForJwt, process.env.SECRET_KEY) }
        },

        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('Unauthorized', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }

            let { author } = args
            const existingAuthor = await Author.findOne({ name: author })

            try {
                // Check if author exists
                if (!existingAuthor) {
                    const newAuthor = new Author({ name: author })
                    author = await newAuthor.save()
                } else {
                    author = existingAuthor
                }
                // Construct and save new book
                const newBook = new Book({ ...args, author: author })
                let savedNewBook = await newBook.save()
                savedNewBook = savedNewBook.populate('author')
                pubsub.publish('BOOK_ADDED', { bookAdded: savedNewBook })
                return savedNewBook
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error,
                    },
                })
            }
        },

        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError('Unauthorized', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                })
            }

            const { name, setToBorn } = args
            if (!Author.exists({ name: name })) {
                return null
            }

            try {
                return Author.findOneAndUpdate(
                    { name: name },
                    { born: setToBorn },
                    { new: true }
                )
            } catch (error) {
                throw new GraphQLError('Author editing failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error,
                    },
                })
            }
        },
    },

    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
        },
    },
}

module.exports = resolvers
