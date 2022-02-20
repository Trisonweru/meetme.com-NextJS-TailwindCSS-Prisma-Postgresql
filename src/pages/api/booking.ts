/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
//An API to help create a user when they sign up.
import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prisma';

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS!);
const calendarId = process.env.CALENDER_ID;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null!,
  CREDENTIALS.private_key,
  SCOPES
);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //Check if the request type if its post, if not we send status 405 with a message of method not aloowed.
  if (req.method != 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }
  // if user, we create the user in the database using prisma create function.
  try {
    const { data, user, dt } = req.body;
    const attendee = await prisma?.attendee.create({
      data: data,
    });
    if (attendee) {
      const booking = await prisma?.booking.create({
        data: {
          attendeeId: attendee.id,
          eventId: user[0].events[0].id,
          dateTime: new Date(dt),
        },
      });
      const startDate = new Date(dt);
      const timeZone = 'Africa/Nairobi';
      const duration = `00:${user[0].events[0].length}:00`;

      const msDuration =
        (Number(duration.split(':')[0]) * 60 * 60 +
          Number(duration.split(':')[1]) * 60 +
          Number(duration.split(':')[2])) *
        1000;
      const endDate = new Date(startDate.getTime() + msDuration);
      const isoStartDate = new Date(
        startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split('.')[0];
      const isoEndDate = new Date(
        endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split('.')[0];

      const insertEvent = async (_event: {
        summary: any;
        description: any;
        start: { dateTime: string; timeZone: string };
        end: { dateTime: string; timeZone: string };
      }) => {
        try {
          const response: any = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            requestBody: event,
          });

          if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
          } else {
            return 0;
          }
        } catch (error) {
          console.log(`Error at insertEvent --> ${error}`);
          return 0;
        }
      };

      // Event for Google Calendar
      const event = {
        summary: user[0].events[0].title,
        description: user[0].events[0].description,
        start: {
          dateTime: isoStartDate,
          timeZone: timeZone,
        },
        end: {
          dateTime: isoEndDate,
          timeZone: timeZone,
        },
      };

      insertEvent(event)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      return res.status(200).json(booking);
    }
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};
