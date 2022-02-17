import {
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import prisma from '@/lib/prisma';

import Seo from '@/components/Seo';
import moment from 'moment';

import { Capitalize } from '@/utils/Capitalize';
import { fetcher } from '@/utils/fetcher';
import { str } from '@/utils/FormatDate';
interface props {
  user: any;
  link: string;
}
function Event({ user, link }: props) {
  const [usr] = useState([JSON.parse(user)]);
  const [clicked, setClicked] = useState(false);
  const [dateTime, setDateTime] = useState(str);
  const [active, setACtive] = useState(false);
  const [additional, setAdditional] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [additionalEmail, setAdditionalEmail] = useState('');
  const router = useRouter();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDateTime(e.target.value);
    setACtive(true);
  };
  const bookHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      name: name,
      email: email,
      notes: notes,
      guest: additionalEmail,
    };
    if (name !== '' && email !== '') {
      const dt = router.query.date;
      const resp = await fetcher('/api/booking', {
        data,
        user: usr,
        dt,
      });
      if (resp.id) {
        router.replace(`/success/?booking=${resp.id}`);
        return;
      }
    }
  };
   const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() + 1).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

  return (
    <>
      <Seo templateTitle='Booking' />
      <div className='flex h-screen items-center justify-center w-[100%]'>
        <div className='border flex flex-wrap h-auto max-w-3xl px-4 py-4 shadow-xl space-x-2 w-[90%] md:w-1/2'>
          <div className='flex flex-col h-full items-start p-3 w-auto'>
            <p className='text-[15px] text-slate-900'>{usr[0]?.username}</p>
            <h2 className='text-[15px] text-slate-900 whitespace-nowrap md:text-[20px]'>
              {usr[0].events[0].title}
            </h2>
            <p className='flex items-center text-slate-900'>
              <ClockIcon className='h-4 mr-1' /> {usr[0].events[0].length}min
            </p>
          </div>
          {!clicked ? (
            <div className='flex flex-grow items-center justify-center'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(`${link}/?date=${dateTime.toString()}`);
                  setClicked(true);
                }}
              >
                <input
                  type='datetime-local'
                  min={dateTime}
                  className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                  value={dateTime}
                  onChange={(e) => handleDateChange(e)}
                />
                {active && (
                  <button
                    type='submit'
                    className='bg-slate-900 block border border-transparent duration-150 mt-4 px-4 py-2 rounded-lg text-center transition-colors w-full hover:bg-slate-800 focus:outline-none focus:shadow-outline-blue active:bg-dark-600'
                  >
                    <span className='flex font-medium items-center justify-center leading-5 text-sm text-white'>
                      Continue <ChevronRightIcon className='h-5 ml-2' />
                    </span>
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className='flex flex-grow items-center justify-center md:border-l md:pl-2'>
              <form
                method='POST'
                onSubmit={(e) => bookHandler(e)}
                className='p-2 w-full'
              >
                <div className='mt-4'>
                  <label className='block text-sm'>Your name</label>
                  <input
                    type='text'
                    className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                    placeholder='Username'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='mt-4 w-[100%]'>
                  <label className='block text-sm'>Email</label>
                  <input
                    type='email'
                    className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                    placeholder='Email Address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div
                  className='cursor-pointer flex items-center my-2 w-[100%]'
                  onClick={() => setAdditional(!additional)}
                >
                  <PlusIcon className='h-4 mr-1' /> Additional guests
                </div>
                {additional && (
                  <div>
                    <input
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                      placeholder='Additional email'
                      type='email'
                      value={additionalEmail}
                      onChange={(e) => setAdditionalEmail(e.target.value)}
                    />
                  </div>
                )}
                <div className='flex-grow'>
                  <label className='block mt-4 text-sm'>Additional notes</label>
                  <textarea
                    className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                    placeholder='Additional notes'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button
                  type='submit'
                  className='bg-slate-900 block border border-transparent duration-150 font-medium leading-5 mt-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-slate-800 focus:outline-none focus:shadow-outline-blue active:bg-dark-600'
                >
                  Confirm
                </button>
              </form>
            </div>
          )}
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
  // const dt: string = context?.query?.date || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    props: { user: JSON.stringify(user), link: context?.req?.url },
  };
}
