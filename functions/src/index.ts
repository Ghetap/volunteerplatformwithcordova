// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()
export const subscribeToTopic = functions.https.onCall(
    async (data,context)=>{
        console.log(data);
        await admin.messaging().subscribeToTopic(data.token,data.topic);
        return `subscribed to ${data.topic}`;
    }
);

export const unsubscribeFromTopic = functions.https.onCall(
    async (data,context)=>{
        await admin.messaging().unsubscribeFromTopic(data.token,data.topic);
        return `unsubscribed from ${data.topic}`;
    }
);

export const sendOnRegisterCreate = functions.firestore
    .document('devices/{deviceId}')
    .onWrite(async (event)=>{   
        const token = event.after.get('token')
        console.log(token);
        const payload ={
            notification :{
                title:"Don't forget to edit your profile",
                body: "Congratulations, if you already have..."
            },
            token:token
        }
    return admin.messaging().send(payload);
});