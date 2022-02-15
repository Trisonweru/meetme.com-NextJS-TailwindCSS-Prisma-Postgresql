/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import { useRouter } from 'next/router';
//import { getSession, GetSessionParams } from 'next-auth/react';
import { useState } from 'react';

import Seo from '@/components/Seo';

import { fetcher } from '../utils/fetcher';

export default function Signup() {
  const [username, setUsername] = useState(''); //handles name field value
  const [email, setEmail] = useState(''); //handles email field value
  const [password, setPassword] = useState(''); //handles password field value
  const [confirm_password, setConfirmPassword] = useState(''); //handles confirm password field value
  const [error, setError] = useState(false); //handles password field error
  const [emailError, setEmailError] = useState(false); //handles email field error
  const [emailNullError, setEmailNullError] = useState(false); //handles email field error
  const [passError, setPassError] = useState(false); //handles password field error
  const [usernameError, setUsernameError] = useState(false); //hanldes errors from api
  const router = useRouter();

  const signUp = async (e: any) => {
    e.preventDefault();
    if (password != confirm_password) {
      setError(true);
      setTimeout(() => setError(false), 5000);
      return;
    }
    if (email == '') {
      setEmailNullError(true);
      setTimeout(() => setEmailNullError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    if (password == '') {
      setPassError(true);
      setTimeout(() => setPassError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    if (username == '') {
      setUsernameError(true);
      setTimeout(() => setUsernameError(false), 5000); //display the error to the user then dissapear within 5seconds
      return;
    }
    if (password != '' && email != '' && username != '') {
      const body = {
        username,
        email,
        password,
        createdAt: new Date().toLocaleString('en-US'),
        updatedAt: new Date().toLocaleString('en-US'),
      };
      const res = await fetcher('/api/create_user', { user: body }); //display the error to the user then dissapear within 5seconds
      setEmail('');
      setPassword('');
      setUsername('');
      setConfirmPassword('');
      if (res.status == 400) {
        setEmailError(true);
        setTimeout(() => setEmailError(false), 5000);
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <>
      <Seo templateTitle='Sign up  ' />
      <div className='bg-gray-50 flex items-center min-h-screen'>
        <div className='bg-white flex-1 h-full max-w-4xl mx-auto rounded-lg shadow-xl'>
          <div className='flex flex-col md:flex-row'>
            <div className='h-32 md:h-auto md:w-1/2'>
              <div className='flex flex-col h-full items-center justify-center p-6 space-y-4 w-full'>
                <h2 className='text-3xl text-center text-slate-900 md:text-5xl'>
                  One step closer to schedule your meetings
                </h2>
                <p className='text-center text-md text-slate-900 md:text-lg'>
                  Easy, fast and secure to schedule your meetings. Never been
                  simple than creating a link for your guests to book your
                  events.{' '}
                </p>
              </div>
            </div>
            <div className='flex items-center justify-center p-6 sm:p-12 md:w-1/2'>
              <div className='w-full'>
                <div className='flex justify-center'>
                  <h1 className='font-bold mb-4 mt-4 text-center text-slate-900 text-xl md:text-2xl'>
                    meetme.com
                  </h1>
                </div>
                <h3 className='font-bold mb-4 mt-4 text-center text-gray-700 text-md md:text-xl'>
                  Sign up
                </h3>

                {error ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      Password do not match!
                    </h1>
                  </div>
                ) : emailError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      Email already exists!
                    </h1>
                  </div>
                ) : emailNullError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      Email field cannot be empty!
                    </h1>
                  </div>
                ) : passError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      Password field cannot be empty!
                    </h1>
                  </div>
                ) : usernameError ? (
                  <div className='flex justify-center'>
                    <h1 className='font-regular mb-2 mt-2 text-base text-center text-red-700'>
                      Username field cannot be empty!
                    </h1>
                  </div>
                ) : (
                  ''
                )}
                <form method='POST' onSubmit={signUp}>
                  <div className='mt-4'>
                    <label className='block text-sm'>Username</label>
                    <input
                      type='text'
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                      placeholder='Username'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className='mt-4'>
                    <label className='block text-sm'>Email</label>
                    <input
                      type='email'
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                      placeholder='Email Address'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block mt-4 text-sm'>Password</label>
                    <input
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                      placeholder='Password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block mt-4 text-sm'>
                      Confirm password
                    </label>
                    <input
                      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
                      placeholder='Confirm password'
                      type='password'
                      value={confirm_password}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='bg-slate-900 block border border-transparent duration-150 font-medium leading-5 mt-4 px-4 py-2 rounded-lg text-center text-sm text-white transition-colors w-full hover:bg-slate-800 focus:outline-none focus:shadow-outline-blue active:bg-dark-600'
                  >
                    Sign up
                  </button>
                </form>

                <div className='mt-4 text-center'>
                  <p className='text-sm'>
                    Already have an account?{' '}
                    <a href='/login' className='text-blue-600 hover:underline'>
                      {' '}
                      Sign in.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// export async function getServerSideProps(
//   context: GetSessionParams | undefined
// ) {
//   const session = await getSession(context);
//   // there is a session, user is logged in and redirect to home page
//   if (session) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// }
