import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import {User} from './user';
import cors from 'cors';
import bodyParser from 'body-parser';
import JWTService from '../services/jwt';

export async function initServer(){
    const app=express();
    app.use(bodyParser.json());
    app.use(cors(
        {
            origin:['http://localhost:3000','http://127.0.0.1:3000'],
            credentials:true,
        }
    ));
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
    app.use('/graphql',expressMiddleware(graphqlServer,{
        context:async({req,res})=>{
            const auth = req.headers.authorization;
            let user: ReturnType<typeof JWTService.decodeToken> | undefined;
            if (auth && auth.startsWith('Bearer ')) {
                try {
                    user = JWTService.decodeToken(auth.slice(7));
                } catch {
                    user = undefined;
                }
            }
            return { user };
        }
    }));
    return app;

}


// simmilar to app structure - app.js or index.js