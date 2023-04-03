/**
 * 复制文本
 * @param {*} text 要复制的内容
 * @param {*} callback 成功后的回调
 */
export const copyText = (text, callback) => {
  const tag = document.createElement('input')
  tag.setAttribute('id', 'cp_hgz_input')
  tag.value = text
  document.getElementsByTagName('body')[0].appendChild(tag)
  document.getElementById('cp_hgz_input').select()
  document.execCommand('copy')
  document.getElementById('cp_hgz_input').remove()
  if (callback) {
    callback()
  }
}
