import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import toast from 'react-hot-toast';
import Button from '@/components/Button'
import Input from '@/components/Input'

import { initParse } from '@/lib';

const Edit = () => {
  const [chartURL, setChartURL] = useState('');
  const [siteId, setSiteId] = useState('');


  const init =(args) => {
    initParse();
    setSiteId(args?.currentSite?.id);
  };

  const getChartURL = async() => {
    const res = await Parse.Cloud.run('getChartURL', {
      siteId
    });
    if (res.status === 'success') {
      setChartURL(res.url);
    }
  }

  const onSave = async() => {
    if (!url || !siteIdRef.current) {
      toast.warning('Insufficient information');
    }
  }

  useEffect(() => {
    if (siteId) getChartURL();
  }, [siteId]);

  useEffect(() => {
    window.forgeSDK.onReady(init);
  }, []);


  return (
    <div className='p-4' testId='Index'>
      <h3 className='mb-10'>Vulcan Chart Edit Panel.</h3>
      <Input name='url' label='URL' value={chartURL} onChange={setChartURL} />
      <div className='text-center'>
        <Button disabled={!siteId || !url} onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};

export default Edit;
