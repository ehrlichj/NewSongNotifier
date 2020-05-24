var sendMail = require('node-email-sender');

function sendEmail(receiver, artistName){
    emailConfig = {
        emailFrom: 'note.ify.me1@gmail.com', 
        transporterConfig:{
            service: 'gmail',
            auth: {
                user:'note.ify.me1@gmail.com',
                pass:'adminMusic!'
            }
        }
    }
    
    var response = sendMail.sendMail({
        emailConfig: emailConfig,
        to: receiver,
        subject: artistName + ' new music',
        content: artistName + " has released new music. Don't forget to check them out.",
    });
}