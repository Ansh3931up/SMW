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
exports.resolver = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../../client/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        var _b;
        const googletoken = token;
        const googleOauthURL = new URL(`https://oauth2.googleapis.com/tokeninfo`);
        googleOauthURL.searchParams.set('id_token', googletoken);
        const { data } = yield axios_1.default.get(googleOauthURL.toString(), {
            responseType: 'json'
        });
        if (!data.email || !data.given_name || !data.family_name) {
            throw new Error("Invalid Google token: missing required claims");
        }
        const email = data.email;
        const firstName = data.given_name;
        const lastName = data.family_name;
        const profileImageUrl = (_b = data.picture) !== null && _b !== void 0 ? _b : null;
        const user = yield db_1.prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            yield db_1.prismaClient.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    profileImageUrl,
                },
            });
        }
        const userInDb = yield db_1.prismaClient.user.findUnique({ where: { email } });
        if (!userInDb)
            throw new Error("user with this email not found");
        const GenToken = jwt_1.default.generateTokenForUser(userInDb);
        console.log(GenToken);
        return GenToken;
    })
};
exports.resolver = { queries };
// similar to the controllers
// logic impleemnt ation with the same name 
