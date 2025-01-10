const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
require('dotenv').config()
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const Book = require('./mongoSchema/bookSchema')
const Author = require('./mongoSchema/authorSchema')
const User = require('./mongoSchema/userSchema')
const jwt = require('jsonwebtoken')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGO_URI

const connectMongo = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to Mongo database')
    } catch (err) {
        throw err
    }
}

connectMongo().catch((err) => {
    console.log('Error connecting to Mongo database: ', err.message)
})

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
    
  }

  type Query {
    bookCount: Int
    authorCount: Int
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Mutation {
    
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    
    login(
        username: String!
        password: String!
    ): Token
    
    addBook(
        title: String!
        published: Int!
        author: String!
        genres: [String!]!
    ): Book
    
    editAuthor(
        name: String!
        setToBorn: Int!
    ): Author
  }
`

const resolvers = {
    Query: {
        me: (root, args, context) => {
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
                const savedNewBook = await newBook.save()
                return savedNewBook.populate('author')
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
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7),
                process.env.SECRET_KEY
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
