import React, { useState, useEffect } from 'react';
const Index = (props) => {
  
  const init = (args) => {
    console.log('the data from server', args);
    window.forgeSDK.register.tab({
      component: 'main',
      name: "user-installed-apps",
      label: "User Installed Apps",
      height: "500",
    });
  };
  useEffect(() => {
    window.forgeSDK.onReady(init);
  }, []);
  return (
    <div className='bg-extra-light-gray' testId='Index'>
      Index Page
    </div>
  );
};

export default Index;
