import gql from 'graphql-tag'
export default gql`
  mutation CreateWorkflowInfoInstance($object: yws_workflow_info_instances_insert_input = {}) {
    insert_yws_workflow_info_instances_one(object: $object) {
      id
      name
      note
      workflow_info_instance_users {
        id
        workflow_info_node_id
        workflow_info_instance_user_lines {
          id
          user {
            id
            username
          }
        }
      }
    }
  }
`
