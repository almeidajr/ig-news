import { signIn, useSession } from 'next-auth/react'
import { api } from '../../services/api'
import { getStripe } from '../../services/getStripe'
import styles from './SubscribeButton.module.scss'

type SubscribeResponseData = {
  sessionId: string
}

export const SubscribeButton = () => {
  const { status } = useSession()

  const handleClick = async () => {
    if (status !== 'authenticated') {
      await signIn('github')
      return
    }

    const { data } = await api.post<SubscribeResponseData>('api/subscribe')

    const stripe = await getStripe()
    await stripe?.redirectToCheckout(data)
  }

  return (
    <button
      type="button"
      className={styles.root}
      disabled={status === 'loading'}
      onClick={handleClick}
    >
      Subscribe now
    </button>
  )
}
