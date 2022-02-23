//处理form_builder数据的一些工具类
export function formJsonFormat(jsonString, fieldNames = []) {
  let jsonArray = JSON.parse(jsonString)
  let ret = []
  for (let field of Object.entries(jsonArray)) {
    if (fieldNames.includes(field.name)) ret.push(field)
  }
  return ret
}

//从formJson中提取前三个字段用于显示
export function formJsonFieldsFormat(jsonString, fieldCount = 3) {
  let jsonArray = JSON.parse(jsonString)
  let ret = []
  for (let i = 0; i < fieldCount; i++) {
    let input = jsonArray[i]
    if (input.label && input.userData) {
      let label = jsonArray[i].label
      let val = jsonArray[i].userData[0]
      ret.push({ label, val })
    }
  }
  return ret
}
