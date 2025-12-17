import 'dotenv/config'
import sendEmail from '../configs/nodeMailer.js'

const to = process.env.TEST_RECIPIENT || process.env.SENDER_EMAIL

async function run(){
  try{
    const res = await sendEmail({
      to,
      subject: 'Test email from Showtime',
      body: `<p>This is a test email sent at ${new Date().toISOString()}</p>`
    })
    console.log('sendMail response:', res)
  }catch(err){
    console.error('test email failed:', err && err.message ? err.message : err)
    process.exit(1)
  }
}

run()
