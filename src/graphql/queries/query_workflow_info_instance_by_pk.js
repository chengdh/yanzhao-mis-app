import gql from 'graphql-tag'
export const QueryWorkflowInfoInstanceByPk = gql`
  query QueryWorkflowInfoInstanceByPk($id: bigint!) {
    workflowInfoInstance: yws_workflow_info_instances_by_pk(id: $id) {
      created_at
      start_datetime
      end_datetime
      form_data_json
      id
      name
      note
      state
      starter {
        id
        username
      }
      workflow_info_instance_nodes {
        id
        name
        workflow_info_node_instance_operates {
          audit_date
          audit_note
          id
          form_data_json
          state
          user {
            id
            username
          }
        }
      }
    }
  }
  `