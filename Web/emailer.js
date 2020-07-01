var sendMail = require('node-email-sender');


function confirmation_email(receiver){
    var confirm_address = "http://noteifymusic.com."
    var link = confirm_address.link("http://noteifymusic.com./confirm")
    console.log(link);
    emailConfig = {
        emailFrom:'note.ify.me1@gmail.com',
        transporterConfig:{
            service: 'gmail',
            auth: {
                user: 'note.ify.me1@gmail.com',
                pass: 'adminMusic!'
            }
        }
    }
    var response = sendMail.sendMail({
        emailConfig: emailConfig,
        to: receiver,
        subject: "Welcome to NoteifyMe!",
        content: "Welcome to NoteifyMe, the web application that notifies you when you favorite music artists release new music. \n" + 
        "Please click the following link to verify your email:" + link
    });
    console.log("confirmation email sent to",receiver);
}
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
        content: artistName + " has released new music. Don't forget to checkout new music by" + artistName
    });
    console.log("email sent to ", receiver);
}

//confirmation_email("aintili@bu.edu");
//sendEmail("ehrlichj@bu.edu","Pink Floyd");

module.exports = {sendEmail, confirmation_email};