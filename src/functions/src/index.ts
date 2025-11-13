import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const submitInput = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    const {text} = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        await admin.firestore().collection('userInputs').add({
            text,
            ip,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).json({error: 'Failed to save: ' + error});
    }
});
