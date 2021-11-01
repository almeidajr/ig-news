import { loadStripe } from '@stripe/stripe-js'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY

if (publishableKey === undefined) {
  throw new Error('Stripe public key is not defined')
}

export const getStripe = async () => await loadStripe(publishableKey)
