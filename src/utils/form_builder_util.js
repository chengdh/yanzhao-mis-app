//处理form_builder数据的一些工具类
export function formJsonFormat(jsonString, fieldNames = []) {
  jsonString = jsonString.replace(/\n/g, '\\n')
  jsonString = jsonString.replace(/\r/g, '\\r')
  const jsonArray = JSON.parse(jsonString)
  const ret = []
  for (const field of Object.entries(jsonArray)) {
    if (fieldNames.includes(field.name)) ret.push(field)
  }
  return ret
}

//从formJson中提取前三个字段用于显示
export function formJsonFieldsFormat(jsonString, fieldCount = 3) {
  jsonString = jsonString.replace(/\n/g, '\\n')
  jsonString = jsonString.replace(/\r/g, '\\r')
  const jsonArray = JSON.parse(jsonString)
  const ret = []
  for (let i = 0; i < fieldCount; i++) {
    const input = jsonArray[i]
    if (input.label && input.userData) {
      const label = jsonArray[i].label
      const val = jsonArray[i].userData[0]
      ret.push({ label, val })
    }
  }
  return ret
}

export function replaceJsonControlChar(jsonString) {
  let ret = jsonString.replace(/\n/g, '\\n')
  ret = ret.replace(/\r/g, '\\r')
  return ret
}
