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
                        book.genres.includes('genre')
                )
            }
            if (genre) {
                return books.filter((book) => book.genres.includes(genre))
            }
            return books.filter((book) => book.author === args.author)
        },
        allAuthors: async () => {
            let authors = await Author.find({})
            const books = await Book.find({}).populate('author')

            return authors.map((author) => {
                const bookCount = books.filter(
                    (book) => book.author.name === author.name
                ).length
                return { ...author.toObject(), bookCount: bookCount }
            })
        },
    },

    /*Mutation: {
        addBook: (root, args) => {
            let { author } = args
            const existingAuthor = authors.find((a) => a.name === author)
            if (!existingAuthor) {
                const newAuthor = { name: author, id: uuid() }
                authors = authors.concat(newAuthor)
            } else {
                author = existingAuthor
            }

            const newBook = { ...args, author: author, id: uuid() }
            books = books.concat(newBook)
            return newBook
        },

        editAuthor: (root, args) => {
            const { name, setToBorn } = args
            const author = authors.find((a) => a.name === name)

            if (!author) {
                return null
            }
            const updatedAuthor = { ...author, born: setToBorn }
            authors = authors.map((a) => (a.name === name ? updatedAuthor : a))
            return updatedAuthor
        },
    },*/
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
