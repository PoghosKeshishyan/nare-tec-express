const nodemailer = require('nodemailer');
const { squareNumbers } = require('../helpers/squareNumbers');

const coupon = async (req, res) => {
    try {
        const formData = req.body;

        const calculateTotalAmount = () => {
            let sum = 0;

            formData.children.forEach(elem => {
                if (elem.costHourExt === '-' || elem.hoursExt === '-') {
                    elem.costHourExt = '$0';
                    elem.hoursExt = 0;
                }

                let sum1 = +elem.costHour.slice(1) * +elem.total_time_in_week;
                let sum2 = +elem.costHourExt.slice(1) * +elem.hoursExt;

                sum += sum1 + sum2;
            });

            return `$${sum.toFixed(2)}`;
        }

        const stylesheets = `
            .message {
                font-size: 2rem;
            }
            
            .container {
                width: 1000px;
                min-width: 1000px;
                border: 2px solid;
                margin-top: 0;
            }
            
            .container .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 1.2rem;
            }
            
            .container .title h3 {
                text-align: center;
                width: 100%;
            }
            
            .container .logo {
                width: 100px;
                height: 100px;
            }
            
            .container .client_info p {
                text-decoration: underline;
                font-size: 1.1rem;
                margin-left: 20px;
                margin-bottom: 10px;
                text-align: left;
            }
            
            .container .child:last-child {
                padding-bottom: 0;
            }
            
            .container .child .client_info {
                margin-bottom: 20px;
            }
            
            .container .child:not(:last-child) {
                border-bottom: 1px solid var(--slate-300);
            }
            
            .container table {
                width: 100%;
                border-collapse: collapse;
                font-size: 1.1rem;
            }
            
            .container table thead th {
                text-align: center;
            }
            
            .container table tbody th {
                text-align: left;
            }
            
            .container table td {
                font-weight: normal;
                text-align: center;
            }
            
            .container table td,
            .container table th {
                border-top: 1px solid;
                border-right: 1px solid;
                border-bottom: 1px solid;
                padding: 5px;
            }

            .table_total .first {
                text-align: start;
                border-right: none;
            }
        `;

        const childInfoHtml = formData.children.map((child, index, array) => {
            const isLastIteration = index === array.length - 1;

            let totalDueRow = '';

            if (isLastIteration) {
                totalDueRow = `
                    <tr class="table_total">
                        <td class="first">Total Due for Week:</td>
                        <td colspan="4">${formData.dates_interval}</td>
                        <td>${calculateTotalAmount()}</td>
                    </tr>
                `;
            }

            return `
                <div class="child">
        
                    <div class='client_info'>
                        <p>Child's name: <b>${child.child_name}</b></p>
                    </div>
        
                    <table className="SendEmailTable">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Number of weeks</th>
                                <th>Days</th>
                                <th>Hours</th>
                                <th>Cost for Per Hour</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
        
                        <tbody>
                            <tr>
                                <th>Weekly Attendance</th>
                                <td>${child.numberWeeks}</td>
                                <td>${child.total_days}</td>
                                <td>${child.total_time_in_week}</td>
                                <td>${child.costHour}</td>
                                <td>$${squareNumbers(Number(child.total_time_in_week), Number(child.costHour.slice(1))).toString()}</td>
                            </tr>
        
                            <tr>
                                <th>Extended Hours</th>
                                <td>${child.numberWeeksExt}</td>
                                <td>${child.hoursExt}</td>
                                <td>${child.daysExt}</td>
                                <td>${child.costHourExt}</td>
                                <td>${child.amountExt}</td>
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
                path: `http://localhost:8000/${formData.logo}`,
                cid: 'image1' /* Unique identifier of the image to be inserted into HTML */
            }]
        };

        await transporter.sendMail(mailOptions); /* Sending a letter */

        res.status(200).json({
            message: 'Email sent successfully',
        });
    } catch (error) {
        res.status(500).json(error);
    }
}

const paymentConfirm = async (req, res) => {
    try {
        const { subject, parent_email, message, parent_id } = req.body;

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

        await transporter.sendMail(mailOptions); /* Sending a letter */

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
