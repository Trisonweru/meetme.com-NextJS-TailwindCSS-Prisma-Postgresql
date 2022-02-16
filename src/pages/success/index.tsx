/* eslint-disable @typescript-eslint/no-explicit-any */

import { CheckIcon } from '@heroicons/react/outline';
import React from 'react';

import prisma from '@/lib/prisma';

import Seo from '@/components/Seo';

function Success({ booking }: any) {
  const fetchedBooking = JSON.parse(booking);
  return (
    <>
      <Seo templateTitle='Success' />
      <div className='flex items-center justify-center min-h-screen w-[100%]'>
        <div className='border flex flex-col flex-wrap h-auto items-center justify-center max-w-3xl px-4 py-4 shadow-xl space-x-2 space-y-3 w-[90%] md:w-1/2'>
          <div className='bg-slate-900 border flex items-center justify-center px-2 py-2 rounded-full text-white'>
            <CheckIcon className='h-6' />
          </div>
          <div>
            <h3>Meeting scheduled</h3>
          </div>
          <div className='border-b border-t flex flex-col items-center justify-center w-full'>
            <div className='border flex flex-auto items-center justify-evenly w-full'>
              <div className='flex font-bold items-center px-2 py-2 text-slate-900'>
                What
              </div>
              <div className='flex flex-grow items-center px-2 py-2 text-slate-900 md:px-6'>
                {fetchedBooking.event.title} between{' '}
                {fetchedBooking.event.user.username} and{' '}
                {fetchedBooking.attendee.name}
              </div>
            </div>
            <div className='border flex flex-auto items-center justify-evenly w-full'>
              <div className='flex font-bold items-center px-2 py-2 text-slate-900'>
                When
              </div>
              <div className='flex flex-grow items-center px-2 py-2 text-slate-900 md:px-6'>
                {new Date(fetchedBooking.dateTime).toUTCString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Success;

export async function getServerSideProps(context: {
  query: { booking: string };
  req: { url: string };
}) {
  const bookingId: any = context?.query.booking;

  // const eventType = url[2];
  if (!bookingId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const booking = await prisma?.booking.findFirst({
    where: {
      id: bookingId,
    },
    include: {
      attendee: true,
      event: {
        include: {
          user: true,
        },
      },
    },
  });

  console.log(booking);

  return {
    props: { booking: JSON.stringify(booking) },
  };
}
