import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import db from "@/db/config";
import User from "@/db/models/User";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await db.connect();

            const existingUser = await User.findOne({ user_id: user.id })

            if (existingUser) {
                await User.updateOne(
                    { user_id: user.id },
                    {
                        $set: {
                            provider: account?.provider,
                            providerData: account
                        }
                    }
                )
                return true
            }

            const newUser = new User({
                user_id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account?.provider,
                providerData: account
            })

            try {
                await newUser.save()
            } catch (error) {
                console.log(error)
            }

            return true
        },
        async jwt({ token, account }: { token: any; account: any }) {
            return token;
        },
    },
}
