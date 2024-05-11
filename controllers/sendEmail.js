const nodemailer = require('nodemailer');

const coupon = async (req, res) => {
    try {
        const formData = req.body;

        const calculateTotalAmount = () => {
            let sum = 0;

            formData.children.forEach(elem => {
                let sum1 = +elem.amount?.slice(1);
                let sum2 = +elem.amount_extended?.slice(1);

                if (sum2 === 0) {
                    sum += sum1;
                } else {
                    sum += sum1 + sum2;
                }
            });

            return `$${sum.toFixed(2)}`;
        }

        const stylesheets = `
            .MessageBox {
                width: 1000px;
                min-width: 1000px;
            }
            
            .MessageBox p.message {
                font-size: 2rem;
            }
            
            .MessageBox .container {
                overflow: hidden;
                border-radius: 10px;
                border: 2px solid;
            }
            
            .MessageBox .container .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .MessageBox .container .title h3 {
                width: 100%;
                font-size: 1.8rem;
            }
            
            .MessageBox .container .title .logo {
                width: 120px;
                height: 120px;
            }
            
            .MessageBox .container .title .logo img {
                width: 100%;
            }
            
            .MessageBox .container .client_info p {
                text-decoration: underline;
                font-size: 1.3rem;
                margin-left: 20px;
                margin-bottom: 10px;
            }
            
            .MessageBox .container .child {
                margin-top: 20px;
            }
            
            .MessageBox .container table {
                width: 100%;
                font-size: 1.2rem;
                border-collapse: collapse;
            }
            
            .MessageBox .container table tbody tr th {
                text-align: left;
                padding-left: 15px;
            }
            
            .MessageBox .container table tbody tr.total td {
                background: none;
            }
            
            .MessageBox .container table td,
            .MessageBox .container table th {
                border-top: 2px solid #cbd5e1;
                border-bottom: 2px solid #cbd5e1;
            }
            
            .MessageBox .container table tr .odd {
                background: #e2e8f0;
            }
            
            .MessageBox .container table th,
            .MessageBox .container table td {
                text-align: center;
                padding: 10px 0;
            }        
        `;

        const childInfoHtml = formData.children.map((child, index, array) => {
            const isLastIteration = index === array.length - 1;
            let totalDueRow = '';

            if (isLastIteration) {
                totalDueRow = `
                    <tr class="total">
                        <th class="total_head">Total Due for Week:</th>
                        <td colspan='4'>${child.dates}</td>
                        <td>${calculateTotalAmount()}</td>
                    </tr>
                `;
            }

            return `
                <div class="child">
                    <div class='client_info'>
                        <p>Child's name: <b>${child.name}</b></p>
                    </div>
        
                    <table class="SendEmailTable">
                        <thead>
                            <tr>
                                <th class="odd">Description</th>
                                <th>Number of weeks</th>
                                <th class="odd">Days</th>
                                <th>Hours</th>
                                <th class="odd">Cost for Per Hour</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
        
                        <tbody>
                            <tr>
                                <th class="odd">Weekly Attendance</th>
                                <td>${child.number_of_weeks}</td>
                                <td class="odd">${child.total_days}</td>
                                <td>${child.total_time_in_week}</td>
                                <td class="odd">${child.cost_for_per_hour}</td>
                                <td>${child.amount}</td>
                            </tr>
        
                            <tr>
                                <th class="odd">Extended Hours</th>
                                <td>${child.number_of_weeks_extended}</td>
                                <td class="odd">${child.total_days_extended}</td>
                                <td>${child.hours_count_extended}</td>
                                <td class="odd">${child.cost_for_per_hour_extended} (Per minute)</td>
                                <td>${child.amount_extended}</td>
                            </tr>
        
                            ${totalDueRow}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('');

        const html = `<html lang='en'>
            <head>
                <style>${stylesheets}</style>
            </head>
            <body>
                <div class="MessageBox">
                    <p class="message">${formData.message1}</p>
            
                    <div class="container">           
                        <div class='title'>
                            <h3>${formData.title} Weekly Bill <br /> Lic. 343625479</h3>
                            <img src="cid:image1" class="logo" alt='logo' />
                        </div>
            
                        <div class='client_info'>
                            <p>Parent’s name: <b>${formData.parent_name}</b></p>
                        </div>
            
                        ${childInfoHtml}
                    </div>
            
                    <p class="message">${formData.message2.split('\n').join('<br>')}</p>
                </div>
            </body>
        </html>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_LOGIN,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_LOGIN,
            to: formData.parent_email,
            subject: formData.subject,
            html,
            attachments: [{
                filename: formData.logo,
                path: `${process.env.BASE_URL}${formData.logo}`,
                cid: 'image1' /* Уникальный идентификатор изображения для вставки в HTML */
            }],
        };

        await transporter.sendMail(mailOptions); /* Sending a letter */

        res.status(200).json({
            message: 'Email sent successfully',
        });
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
}

const paymentConfirm = async (req, res) => {
    try {
        const { subject, parent_email, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_LOGIN,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_LOGIN,
            to: parent_email,
            subject: subject,
            text: message,
        };

        /* Sending a letter */
        await transporter.sendMail(mailOptions); 

        res.status(200).json({
            message: 'Email sent successfully',
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    coupon,
    paymentConfirm,
};
