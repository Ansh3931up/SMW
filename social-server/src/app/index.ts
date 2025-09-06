import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import {User} from './user';
import cors from 'cors';
import bodyParser from 'body-parser';

export async function initServer(){
    const app=express();
    app.use(bodyParser.json());
    app.use(cors());
    const graphqlServer=new ApolloServer({
        typeDefs:`
        ${User.types}
            type Query {
                ${User.queries}
            }
            `,
        resolvers:{
            Query:{
                ...User.resolver.queries,
            }
        },
    });
    await graphqlServer.start();
    app.use('/graphql',expressMiddleware(graphqlServer));
    return app;

}


// simmilar to app structure - app.js or index.js