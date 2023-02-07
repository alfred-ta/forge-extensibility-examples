import React, { useEffect, useContext } from 'react';
import Context from './Context';
const Index = (props) => {
  const { setServerUserId } = useContext(Context);
  const init = (args) => {

    if (args.currentUser && args.currentUser.id) {
      setServerUserId(args.currentUser.id);
    }
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
