import connectDB from "@/lib/connectDB.ts";
import userModel from "@/model/User.model.ts";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await connectDB()
                try {
                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},
                            {username: credentials.identifier.username}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with given ceredentials")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account to login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user  // ! This is the end-goal, To return the user
                    }
                    else{
                        throw new Error("Incorrect Password")
                    }
                }
                catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        // ! Modified to get data access within jwt & session, reducing/avoiding DB call
        async jwt({ token, user }){   // ! user from above
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            return token
        },
        async session({ session, token }){
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}