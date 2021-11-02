import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RichText, RichTextBlock } from 'prismic-reactjs'
import { useEffect } from 'react'
import { getPostByUID } from '../../../services/prismic'
import styles from '../../../styles/Post.module.scss'

type PostData = {
  slug: string
  title: string
  content: RichTextBlock[]
  createdAt: string
}

type PostPreviewProps = {
  post: PostData
}

type ResultData = {
  title: RichTextBlock[]
  content: RichTextBlock[]
}

export const getStaticProps: GetStaticProps<PostPreviewProps> = async ({
  params,
}) => {
  const slug = String(params?.slug)

  const response = await getPostByUID(slug)
  const data: ResultData = response.data

  const post: PostData = {
    slug: slug,
    title: RichText.asText(data.title),
    content: data.content.splice(0, 3),
    createdAt: new Date(response.first_publication_date!).toLocaleDateString(
      'en-US',
      { day: '2-digit', month: 'long', year: 'numeric' },
    ),
  }

  return {
    props: { post },
    redirect: 60 * 60, // 1h
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const PostPreview: NextPage<PostPreviewProps> = ({ post }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.isSubscribed) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post, router, session, status])

  return (
    <main className={styles.container}>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <time>{post.createdAt}</time>
        <div className={`${styles.content} ${styles.preview}`}>
          {RichText.render(post.content)}
        </div>

        <div className={styles.continueReading}>
          Wanna continue reading?
          <Link href="/">
            <a>Subscribe now 🤗</a>
          </Link>
        </div>
      </article>
    </main>
  )
}

export default PostPreview
