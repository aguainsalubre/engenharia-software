async function main() {
    const recipient = process.env.EMAIL_RECIPIENT;
    const pipelineStatus = process.env.PIPELINE_STATUS;

    if (!recipient) {
        console.error("Variável de ambiente EMAIL_RECIPIENT não definida.");
        process.exit(1);
    }

    // Configuração do transporter - O usuário precisará configurar um SMTP real
    // Este é um exemplo usando Ethereal para testes, que gera credenciais temporárias.
    // Para uso em produção, configure com um serviço de e-mail como SendGrid, Mailgun, etc.
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // Exemplo: "smtp.sendgrid.net"
        port: 587,
        secure: false, // true para porta 465, false para outras (como 587 com STARTTLS)
        auth: {
            user: "user@example.com", // Substitua pelo seu usuário SMTP
            pass: "password", // Substitua pela sua senha SMTP
        },
    });

    let subject = `Status do Pipeline: ${pipelineStatus ? pipelineStatus.toUpperCase() : 'DESCONHECIDO'}`;
    let textBody = `O pipeline foi executado com status: ${pipelineStatus || 'desconhecido'}. Verifique os logs no GitHub Actions para mais detalhes.`;
    let htmlBody = `<p>O pipeline foi executado com status: <b>${pipelineStatus || 'desconhecido'}</b>.</p><p>Verifique os logs no GitHub Actions para mais detalhes.</p>`;

    try {
        let info = await transporter.sendMail({
            from: "\"CI/CD Pipeline\" <ci-cd@example.com>", // Endereço do remetente
            to: recipient, // Lista de destinatários
            subject: subject,
            text: textBody,
            html: htmlBody,
        });

        console.log("Mensagem enviada: %s", info.messageId);
        // Apenas para testes com Ethereal, mostra URL de preview
        if (transporter.options.host === "smtp.ethereal.email") {
            console.log("URL Preview (Ethereal): %s", nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error("Falha ao enviar e-mail:", error);
        process.exit(1);
    }
}

main().catch(console.error);