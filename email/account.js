const sendgrid=require('@sendgrid/mail');

const sendgridkey='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'

sendgrid.setApiKey(sendgridkey)
const sentemail=sendgrid.send({
    'to':'haleshgollar@gmail.com',
    'from':'haleshgollar@gmail.com',
    'subject':'welcome',
    'text':"welcome"
})