import { query } from 'faunadb'
import { fauna } from './fauna'
import { stripe } from './stripe'

type Config = {
  subscriptionId: string
  customerId: string
  createAction?: boolean
}

export const manageSubscription = async ({
  subscriptionId,
  customerId,
  createAction = false,
}: Config) => {
  const faunaUserRef = await fauna.query(
    query.Select(
      'ref',
      query.Get(
        query.Match(query.Index('user_by_stripe_customer_id'), customerId),
      ),
    ),
  )

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId)
  const faunaSubscription = {
    id: stripeSubscription.id,
    user_ref: faunaUserRef,
    status: stripeSubscription.status,
    price_id: stripeSubscription.items.data[0].price.id,
  }

  if (createAction) {
    await fauna.query(
      query.Create(query.Collection('subscriptions'), {
        data: faunaSubscription,
      }),
    )
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          'ref',
          query.Get(
            query.Match(query.Index('subscription_by_id'), subscriptionId),
          ),
        ),
        { data: faunaSubscription },
      ),
    )
  }
}
