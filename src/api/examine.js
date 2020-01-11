import request from '@/utils/request'

//用户审核列表
export function getExamineList(data = {}) {
  return request({
    url: '/patronus/userExamine/list',
    method: 'post',
    data
  })
}

//用户审核操作
export function userExamine(data = {}) {
  return request({
    url: '/patronus/userExamine/examine',
    method: 'post',
    data
  })
}

//用户详情数据
export function userExamineDetail(data = {}) {
  return request({
    url: '/patronus/userExamine/detail',
    method: 'post',
    data
  })
}