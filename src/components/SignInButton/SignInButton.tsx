import { signIn, signOut, useSession } from 'next-auth/react'
import { AiFillGithub, AiOutlineClose } from 'react-icons/ai'
import styles from './SignInButton.module.scss'

export const SignInButton = () => {
  const { data: session, status } = useSession()

  switch (status) {
    case 'authenticated':
      return (
        <button className={styles.root} onClick={() => signOut()}>
          <AiFillGithub className={styles.authenticatedIcon} />
          {session!.user?.name}
          <AiOutlineClose className={styles.closeIcon} />
        </button>
      )
    case 'loading':
      return (
        <button className={styles.root} disabled>
          <AiFillGithub />
          Loading auth data...
        </button>
      )
    case 'unauthenticated':
      return (
        <button className={styles.root} onClick={() => signIn('github')}>
          <AiFillGithub className={styles.unauthenticatedIcon} />
          Sign in with GitHub
        </button>
      )
  }
}
