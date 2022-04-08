import gql from 'graphql-tag'
export default gql`
  query FormInfoByPkQuery($formInfoId: bigint!) {
    formInfo: yws_form_infos_by_pk(id: $formInfoId) {
      form_info_design {
        form_json
      }
      workflow_infos {
        id
        name
        note
        workflow_info_nodes(where: { node_type: { _nin: ["start", "end", "condition"] } }) {
          id
          name
          node_type
          audit_type
          audit_mode
          workflow_info_node_users {
            user {
              id
              username
              org_id
            }
          }
          workflow_info_node_roles {
            role_oa {
              role_oa_users {
                user {
                  id
                  username
                  org_id
                }
              }
            }
          }
        }
      }
      name
      note
    }
  }
`
