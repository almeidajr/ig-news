import Image from 'next/image'
import Link from 'next/link'
import { ActiveLink } from '../ActiveLink/ActiveLink'
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
          <ActiveLink href="/" activeClass={styles.active}>
            Home
          </ActiveLink>
          <ActiveLink href="/posts" activeClass={styles.active}>
            Posts
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
