// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase)
const db = admin.firestore();

export const archiveChat = functions.firestore.document('chats/{chatId}')
.onUpdate(change=>{
    const data = change.after.data();
    const maxLen = 50;
    let msgLen;
    if(data)
        msgLen = data.messages.length;
    const charLen = JSON.stringify(data).length;

    //archive or delete old messages
    if(charLen >= 10000 || msgLen >= maxLen){
        const batch = db.batch();
        if(data)
            data.messages.splice(0,msgLen-maxLen);
        const ref = db.collection('chats').doc(change.after.id);
        batch.set(ref,data,{merge:true})
        return batch.commit();
    }else{
        return null;
    }

})



export const sendFcm = functions.firestore.document('chats/{chatId}').onWrite(
    async (event)=>{
        const after = event.after.data();
        let receiverEmail;
        let senderEmail;
        let text;
        let announcementId;
        console.log(after);
        if(after){
            receiverEmail = after.messages[after.messages.length - 1]['receiverEmail'];
            senderEmail = after.messages[after.messages.length - 1]['senderEmail']
            text = after.messages[after.messages.length - 1]['text'];
            announcementId = event.after.id;
        }    
        const title = 'From ' + senderEmail + ' for announcement with ID: ' + announcementId;
        const payload = {
            notification:{
                title: title,
                body: text
            }
        }
        const id = Math.random().toString();
        const seen = false;
        const date = Date.now();
        const data = {
            id,
            announcementId,
            title,
            text,
            seen,
            date
        }
        console.log(data);
        console.log(receiverEmail);
        await db.collection('users').where('email','==',receiverEmail).get()
        .then(snapshot=>{
            snapshot.forEach(function(doc){
                console.log(doc);
                db.collection('users').doc(doc.id).update({
                    notifications : admin.firestore.FieldValue.arrayUnion(data)
                }).then(()=>{console.log("notification saved")})
                .catch(err=>console.log(err))
            })
        }).catch(err=>console.log("error"));

        const devicesRef = db.collection('devices').where('email','==',receiverEmail);
        const devices = await devicesRef.get();
        const tokens: string | any[] = [];
        devices.forEach(result=>{
            const token = result.data().token;
            tokens.push( token )
        })
        return admin.messaging().sendToDevice(tokens,payload);
    }
)