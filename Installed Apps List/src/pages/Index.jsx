import React, { useEffect } from 'react';

const Index = () => {
  const init = () => {
    window.forgeSDK.register.siteTab({
      component: `/main`,
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
