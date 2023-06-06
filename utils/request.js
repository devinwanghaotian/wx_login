const BASE_URL = 'http://127.0.0.1:8080'
/**
 * 使用 Promise 对 wx.request 进行封装
 */
function getRequest(params = {
    url
}) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: BASE_URL + params.url,
            method: 'GET',
            header: {
                'token': wx.getStorageSync('token') || ''
            },
            timeout: 5000,
            success(res) {
                if (res.statusCode == 200) {
                    if (res.data.code == 20001) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "error",
                        duration: 800
                    })
                    reject();
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

function postRequest(params = {
    url,
    data
}) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: BASE_URL + params.url,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token') || ''
            },
            data: params.data,
            timeout: 5000,
            success(res) {
                if (res.statusCode == 200) {
                    if (res.data.code == 20001) {
                        resolve(res.data);
                    }  else if (res.data.code == 30003) {
                        wx.switchTab({
                            url: '/pages/me/me'
                        })
                    } else {
                        reject(res.data);
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "error",
                        duration: 800
                    })
                    reject();
                }
            },
            fail(err) {
                reject(err)
            }
        })
    })
}
module.exports = {
    getRequest: getRequest,
    postRequest: postRequest
}