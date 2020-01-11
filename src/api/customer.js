import request from '@/utils/request'

// 客服列表
export function getCustomerList() {
  return request({
    url: '/patronus/neatim/customer',
    method: 'get'
  })
}