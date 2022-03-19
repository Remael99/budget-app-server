import nodemailer, { SendMailOptions } from "nodemailer";
import { google } from "googleapis";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function sendEMail(payload: SendMailOptions) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      //@ts-ignore
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "remael99@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      ...payload,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}
