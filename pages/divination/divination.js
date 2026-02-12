const { generateLine } = require('../../utils/divination.js');
const gyroService = require('../../services/gyro.js');

Page({
    data: {
        lines: [], // [bottom, ..., top]
        status: 'idle', // 'idle' | 'shaking' | 'complete'
        mode: 'gyro', // 'gyro' | 'button'
        isGyroSupported: true
    },

    onLoad() {
        // Check Gyro Support
        const supported = gyroService.isSupported();
        this.setData({
            isGyroSupported: supported,
            mode: supported ? 'gyro' : 'button'
        });

        if (supported) {
            this.initGyroListeners();
        }
    },

    onShow() {
        if (this.data.mode === 'gyro') {
            gyroService.start();
        }
    },

    onHide() {
        gyroService.stop();
    },

    onUnload() {
        gyroService.stop();
    },

    initGyroListeners() {
        gyroService.onShake(() => {
            this.handleGyroShake();
        });

        gyroService.onSettle(() => {
            this.handleGyroSettle();
        });
    },

    toggleMode() {
        if (!this.data.isGyroSupported) {
            wx.showToast({ title: '设备不支持陀螺仪', icon: 'none' });
            return;
        }

        const newMode = this.data.mode === 'gyro' ? 'button' : 'gyro';
        this.setData({ mode: newMode });

        if (newMode === 'gyro') {
            gyroService.start();
        } else {
            gyroService.stop();
        }
    },

    // --- Logic ---

    handleGyroShake() {
        if (this.data.status === 'complete') return;

        if (this.data.status !== 'shaking') {
            this.setData({ status: 'shaking' });
            wx.vibrateShort({ type: 'medium' });
        }
    },

    handleGyroSettle() {
        if (this.data.status === 'complete') return;

        if (this.data.status === 'shaking') {
            // Settle means ONE shake completed -> generate ONE line
            this.shakeOnce();
            // Reset to idle for next shake
            if (this.data.status !== 'complete') {
                this.setData({ status: 'idle' });
            }
        }
    },

    handleAction() {
        if (this.data.status === 'complete') {
            this.goToResult();
        } else {
            // Button Mode Trigger
            this.shakeOnce();
        }
    },

    shakeOnce() {
        if (this.data.lines.length >= 6) return;

        // Haptic feedback
        if (this.data.mode === 'button') {
            wx.vibrateShort({ type: 'light' });
        } else {
            // Gyro mode settle feedback
            wx.vibrateShort({ type: 'heavy' });
        }

        // Generate Line
        const newLine = generateLine();
        const newLines = [...this.data.lines, newLine];

        this.setData({
            lines: newLines
        });

        // Check completion
        if (newLines.length >= 6) {
            this.setData({ status: 'complete' });
            wx.vibrateLong();

            // Stop Gyro to save battery
            gyroService.stop();
        }
    },

    goToResult() {
        const lines = this.data.lines;
        const coinsStr = JSON.stringify(lines);

        wx.navigateTo({
            url: `/pages/result/result?coins=${coinsStr}`
        });
    }
});
