// ==UserScript==
// @name         Twitter WebMCP - 发帖功能
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  为 Twitter/X 注入 WebMCP 支持，提供发帖功能
// @author       ReedSoul
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    /**
     * WebMCP Tool: 发帖功能
     *
     * 允许 AI Agent 直接调用 Twitter 的发帖功能
     * 参数：
     *   - text: 推文内容（必填，最多 280 字符）
     *   - imageUrls: 图片 URL 数组（可选）
     */
    window.webMCP = {
        tools: [
            {
                name: 'postTweet',
                description: '发布一条推文到 Twitter/X。支持纯文本或带图片的推文。',
                parameters: {
                    type: 'object',
                    properties: {
                        text: {
                            type: 'string',
                            description: '推文内容，最多 280 字符',
                            maxLength: 280
                        },
                        imageUrls: {
                            type: 'array',
                            description: '要附加的图片 URL 数组（可选）',
                            items: {
                                type: 'string',
                                format: 'uri'
                            }
                        }
                    },
                    required: ['text']
                },
                handler: async (params) => {
                    console.log('[Twitter WebMCP] 收到发帖请求:', params);

                    const { text, imageUrls = [] } = params;

                    // 验证推文长度
                    if (text.length > 280) {
                        throw new Error('推文内容不能超过 280 字符');
                    }

                    try {
                        // 步骤 1: 找到发帖按钮并点击
                        const postButton = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
                        if (!postButton) {
                            throw new Error('未找到发帖按钮');
                        }
                        postButton.click();

                        // 等待发帖弹窗出现
                        await waitForElement('[data-testid="tweetTextarea_0"]', 5000);

                        // 步骤 2: 找到文本输入框
                        const textarea = document.querySelector('[data-testid="tweetTextarea_0"]');
                        if (!textarea) {
                            throw new Error('未找到推文输入框');
                        }

                        // 步骤 3: 输入推文内容
                        textarea.focus();
                        textarea.value = text;

                        // 触发 input 事件，让 Twitter 更新字符计数
                        const inputEvent = new Event('input', { bubbles: true });
                        textarea.dispatchEvent(inputEvent);

                        console.log('[Twitter WebMCP] 推文内容已输入');

                        // 步骤 4: 如果有图片，添加图片
                        if (imageUrls.length > 0) {
                            for (const imageUrl of imageUrls) {
                                try {
                                    await uploadImage(imageUrl);
                                } catch (error) {
                                    console.error('[Twitter WebMCP] 图片上传失败:', error);
                                    throw new Error(`图片上传失败: ${error.message}`);
                                }
                            }
                        }

                        // 步骤 5: 等待用户确认
                        // 注意：Twitter 需要用户手动点击"发布"按钮
                        // 这里我们只准备好内容，不自动发布（出于安全考虑）
                        console.log('[Twitter WebMCP] 推文已准备好，等待用户确认发布');

                        return {
                            success: true,
                            message: '推文已准备好，请手动点击"发布"按钮确认',
                            data: {
                                text,
                                imageCount: imageUrls.length,
                                timestamp: new Date().toISOString()
                            }
                        };

                    } catch (error) {
                        console.error('[Twitter WebMCP] 发帖失败:', error);
                        throw error;
                    }
                }
            }
        ]
    };

    /**
     * 辅助函数：等待元素出现
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素超时: ${selector}`));
            }, timeout);
        });
    }

    /**
     * 辅助函数：上传图片
     * 注意：这个功能需要额外的实现，Twitter 的图片上传比较复杂
     */
    async function uploadImage(imageUrl) {
        console.log('[Twitter WebMCP] 尝试上传图片:', imageUrl);

        // Twitter 的图片上传需要：
        // 1. 找到图片上传按钮 [data-testid="attachmentsButton"]
        // 2. 点击它
        // 3. 选择文件输入
        // 4. 处理图片并上传

        // 这里简化实现，只支持网络 URL 转换
        // 实际场景中可能需要：
        // - 先下载图片到本地
        // - 通过文件选择器上传
        // - 或使用 Twitter API 直接上传

        throw new Error('图片上传功能需要额外实现');
    }

    /**
     * 控制台提示
     */
    console.log('[Twitter WebMCP] 已加载');
    console.log('[Twitter WebMCP] 可用工具:', window.webMCP.tools.map(t => t.name));
    console.log('[Twitter WebMCP] 提示：使用 Chrome DevTools > Application > WebMCP 查看和测试');

})();
