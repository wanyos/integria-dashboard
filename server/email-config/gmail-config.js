import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'juanjor99@gmail.com',
    pass: 'wiso dlec oblp qoon',
  },
})

export const sendGmail = async (options) => {
  const gm = await transporter.sendMail({
    from: '"Juan Jose Romero Ramos" <juanjor99@gmail.com>',
    to: options.to,
    subject: options.subject,
    text: options?.text,
    html: options?.html,
    attachments: [
      {
        filename: options?.fileName,
        content: options?.fileData,
      },
    ],
  })
  console.log('message sent...', gm.messageId)
}
