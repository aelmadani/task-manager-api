const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'a.elmadani@gmail.com',
    subject: 'Thanks for joining',
    text: `Hi, ${name}. Thanks for joining`
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'a.elmadani@gmail.com',
    subject: 'Cancelation',
    text: `Hi, ${name}. Bye bye`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
};
