const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    } catch (err) {
        console.error('Email error:', err.message);
    }
};

exports.createContact = async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;
        const contact = await Contact.create({ name, email, mobile, subject, message });

        await sendEmail(process.env.ADMIN_EMAIL, `New Enquiry from ${name}`, `
      <h3>New contact enquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
      <p><strong>Message:</strong> ${message}</p>
    `);

        await sendEmail(email, 'Thank you for contacting SKETCH_VIBES23', `
      <h2>Hello ${name}!</h2>
      <p>Thank you for reaching out. We have received your message and will get back to you within 24 hours.</p>
      <p>You can also reach us on WhatsApp: <strong>+91 7806906030</strong></p>
      <br><p>- SKETCH_VIBES23 | Artist Saran</p>
    `);

        res.status(201).json({ success: true, data: contact, message: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
