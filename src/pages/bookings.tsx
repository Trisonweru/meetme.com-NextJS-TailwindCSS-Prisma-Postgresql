/* eslint-disable @typescript-eslint/no-explicit-any */
import { XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';
import React, { useState } from 'react';

import prisma from '@/lib/prisma';

import Button from '@/components/buttons/Button';
import Header from '@/components/layout/Header';
import Seo from '@/components/Seo';
import Sidebar from '@/components/Sidebar';

import { fetcher } from '@/utils/fetcher';

interface props {
  bookings: string;
  session: any;
  cancelled: any;
}
function Bookings({ session, bookings, cancelled }: props) {
  const [bkings, setBookings] = useState([...JSON.parse(bookings)]);
  const [cancelledBookings, setCancelledBookings] = useState([
    ...JSON.parse(cancelled),
  ]);
  const [available, setAvailable] = useState(true);
  const [cancel, setCancel] = useState(false);

  const router = useRouter();

  const cancelHandler = async (id: any) => {
    const res = await fetcher('/api/cancel', { itemId: id, session });
    if (res.id) {
      bkings.map((item, index: any) => {
        if (item.id === id) {
          bkings.splice(index, 1);
          setBookings([...bkings]);
          setCancelledBookings((prev) => [...prev, item].reverse());
        }
      });
    }
  };

  return (
    <div className='border-r h- h-screen layout relative'>
      <Header />
      <Seo templateTitle='Event Types' />
      <Sidebar pathname={router.pathname} />
      <div className='h-full overflow-y-scroll scrollbar-hide'>
        <div className='flex h-full'>
          <div className='flex flex-col items-end w-full'>
            <div className='flex items-center justify-start px-4 py-4 space-x-2 w-2/3 md:w-5/6'>
              <div
                onClick={() => {
                  setCancel(false);
                  setAvailable(true);
                }}
                className={
                  available
                    ? 'border-b-2 border-slate-900 cursor-pointer flex items-center text-sm'
                    : ' cursor-pointer flex items-center text-sm'
                }
              >
                Available
              </div>
              <div
                onClick={() => {
                  setCancel(true);
                  setAvailable(false);
                }}
                className={
                  cancel
                    ? 'border-b-2 border-slate-900 cursor-pointer flex items-center text-sm'
                    : ' cursor-pointer flex items-center text-sm'
                }
              >
                Cancelled
              </div>
            </div>
            {available ? (
              <div className='flex flex-col h-full items-start px-4 py-4 w-2/3 md:w-5/6'>
                {bkings.map((item: any) => {
                  const oldDateObj = new Date(item.dateTime);
                  const newDateObj = new Date();
                  newDateObj.setTime(oldDateObj.getTime() + 30 * 60 * 1000);
                  return (
                    <div
                      key={item.id}
                      className='flex flex-wrap items-center justify-center px-2 py-2 shadow-md w-full md:justify-between'
                    >
                      <div className='flex flex-col items-center justify-start px-2 py-2'>
                        <div className='text-slate-800 text-sm'>
                          {oldDateObj.toDateString()}
                        </div>

                        <div className='text-slate-500 text-xs'>
                          {oldDateObj.toLocaleTimeString().split(' ')[0]} -{' '}
                          {newDateObj.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className='flex flex-col flex-grow ml-3 text-slate-900 text-sm'>
                        {item.event.title} between {item.event.user.username}{' '}
                        and {item.attendee.name}
                      </div>
                      <div>
                        <div>
                          {' '}
                          <Button
                            onClick={() => cancelHandler(item.id)}
                            className='bg-white border-slate-500 duration-200 mt-2 text-slate-900 transition hover:bg-slate-900 focus-visible:ring-slate-500 active:bg-slate-800'
                          >
                            <XIcon className='h-4 mr-2' />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : cancel ? (
              <div className='flex flex-col h-full items-start px-4 py-4 w-2/3 md:w-5/6'>
                {cancelledBookings.map((item: any) => {
                  const oldDateObj = new Date(item.dateTime);
                  const newDateObj = new Date();
                  newDateObj.setTime(oldDateObj.getTime() + 30 * 60 * 1000);
                  return (
                    <div
                      key={item.id}
                      className='flex flex-wrap items-center justify-center px-2 py-2 shadow-md w-full md:justify-between'
                    >
                      <div className='flex flex-col items-center justify-start px-2 py-2'>
                        <div className='text-slate-800 text-sm'>
                          {oldDateObj.toDateString()}
                        </div>

                        <div className='text-slate-500 text-xs'>
                          {oldDateObj.toLocaleTimeString().split(' ')[0]} -{' '}
                          {newDateObj.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className='flex flex-col flex-grow ml-3 text-slate-900 text-sm'>
                        {item.event.title} between {item.event.user.username}{' '}
                        and {item.attendee.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context); // get the session
  //else redict to home page.
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const bookings = await prisma?.booking.findMany({
    where: {
      canceled: false,
    },
    include: {
      event: {
        include: {
          user: true,
        },
      },
      attendee: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const cancelledBookings = await prisma?.booking.findMany({
    where: {
      canceled: true,
    },
    include: {
      event: {
        include: {
          user: true,
        },
      },
      attendee: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    props: {
      session,
      bookings: JSON.stringify(bookings),
      cancelled: JSON.stringify(cancelledBookings),
    },
  };
}
