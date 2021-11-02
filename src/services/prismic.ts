import Prismic from '@prismicio/client'

const url = process.env.PRISMIC_API_ENDPOINT
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

if (!url) {
  throw new Error('PRISMIC_API_ENDPOINT is not defined')
}
if (!accessToken) {
  throw new Error('PRISMIC_ACCESS_TOKEN is not defined')
}

export const prismicClient = (req: unknown = null) =>
  Prismic.client(url, { accessToken, req })

export const queryPosts = async () => {
  const client = prismicClient()

  const posts = await client.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 25,
    },
  )

  return posts
}

export const getPostByUID = async (uid: string, req: unknown = null) => {
  const client = prismicClient()

  const post = await client.getByUID('post', uid, {})

  return post
}
