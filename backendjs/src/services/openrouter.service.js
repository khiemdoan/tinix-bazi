/**
 * OpenRouter AI Service
 * Low-level client for interacting with AI models via OpenRouter
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const baziAiService = require('../bazi/services/bazi_ai.service');
const tuviAiService = require('../tuvi/services/tuvi_ai.service');

class OpenRouterService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';
        this.maxRetries = 3;
        this.timeout = 60000; // 60 seconds timeout
    }

    /**
     * Generic method to call AI
     */
    async _callAI(systemPrompt, userPrompt, options = {}) {
        if (!this.apiKey) {
            throw new Error('OPENROUTER_API_KEY is not configured');
        }

        const { response_format, max_tokens = 2000, temperature = 0.7, xTitle = 'AI Consultant' } = options;

        let lastError;
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`[OpenRouter] Attempt ${attempt}/${this.maxRetries}...`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(OPENROUTER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': 'https://huyencobattu.com',
                        'X-Title': xTitle
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
                            { role: 'user', content: userPrompt }
                        ],
                        response_format,
                        max_tokens,
                        temperature
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
                }

                const data = await response.json();
                const content = data.choices?.[0]?.message?.content || '';

                if (!content || content.trim().length < 10) {
                    throw new Error('Empty or too short response from AI');
                }

                return content;
            } catch (error) {
                lastError = error;
                console.error(`[OpenRouter] Attempt ${attempt} failed:`, error.message);

                if (!this.isRetryableError(error) || attempt === this.maxRetries) {
                    break;
                }

                const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        throw lastError;
    }

    /**
     * Generate AI response for a BaZi question
     */
    async generateAnswer(baziContext, luckCyclesData, questionText, personaId = 'huyen_co', partnerContext = null) {
        try {
            const systemPrompt = baziAiService.buildSystemPrompt(personaId);
            const userPrompt = baziAiService.buildUserPrompt(baziContext, luckCyclesData, questionText, personaId, partnerContext);

            const content = await this._callAI(systemPrompt, userPrompt, { xTitle: 'BaZi Consultant' });
            return this.formatResponse(content);
        } catch (error) {
            console.error('[OpenRouter/Bazi] Failed after retries:', error);
            return this.getFallbackResponse(questionText);
        }
    }

    /**
     * Generate AI response for a TuVi question
     */
    async generateTuViAnswer(tuviContext, questionText, personaId = 'huyen_co') {
        try {
            const systemPrompt = tuviAiService.buildSystemPrompt(personaId);
            const userPrompt = tuviAiService.buildUserPrompt(tuviContext, questionText, personaId);

            const content = await this._callAI(systemPrompt, userPrompt, { xTitle: 'TuVi Consultant' });
            return this.formatResponse(content);
        } catch (error) {
            console.error('[OpenRouter/TuVi] Failed after retries:', error);
            return this.getFallbackResponse(questionText);
        }
    }

    /**
     * Generate AI response for a BaZi matching analysis
     */
    async generateMatchingAnswer(person1Ctx, person2Ctx, relationshipType = 'romance', personaId = 'huyen_co') {
        try {
            const systemPrompt = baziAiService.buildMatchingSystemPrompt();
            const userPrompt = baziAiService.buildMatchingUserPrompt(person1Ctx, person2Ctx, relationshipType);

            const content = await this._callAI(systemPrompt, userPrompt, { 
                xTitle: 'BaZi Matching',
                response_format: { type: "json_object" } 
            });

            return this.cleanAndParseJSON(content);
        } catch (error) {
            console.error('[OpenRouter/Matching] Failed after retries:', error);
            // Return match-specific fallback
            return this.getMatchingFallback();
        }
    }

    /**
     * Generic completion (e.g. for comprehensive analysis)
     */
    async generateCompletion(prompt, personaId = 'huyen_co') {
        try {
            const content = await this._callAI(null, prompt, { 
                xTitle: 'BaZi Comprehensive', 
                max_tokens: 3000, 
                temperature: 0.75 
            });

            let finalContent = content.trim();
            if (finalContent.startsWith('```')) {
                const lines = finalContent.split('\n');
                if (lines[0].startsWith('```')) lines.shift();
                if (lines[lines.length - 1].startsWith('```')) lines.pop();
                finalContent = lines.join('\n').trim();
            }
            return finalContent;
        } catch (error) {
            console.error('[OpenRouter/Completion] Failed after retries:', error);
            return this.getComprehensiveFallback(personaId);
        }
    }

    /**
     * Check if error is retryable
     */
    isRetryableError(error) {
        const message = error.message?.toLowerCase() || '';
        return (
            error.name === 'AbortError' ||
            message.includes('terminated') ||
            message.includes('socket') ||
            message.includes('network') ||
            message.includes('econnreset') ||
            message.includes('econnrefused') ||
            message.includes('etimedout') ||
            message.includes('fetch failed') ||
            message.includes('other side closed') ||
            message.includes('empty') ||
            message.includes('too short') ||
            message.includes('invalid json') ||
            message.includes('malformed') ||
            message.includes('rejected')
        );
    }

    /**
     * Extract paragraphs and follow-ups
     */
    formatResponse(content) {
        if (!content) return { answer: ['Xin lỗi, thầy đang bận chút việc...'], followUps: [] };

        let answerText = content;
        let followUps = [];

        const followUpMatch = content.match(/\[FOLLOW_UP\]([\s\S]*)$/i);
        if (followUpMatch) {
            answerText = content.split(/\[FOLLOW_UP\]/i)[0].trim();
            const followUpContent = followUpMatch[1].trim();
            followUps = followUpContent
                .split('\n')
                .map(line => line.replace(/^[\-\*•\s\d\.]+/, '').trim())
                .filter(line => line.length > 5 && line.endsWith('?'));
        }

        answerText = answerText.replace(/[\s\*\-\_\#\=\+]+$/, '').trim();
        const paragraphs = answerText.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);

        return {
            answer: paragraphs.length > 0 ? paragraphs : [answerText],
            followUps: followUps.length > 0 ? followUps : [
                "Con có muốn thầy xem kỹ hơn về đường tài lộc trong năm tới không?",
                "Vấn đề tình cảm của con có gì cần thầy gỡ rối thêm không?",
                "Con có muốn biết mình hợp với ngành nghề nào để phát tài nhanh nhất không?"
            ]
        };
    }

    /**
     * Fallback for standard consultant
     */
    getFallbackResponse(questionText) {
        return {
            answer: [
                `Con ơi, Thầy đang gặp chút trở ngại trong việc kết nối nguồn năng lượng để luận giải câu hỏi "${questionText}" của con.`,
                'Con hãy kiên nhẫn chờ ít phút rồi thử lại nhé. Duyên đến thì mọi sự sẽ sáng tỏ.',
                'Thầy xin lỗi vì sự bất tiện này. Linh thạch của con sẽ được hoàn lại nếu Thầy không thể trả lời được.'
            ],
            followUps: [
                "Con có muốn thầy xem kỹ hơn về đường tài lộc trong năm tới không?",
                "Vấn đề tình cảm của con có gì cần thầy gỡ rối thêm không?",
                "Con có muốn biết mình hợp với ngành nghề nào để phát tài nhanh nhất không?"
            ]
        };
    }

    /**
     * Fallback for comprehensive analysis
     */
    getComprehensiveFallback(personaId) {
        if (personaId === 'menh_meo') {
            return `🐱 Ối dồi ôi, server đang bận lắm nè con ơi! Thầy Mèo đang chill chút, con thử lại sau nha!`;
        }
        return `Kính thưa Mệnh chủ, hệ thống đang gặp trở ngại. Xin vui lòng thử lại sau ít phút. Thầy Huyền Cơ kính bút.`;
    }

    /**
     * Fallback for matching
     */
    getMatchingFallback() {
        return {
            totalScore: 50,
            assessment: { level: 'neutral', title: 'Cần phân tích thêm', summary: 'Thầy đang gặp khó khăn trong việc kết nối.', icon: '🔮' },
            breakdown: {
                element: { score: 15, maxScore: 30, description: 'Chưa phân tích được', quality: 'neutral' },
                ganzhi: { score: 12, maxScore: 25, details: [], quality: 'neutral' },
                shishen: { score: 12, maxScore: 25, details: [], quality: 'neutral' },
                star: { score: 10, maxScore: 20, details: [], quality: 'neutral' }
            },
            aspects: [
                { type: 'romance', icon: '💕', title: 'Tình Cảm', score: 50, description: 'Cần xem xét thêm' },
                { type: 'communication', icon: '💬', title: 'Giao Tiếp', score: 50, description: 'Cần xem xét thêm' },
                { type: 'finance', icon: '💰', title: 'Tài Chính', score: 50, description: 'Cần xem xét thêm' }
            ],
            advice: [{ type: 'neutral', text: 'Hãy kiên nhẫn và thử lại sau.' }],
            suggestedQuestions: ["Làm sao để cải thiện mối quan hệ này?", "Có điều gì cần lưu ý?"]
        };
    }

    /**
     * Clean and parse JSON
     */
    cleanAndParseJSON(content) {
        if (!content || typeof content !== 'string') throw new Error('Empty or invalid content');
        let cleaned = content.trim();
        const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (codeBlockMatch) cleaned = codeBlockMatch[1].trim();
        if (!cleaned.startsWith('{') && cleaned.includes('{')) {
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        try {
            return JSON.parse(cleaned);
        } catch (parseError) {
            throw new Error(`Invalid JSON from LLM: ${parseError.message}`);
        }
    }
}

module.exports = new OpenRouterService();
