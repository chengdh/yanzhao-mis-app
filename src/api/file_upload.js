// axios
import request from '@/utils/request'

//文件上传
export function uploadFiles(attachable_id, attacheable_type, files) {
  var formData = new FormData()
  formData.append('file_upload[attachable_id]', attachable_id)
  formData.append('file_upload[attachable_type]', attacheable_type)
  for (const f of files) {
    formData.append('file_upload[photo][]', f)
  }
  return request.post('file_uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

//获取上传文件
export function getUploadFiles(attachable_id, attacheable_type) {
  return request.get('file_uploads', {
    params: {
      search: { attachable_id_eq: attachable_id, attacheable_type_eq: attacheable_type }
    }
  })
}
