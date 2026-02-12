/**
 * Mock API Service
 * 模拟后端接口，提供 hexagram 解析服务。
 * @module services/api
 */

/**
 * 解释六爻卦象
 * @param {number[]} coins - 长度为 6 的数组，元素为 6, 7, 8, 9
 * @returns {Promise<object>} - 解析结果
 */
const interpretHexagram = (coins) => {
    return new Promise((resolve, reject) => {
        console.log('API Request:', coins);

        // Validate Input
        if (!Array.isArray(coins) || coins.length !== 6) {
            const error = { code: 'INVALID_INPUT', message: 'Input must be array of 6 integers (6,7,8,9)' };
            console.error('API Error:', error);
            return reject(error);
        }

        // Simulate Network Delay (1.5s) per @ui-ux-pro-max (Loading State Testing)
        setTimeout(() => {
            // Mock Response based on docs/api_requirements.md
            // Here we return "Wei Ji" (Hexagram 64) as a sample
            const mockResponse = {
                hexagram_code: "101010",
                name: "未济",
                symbol: "䷿",
                judgment: "未济：亨，小狐汔济，濡其尾，无攸利。",
                image: "火在水上，未济；君子以慎辨物居方。",
                interpretation: "【模拟结果】未济卦象征事未成...（此处为Mock数据，请对接真实API）",
                is_changing: true,
                changing_hexagram: {
                    code: "111110",
                    name: "姤",
                    symbol: "䷫",
                    judgment: "姤：女壮，勿用取女。",
                    interpretation: "姤卦象征相遇...（变卦解读）"
                },
                changed_lines: [1, 4] // Sample changed lines
            };

            console.log('API Response:', mockResponse);
            resolve(mockResponse);
        }, 1500);
    });
};

module.exports = {
    interpretHexagram
};
