import request from '@/utils/request'

// 获取订单列表信息
export function getOrderList(data) {
  return request({
    url: '/patronus/order/list',
    method: 'post',
    data
  })
}

// 获取详情
export function getOrderDetail(data) {
  return request({
    url: '/patronus/order/detail',
    method: 'post',
    data
  })
}

//订单列表导出数据
export function orderExport(data) {
  return request({
    url: '/god/order/export',
    method: 'post',
    data
  })
}
