const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: 'naver',
    host: 'smtp.naver.com',
    port : 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: "vacabe240723@naver.com",
        pass: "vacabe1234!",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

module.exports = { smtpTransport };