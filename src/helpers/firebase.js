const admin = require('firebase-admin')

const serviceAccount = require('../config/dokterhebatlabura-firebase-adminsdk-xi9gs-fdc5b4feda.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dokterhebatlabura-default-rtdb.asia-southeast1.firebasedatabase.app'
})

const messaging = (topic, username, content) => {;
  admin.messaging().send({
    notification: {
      title: username,
      body: content?.length > 50 ? content?.slice(0, 50)?.concat('...') : content || 'Lihat lampiran gambar 📄',
    },
    topic: topic,
  }).then((response) => {
    console.log(`Successfully sent notification: ${response}`)
  }).catch((err) => {
    console.log(err.message)
  })
}

module.exports = messaging
