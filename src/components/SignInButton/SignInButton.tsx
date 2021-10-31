import { useState } from 'react'
import { AiFillGithub, AiOutlineClose } from 'react-icons/ai'
import styles from './SignInButton.module.scss'

export const SignInButton = () => {
  const [isLogged] = useState(false)

  if (!isLogged) {
    return (
      <button className={styles.root}>
        <AiFillGithub className={styles.unauthenticatedIcon} />
        Sign in with GitHub
      </button>
    )
  }

  return (
    <button className={styles.root}>
      <AiFillGithub className={styles.authenticatedIcon} />
      Default
      <AiOutlineClose className={styles.closeIcon} />
    </button>
  )
}
