import gql from 'graphql-tag'
export const query_schedule_for_developer = gql`
query query_schedule_for_developer($developer_id: bigint!) {
    for_test_code_scheduleline(where: {developer_id: {_eq: $developer_id}}) {
    id
    state
    from_time
    to_time
    developer_id
    for_test_code_schedule {
      schedule_date
      for_test_code_partner {
        id
        mobile
        name
        email
      }
    }
  }
}
`

