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
  const { session } = req.body;

  if (!session) {
    return res.status(401).json({ status: 401, message: 'Not authorized' });
  }
  try {
    const user = await prisma?.user.findUnique({
      where: {
        email: session.session.user.email,
      },
    });
    const savedEvent = await prisma?.eventType.create({
      data: {
        title: 'Requirements discussion',
        description: 'To discuss app requirements discussion.',
        length: '30',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: user!.id,
      },
    });
    //we send a 200 code status on creating succesful with the saved event object.
    res.status(200).json(savedEvent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    //if any error during the creation proces we catch it and send the error message to the frontend.
    res.status(400).json({ status: 400, message: err.message });
  }
};
