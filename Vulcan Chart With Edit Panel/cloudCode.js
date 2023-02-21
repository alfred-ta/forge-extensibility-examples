const getDefaultSiteNameId = async () => {
  const siteQuery = new Parse.Query('Site');
  const record = await siteQuery.first({ useMasterKey: true });
  if (!record || !record.get('nameId')) return null;
  return record.get('nameId');
};

const getChartURL = async (siteId) => {
  try {
    const siteNameId = await getDefaultSiteNameId();
    const CHART_MODEL_NAME = `ct____${siteNameId}____Chart`;
    const query = new Parse.Query(CHART_MODEL_NAME);
    query.equalTo('siteId', siteId);
    const record = await query.first();
    if (record && record.get('url')) return record.get('url');
  } catch(error) {
    console.error('inside getChartURL function', error);
  }
  return null;
};

const setChartURL = async (siteId, url) => {
  try {
    const siteNameId = await getDefaultSiteNameId();
    const CHART_MODEL_NAME = `ct____${siteNameId}____Chart`;
    const query = new Parse.Query(CHART_MODEL_NAME);
    query.equalTo('siteId', siteId);
    let record = await query.first();
    if (!record) {
      record = new Parse.Object(CHART_MODEL_NAME);
      record.set('siteId', siteId);
    }
    record.set('url', url);

    await record.save();
    return record.id;
  } catch(error) {
    console.error('inside setChartURL function', error);
  }
  return null;
};


Parse.Cloud.define("getChartURL", async (request) => {
  const { siteId } = request.params;
  try {
    const url = await getChartURL(siteId);
    
    return { status: 'success', url };
  } catch (error) {
    console.error('inside getChartURL cc', error);
    return { status: 'error', error };
  }
});

Parse.Cloud.define("setChartURL", async (request) => {
  const { siteId, url } = request.params;
  try {
    const id = await setChartURL(siteId, url);
    
    return { status: 'success', id };
  } catch (error) {
    console.error('inside setChartURL cc', error);
    return { status: 'error', error };
  }
});

