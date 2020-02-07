import request from '@/utils/request'

//消息列表
export function getMessageList(data = {}) {
  return request({
    url: '/patronus/pushmessage/list',
    method: 'post',
    data
  })
}

//消息推送详情
export function getMessageDetail(data = {}) {
  return request({
    url: '/patronus/pushmessage/detailsList',
    method: 'post',
    data
  })
}

//消息新增修改
export function handleMessageEdit(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/patronus/pushmessage/savePushmessage',
    method: 'post',
    data
  })
}

//消息删除
export function handleMessageDel(data = {}) {
  return request({
    url: '/patronus/pushmessage/delPushmessage',
    method: 'post',
    data
  })
}

//消息推送
export function handleMessagePush(data = {}) {
  return request({
    url: '/patronus/pushmessage/push',
    method: 'post',
    data
  })
}