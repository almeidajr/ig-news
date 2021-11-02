import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { RichText, RichTextBlock } from 'prismic-reactjs'
import { queryPosts } from '../../services/prismic'
import styles from '../../styles/Posts.module.scss'

type Post = {
  slug: string
  title: string
  excerpt: string
  createdAt: string
}

type ResultData = {
  title: RichTextBlock[]
  content: RichTextBlock[]
}

type PostsProps = {
  posts: Post[]
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const { results } = await queryPosts()

  const posts: Post[] = results.map((post) => {
    const data: ResultData = post.data

    return {
      slug: post.uid!,
      title: RichText.asText(data.title),
      excerpt:
        data.content.find((block) => block.type === 'paragraph')?.text ?? '',
      createdAt: new Date(post.first_publication_date!).toLocaleDateString(
        'en-US',
        { day: '2-digit', month: 'long', year: 'numeric' },
      ),
    }
  })

  return {
    props: { posts },
    redirect: 60 * 60, // 1h
  }
}

const Posts: NextPage<PostsProps> = ({ posts }) => (
  <main className={styles.container}>
    <Head>
      <title>Posts | ig.news</title>
    </Head>

    <div className={styles.posts}>
      {posts.map((post) => (
        <Link key={post.slug} href={`/posts/${post.slug}`}>
          <a>
            <time>{post.createdAt}</time>
            <strong>{post.title}</strong>
            <p>{post.excerpt}</p>
          </a>
        </Link>
      ))}
    </div>
  </main>
)

export default Posts
