Page({
    startDivination() {
        wx.navigateTo({
            url: '/pages/divination/divination'
        });
    },

    viewHistory() {
        wx.navigateTo({
            url: '/pages/history/history'
        });
    }
})
