import gql from 'graphql-tag'
export const query_schedule_line_by_pk = gql`query query_schedule_line_by_pk($id: bigint!) {
    schedule_line: for_test_code_scheduleline_by_pk(id: $id) {
        id
        from_time
        state
        to_time
    for_test_code_developer {
            id
            mobile
            name
        }
    for_test_code_schedule {
            id
            partner_id
            schedule_date
      for_test_code_partner {
                id
                email
                name
                mobile
            }
        }
    }
}
`

