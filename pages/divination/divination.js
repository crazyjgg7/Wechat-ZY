const { generateLine } = require('../../utils/divination.js');

Page({
    data: {
        lines: [], // [bottom, ..., top]
        status: 'shaking' // 'shaking' | 'complete' | 'loading'
    },

    handleAction() {
        if (this.data.status === 'complete') {
            this.goToResult();
        } else {
            this.shakeOnce();
        }
    },

    shakeOnce() {
        if (this.data.lines.length >= 6) return; // Guard clause

        // Haptic feedback per @ui-ux-pro-max
        wx.vibrateShort({ type: 'medium' });

        // Generate Line
        const newLine = generateLine();
        const newLines = [...this.data.lines, newLine];

        this.setData({
            lines: newLines
        });

        // Check completion
        if (newLines.length >= 6) {
            this.setData({ status: 'complete' });
            // Completion feedback
            wx.vibrateLong();

            // Auto-jump optional? Better let user confirm.
        }
    },

    goToResult() {
        // Pass visual representation to result page
        const lines = this.data.lines;

        // We encode the array as JSON string for URL param
        // In complex cases, we might store in app.globalData or wx.setStorage
        // For MVP, URL param is simple.
        const coinsStr = JSON.stringify(lines);

        wx.navigateTo({
            url: `/pages/result/result?coins=${coinsStr}`
        });
    }
});
