import gql from 'graphql-tag'
export const query_schedule_for_partner = gql`query query_schedule_for_partner($partner_id: bigint!) {
    for_test_code_schedule(where: { partner_id: { _eq: $partner_id } }) {
        id
        note
        partner_id
        schedule_date
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
