const  { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>This is the email body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "subject",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "prajaktamule90@gmail.com",
    "prajakta@devshub.co.in",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };