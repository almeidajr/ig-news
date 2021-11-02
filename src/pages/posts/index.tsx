import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Posts.module.scss'

const Posts: NextPage = () => (
  <main className={styles.container}>
    <Head>
      <title>Posts | ig.news</title>
    </Head>

    <div className={styles.posts}>
      <Link href="/">
        <a>
          <time>November 14</time>
          <strong>
            Texto texto texto texto texto texto texto texto texto texto texto
          </strong>
          <p>
            Conteudo conteudo conteudo conteudo conteudo conteudo conteudo
            conteudo conteudo conteudo conteudo conteudo conteudo
          </p>
        </a>
      </Link>
      <Link href="/">
        <a>
          <time>November 14</time>
          <strong>
            Texto texto texto texto texto texto texto texto texto texto texto
          </strong>
          <p>
            Conteudo conteudo conteudo conteudo conteudo conteudo conteudo
            conteudo conteudo conteudo conteudo conteudo conteudo
          </p>
        </a>
      </Link>
      <Link href="/">
        <a>
          <time>November 14</time>
          <strong>
            Texto texto texto texto texto texto texto texto texto texto texto
          </strong>
          <p>
            Conteudo conteudo conteudo conteudo conteudo conteudo conteudo
            conteudo conteudo conteudo conteudo conteudo conteudo
          </p>
        </a>
      </Link>
      <Link href="/">
        <a>
          <time>November 14</time>
          <strong>
            Texto texto texto texto texto texto texto texto texto texto texto
          </strong>
          <p>
            Conteudo conteudo conteudo conteudo conteudo conteudo conteudo
            conteudo conteudo conteudo conteudo conteudo conteudo
          </p>
        </a>
      </Link>
      <Link href="/">
        <a>
          <time>November 14</time>
          <strong>
            Texto texto texto texto texto texto texto texto texto texto texto
          </strong>
          <p>
            Conteudo conteudo conteudo conteudo conteudo conteudo conteudo
            conteudo conteudo conteudo conteudo conteudo conteudo
          </p>
        </a>
      </Link>
    </div>
  </main>
)

export default Posts
