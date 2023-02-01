import React, { useState, useEffect } from 'react';
const Index = (props) => {
  
  const init = () => {
    forgeSDK.register.tab({
      component: 'main',
      name: "vulcan-chart",
      label: "Vulcan Chart",
      height: "500",
    });
  };
  useEffect(() => {
    forgeSDK.onReady(init);
  }, []);
  return (
    <div className='bg-extra-light-gray' testId='Index'>
      Index Page
    </div>
  );
};

export default Index;
