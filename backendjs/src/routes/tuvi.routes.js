const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const dbService = require('../services/database.service');
const TuViCalculator = require('../tuvi/calculator');

// Credit cost for TuVi Professional Analysis (v6.0)
const CREDIT_COST_TUVI = 10;

/**
 * POST /api/tuvi/analyze
 * Requires authentication and 10 credits
 * Saves to history
 */
router.post('/analyze', authRoutes.authMiddleware, async (req, res) => {
    try {
        const { name, year, month, day, hour, minute, gender, calendar, horoDate } = req.body;
        const userId = req.user.id;
        
        // Validation
        if (!year || !month || !day) {
            return res.status(400).json({ error: 'Missing required date parameters' });
        }

        // 1. Check and deduct credits
        try {
            await dbService.deductCredits(userId, CREDIT_COST_TUVI, 'Lập lá số Tử Vi trọn đời (v6.0)');
        } catch (creditError) {
            const user = await dbService.getUserById(userId);
            return res.status(402).json({
                error: creditError.message,
                credits_required: CREDIT_COST_TUVI,
                credits_current: user?.credits || 0
            });
        }

        // 2. Perform calculation
        const calc = new TuViCalculator({
            name: name || "Khách",
            year: Number(year),
            month: Number(month),
            day: Number(day),
            hour: hour !== undefined && hour !== '' && hour !== null ? Number(hour) : 12,
            minute: Number(minute) || 0,
            gender: gender || 'Nam',
            calendar: calendar || 'solar',
            horoDate: horoDate
        });

        const result = calc.calculate();

        // 3. Save to database history
        let customerId = null;
        let consultationId = null;
        try {
            customerId = await dbService.findOrCreateCustomer({
                name: name || "Mệnh chủ",
                year: Number(year),
                month: Number(month),
                day: Number(day),
                hour: hour !== undefined && hour !== '' && hour !== null ? Number(hour) : 12,
                minute: Number(minute) || 0,
                gender: gender || 'Nam',
                calendar: calendar || 'solar'
            });

            consultationId = await dbService.saveConsultation(
                customerId,
                'tuvi',       // theme_id
                'tuvi_full',  // question_id
                'Lập lá số Tử Vi trọn đời', // question_text
                result,       // answer (full result object)
                false,        // useAI (it's algorithmic but high value)
                CREDIT_COST_TUVI,
                userId,
                'huyen_co',   // persona
                [],           // follow-ups
                {
                    metadata: { type: 'tuvi_v6_0' }
                }
            );
        } catch (dbError) {
            console.error('[DB TuVi Save Error]:', dbError);
        }

        res.json({
            success: true,
            data: result,
            creditsUsed: CREDIT_COST_TUVI,
            consultationId,
            customerId
        });

    } catch (error) {
        console.error('[TuVi Route Error]:', error);
        res.status(500).json({ error: error.message || 'Lỗi server khi lập lá số' });
    }
});

module.exports = router;
