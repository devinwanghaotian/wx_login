const app = getApp();
const req = require('../../api/login.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        nickName: "请点击头像登录一下吧",
        avatarUrl: "https://devin-edu.oss-cn-zhangjiakou.aliyuncs.com/spaceman.png"
    },
    // 登录
    async login() {
        if (!this.data.show) {
            const userInfo = await app.login();
            app.globalData.userInfo = userInfo;
            console.log(app.globalData.userInfo);
            this.setData({
                show: true,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl
            })
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 800 //持续的时间
            })
        }
    },

    logout() {
        if (this.data.show) {
            req.logout().catch(err => console.log(err));
            this.setData({
                show: false,
                nickName: "请点击头像登录一下吧",
                avatarUrl: "https://devin-edu.oss-cn-zhangjiakou.aliyuncs.com/spaceman.png"
            })
            app.globalData.userInfo = null;
        }
    },


    // 关于我们
    aboutClick() {
        console.log('关于我们监听');
    },

})

function hello() {
    console.log("hello");
}