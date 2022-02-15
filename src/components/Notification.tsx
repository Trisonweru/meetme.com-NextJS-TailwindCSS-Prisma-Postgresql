import { CheckCircleIcon } from '@heroicons/react/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface props {
  showSuccess?: boolean;
}

function Notification({ showSuccess }: props) {
  return (
    <AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 1,
          }}
          exit={{ y: '100%', opacity: 0 }}
          className='absolute bottom-0 flex justify-end left-0 mb-4 right-0 w-full z-50'
        >
          <div className='bg-slate-900 flex items-center justify-between max-w-[40%] min-h-[50px] px-3 shadow-xl sm:max-w-[25%]'>
            <p className='center flex items-center text-center text-white whitespace-nowrap'>
              <CheckCircleIcon className='h-6 mr-2' />
              Link copied!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
