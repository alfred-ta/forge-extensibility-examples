import React from 'react';
import PuffLoader from 'react-spinners/PuffLoader';

export default function Loading() {
  return (
    <div className='loading-wrapper'>
      <PuffLoader color={'#A3003F'} />
    </div>
  );
}
