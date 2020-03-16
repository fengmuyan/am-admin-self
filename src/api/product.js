import request from '@/utils/request'

//商品列表
export function getProList(data = {}) {
  return request({
    url: '/patronus/prduList',
    method: 'post',
    data
  })
}

//货主编辑
export function handelProEdit(data = {}) {
  return request({
    url: '/patronus/modifyCmdtSales',
    method: 'post',
    data
  })
}
