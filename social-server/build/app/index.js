"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = initServer;
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express5_1 = require("@as-integrations/express5");
const user_1 = require("./user");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jwt_1 = __importDefault(require("../services/jwt"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        app.use((0, cors_1.default)({
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
        }));
        const graphqlServer = new server_1.ApolloServer({
            typeDefs: `
        ${user_1.User.types}
            type Query {
                ${user_1.User.queries}
            }
            `,
            resolvers: {
                Query: Object.assign({}, user_1.User.resolver.queries)
            },
        });
        yield graphqlServer.start();
        app.use('/graphql', (0, express5_1.expressMiddleware)(graphqlServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                const auth = req.headers.authorization;
                let user;
                if (auth && auth.startsWith('Bearer ')) {
                    try {
                        user = jwt_1.default.decodeToken(auth.slice(7));
                    }
                    catch (_b) {
                        user = undefined;
                    }
                }
                return { user };
            })
        }));
        return app;
    });
}
// simmilar to app structure - app.js or index.js
