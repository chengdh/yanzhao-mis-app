import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { baseApi } from '@/config'
import Router from '@/router'
import router from './router'
const httpLink = createHttpLink({
  uri: baseApi
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case 'UNAUTHENTICATED':
        // Modify the operation context with a new token
        // const oldHeaders = operation.getContext().headers;
        // operation.setContext({
        //   headers: {
        //     ...oldHeaders,
        //     authorization: getNewToken(),
        //   },
        // });
        // Retry the request, returning the new observable
        //无效jwt
        case 'invalid-jwt':
          localStorage.removeItem('JWT_TOKEN')
          router.push({ name: 'Login' })
        // return forward(operation)
      }
    }
  }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
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
  link: errorLink.concat(from([authLink, httpLink])),
  cache: new InMemoryCache()
})

export default client
