import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

type ActiveLinkProps = {
  activeClass: string
  href: string
  children: ReactNode
}

export const ActiveLink = ({
  activeClass,
  href,
  children,
}: ActiveLinkProps) => {
  const { asPath } = useRouter()

  const className =
    asPath.includes(href) && (href !== '/' || asPath === href)
      ? activeClass
      : ''

  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  )
}
