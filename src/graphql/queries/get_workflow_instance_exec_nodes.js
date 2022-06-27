import gql from 'graphql-tag'
export const GetWfExecNodes = gql`
  mutation execNodes($formInfoId: String!, $userId: String!) {
  call_kw(arg: {method: "get_wf_exec_nodes", model: "workflow_info_instance", args: [$formInfoId, $userId]}) {
    result
  }
}
`
export const GetWfNodeByPk = gql`
query node($id: bigint!) {
  node: yws_workflow_info_nodes_by_pk(id: $id) {
    id
    name
    node_type
    audit_type
    audit_mode
    prior
    sort_by
    workflow_info_node_roles {
      id
      role_oa {
        id
        name
        role_oa_users {
          user {
            id
            username
          }
        }
      }
    }
    workflow_info_node_users {
      id
      user {
        id
        username
      }
    }
  }
}
`
