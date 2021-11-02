import { query } from 'faunadb'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    signIn: async ({ user }) => {
      const { email } = user

      const collection = query.Collection('users')
      const index = query.Index('user_by_email')

      if (!email) {
        return false
      }

      try {
        await fauna.query(
          query.If(
            query.Not(query.Exists(query.Match(index, query.Casefold(email)))),
            query.Create(collection, { data: { email } }),
            query.Get(query.Match(index, query.Casefold(email))),
          ),
        )
      } catch (err) {
        if (err instanceof Error) {
          console.error(`❌ Auth error ${err.message}`)
        }
        return false
      }

      return true
    },
    session: async ({ session }) => {
      const { user } = session
      if (!user) {
        return session
      }

      try {
        const subscription = await fauna.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                query.Select(
                  'ref',
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(user.email!),
                    ),
                  ),
                ),
              ),
              query.Match(query.Index('subscription_by_status'), 'active'),
            ]),
          ),
        )

        return { ...session, isSubscribed: !!subscription }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`❌ Check subscription error ${error.message}`)
        }
        return { ...session, isSubscribed: false }
      }
    },
  },
})
