const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
