const nodemailer = require('nodemailer');

const sendEmail = async (formData) => {
    try {
        // Создаем транспорт для отправки писем (может потребоваться настройка)
        let transporter = nodemailer.createTransport({
            // Укажите настройки SMTP или другие настройки транспорта
            // Пример для использования Gmail:
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });

        // Определяем содержимое письма
        let mailOptions = {
            from: 'your_email@gmail.com',
            to: formData.parent_email,
            subject: formData.subject,
            text: `
                <div class="MessageBox">
                    <!-- Ваша вся HTML-структура здесь -->
                </div>
            `
        };

        // Отправляем письмо
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true; // Возвращаем true, чтобы показать, что отправка прошла успешно
    } catch (error) {
        console.error('Error sending email:', error);
        return false; // Возвращаем false в случае ошибки отправки
    }
}

module.exports = {
    sendEmail,
};
