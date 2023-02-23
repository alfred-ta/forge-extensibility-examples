import React, { useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import { initParse } from '@/lib';

const Index = () => {
  const init = async (args) => {
    console.log('inside init', args)
    initParse();
    const siteId = args?.activeSite?.id;
    const res = await Parse.Cloud.run('getChartURL', {
      siteId
    });
    console.log('inside indx page', res);
    if (res.status === 'success') {
      window.forgeSDK.register.tab({
        component: res.url || '/',
        edit: `/edit`,
        name: "plugin-vulcan-chart",
        label: "Vulcan Chart plugin",
        height: "500",
      });
    }
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
