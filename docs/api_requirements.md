# 易经六爻卜卦微信小程序 - API 接口规范 (MVP 版)

> **文档版本**: v1.0
> **创建日期**: 2026-02-12
> **适用方**: 后端 MCP 开发团队 / 前端小程序开发团队

## 1. 概述

本文档定义了微信小程序前端与后端服务（基于 CyberYJ MCP）之间的通信接口。
**目标**：实现从前端提交六次铜钱投掷结果，由后端进行卦象计算、变卦分析并返回完整解读。

## 2. 接口定义

### 2.1 六爻解卦接口

将用户的六次投掷结果（数字）转换为卦象并解读。

- **URL**: `/v1/divination/interpret`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### 请求参数 (Request Body)

```json
{
  "coins": [6, 7, 8, 9, 7, 7],     // 必填，长度为6的数组，表示从初爻到上爻的投掷结果
                                   // 6: 老阴 (变爻)
                                   // 7: 少阳 (不变)
                                   // 8: 少阴 (不变)
                                   // 9: 老阳 (变爻)
  "question": "事业发展"            // 选填，用户的问题，用于辅助解读生成
}
```

#### 响应参数 (Response Body)

```json
{
  "hexagram_code": "101010",       // 本卦的二进制编码 (从初爻到上爻: 0=阴, 1=阳)
                                   // 例如: [6(阴), 7(阳), 8(阴), 9(阳), 7(阳), 7(阳)] -> 010111
  
  "name": "未济",                  // 本卦卦名
  "symbol": "䷿",                  // 本卦符号
  
  "judgment": "未济：亨，小狐汔济，濡其尾，无攸利。", // 本卦卦辞
  
  "image": "火在水上，未济；君子以慎辨物居方。",     // 本卦象辞
  
  "interpretation": "...",         // 【重点】综合解读文本（包含变卦分析，如果有）
                                   // 后端应整合卦辞、变爻辞、五行生克等，输出对用户友好的自然语言段落。
  
  "is_changing": true,             // 是否存在变卦
  
  "changing_hexagram": {           // 变卦信息（若无变爻则为 null）
      "code": "111110",
      "name": "姤",
      "symbol": "䷫",
      "judgment": "...",
      "interpretation": "..."      // 变卦的解读
  },
  
  "changed_lines": [1, 4]          // 变爻位置（1-6），对应输入数组索引+1
}
```

#### 错误响应

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "coins 数组长度必须为 6，且元素值为 6,7,8,9 之一"
  }
}
```

## 3. 逻辑说明

后端需实现以下转换逻辑：

1.  **输入校验**：确保 `coins` 数组长度为 6，仅包含 `[6, 7, 8, 9]`。
2.  **本卦生成**：
    - 6 (老阴) -> 0 (阴)
    - 7 (少阳) -> 1 (阳)
    - 8 (少阴) -> 0 (阴)
    - 9 (老阳) -> 1 (阳)
3.  **变卦生成**：
    - 6 (老阴) -> 1 (阳) [变]
    - 7 (少阳) -> 1 (阳) [不变]
    - 8 (少阴) -> 0 (阴) [不变]
    - 9 (老阳) -> 0 (阴) [变]
4.  **调用 CyberYJ 核心**：利用现有的 `hexagram_analyzer` 对生成的本卦和变卦进行分析。
5.  **返回结果**：组装 JSON 响应。

## 4. 示例

**Example Interaction:**

**Request:**
```http
POST /v1/divination/interpret HTTP/1.1
Content-Type: application/json

{
    "coins": [8, 8, 8, 8, 8, 8],
    "question": "测试全阴"
}
```

**Response:**
```json
{
    "hexagram_code": "000000",
    "name": "坤",
    "symbol": "䷁",
    "judgment": "坤：元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞，吉。",
    "image": "地势坤，君子以厚德载物。",
    "interpretation": "坤卦代表至柔至顺...",
    "is_changing": false,
    "changing_hexagram": null,
    "changed_lines": []
}
```
