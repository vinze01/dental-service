require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, text, html) => {
    const msg = {
        to,
        from: 'veetee0808@gmail.com',
        subject,
        text,
        html,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('Email sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendMail };
