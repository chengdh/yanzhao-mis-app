import gql from 'graphql-tag'
export default gql`
  query OrgsQuery {
    orgs: yws_orgs(where: { is_active: { _eq: true }, type: { _eq: "Department" } }, order_by: { order_by: asc }) {
      id
      text: name
      children: users(where: { is_active: { _eq: true } }) {
        id
        text: username
        is_admin
      }
      users_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`
export const getUserHeader = gql`
  query getUserHeader($id: bigint!) {
    userHeader: yws_users_by_pk(id: $id) {
      id
      username
      org {
        name
        id
        header {
          id
          username
        }
      }
    }
  }
`
