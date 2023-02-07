import React, { useState, useEffect, useContext } from 'react';
import Parse from 'parse/dist/parse.min.js';
import toast from 'react-hot-toast';

import Context from './Context';
import { initParse } from '@/lib';

const Main = () => {
  const [installedApps, setInstalledApps] = useState([]);
  const [objectId, setObjectId] = useState('');
  const { serverUserId } = useContext(Context);
  const init = async () => {
    initParse();
    const res = await Parse.Cloud.run('getUserInstalledApps', {
      siteId: import.meta.env.VITE_SITE_ID,
      userId: serverUserId
    });
    if (res.status === 'success') {
      setInstalledApps(res.apps || []);
      setObjectId(res.id);
    }
  };

  const onUninstallApp = async (app) => {
    if (window.confirm(`Are you sure to remove the app ${app.name}.`)) {
      const res = await Parse.Cloud.run('uninstallApp', {
        siteId: import.meta.env.VITE_SITE_ID,
        objectId,
        appId: app.id
      })
      if (res.status === 'success' && res.removedId) {
        toast('Successfully removed the app!');
        init();
      }
    }
  }

  useEffect(() => {
    init();
  }, []);
  console.log('installed apps', installedApps)
  return (
    <div className='p-4' testId='Index'>
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
