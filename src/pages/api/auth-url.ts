import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

import { encodeOAuthState } from '@/utils/util';
//An API to help create a user when they sign up.
const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
};
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Check if the request type if its post, if not we send status 405 with a message of method not aloowed.
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  // if user, we create the user in the database using prisma create function.
  const { session } = req.body;

  if (!session) {
    return res.status(401).json({ status: 401, message: 'Not authorized' });
  }
  try {
    const BASE_URL = 'http://localhost:3000';
    const { client_secret, client_id } = credentials;
    const redirect_uri = BASE_URL + '/success/callback';
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uri
    );

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      // A refresh token is only returned the first time the user
      // consents to providing access.  For illustration purposes,
      // setting the prompt to 'consent' will force this consent
      // every time, forcing a refresh_token to be returned.
      prompt: 'consent',
      state: encodeOAuthState(req),
    });

    res.status(200).json({ url: authUrl });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};
