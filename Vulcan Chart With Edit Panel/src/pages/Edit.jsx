import React, { useState, useEffect } from 'react';
import Parse from 'parse/dist/parse.min.js';
import toast from 'react-hot-toast';
import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'

import { initParse } from '@/lib';

const Edit = () => {
  const [chartURL, setChartURL] = useState('');
  const [siteId, setSiteId] = useState('');
  const [loading, setLoading] = useState(false);


  const init =(args) => {
    initParse();
    setSiteId(args?.activeSite?.id);
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
    if (!chartURL || !siteId) {
      toast.warning('Insufficient information');
    }
    setLoading(true);
    const res = await Parse.Cloud.run('setChartURL', {
      siteId,
      url: chartURL
    });

    if (res.status === 'success' && res.id) {
      toast.success('Successfully updated the url.');
    }
    setLoading(false);
  }

  useEffect(() => {
    if (siteId) getChartURL();
  }, [siteId]);

  useEffect(() => {
    window.forgeSDK.onReady(init);
  }, []);


  return (
    <div className='p-4' testId='Edit'>
      <h3 className='mb-10'>Vulcan Chart Edit Panel.</h3>
      <Input name='url' label='URL' value={chartURL} onChange={setChartURL} />
      <div className='text-center'>
        <Button disabled={!siteId || !chartURL || loading} onClick={onSave}>Save</Button>
      </div>
      { loading && <Loading /> }
    </div>
  );
};

export default Edit;
