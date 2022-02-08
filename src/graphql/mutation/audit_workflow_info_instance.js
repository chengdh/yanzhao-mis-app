import gql from 'graphql-tag'
export const AuditWorkflowInfoNodeInstanceOperate = gql`
  mutation auditWorkflowInfoNodeInstanceOperate($id: Int! , $note: String) {
    call_kw(arg: { method: "audit", model: "workflow_info_node_instance_operate", id: $id, args: [$note] }) {
      result
    }
  }
`

export const RejectWorkflowInfoNodeInstanceOperate = gql`
  mutation RejectWorkflowInfoNodeInstanceOperate($id: Int! , $note: String) {
    call_kw(arg: { method: "reject", model: "workflow_info_node_instance_operate", id: $id, args: [$note] }) {
      result
    }
  }
`
