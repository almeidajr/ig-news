import Image from 'next/image'
import Link from 'next/link'
import { SignInButton } from '../SignInButton'
import styles from './Header.module.scss'

export const Header = () => {
  return (
    <header className={styles.root}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <Image
              src="/images/logo.svg"
              alt="ig.news logo"
              width={110}
              height={31}
            />
          </a>
        </Link>
        <nav>
          <Link href="/">
            <a className={styles.active}>Home</a>
          </Link>
          <Link href="/">
            <a>Posts</a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
