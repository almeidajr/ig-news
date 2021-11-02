import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { RichText, RichTextBlock } from 'prismic-reactjs'
import { getPostByUID } from '../../services/prismic'
import styles from '../../styles/Post.module.scss'

type PostData = {
  slug: string
  title: string
  content: RichTextBlock[]
  createdAt: string
}

type PostProps = {
  post: PostData
}

type ResultData = {
  title: RichTextBlock[]
  content: RichTextBlock[]
}

export const getServerSideProps: GetServerSideProps<PostProps> = async ({
  req,
  query,
}) => {
  const session = await getSession({ req })
  const slug = String(query.slug)

  if (!session?.isSubscribed) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const response = await getPostByUID(slug, req)
  const data: ResultData = response.data

  const post: PostData = {
    slug: slug,
    title: RichText.asText(data.title),
    content: data.content,
    createdAt: new Date(response.first_publication_date!).toLocaleDateString(
      'en-US',
      { day: '2-digit', month: 'long', year: 'numeric' },
    ),
  }

  return {
    props: { post },
  }
}

const Post: NextPage<PostProps> = ({ post }) => (
  <main className={styles.container}>
    <Head>
      <title>{post.title} | ig.news</title>
    </Head>
    <article className={styles.post}>
      <h1>{post.title}</h1>
      <time>{post.createdAt}</time>
      <div className={styles.content}>{RichText.render(post.content)}</div>
    </article>
  </main>
)

export default Post
