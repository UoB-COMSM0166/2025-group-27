message = "HiaHia....";
let lastUpdateTime = 0;
const API_URL = "http://127.0.0.1:5000/chat";  // Python 服务器 API 地址
const maxWidth = 600;  // 最大文本宽度
const lineSpacing = 30;  // 行间距

async function getAIMessage() {
    const requestData = {
        model: "deepseek-v3-241226",
        messages: [{
            role: "user",
            content: `
            你的角色是：
            你是这座山的上帝。

            你的故事是：
            玩家掉落在一个深山里，正在打小怪，试图消灭怪物走出大山。
            然而，这座山的怪物都是误入的旅人，被困在这里，逐渐变成了怪物。
            你知道这个秘密，但不会直接告诉玩家。

            当前游戏信息：
            玩家血量：
            玩家进度：

            要求：
            请你用非常短的语言嘲讽玩家，每次返回一句话，不要重复。
            使用英文，并且带有神秘感，深奥玄学。
`
    }]
};


    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            message = data.choices[0].message.content;  // ✅ 更新全局 `message` 变量
            console.log("🔥 AI 说:", message);
        } else {
            message = "AI 没有返回内容";
        }
    } catch (error) {
        console.error("请求失败:", error);
        message = "获取失败，请检查网络";
    }
}

setInterval(getAIMessage, 5000);


