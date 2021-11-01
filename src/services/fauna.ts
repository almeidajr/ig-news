import { Client } from 'faunadb'

const secret = process.env.FAUNA_SECRET
const domain = process.env.FAUNA_DOMAIN

if (secret === undefined) {
  throw new Error('FAUNA_SECRET is not set')
}
if (domain === undefined) {
  throw new Error('FAUNA_DOMAIN is not set')
}

export const fauna = new Client({ secret, domain })
