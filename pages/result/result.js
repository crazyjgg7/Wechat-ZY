const { interpretHexagram } = require('../../services/api.js');

Page({
    data: {
        loading: true,
        error: false,
        errorMsg: '',
        coins: [],
        hexagram: null
    },

    onLoad(options) {
        if (options.coins) {
            try {
                const coins = JSON.parse(options.coins);
                this.setData({ coins });
                this.fetchResult(coins);
            } catch (e) {
                this.setError('无效的数据格式');
            }
        } else {
            this.setError('缺少卦象数据');
        }
    },

    retryFetch() {
        this.fetchResult(this.data.coins);
    },

    fetchResult(coins) {
        this.setData({ loading: true, error: false });

        // Call Mock API
        interpretHexagram(coins)
            .then(res => {
                this.setData({
                    loading: false,
                    hexagram: res
                });
            })
            .catch(err => {
                console.error(err);
                this.setData({
                    loading: false,
                    error: true,
                    errorMsg: err.message || '解卦失败，请检查网络'
                });
            });
    },

    setError(msg) {
        this.setData({
            loading: false,
            error: true,
            errorMsg: msg
        });
    },

    goHome() {
        wx.reLaunch({
            url: '/pages/index/index'
        });
    }
});
