//Basic dependencies
//Http interface
require("dotenv").config();

import express from 'express';
import cors from 'cors';

const MongoClient = require('mongodb').MongoClient;

const {ApolloServer} = require('apollo-server-express');
const bodyParser = require('body-parser');

const MONGO_URL = process.env.MONGO_URL;


//Settings
import scheme from './scheme'
import resolvers from './resolvers'

(async () => {
    try {
        //Express
        const app = express();
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.raw());
        app.get('/health', (req, res) => res.send('OK'));

        //Setting mongo
        let mongo = await MongoClient.connect(MONGO_URL);
        let db = mongo.db('crypto');

        const server = new ApolloServer({
            typeDefs: scheme,
            resolvers: resolvers,
            // Express context https://www.apollographql.com/docs/apollo-server/api/apollo-server/
            context: ({req, res}) => {
                // add the user to the context
                return {mongo: db}
            },
        });

        server.applyMiddleware({
            app: app,
            path: '/',
        });

        app.listen(4000);
        console.log('Running a GraphQL API server at localhost:4000/graphql');
    } catch (err) {
        console.log(err);
    }

})();

