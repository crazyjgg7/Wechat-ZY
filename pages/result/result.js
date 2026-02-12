const { interpretHexagram } = require('../../services/api.js');
const storage = require('../../utils/storage.js');

Page({
    data: {
        loading: true,
        error: false,
        errorMsg: '',
        result: null, // Full API response
        isHistory: false
    },

    onLoad(options) {
        if (options.id) {
            // Load from History
            const record = storage.getHistoryById(options.id);
            if (record) {
                // Format timestamp for display if needed, but wxml can handle or use wxs
                this.setData({
                    result: record,
                    loading: false,
                    isHistory: true
                });
            } else {
                this.setError('记录不存在');
            }
        } else if (options.coins) {
            // New Divination
            try {
                const coins = JSON.parse(options.coins);
                this.fetchResult(coins);
            } catch (e) {
                this.setError('无效的数据格式');
            }
        } else {
            this.setError('缺少卦象数据');
        }
    },

    retryFetch() {
        // Retry logic depends on context (history or fresh)
        // If history failed loading (n/a), just go back.
        // If fresh failed, we need coins.
        // For simplicity, we assume retry is for fetch failure.
        // We need to store coins in data if we want retry support.
        // But options logic covers it mostly.
        this.setError('请重新起卦');
    },

    fetchResult(coins) {
        this.setData({ loading: true, error: false });

        interpretHexagram(coins)
            .then(res => {
                // Enrich result with metadata for storage
                const enrichedResult = {
                    ...res,
                    timestamp: Date.now(),
                    id: Date.now().toString(),
                    coins: coins
                };

                // Save to History
                storage.saveHistory(enrichedResult);

                this.setData({
                    loading: false,
                    result: enrichedResult, // Use 'result' instead of 'hexagram' to align with rich structure
                    isHistory: false
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
