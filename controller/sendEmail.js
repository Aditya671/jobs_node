import nodemailer from 'nodemailer';

export const sendEmail = async (req,res) =>{
   let testAccount = await nodemailer.createTestAccount()
   const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'vvisdda4cho64ywe@ethereal.email',
          pass: 'VSMA62KsAFUJepkN2y'
      }
  });

  let info = await transporter.sendMail({
   from: '"Fred Foo 👻" <foo@example.com>', // sender address
   to: "bar@example.com, baz@example.com", // list of receivers
   subject: "Hello ✔", // Subject line
   text: "Hello world?", // plain text body
   html: "<b>Hello world?</b>", // html body
 });
 console.log(info.messageId)
}