/**
 * 六爻生成工具 (Divination Utility)
 * Using 3-coin method probability simulation.
 * 
 * 3 Coins: Head (Front) = 2, Tail (Back) = 3 (Common convention: '字' is Yin/2, '花' is Yang/3)
 * Wait, convention varies. Let's stick to standard:
 * - 1 Back (Shaoyang/Young Yang) = 3+2+2 = 7 (Static Yang) -> Probability 3/8
 * - 2 Backs (Shaoyin/Young Yin) = 3+3+2 = 8 (Static Yin) -> Probability 3/8
 * - 3 Backs (Laoyang/Old Yang) = 3+3+3 = 9 (Changing Yang) -> Probability 1/8
 * - 0 Backs (3 Fronts) (Laoyin/Old Yin) = 2+2+2 = 6 (Changing Yin) -> Probability 1/8
 * 
 * @module utils/divination
 */

/**
 * Generate a single line value (6, 7, 8, 9)
 * @returns {number}
 */
const generateLine = () => {
    // Simulate 3 coins flipping
    // pure random 0 or 1. Let's say 0 is Front (2), 1 is Back (3).
    const coin1 = Math.random() < 0.5 ? 2 : 3;
    const coin2 = Math.random() < 0.5 ? 2 : 3;
    const coin3 = Math.random() < 0.5 ? 2 : 3;

    return coin1 + coin2 + coin3;
};

/**
 * Generate 6 lines for a full hexagram (from bottom to top)
 * @returns {number[]} Array of 6 integers
 */
const generateSixLines = () => {
    const lines = [];
    for (let i = 0; i < 6; i++) {
        lines.push(generateLine());
    }
    return lines;
};

module.exports = {
    generateSixLines,
    generateLine
};
