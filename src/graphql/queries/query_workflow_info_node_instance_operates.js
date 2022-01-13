import gql from 'graphql-tag'
//待处理 $state='draft'
//已处理 $state='done'
export const QuerMyOperates = gql`
  query myOperates($user_id: bigint!, $states: [String!], $offset: Int! = 0, $limit: Int! = 15) {
    myOperates: yws_workflow_info_node_instance_operates(
      where: {
        state: { _in: $states }
        user_id: { _eq: $user_id }
        workflow_info_node_instance: { workflow_info_node: { node_type: { _nin: ["start", "end", "condition"] } } }
      }
      offset: $offset
      limit: $limit
    ) {
      audit_date
      audit_note
      created_at
      form_data_json
      id
      state
      user_id
      workflow_info_node_instance {
        name
        workflow_info_node {
          id
          name
          node_type
          audit_type
          audit_mode
        }
        workflow_info_instance {
          id
          name
          start_datetime
          state
          form_data_json
          note
          starter {
            id
            username
          }
          workflow_info {
            id
            name
          }
        }
      }
    }
  }
`
//我发起的
export const QuerMySubmitted = gql`
  query MySubmitted($starter_id: bigint!, $states: [String!], $offset: Int! = 0, $limit: Int! = 15) {
    mySubmitted: yws_workflow_info_instances(
      where: { state: { _in: $states }, starter_id: { _eq: $starter_id } }
      offset: $offset
      limit: $limit
    ) {
      id
      name
      start_datetime
      state
      form_data_json
      starter {
        id
        username
      }
      workflow_info {
        id
        name
      }
    }
  }
`
//我收到的-指的是抄送给我的
//TODO
export const QuerMyReceived = gql`
  query myReceived($user_id: bigint!, $state: String!) {
    myReceived: yws_workflow_info_node_instance_operates(
      where: { state: { _eq: $state }, user_id: { _eq: $user_id } }
    ) {
      audit_date
      audit_note
      created_at
      form_data_json
      id
      state
      user_id
      workflow_info_node_instance {
        name
        workflow_info_instance {
          name
          starter_id
          start_datetime
          starter {
            username
          }
        }
      }
    }
  }
`
