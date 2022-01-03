import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { baseApi } from '@/config'
const httpLink = createHttpLink({
  uri: baseApi
})

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem('JWT_TOKEN')
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  } else {
    return {
      headers: {
        ...headers
      }
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

export default client
