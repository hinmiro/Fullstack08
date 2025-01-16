const { ApolloServer } = require('@apollo/server')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { expressMiddleware } = require('@apollo/server/express4')
const {
    ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/mongoSchema/userSchema')
const jwt = require('jsonwebtoken')
const resolvers = require('./src/resolvers')
const typeDefs = require('./src/apolloSchema')

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

const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    })

    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const serverCleanup = useServer({ schema }, wsServer)

    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose()
                        },
                    }
                },
            },
        ],
    })
    await server.start()
    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware(server, {
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
        })
    )
    const PORT = 4000
    httpServer.listen(PORT, () =>
        console.log(`Server is running on ${new URL('http://localhost:4000')}`)
    )
}
start()
