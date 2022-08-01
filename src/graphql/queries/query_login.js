import gql from 'graphql-tag'
export const login_partner = gql`
  query login_partner($mobile: String!) {
    users: for_test_code_partner(where: {mobile: {_eq: $mobile}}) {
    id
    mobile
    name
    email
  }
}
`

export const login_developer = gql`
  query login_developer($mobile: String!) {
    users: for_test_code_developer(where: {mobile: {_eq: $mobile}}) {
    id
    mobile
    name
    email
  }
}
`
