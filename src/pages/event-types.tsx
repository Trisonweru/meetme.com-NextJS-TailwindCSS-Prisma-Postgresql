/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClockIcon, LinkIcon, PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';
import React, { useState } from 'react';

import prisma from '@/lib/prisma';

import Button from '@/components/buttons/Button';
import Header from '@/components/layout/Header';
import Notification from '@/components/Notification';
import Seo from '@/components/Seo';
import Sidebar from '@/components/Sidebar';

import { Capitalize } from '@/utils/Capitalize';
import { LowerCase } from '@/utils/Lowercase';
interface props {
  events: any;
}
function EventTypes({ events }: props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleCopy = (username: string, length: any) => {
    navigator.clipboard.writeText(
      `http://${window.location.host}/${LowerCase(username)}/${length}min`
    );
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className='border h-screen layout relative'>
      <Header />
      <Seo templateTitle='Event Types' />
      <Sidebar pathname={router.pathname} />
      <div className='h-screen'>
        <div className='flex h-full'>
          <div className='flex flex-col items-end w-full'>
            <div className='flex justify-end w-2/3 md:w-5/6'>
              <Button
                //onClick={NewEventHandler}
                className='bg-white border-slate-500 duration-200 mt-2 text-slate-900 transition hover:bg-slate-800 focus-visible:ring-slate-500'
              >
                <PlusIcon className='h-4 mr-2' />
                New Event Type
              </Button>
            </div>
            <div className='flex flex h-full items-start px-4 py-4 w-2/3 md:w-5/6'>
              {JSON.parse(events).map((item: any) => {
                return (
                  <div
                    key={item.id}
                    className='flex flex-wrap items-center justify-center px-2 py-2 shadow-md w-full md:justify-between'
                  >
                    <div className='flex flex-col justify-center'>
                      <div className='flex flex-wrap items-center justify-center space-x-2 md:justify-start'>
                        <h3 className='text-[14px] whitespace-nowrap md:text-[17px]'>
                          {Capitalize(item.title)}
                        </h3>{' '}
                        <p className='text-[10px] whitespace-nowrap sm:text-[12px]'>
                          /{LowerCase(item.user.username)}/
                          {LowerCase(item.title)}
                        </p>
                      </div>
                      <div className='flex flex-wrap items-center justify-center mt-1 space-x-2 w-full md:justify-start'>
                        <ClockIcon className='h-4 mr-1' /> {item.length}min
                      </div>
                    </div>
                    <div
                      className='cursor-pointer flex items-center m-1 px-2 py-2 hover:border'
                      onClick={() =>
                        handleCopy(item.user.username, item.length)
                      }
                    >
                      <LinkIcon className='h-6' />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Notification showSuccess={showSuccess} />
    </div>
  );
}

export default EventTypes;

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

  const user = await prisma?.user.findUnique({
    where: {
      email: session.user?.email || '',
    },
  });

  const events = await prisma?.eventType.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
    },
  });

  return {
    props: { session, events: JSON.stringify(events) },
  };
}
