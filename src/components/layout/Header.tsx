import { signOut } from 'next-auth/react';
import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

const links = [
  { href: '/', label: 'Route 1' },
  { href: '/', label: 'Route 2' },
];

export default function Header() {
  return (
    <header className='bg-slate-900 sticky top-0 z-50'>
      <div className='flex h-14 items-center justify-between layout'>
        <UnstyledLink
          href='/'
          className='font-bold text-white text-xl md:text-2xl hover:text-gray-600'
        >
          meetme.com
        </UnstyledLink>

        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <li>
              <UnstyledLink
                href='#'
                onClick={() => signOut()}
                className='text-white hover:text-gray-600'
              >
                Signout
              </UnstyledLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
