import React, { useEffect } from 'react';

const Index = () => {
  const init = (args) => {
    window.forgeSDK.register.tab({
      component: `main?userId=${args?.currentUser?.id || ''}`,
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
