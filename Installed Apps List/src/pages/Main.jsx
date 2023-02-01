import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';

import { initParse } from '@/lib';
const Main = (props) => {
  const [installedApps, setInstalledApps] = useState([]);
  const [objectId, setObjectId] = useState('');
  const init = async () => {
    initParse();
    const res = await Parse.Cloud.run('getUserInstalledApps', {
      siteId: import.meta.env.VITE_SITE_ID,
      userEmail: 'alfredtakala@yandex.com'
    });
    if (res.status === 'success') {
      setInstalledApps(res.apps || []);
      setObjectId(res.id);
    }
  };

  const onUninstallApp = async (app) => {
    const res = await Parse.Cloud.run('uninstallApp', {
      siteId: import.meta.env.VITE_SITE_ID,
      objectId,
      appId: app.id
    })
    console.log('the response of uninstall app', res);
  }

  useEffect(() => {
    init();
  }, []);
  console.log('installed apps', installedApps)
  return (
    <div className='bg-extra-light-gray p-4' testId='Index'>
      <h3 className=''>Installed Apps for the site.</h3>
      <div>
        {
          installedApps.map((app, index) => (<div key={app.id} className='flex justify-between p-2'>
            <div className='flex'>
              <div className='mr-4'>{index + 1}.</div>
              <div>{app.name}</div>
            </div>
            <div className='cursor-pointer text-blue-50' onClick={() => onUninstallApp(app)}>Remove</div>
          </div>))
        }
      </div>
    </div>
  );
};

export default Main;
