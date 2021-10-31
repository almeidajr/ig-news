import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { SubscribeButton } from '../components/SubscribeButton'
import { priceKey, stripe } from '../services/stripe'
import styles from '../styles/Home.module.scss'

type HomeProps = {
  productPrice: string
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(priceKey)

  const productPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price.unit_amount! / 100)

  return {
    props: {
      productPrice,
    },
    revalidate: 24 * 3600, // 24h
  }
}

const Home: NextPage<HomeProps> = ({ productPrice }) => (
  <main className={styles.container}>
    <Head>
      <title>Home | ig.news</title>
    </Head>

    <section className={styles.hero}>
      <span>👏 Hey, welcome!</span>
      <h1>
        News about the <span>React</span> world.
      </h1>
      <p>
        Get access to all the publications <br />
        <span>for {productPrice} month</span>
      </p>

      <SubscribeButton />
    </section>

    <div className={styles.avatar}>
      <Image src="/images/avatar.svg" alt="Girl at coding" layout="fill" />
    </div>
  </main>
)

export default Home
