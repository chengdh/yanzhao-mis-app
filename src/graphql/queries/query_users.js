import gql from 'graphql-tag'
export default gql`
  query QueryUsers($ids: [bigint!]) {
    users: yws_users(where: { is_active: { _eq: true }, id: { _in: $ids } }, order_by: { org_id: asc }) {
      id
      username
      is_admin
      org_id
    }
  }
`