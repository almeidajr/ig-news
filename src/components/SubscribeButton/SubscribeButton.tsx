import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripe } from '../../services/getStripe'
import styles from './SubscribeButton.module.scss'

type SubscribeResponseData = {
  sessionId: string
}

export const SubscribeButton = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleClick = async () => {
    if (status !== 'authenticated') {
      await signIn('github')
      return
    }

    if (session?.isSubscribed) {
      router.push('/posts')
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
