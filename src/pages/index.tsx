import { getSession, GetSessionParams } from 'next-auth/react';
import * as React from 'react';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage(session: any) {
  const NewEventHandler = async () => {
    // const res = await fetcher('/api/new_event', { session });
    //console.log(res);
  };
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo templateTitle='Home' />
      <Header />
    </Layout>
  );
}

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
  if (session) {
    return {
      redirect: {
        destination: '/event-types',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
