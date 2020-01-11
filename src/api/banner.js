import request from '@/utils/request'

// 获取banner列表信息
export function getBannerList(data) {
  return request({
    url: '/patronus/advertList',
    method: 'post',
    data
  })
}

// 删除banner信息
export function delBanner(data) {
  return request({
    url: '/patronus/delAdvert',
    method: 'post',
    data
  })
}

// 新增banner
export function saveAdvert(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/patronus/saveAdvert ',
    method: 'post',
    data
  })
}