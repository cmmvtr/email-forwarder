export default {
  async email(message, env, ctx) {
    const FORWARD_EMAIL = 'communistov.kboch@icloud.com';

    const fromAddress = message.headers.get('From');
    const subject = message.headers.get('Subject');
    const toAddress = message.headers.get('To');
    const rawBody = await message.text();

    if (subject.startsWith('send:')) {
      const targetEmail = subject.slice(5).trim();
      const replyMessage = new EmailMessage();
      replyMessage.setTo([targetEmail]);
      replyMessage.setFrom(FORWARD_EMAIL);
      replyMessage.setSubject(`Re: ${subject}`);
      replyMessage.setBody(rawBody);

      await env.SENDMAIL.send(replyMessage);
    } else {
      const isSpam = checkIfSpam(fromAddress);
      const forwardSubject = isSpam ? 'SPAM: ' + subject : 'INBOX: ' + subject;

      const forwardedMessage = new EmailMessage();
      forwardedMessage.setTo([FORWARD_EMAIL]);
      forwardedMessage.setFrom(toAddress);
      forwardedMessage.setSubject(forwardSubject);
      forwardedMessage.setBody(rawBody);

      await env.SENDMAIL.send(forwardedMessage);
    }
  }
}

function checkIfSpam(email) {
  const spamDomains = ['spammer.com', 'junkmail.com'];
  return spamDomains.some(domain => email.endsWith('@' + domain));
}
