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
            // Mock Response based on docs/api_requirements.md Phase 3
            // Currently mocking "Wei Ji" -> "Qian" transition for demonstration

            const mockResponse = {
                hexagram: {
                    code: "101010",
                    name: "未济",
                    symbol: "䷿",
                    judgment: "未济：亨，小狐汔济，濡其尾，无攸利。",
                    image: "火在水上，未济；君子以慎辨物居方。",
                    upper_trigram: "离",
                    lower_trigram: "坎"
                },

                changing_hexagram: {
                    code: "111111",
                    name: "乾",
                    symbol: "䷀",
                    judgment: "乾：元亨利贞。",
                    image: "天行健，君子以自强不息。",
                    interpretation: "【变卦】乾卦象征刚健不息，充满活力。表示目前正处于上升期，应积极进取。"
                },

                analysis: {
                    overall: "【Mock分析】未济卦象征事未成，但这也意味着无限的可能性。此时不宜急进，需审慎行事，等待时机成熟。",
                    active_lines: ["初六：濡其尾，吝。", "九四：贞吉，悔亡，震用伐鬼方，三年有赏于大国。"],
                    five_elements: "本卦属火，变卦属金。火克金，需注意...",
                    solar_term: "当前节气立春，万物复苏，此卦象显示生机勃勃...",
                    advice: "宜：筹备规划，蓄势待发。\n忌：轻举妄动，涉水过河。"
                },

                do_dont: {
                    do: ["制定长远计划", "韬光养晦", "结交益友"],
                    dont: ["即刻行动", "强行推进", "与人争执"]
                },

                // Optional debugging info
                trace: [
                    "Step 1: Analyzed base hexagram Wei Ji",
                    "Step 2: Calculated changing lines 1 and 4",
                    "Step 3: Derived changing hexagram Qian"
                ]
            };

            console.log('API Response:', mockResponse);
            resolve(mockResponse);
        }, 1500);
    });
};

module.exports = {
    interpretHexagram
};
