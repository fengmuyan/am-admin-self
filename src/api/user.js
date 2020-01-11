import request from '@/utils/request'

// 新增用户
export function addUser(data) {
  return request({
    url: '/god/register/saveUser',
    method: 'post',
    data,
  })
}

// 获取用户列表
export function getUserList(data) {
  return request({
    url: '/god/register/userList',
    method: 'post',
    data,
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/god/register/saveRole',
    method: 'post',
    data,
  })
}

// 获取角色列表
export function getRoleList(data) {
  return request({
    url: '/god/register/roleList',
    method: 'post',
    data,
  })
}






