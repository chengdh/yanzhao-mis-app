import gql from 'graphql-tag'
export const query_schedule_for_all_partner = gql`query query_schedule_for_all_partner {
    for_test_code_schedule {
        id
        note
        schedule_date
        for_test_code_partner {
            id
            name
            mobile
            email
        }
        for_test_code_schedulelines {
            developer_id
            for_test_code_developer {
                id
                mobile
                name
            }
            from_time
            id
            to_time
            state
        }
    }
}
`
