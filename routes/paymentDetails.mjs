import express from 'express';
import db from '../db/conn.mjs';
import {ObjectId} from 'mongodb';
import checkauth from '../check-auth.mjs';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create a new record
router.post('/payDetails', [
    body('amount')
        .isNumeric()
        .notEmpty()
        .withMessage('A numeric value of the amount is required'),
    body('currency')
        .isIn(['USD', 'EUR', 'GBP', 'ZWL', 'ZAR'])
        .notEmpty()
        .withMessage('The currency is required'),
    body('provider')
        .isIn(['SWIFT', 'Wise', 'SEPA'])
        .notEmpty()
        .withMessage('A service provider is required'),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    // Create a new record in the 'paymentDetails' collection
    let newDocument = {
        amount: req.body.amount,
        currency: req.body.currency,
        provider: req.body.provider
    };

    let collection = await db.collection('paymentDetails');
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

// Retrieve all records
router.get('/', async (req, res) => {
    let collection = await db.collection('paymentDetails');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

export default router;