import React from 'react';

import UnstyledLink from './links/UnstyledLink';

function Sidebar({ pathname }: any) {
  return (
    <div className='absolute bg-slate-900 border flex h-screen justify-center left-0 mt-2 w-1/3 md:w-1/6'>
      <div className='flex flex-col h-full w-full'>
        <UnstyledLink href='/event-types'>
          <div
            className={
              pathname === '/event-types'
                ? 'border-b cursor-pointer flex justify-center px-4 py-2 text-md text-slate-900 text-white w-full bg-slate-700'
                : 'border-b cursor-pointer flex justify-center px-4 py-2 text-md text-slate-900 text-white w-full hover:bg-slate-800'
            }
          >
            EventType
          </div>
        </UnstyledLink>
        <UnstyledLink href='/bookings'>
          <div
            className={
              pathname !== '/event-types'
                ? 'border-b cursor-pointer flex justify-center px-4 py-2 text-md text-slate-900 text-white w-full bg-slate-700'
                : 'border-b cursor-pointer flex justify-center px-4 py-2 text-md text-slate-900 text-white w-full hover:bg-slate-800'
            }
          >
            Bookings
          </div>
        </UnstyledLink>
      </div>
    </div>
  );
}

export default Sidebar;
