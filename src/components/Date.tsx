import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { str } from '@/utils/FormatDate';
function Date() {
  const [dateTime, setDateTime] = useState(str);
  const router = useRouter();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDateTime(e.target.value);
    router.push(`/?date=${dateTime}`);
  };
  return (
    <input
      type='datetime-local'
      className='border px-4 py-2 rounded-md text-sm w-full focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600'
      value={dateTime}
      onChange={(e) => handleDateChange(e)}
    />
  );
}

export default Date;
