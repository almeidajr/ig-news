import Stripe from 'stripe'
import info from '../../package.json'

if (process.env.STRIPE_SECRET_KEY === undefined) {
  throw new Error('Stripe API key is not defined')
}
if (process.env.STRIPE_PRICE_KEY === undefined) {
  throw new Error('Stripe price key is not defined')
}
if (process.env.STRIPE_ENDPOINT_SECRET === undefined) {
  throw new Error('Stripe endpoint secrete is not defined')
}

const apiKey = process.env.STRIPE_SECRET_KEY
export const priceKey = process.env.STRIPE_PRICE_KEY
export const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

export const stripe = new Stripe(apiKey, {
  apiVersion: '2020-08-27',
  appInfo: { name: 'ig.news', version: info.version },
})
