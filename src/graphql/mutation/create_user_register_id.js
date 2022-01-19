import gql from 'graphql-tag'
export const UpdateUserRegisterId = gql`
  mutation UpdateRegisterId($user_id: Int!, $register_id: String!) {
    update_yws_user_register_ids(where: { user_id: { _eq: $user_id } }, _set: { register_id: $register_id }) {
      affected_rows
      returning {
        id
        register_id
        user_id
      }
    }
  }
`
export const InsertUserRegisterId = gql`
  mutation InsertRegisterId($user_id: Int!, $register_id: String!) {
    insert_yws_user_register_ids(objects: { user_id: $user_id, register_id: $register_id }) {
      returning {
        id
        user {
          id
          username
        }
        register_id
      }
    }
  }
`
