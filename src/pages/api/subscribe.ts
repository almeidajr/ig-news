import { query } from 'faunadb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { priceKey, stripe } from '../../services/stripe'

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

type Data = {
  sessionId: string
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (appUrl === undefined) {
  throw new Error('Missing NEXT_PUBLIC_APP_URL')
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    const session = await getSession({ req })

    if (!session?.user?.email) {
      res.status(401).end('Unauthorized')
      return
    }

    const collection = query.Collection('users')
    const index = query.Index('user_by_email')

    const faunaUser = await fauna.query<User>(
      query.Get(query.Match(index, query.Casefold(session.user.email))),
    )

    let stripeCustomerId = faunaUser.data.stripe_customer_id
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
      })
      stripeCustomerId = customer.id
      await fauna.query(
        query.Update(query.Ref(collection, faunaUser.ref.id), {
          data: {
            stripe_customer_id: stripeCustomerId,
          },
        }),
      )
    }

    const stripeCheckout = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [{ price: priceKey, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${appUrl}/posts`,
      cancel_url: appUrl,
    })

    res.status(200).json({ sessionId: stripeCheckout.id })
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Subscribe error ${err.message}`)
    }
    res.status(500).end('Internal Server Error')
  }
}

export default handler
