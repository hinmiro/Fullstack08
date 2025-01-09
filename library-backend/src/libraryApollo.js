const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./mongoSchema/bookSchema')
const Author = require('./mongoSchema/authorSchema')
require('dotenv').config()

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
  }
  
  type Mutation {
  
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

            const allAuthors = authors.map((author) => {
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
            console.log(allAuthors)
            return allAuthors
        },
    },

    Mutation: {
        addBook: async (root, args) => {
            let { author } = args
            const existingAuthor = await Author.findOne({ name: author })

            if (!existingAuthor) {
                const newAuthor = new Author({ name: author })
                author = await newAuthor.save()
            } else {
                author = existingAuthor
            }

            const newBook = new Book({ ...args, author: author })
            const savedNewBook = await newBook.save()
            return savedNewBook.populate('author')
        },

        editAuthor: async (root, args) => {
            const { name, setToBorn } = args
            if (!Author.exists({ name: name })) {
                return null
            }

            return Author.findOneAndUpdate(
                { name: name },
                { born: setToBorn },
                { new: true }
            )
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
