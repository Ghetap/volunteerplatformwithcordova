// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()
const db =admin.firestore();
const settings = {timestampsInSnapshots:true};
db.settings(settings);

export const archiveChat = functions.firestore.document('chat/{chatId}')
.onUpdate(change=>{
    const data = change.after.data();
    const maxLen = 50;
    var msgLen;
    if(data)
        msgLen = data.messages.length;
    const charLen = JSON.stringify(data).length;

    //archive or delete old messages
    if(charLen >= 10000 || msgLen >= maxLen){
        const batch = db.batch();
        if(data)
            data.messages.splice(0,msgLen-maxLen);
        const ref = db.collection('chat').doc(change.after.id);
        batch.set(ref,data,{merge:true})
        return batch.commit();
    }else{
        return null;
    }

})

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
