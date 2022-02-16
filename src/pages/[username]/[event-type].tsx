import { ClockIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';

import prisma from '@/lib/prisma';

import Date from '@/components/Date';
import Seo from '@/components/Seo';

import { Capitalize } from '@/utils/Capitalize';

interface props {
  user: any;
}
function Event({ user }: props) {
  const [usr] = useState([JSON.parse(user)]);

  return (
    <>
      <Seo templateTitle='Booking' />
      <div className='flex h-screen items-center justify-center w-[100%]'>
        <div className='border flex flex-wrap h-auto max-w-3xl px-4 py-4 shadow-xl space-x-2 w-[90%] md:w-1/2'>
          <div className='flex flex-col h-full items-start p-3 w-auto'>
            <p className='text-[15px]'>{usr[0]?.username}</p>
            <h2 className='text-[15px] whitespace-nowrap md:text-[20px]'>
              {usr[0].events[0].title}
            </h2>
            <p className='flex items-center'>
              <ClockIcon className='h-4 mr-1' /> {usr[0].events[0].length}min
            </p>
          </div>
          <div className='flex flex-grow items-center justify-center'>
            <Date />
          </div>
        </div>
      </div>
    </>
  );
}

export default Event;

export async function getServerSideProps(context: {
  query: { date: string };
  req: { url: string };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dt: string = context?.query?.date || '';
  const url: any = context?.req?.url?.split('/');
  const username = Capitalize(url[1]);
  // const eventType = url[2];

  const user = await prisma?.user.findUnique({
    where: {
      username: username,
    },
    include: {
      events: true,
    },
  });

  return {
    props: { user: JSON.stringify(user) },
  };
}
