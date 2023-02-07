import React, { useState, useEffect, useContext } from 'react';
import Parse from 'parse/dist/parse.min.js';
import toast from 'react-hot-toast';

import { initParse } from '@/lib';
import { useQuery } from '@/lib/useQuery'

const Main = () => {
  const [installedApps, setInstalledApps] = useState([]);
  const [objectId, setObjectId] = useState('');

  let query = useQuery();

  const init = async () => {
    initParse();
    const res = await Parse.Cloud.run('getUserInstalledApps', {
      userId: query.get('userId')
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
    if (query.get('userId')) init();
  }, [query]);

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
