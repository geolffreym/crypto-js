/**
 * Copyright (c) 2020 ZorrillosDev

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 *
 */

require("dotenv").config();

import express from 'express';
import cors from 'cors';

const MongoClient = require('mongodb').MongoClient;
const {ApolloServer} = require('apollo-server-express');
const {makeExecutableSchema} = require('graphql-tools');
const bodyParser = require('body-parser');
const MONGO_URL = process.env.MONGO_URL;


//Settings
import scheme from '../api/scheme'
import resolvers from '../api/resolvers'

(async () => {

    try {
        //Express
        const app = express();
        const port = 4000

        //Setting mongo
        let mongo = await MongoClient.connect(MONGO_URL);
        let db = mongo.db('crypto');

        const server = new ApolloServer({
            context: {mongo: db},
            playground: true,
            introspection: true,
            schema: makeExecutableSchema({
                typeDefs: scheme,
                resolvers: resolvers
            }),
        });

        // Middleware..
        server.applyMiddleware({
            app: app, path: '/'
        });

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.raw());
        app.get('/health', (req, res) => res.send('OK'));

        // Express server
        const eServer = app.listen(
            port, (err) => {
                if (err) {
                    console.error(err);
                    process.exit(1)
                }

                // Running OK!
                console.log('Running a GraphQL API server at :4000/graphql')
            }
        );

        process.on('SIGTERM', () => {
            eServer.close((err) => {
                console.error(err);
                process.exit(1)
            });

            process.exit(0)
        })

    } catch (err) {
        console.log(err);
    }

})();

