import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from 'lib/backend/prisma_client'

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: '123',
    session: {
        strategy: 'jwt'
    },
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            async authorize({ username, password }, req) {
                let user
                try {
                    user = await prisma.user.findUnique({
                        where: {
                            displayName: username
                        },
                        select: {
                            id: true,
                            displayName: true,
                        }
                    })
                } catch (e) {
                    console.error(e)
                }

                return {
                    id: user.id,
                    displayName: user.displayName || user.username,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile, user }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            console.log({token, account, profile, user})
            if(user) {
                token.user = user
            }
            return token
        },
        session: async ({session, token}) => {
            if (token) {
                session.user = token.user
            }
            try {
                let foundUser = await prisma.user.findUnique({
                    where: {
                        id: session.user.id
                    }
                })
                delete foundUser.password
                session.user = foundUser
            } catch (e) {
                console.error(e)
            }
            return session
        }
    }
})
