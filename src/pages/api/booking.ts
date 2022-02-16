import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prisma';
//An API to help create a user when they sign up.

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
      return res.status(200).json(booking);
    }
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};
