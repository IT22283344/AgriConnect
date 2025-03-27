import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send order confirmation email
export const sendOrderConfirmationEmail = async (order, user) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation - Farmer Management System',
            html: `
                <h2>Order Confirmation</h2>
                <p>Dear ${user.name},</p>
                <p>Thank you for your order! Your order has been successfully placed.</p>
                
                <h3>Order Details:</h3>
                <p>Order ID: ${order._id}</p>
                <p>Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Total Amount: $${order.totalAmount}</p>
                
                <h3>Order Items:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                    </tr>
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.product.name}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">$${item.price}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h3>Shipping Address:</h3>
                <p>${order.shippingAddress}</p>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>Farmer Management System Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}; 