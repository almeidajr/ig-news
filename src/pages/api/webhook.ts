import type { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import Stripe from 'stripe'
import { manageSubscription } from '../../services/manageSubscription'
import { endpointSecret, stripe } from '../../services/stripe'

type Data = {
  received: boolean
}

const buffer = async (readable: Readable) => {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const sig = req.headers['stripe-signature']
  if (!sig) {
    res.status(400).end('Bad Request')
    return
  }

  const buf = await buffer(req)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch {
    res.status(400).end('Webhook error')
    return
  }

  switch (event.type) {
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      await manageSubscription({
        subscriptionId: subscription.id,
        customerId: subscription.customer.toString(),
      })
      break

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      if (!session.subscription || !session.customer) {
        res.status(400).end('Session subscription/customer is missing')
        return
      }
      await manageSubscription({
        subscriptionId: session.subscription.toString(),
        customerId: session.customer.toString(),
        createAction: true,
      })
      break
  }

  res.status(200).json({ received: true })
}

export default handler
