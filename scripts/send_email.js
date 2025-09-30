// scripts/send_email.js
const nodemailer = require('nodemailer');

async function main() {
    const recipient = process.env.EMAIL_RECIPIENT;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!recipient) {
        console.error('ERRO: EMAIL_RECIPIENT não definido.');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: false,
        auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    });

    await transporter.sendMail({
        from: smtpUser || 'henry22gamer@gmail.com',
        to: recipient,
        subject: 'Pipeline executado!',
        text: 'Pipeline executado! Verifique artefatos e logs no GitHub Actions.',
    });

    console.log(`Email enviado para ${recipient}`);
}

main().catch(err => {
    console.error('Falha ao enviar email:', err);
    process.exit(1);
});
