const Ticket = require('../Models/Ticket');
const cron = require('node-cron');
const moment = require('moment');
const nodemailer = require('nodemailer');

const cronJob = cron.schedule('0 12 * * *', async () => {
  try {
    // İki gün önceki tarihi hesapla.
    const twoDaysAgo = moment().subtract(2, 'days');

    // "in_progress" durumunda olan ve iki veya daha fazla gün önce oluşturulmuş biletleri bul.
    const ticketsInProgress = await Ticket.find({
      status: 'in_progress',
      createdDate: { $lte: twoDaysAgo.toDate() },
    }).populate('department');

    // Eğer bilet varsa, bir e-posta gönder.
    if (ticketsInProgress.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'seyrekeren981@gmail.com', // Gönderen hesap bilgileri
          pass: 'mysalzqopwpzkifn',
        },
      });

      const mailOptions = {
        from: 'example@gmail.com',
        to: 'seyrekeren@hotmail.com', // Alıcı adresi
        subject: 'Uyarı: Biletler "in_progress" durumunda',
        html: `
          <p>Merhaba,</p>
          <p>Aşağıdaki biletler "in_progress" durumunda ve iki günden daha uzun süredir tamamlanmamıştır:</p>
          <ul>
            ${ticketsInProgress.map(ticket => `
              <li>
                <strong>Departman:</strong> ${ticket.department.name}<br>
                <strong>Oluşturan:</strong> ${ticket.createdBy}<br>
                <strong>Açıklama:</strong> ${ticket.description}<br>
                <strong>Oluşturulma Tarihi:</strong> ${moment().format('DD.MM.YYYY hh:mm:ss')}
              </li>
            `).join('')}
          </ul>
          <p>Lütfen bu biletleri kontrol edin ve gerekli işlemleri yapın.</p>
          <p>İyi günler!</p>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Mesaj gönderildi: ${info.messageId}`);
    }
  } catch (err) {
    console.error(err);
  }
});
/*
const cronJob2 = cron.schedule('* * * * *', async () => {
    try {
      // İki gün önceki tarihi hesapla.
      const twoDaysAgo = moment().subtract(1, 'minute');
  
      // "in_progress" durumunda olan ve iki veya daha fazla gün önce oluşturulmuş biletleri bul.
      const ticketsInProgress = await Ticket.find({
        status: 'in_progress',
        createdDate: { $lte: twoDaysAgo.toDate() },
      }).populate('department');
  
      // Eğer bilet varsa, bir e-posta gönder.
      if (ticketsInProgress.length > 0) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'seyrekeren981@gmail.com', // Gönderen hesap bilgileri
            pass: 'mysalzqopwpzkifn',
          },
        });
  
        const mailOptions = {
          from: 'example@gmail.com',
          to: 'seyrekeren@hotmail.com', // Alıcı adresi
          subject: 'Uyarı: Biletler "in_progress" durumunda',
          html: `
            <p>Merhaba,</p>
            <p>Aşağıdaki biletler "in_progress" durumunda ve iki günden daha uzun süredir tamamlanmamıştır:</p>
            <ul>
              ${ticketsInProgress.map(ticket => `
                <li>
                  <strong>Departman:</strong> ${ticket.department.name}<br>
                  <strong>Oluşturan:</strong> ${ticket.createdBy}<br>
                  <strong>Açıklama:</strong> ${ticket.description}<br>
                  <strong>Oluşturulma Tarihi:</strong> ${moment().format('DD.MM.YYYY hh:mm:ss')}
                </li>
              `).join('')}
            </ul>
            <p>Lütfen bu biletleri kontrol edin ve gerekli işlemleri yapın.</p>
            <p>İyi günler!</p>
          `,
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log(`Mesaj gönderildi: ${info.messageId}`);
      }
    } catch (err) {
      console.error(err);
    }
  });
  */
module.exports = {cronJob, }