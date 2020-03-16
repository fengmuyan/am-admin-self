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
export function handleMessageEdit(data = {}) {
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

//消息icon列表
export function getMessageIconList(data = {}) {
  return request({
    url: '/patronus/pushmessage/iconList',
    method: 'post',
    data
  })
}

//消息icon 新增修改
export function handleMessageIconEdit(data = {}) {
  return request({
    url: '/patronus/pushmessage/saveIcon',
    method: 'post',
    data
  })
}

//消息icon删除
export function handleMessageIconDel(data = {}) {
  return request({
    url: '/patronus/pushmessage/delIcon',
    method: 'post',
    data
  })
}

//图标列表(新增消息时)
export function getMessageIconAddList(data) {
  return request({
    url: '/patronus/pushmessage/allIconList',
    method: 'post',
    data
  })
}
