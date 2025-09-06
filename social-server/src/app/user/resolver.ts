import axios from 'axios';
import { prismaClient } from '../../client/db';
import JWTService from '../../services/jwt';
import { GraphqlContext } from 'src/interface';

interface GoogleTokenResult{
    iss: string;
    azp?: string;
    aud: string;
    sub: string;
    email?: string;
    email_verified?: 'true' | 'false' | boolean;
    at_hash?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    iat: string; // seconds since epoch (string)
    exp: string; // seconds since epoch (string)
    hd?: string;  // hosted domain (Google Workspace)
}

const queries={
    verifyGoogleToken:async(parent:any,{token}:{token:string})=>{
        const googletoken=token;
        const googleOauthURL=new URL(`https://oauth2.googleapis.com/tokeninfo`)
        googleOauthURL.searchParams.set('id_token',googletoken);

        const {data}=await axios.get<GoogleTokenResult>(googleOauthURL.toString(),{
            responseType:'json'
        })
        console.log(data);

        if(!data.email || !data.given_name || !data.family_name){
            throw new Error("Invalid Google token: missing required claims");
        }
        const email = data.email!;
        const firstName = data.given_name!;
        const lastName = data.family_name!;
        const profileImageUrl = data.picture;

        const user=await prismaClient.user.findUnique({
            where:{email},
        })
        if(!user){
            await prismaClient.user.create({
                data:{
                    email,
                    firstName,
                    lastName,
                    profileImageUrl,
                },
            })
        }
        const userInDb=await prismaClient.user.findUnique({where:{email}});
        if(!userInDb)throw new Error("user with this email not found");
        const GenToken=JWTService.generateTokenForUser(userInDb);

        console.log(GenToken);
        return GenToken;


    },

    getCurrentUser:async(parent:any, args:any,ctx:GraphqlContext)=>{
        const id=ctx.user?.id;
        if(!id) return null;
        const user=await prismaClient.user.findUnique({where:{id}});
        if(!user) return null;
        return user;
        
    },
};

export const resolver={queries};


// similar to the controllers


// logic impleemnt ation with the same name 