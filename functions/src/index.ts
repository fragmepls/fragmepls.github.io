import * as functions from 'firebase-functions/v1';
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
        const timestamp = Date.now();
        const docId = `${timestamp}-${Math.random().toString(36).substring(2, 8)}`;

        await admin.firestore().collection('userInputs').doc(docId).set({
            text,
            ip,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).json({error: 'Failed to save: ' + error});
    }
});

export const deleteOldInputs = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async () => {
        const cutoff = admin.firestore.Timestamp.fromMillis(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        );

        const snapshot = await admin.firestore()
            .collection('userInputs')
            .where('timestamp', '<', cutoff)
            .get();

        const batch = admin.firestore().batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        console.log(`Deleted ${snapshot.size} old documents`);
    });
