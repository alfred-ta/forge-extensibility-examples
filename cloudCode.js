const getSiteNameId = async(siteId) => {
  const siteQuery = new Parse.Query('Site');
  siteQuery.equalTo('objectId', siteId);
  const siteRecord = await siteQuery.first({useMasterKey: true});
  if (!siteRecord || !siteRecord.get('nameId')) return null;
  return siteRecord.get('nameId');
}

Parse.Cloud.define('getSiteNameId', async (request) => {
  try {
    const { siteId } = request.params;
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }
    return { status: 'success', siteNameId };
  } catch(error) {
    console.log('Error in getSiteNameId', error);
    return { status: 'error', error };
  }
});


Parse.Cloud.define("getUserInstalledApps", async (request) => {
  const { siteId, userId } = request.params;
  try {
    const { list: apps, id } = await getUserInstalledApps(siteId, userId);
    
    return { status: 'success', apps, id };
  } catch (error) {
    console.error('inside getUserInstalledApps', error);
    return { status: 'error', error };
  }
});


Parse.Cloud.define("uninstallApp", async (request) => {
  const { siteId, appId, objectId } = request.params;
  try {
    const removedId = await uninstallApp(siteId, objectId, appId);

    return { status: 'success', removedId };
  } catch (error) {
    console.error('inside uninstallApp', error);
    return { status: 'error', error };
  }
});


Parse.Cloud.define("getAppsList", async (request) => {
  const { siteId, filter: { developer = [], status } } = request.params;
  try {
    const apps = await getAppsList(siteId, developer, status);
    
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside getAppsList', error);
    return { status: 'error', error };
  }
});

const getAppsList = async(siteId, developerIds, status) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_DATA_MODEL_NAME = `ct____${siteNameId}____Developer_App_Data`;
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include(['Content.Catgories']);
    query.include(['Data.Dashboard_Setting']);
    query.include(['Data.Dashboard_Setting.SVG_Icon']);
    query.include(['Data.Capabilities']);
    query.include('Data.Facilitator_Mode');
    query.include('Data.Permissions');
    query.include('Data.Sandbox_Permissions');


    query.include('Developer');
    query.include('Security');

    

    if (developerIds && developerIds.length > 0) {
      const developersQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
      developersQuery.containedIn('objectId', developerIds);
      query.matchesQuery('Developer', developersQuery);
    }
    

    if (!!status) {
      const readyForSaleQuery = new Parse.Query(DEVELOPER_APP_DATA_MODEL_NAME);
      readyForSaleQuery.equalTo('Status', status);
      query.matchesQuery('Data', readyForSaleQuery);
    }
    
    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;
  } catch(error) {
    console.error('inside getPublicAppsList', error);
    throw error;
  }
}


Parse.Cloud.define("getPluginsList", async (request) => {
  const { siteId, filter: { developer = [], status } } = request.params;
  try {
    const apps = await getPluginsList(siteId, developer, status);
    
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside getPluginsList', error);
    return { status: 'error', error };
  }
});

const getPluginsList = async(siteId, developerIds, status) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_DATA_MODEL_NAME = `ct____${siteNameId}____Developer_App_Data`;
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include(['Data.Dashboard_Setting']);
    query.include(['Data.Dashboard_Setting.SVG_Icon']);
    query.include(['Data.Capabilities']);
    query.include('Content');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include(['Content.Catgories']);
    query.include('Security');   

    if (developerIds && developerIds.length > 0) {
      const developersQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
      developersQuery.containedIn('objectId', developerIds);
      query.matchesQuery('Developer', developersQuery);
    }
    

    if (!!status) {
      const readyForSaleQuery = new Parse.Query(DEVELOPER_APP_DATA_MODEL_NAME);
      readyForSaleQuery.equalTo('Status', status);
      query.matchesQuery('Data', readyForSaleQuery);
    }
    
    const appObjects = await query.find({ useMasterKey: true });

    const lst = await Promise.all(
      appObjects.map(async(appObject) => {
        const developer = appObject.get('Developer') && appObject.get('Developer')[0] ? appObject.get('Developer')[0].id : null;
        const developerContent = getDeveloperContentFromAppObject(appObject);
        const developerData = await getDeveloperDataFromAppObject(appObject);
        return {
          name: appObject.get('Name'),
          id: appObject.id,
          slug: appObject.get('Slug'),
          url: appObject.get('URL'),
          developer,
          developerContent,
          developerData,
        };
      })
    );
    return lst;

  } catch(error) {
    console.error('inside getPluginList', error);
    throw error;
  }
}



Parse.Cloud.define("publishedAppsList", async (request) => {
  const { siteId } = request.params;
  try {
    const publishedApps = await getPublishedAppsList(siteId);
    
    return { status: 'success', apps: publishedApps };
  } catch (error) {
    console.error('inside publishedAppsList', error);
    return { status: 'error', error };
  }
});

const getPublishedAppsList = async(siteId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_DATA_MODEL_NAME = `ct____${siteNameId}____Developer_App_Data`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include(['Content.Catgories']);
    query.include(['Data.Dashboard_Setting']);
    query.include(['Data.Dashboard_Setting.SVG_Icon']);
    query.include(['Data.Capabilities']);
    query.include('Data.Facilitator_Mode');
    query.include('Data.Permissions');
    query.include('Data.Sandbox_Permissions');


    query.include('Developer');
    query.include('Security');
    
    const readyForSaleQuery = new Parse.Query(DEVELOPER_APP_DATA_MODEL_NAME);
    readyForSaleQuery.equalTo('Status', 'Ready for Sale');
    query.matchesQuery('Data', readyForSaleQuery);
    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside getPublicAppsList', error);
    throw error;
  }
}


Parse.Cloud.define("featuredAppsList", async (request) => {
  const { siteId } = request.params;
  try {
    const featuredApps = await getFeaturedAppsList(siteId);
    
    return { status: 'success', apps: featuredApps };
  } catch (error) {
    console.error('inside featuredAppsList', error);
    return { status: 'error', error };
  }
});

const getFeaturedAppsList = async(siteId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_DATA_MODEL_NAME = `ct____${siteNameId}____Developer_App_Data`;
    const DEVELOPER_APP_CONTENT_MODEL_NAME = `ct____${siteNameId}____Developer_App_Content`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include('Developer');
    query.include('Security');
    query.include(['Data.Dashboard_Setting']);
    query.include('Data.Facilitator_Mode');
    query.include('Data.Permissions');
    query.include('Data.Sandbox_Permissions');
    
    const readyForSaleQuery = new Parse.Query(DEVELOPER_APP_DATA_MODEL_NAME);
    readyForSaleQuery.equalTo('Status', 'Ready for Sale');
    query.matchesQuery('Data', readyForSaleQuery);

    const featuredQuery = new Parse.Query(DEVELOPER_APP_CONTENT_MODEL_NAME);
    featuredQuery.equalTo('Featured_', true);
    query.matchesQuery('Content', featuredQuery);

    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside getFeaturedAppsList', error);
    throw error;
  }
}

Parse.Cloud.define("appsMadeBy", async (request) => {
  const { siteId, companyName } = request.params;
  try {
    const apps = await getAppsListMadeBy(siteId, companyName);
    
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside appsMadeBy', error);
    return { status: 'error', error };
  }
});

const getAppsListMadeBy = async(siteId, companyName) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_DATA_MODEL_NAME = `ct____${siteNameId}____Developer_App_Data`;
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include('Developer');
    query.include('Security');
    
    const readyForSaleQuery = new Parse.Query(DEVELOPER_APP_DATA_MODEL_NAME);
    readyForSaleQuery.equalTo('Status', 'Ready for Sale');
    query.matchesQuery('Data', readyForSaleQuery);

    const madeByQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    madeByQuery.equalTo('Company', companyName);
    query.matchesQuery('Developer', madeByQuery);

    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside getAppsListMadeBy function', error);
    throw error;
  }
}


Parse.Cloud.define("categoryAppsList", async (request) => {
  const { siteId, categorySlug } = request.params;
  try {
    const apps = await getCategoryAppsList(siteId, categorySlug);
    
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside categoryAppsList', error);
    return { status: 'error', error };
  }
});

const getCategoryAppsList = async(siteId, categorySlug) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_APP_CONTENT_MODEL_NAME = `ct____${siteNameId}____Developer_App_Content`;
    const CATEGORY_MODEL_NAME = `ct____${siteNameId}____Category`;

    const categoryQuery = new Parse.Query(CATEGORY_MODEL_NAME);
    categoryQuery.equalTo('t__status', 'Published');
    categoryQuery.equalTo('Slug', categorySlug);
    const categoryObject = await categoryQuery.first({ useMasterKey: true });

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include('Developer');
    query.include('Security');
    
    const categoriesMatchQuery = new Parse.Query(DEVELOPER_APP_CONTENT_MODEL_NAME);
    categoriesMatchQuery.equalTo('Categories', categoryObject);
    query.matchesQuery('Content', categoriesMatchQuery);

    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside getCategoryAppsList', error);
    throw error;
  }
}

const getAppListFromObjects = async (appObjects) => {
  const list = await Promise.all(
    appObjects.map(async(appObject) => {
    
      const developer = getDeveloperFromAppObject(appObject);
      const developerContent = getDeveloperContentFromAppObject(appObject);
      const developerData = await getDeveloperDataFromAppObject(appObject);
      // const siteInfo = await getSiteInfoFromAppObject(appObject);
      return {
        id: appObject.id,
        name: appObject.get('Name'),
        slug: appObject.get('Slug'),
        url: appObject.get('URL'),
        developer,
        developerContent,
        developerData,
        // siteInfo
      };
    })
  );
  return list.sort((a, b) => (a.name > b.name ? 1 : -1));
}


const getPlainAppsList = (appObjects) => {
  const list = appObjects.map((appObject) => {   
    return {
      id: appObject.id,
      name: appObject.get('Name'),
      slug: appObject.get('Slug'),
      url: appObject.get('URL')
    };
  });
  return list.sort((a, b) => (a.name > b.name ? 1 : -1));
}

Parse.Cloud.define("searchApps", async (request) => {
  const { siteId, keyword } = request.params;
  try {
    const apps = await searchApps(siteId, keyword);
    
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside searchApps', error);
    return { status: 'error', error };
  }
});

const searchApps = async(siteId, keyword) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.matches('Name', keyword, 'i')
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include('Developer');
    query.include('Security');
    query.include('Security.Policy');
    
    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside searchApps', error);
    throw error;
  }
}



Parse.Cloud.define("getAppDetail", async (request) => {
  const { siteId, appSlug } = request.params;
  try {
    const appDetail = await getAppDetail(siteId, appSlug);
    
    return { status: 'success', appDetail };
  } catch (error) {
    console.error('inside getAppDetail', error);
    return { status: 'error', error };
  }
});

const getAppDetail = async(siteId, appSlug) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.equalTo('Slug', appSlug)
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include(['Content.Categories']);
    query.include('Developer');
    query.include('Security');
    query.include('Security.Policy');
    
    const appObject = await query.first({ useMasterKey: true });
    if (!appObject) return null;
    const developer = getDeveloperFromAppObject(appObject);
    const developerContent = getDeveloperContentFromAppObject(appObject);
    const developerData = await getDeveloperDataFromAppObject(appObject);
    const developerSecurity = getSecurityFromAppObject(appObject);
    const siteInfo = await getSiteInfoFromAppObject(appObject);
    return {
      id: appObject.id,
      name: appObject.get('Name'),
      slug: appObject.get('Slug'),
      url: appObject.get('URL'),
      developer,
      developerContent,
      developerData,
      developerSecurity,
      siteInfo
    }
  } catch(error) {
    console.error('inside getAppDetal', error);
    throw error;
  }
}

Parse.Cloud.define("getDeveloperAppByIds", async (request) => {
  const { siteId, appIds } = request.params;
  try {
    const apps = await Promise.all(appIds.map(appId => getDeveloperAppById(siteId, appId)));
    return { status: 'success', apps };
  } catch (error) {
    console.error('inside getDeveloperAppByIds', error);
    return { status: 'error', error };
  }
});


Parse.Cloud.define("getDeveloperAppById", async (request) => {
  const { siteId, appId } = request.params;
  try {
    const appDetail = await getDeveloperAppById(siteId, appId);
    
    return { status: 'success', appDetail };
  } catch (error) {
    console.error('inside getDeveloperAppById', error);
    return { status: 'error', error };
  }
});

const getDeveloperAppById = async(siteId, appId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.equalTo('objectId', appId)
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include(['Content.Categories']);
    query.include('Developer');
    query.include('Security');
    query.include('Security.Policy');
    query.include(['Data.Capabilities']);
    query.include(['Data.Dashboard_Setting']);
    query.include(['Data.Dashboard_Setting.SVG_Icon']);
    query.include('Data.Facilitator_Mode');
    query.include('Data.Permissions');
    query.include('Data.Sandbox_Permissions');

    
    const appObject = await query.first({ useMasterKey: true });
    if (!appObject) return null;
    const developer = getDeveloperFromAppObject(appObject);
    const developerContent = getDeveloperContentFromAppObject(appObject);
    const developerData = await getDeveloperDataFromAppObject(appObject);
    const developerSecurity = getSecurityFromAppObject(appObject);
    const siteInfo = await getSiteInfoFromAppObject(appObject);
    return {
      id: appObject.id,
      name: appObject.get('Name'),
      slug: appObject.get('Slug'),
      url: appObject.get('URL'),
      developer,
      developerContent,
      developerData,
      developerSecurity,
      siteInfo
    }
  } catch(error) {
    console.error('inside getDeveloperAppById', error);
    throw error;
  }
}



function getDeveloperFromAppObject(appObject) {
  let developer = null;
  const developerObject = appObject.get('Developer');

  if (developerObject && developerObject.length > 0) {
    developer = {
      id: developerObject[0].id,
      name: developerObject[0].get('Name'),
      verified: developerObject[0].get('Verified') || false,
      company: developerObject[0].get('Company') || '',
      website: developerObject[0].get('Website') || '',
      email: developerObject[0].get('Email') || '',
      isActive: developerObject[0].get('IsActive') || false,
    }
  }
  return developer;
}

function getDeveloperContentFromAppObject(appObject) {
  let developerContent = null;
  const developerContentObject = appObject.get('Content');
  if (developerContentObject && developerContentObject.length > 0) {
    let screenshots = [];
    if (developerContentObject[0].get('Screenshots') && developerContentObject[0].get('Screenshots').length > 0) {
      screenshots = developerContentObject[0].get('Screenshots').map(screen => screen.get('file')._url);
    }
    let categories = [];
    if (developerContentObject[0].get('Categories') && developerContentObject[0].get('Categories').length > 0) {
      categories = developerContentObject[0].get('Categories').map(category => ({
        name: category.get('Name'),
        slug: category.get('Slug'),
        id: category.id
      }))
    }
    developerContent = {
      id: developerContentObject[0].id,
      shortName: developerContentObject[0].get('Short_Name'),
      keyImage: developerContentObject[0].get('Key_Image') ? developerContentObject[0].get('Key_Image').get('file')._url : null,
      description: developerContentObject[0].get('Description') || '',
      termsURL: developerContentObject[0].get('Terms_URL') || '',
      privacyURL: developerContentObject[0].get('Privacy_URL') || '',
      featured: developerContentObject[0].get('Featured_') || false,
      listing: developerContentObject[0].get('Listing') || [],
      filters: developerContentObject[0].get('Filters') || [],
      categories,
      screenshots
    }
  }
  return developerContent;
}


async function getDeveloperDataFromAppObject(appObject) {
  let developerData = null;
  const developerDataObject = appObject.get('Data');

  if (developerDataObject && developerDataObject.length > 0) {    
    let dashboardSettings = null;

    if (developerDataObject[0].get('Dashboard_Setting') && developerDataObject[0].get('Dashboard_Setting').length > 0) {
      dashboardSettings = developerDataObject[0].get('Dashboard_Setting')[0];
    }

    developerData = {
      id: developerDataObject[0].id,
      dataName: developerDataObject[0].get('Data_Name'),
      installsCount: developerDataObject[0].get('Installs_Count'),
      status: developerDataObject[0].get('Status'),
      rating: developerDataObject[0].get('Rating'),
      isPaid: developerDataObject[0].get('Is_Paid_') || false,
      feeType: developerDataObject[0].get('Fee_Type') || null,
      feeAmount: developerDataObject[0].get('Fee_Amount') || null,
      capabilities: developerDataObject[0].get('Capabilities') || null,
      facilitatorMode: developerDataObject[0].get('Facilitator_Mode') || null,
      permissions: developerDataObject[0].get('Permissions') || [],
      sandboxPermissions: developerDataObject[0].get('Sandbox_Permissions') || [],
      dashboardSettings,
    }
  }
  return developerData;
}

// Get site info from app object / security
async function getSiteInfoFromAppObject(appObject) {
  try {
    const securityObject = appObject.get('Security');
    if (securityObject && securityObject[0] && securityObject[0].get('Forge_API_Key')) {
      const url = 'https://getforge.com/api/v2/settings/site_info?site_token=' + securityObject[0].get('Forge_API_Key');
      const result = await axios.get(url);
      return result.data ? result.data.message : null;
    }
    return null
  } catch(error) {
    console.error("inside getSiteInfoFromAppObject", error);
    // throw error;
    return null;
  }
}

function getSecurityFromAppObject(appObject) {
  try {
    let security = null;
    const securityObject = appObject.get('Security');
    if (securityObject && securityObject.length > 0) {
      const policy = securityObject[0].get('Policy');
      if (policy) {
        security = {
          id: policy[0].id,
          name: policy[0].get('Policy_Name'),
          evalSafePassMax: policy[0].get('EvalSafe_Pass_Max'),
          evalSafePassMin: policy[0].get('EvalSafe_Pass_Min'),
          evalSafeWarningMax: policy[0].get('EvalSafe_Warning_Max'),
          evalSafeWarningMin: policy[0].get('EvalSafe_Warning_Min'),
          evalSafeFailMax: policy[0].get('EvalSafe_Fail_Max'),
          evalSafeFailMin: policy[0].get('EvalSafe_Fail_Min'),
          requireSSL: policy[0].get('RequireSSL'),
          requireForceSSL: policy[0].get('RequireForceSSL')
        };
      }
    }
    return security;
  } catch(error) {
    console.error("get security", error);
  }
}


Parse.Cloud.define("getDeveloperFromUserId", async (request) => {
  const { siteId, userId } = request.params;
  try {
    const developer = await getDeveloperFromUserId(siteId, userId);
    const isMuralAdmin = await checkIfMuralAdmin(userId);
    return { status: 'success', developer, isMuralAdmin };
    // return { status: 'success', isMuralAdmin };
  } catch (error) {
    console.error('inside getDeveloperFromUserId', error);
    return { status: 'error', error };
  }
});

const getDeveloperFromUserId = async(siteId, userId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    // get site name Id and generate MODEL names based on that
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;
    const developerQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    const UserModel = Parse.Object.extend('User');
    const currentUser = new UserModel();
    currentUser.id = userId;
    developerQuery.equalTo('user', currentUser);
    developerQuery.equalTo('IsActive', true);
    const developerObject = await developerQuery.first();
    
    if (!developerObject) return null;
    
    return {
      id: developerObject.id,
      name: developerObject.get('Name'),
      verified: developerObject.get('Verified') || false,
      company: developerObject.get('Company') || '',
      website: developerObject.get('Website') || '',
      email: developerObject.get('Email') || '',
      isActive: developerObject.get('IsActive') || false,
    };

  } catch(error) {
    console.error('inside getDeveloperFromUserId', error);
    throw error;
  }
}




const checkIfMuralAdmin = async(userId) => {
  try {
    const UserModel = Parse.Object.extend('User');
    const currentUser = new UserModel();
    currentUser.id = userId;

    const roleQuery = new Parse.Query(Parse.Role);
    roleQuery.equalTo('name', 'Mural Admins');
    const roleObject = await roleQuery.first();

    const adminRelation = new Parse.Relation(roleObject, 'users');
    const queryAdmins = adminRelation.query();
    const userObjects = await queryAdmins.find();
    for (const userObject of userObjects) {
      if (userObject.id.toString() === userId) return true;
    }
    return false;
  } catch(error) {
    console.error('inside checkIfMuralAdmin', error);
    throw error;
  }
}

Parse.Cloud.define("authorize", async (request) => {
  const { params } = request;
  const authorizationUri = 'https://app.mural.co/api/public/v1/authorization/oauth2/';
  try {
    const query = new URLSearchParams();
    query.set('client_id', process.env.MURAL_CLIENT_ID);
    query.set('redirect_uri', getMuralRedirectURI(params.devMode));
    query.set('state', 123);
    query.set('response_type', 'code');
    const scopes = [
      "identity:read"
    ]
    query.set('scope', scopes.join(' '));
	  return { success: true, url: `${authorizationUri}?${query}`};
  } catch(error) {
    console.error('inside authorize', error);
    return { success: false, error };
  }
});

Parse.Cloud.define("token", async (request) => {
  try {
    const { params } = request;
    const redirect_uri = getMuralRedirectURI(params.devMode);
    const response = await axios.post('https://app.mural.co/api/public/v1/authorization/oauth2/token', 
      {
        client_id: process.env.MURAL_CLIENT_ID,
        client_secret: process.env.MURAL_CLIENT_SECRET,
        code: params.code,
        grant_type: 'authorization_code',
        redirect_uri
      });
    if (response.status!== 200) {
      throw 'token request failed';
    }
    const meResponse = await axios.get('https://app.mural.co/api/public/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${response.data.access_token}`
      }
    });
    if (meResponse.status !== 200) {
      throw 'unauthorized for getting currentUser';
    }
    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      me: meResponse.data.value
    };
    
  } catch(error) {
    console.error("inside token", error);
    return { success: false, error };
  }
});


Parse.Cloud.define("refresh", async (request) => {
  try {
    const { params } = request;
    const { refreshToken } = params;
    const response = await axios.post('https://app.mural.co/api/public/v1/authorization/oauth2/refresh', 
      {
        client_id: process.env.MURAL_CLIENT_ID,
        client_secret: process.env.MURAL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      });
    if (response.status!== 200) {
      throw 'token request failed';
    }
    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token
    };
    
  } catch(error) {
    console.error("inside refresh", error);
    return { success: false, error };
  }
});


Parse.Cloud.define("getPublisherSettings", async (request) => {
  const { siteId } = request.params;
  try {
    const publisherSetting = await getPublisherSettings(siteId);
    
    
    return { status: 'success', publisherSetting };
  } catch (error) {
    console.error('inside getPublisherSettings', error);
    return { status: 'error', error };
  }
});

const getPublisherSettings = async(siteId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const PUBLISHER_SETTING_MODEL_NAME = `ct____${siteNameId}____Publisher_Settings`;

    const query = new Parse.Query(PUBLISHER_SETTING_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Logo');
    
    const publisherSettingObject = await query.first({ useMasterKey: true });
    if (!publisherSettingObject) return null;
    return {
      name: publisherSettingObject.get('Name'),
      logo: publisherSettingObject.get('Logo') ? publisherSettingObject.get('Logo').get('file')._url : '',
      primaryColor: publisherSettingObject.get('Primary_Colour'),
      secondaryColor: publisherSettingObject.get('Secondary_Colour'),
      appsListBanner: publisherSettingObject.get('Apps_List_Banner') ? publisherSettingObject.get('Logo').get('file')._url : ''
    };
  } catch(error) {
    console.error('inside getPublisherSettings function', error);
    throw error;
  }
}

const getMuralRedirectURI = (devMode) => {
  return devMode ? process.env.DEV_MURAL_REDIRECT_URI : process.env.MURAL_REDIRECT_URI;
}

// Related with Mural Auth
Parse.Cloud.define('linkWith', async(request) => {
  const { authData, email } = request.params;
  try {
    let user;
    // Check for existing user with email given from `token` request response
    const userQuery = new Parse.Query('User');
    userQuery.equalTo('email', email)
    user = await userQuery.first();
    const oldId = user ? user.id : null;

    if (!user) user = new Parse.User();
    await user.linkWith('mural', { authData }, { useMasterKey: true });
    
    // set username and email for the new user
    if (!oldId) {
      await user.save({ 
        'username': email, 
        'email': email
      }, 
      { useMasterKey: true });
    }
    return { status: 'success', user };
  } catch (error) {
    console.error('inside linkWith', error);
    return { status: 'error', error };
  }
})

// Related with Mural Auth
Parse.Cloud.define('activateDeveloper', async(request) => {
  try {
    const { siteId, userId, developerId } = request.params;
    const developer = await activateDeveloper(siteId, userId, developerId);
    return { status: 'success', developer };
  } catch (error) {
    console.error('inside activateDeveloper', error);
    return { status: 'error', error };
  }
});

const activateDeveloper = async(siteId, userId, developerId) => {
  try {
    let i;
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    // Model related data preparation
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;
    const UserModel = Parse.Object.extend('User');
    const currentUser = new UserModel();
    currentUser.id = userId;

    // 
    const DeveloperModel = Parse.Object.extend(DEVELOPER_MODEL_NAME);
    const developerQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    developerQuery.equalTo('user', currentUser);
    const results = await developerQuery.find();
    for (i = 0; i < results.length; i++) {
      if (results[i].id !== developerId) {
        const updatedDeveloper = new DeveloperModel();
        updatedDeveloper.id = results[i].id;
        updatedDeveloper.set('IsActive', false);
        await updatedDeveloper.save();
      }
    }

    const currentDeveloperQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    currentDeveloperQuery.equalTo('objectId', developerId);
    const currentDeveloper = await currentDeveloperQuery.first();
    currentDeveloper.set('IsActive', true);
    await currentDeveloper.save();

    return {
      id: currentDeveloper.id,
      name: currentDeveloper.get('Name'),
      verified: currentDeveloper.get('Verified') || false,
      company: currentDeveloper.get('Company') || '',
      website: currentDeveloper.get('Website') || '',
      email: currentDeveloper.get('Email') || '',
      isActive: currentDeveloper.get('IsActive') || false,
    };

  } catch(error) {
    console.error("inside activateDeveloper function", error);
    throw error;
  }
}


// Related with Mural Auth
Parse.Cloud.define('developersList', async(request) => {
  try {
    const { siteId, verified } = request.params;
    const developersList = await getDevelopersList(siteId, verified);
    return { status: 'success', developersList };
  } catch (error) {
    console.error('inside developersList', error);
    return { status: 'error', error };
  }
});

const getDevelopersList = async(siteId, verified = '') => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    // Model related data preparation
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;
    const developerQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    developerQuery.equalTo('t__status', 'Published');
    if (verified !== '') {
      developerQuery.equalTo('Verified', verified);
    }
    const results = await developerQuery.find();

    const list = results.map(developer => (
      {
        id: developer.id,
        slug: developer.get('Slug') || '',
        name: developer.get('Name'),
        verified: developer.get('Verified') || false,
        company: developer.get('Company') || '',
        website: developer.get('Website') || '',
        email: developer.get('Email') || '',
        isActive: developer.get('IsActive') || false,
        updatedAt: developer.get('updatedAt')
      }
    ));
    return list;

  } catch(error) {
    console.error("inside getDevelopersList function", error);
    throw error;
  }
}



Parse.Cloud.define("getDeveloperDetailBySlug", async (request) => {
  const { siteId, slug } = request.params;
  try {
    const developer = await getDeveloperDetailBySlug(siteId, slug);
    return { status: 'success', developer };
  } catch (error) {
    console.error('inside getDeveloperDetailBySlug', error);
    return { status: 'error', error };
  }
});

const getDeveloperDetailBySlug = async(siteId, slug) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    // get site name Id and generate MODEL names based on that
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;
    const developerQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    developerQuery.equalTo('Slug', slug);
    developerQuery.equalTo('t__status', 'Published');
    const developerObject = await developerQuery.first();
    
    if (!developerObject) return null;
    
    const appsList = await getAppsListByDeveloperSlug(siteId, slug);

    return {
      id: developerObject.id,
      name: developerObject.get('Name'),
      verified: developerObject.get('Verified') || false,
      company: developerObject.get('Company') || '',
      website: developerObject.get('Website') || '',
      email: developerObject.get('Email') || '',
      isActive: developerObject.get('IsActive') || false,
      appsList
    };

  } catch(error) {
    console.error('inside getDeveloperDetailBySlug', error);
    throw error;
  }
}


const getAppsListByDeveloperSlug = async(siteId, slug) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const DEVELOPER_APP_MODEL_NAME = `ct____${siteNameId}____Developer_App`;
    const DEVELOPER_MODEL_NAME = `ct____${siteNameId}____Developer`;

    const query = new Parse.Query(DEVELOPER_APP_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.include('Data');
    query.include('Content');
    query.include('Content.Key_Image');
    query.include(['Content.Screenshots']);
    query.include('Developer');
    query.include('Security');
    
    const madeByQuery = new Parse.Query(DEVELOPER_MODEL_NAME);
    madeByQuery.equalTo('Slug', slug);
    query.matchesQuery('Developer', madeByQuery);

    const appObjects = await query.find({ useMasterKey: true });
    
    const list = await getAppListFromObjects(appObjects);
    return list;

  } catch(error) {
    console.error('inside getAppsListByDeveloperSlug function', error);
    throw error;
  }
}


const getUserInstalledApps = async(siteId, userId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const USER_INSTALLED_APPS_MODEL_NAME = `ct____${siteNameId}____UserInstalledApps`;

    const query = new Parse.Query(USER_INSTALLED_APPS_MODEL_NAME);
    query.equalTo('t__status', 'Published');
    query.equalTo('UserId', userId);
    query.include('AppsList');
    
    const record = await query.first();

    let list = [];
    let id = null;
    if (record && record.get('AppsList') && record.get('AppsList')[0]) {
      id = record.id;
      appsObjects = record.get('AppsList');
      list = getPlainAppsList(appsObjects);
    }
    
    return { id, list };

  } catch(error) {
    console.error('inside getUserInstalledApps function', error);
    throw error;
  }
}


const uninstallApp = async(siteId, objectId, appId) => {
  try {
    // get site name Id and generate MODEL names based on that
    const siteNameId = await getSiteNameId(siteId);
    if (siteNameId === null) {
      throw { message: 'Invalid siteId' };
    }

    const USER_INSTALLED_APPS_MODEL_NAME = `ct____${siteNameId}____UserInstalledApps`;

    const query = new Parse.Query(USER_INSTALLED_APPS_MODEL_NAME);
    query.equalTo('objectId', objectId);
    
    const app = await query.first();
    if (app) {
      let appsList = app.get('AppsList');
      if (appsList && appsList.length > 0) {
        appsList = appsList.filter(obj => obj.id !== appId);
      }
      
      app.set('AppsList', appsList);
      await app.save();

      return objectId;
    }

  } catch(error) {
    console.error('inside uninstallApp function', error);
    throw error;
  }
}