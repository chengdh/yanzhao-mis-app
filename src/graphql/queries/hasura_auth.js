import gql from 'graphql-tag'
export default gql`
  query hasuraAuth($username: String!, $cleartext_password: String!) {
    hasura_auth(args: { username: $username, cleartext_password: $cleartext_password }) {
      id 
      username
      jwt_token
    }
  }
`