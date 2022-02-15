import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';
import React from 'react';

import Header from '@/components/layout/Header';
import Seo from '@/components/Seo';
import Sidebar from '@/components/Sidebar';

function Bookings() {
  const router = useRouter();

  return (
    <div className='border h-screen layout relative w-full'>
      <Header />
      <Seo templateTitle='Event Types' />
      <Sidebar pathname={router.pathname} />
      <div className='h-screen'>
        <div className='flex h-full items-start'>
          <div className='flex flex-1'>Bookings</div>
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

  return {
    props: { session },
  };
}
