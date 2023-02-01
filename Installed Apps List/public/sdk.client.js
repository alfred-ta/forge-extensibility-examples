'use strict';
window.forgeSDK = (() => {
  const CONNECTED_EV = new Event('connected');
  const callbacks = {};
  const uuidv4 = () => {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  };
  
  const addToCallbacks = callbackFunc => {
    const id = uuidv4();
    callbacks[id] = callbackFunc;
    return id;
  };

  let extensionId;
  let siteSrc;

  // ----------------------------------------------------------------
  // Wrapper INITIALIZATION
  // ----------------------------------------------------------------

  class RegisterWrapper {
    callFunc(endpoint, ...args) {
      if (args[0].component) {
        args[0].siteSrc = siteSrc;
      }

      if (args[0].onClick) {
        //Save in callback array function which should be called after function response received
        args[0].onClick = addToCallbacks(args[0].onClick);
      }

      //Set extensions id to avoid name collisions
      args[0].extensionId = extensionId;

      return sendRegister(endpoint, ...args);
    }
  }
  

  // ----------------------------------------------------------------
  // Core Communication messages
  // ----------------------------------------------------------------
  // Receive
  var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

  eventer(messageEvent, function(e) {
    const { data: payload } = e;
    console.log('receive:', payload);
    
    if (payload.type === 'CONNECT' && !extensionId) {
      initialize(payload);
      return;
    }
    if (payload.type == 'CALLBACK') {
      const func = callbacks[payload.callbackId];

      if (!func) {
        console.error(payload.callbackId);
      } else {
        if (payload.options) {
          func(payload.options);
        } else {
          func();
        }
      }
    }
  });
  
  const initialize = (options) => {
    const { src, extensionId: contextId } = options;
    extensionId = contextId;
    siteSrc = src;
    window.dispatchEvent(CONNECTED_EV);
  }

  // Send
  const send = (keyName, kind, ...args) => {
    console.log('sending message', keyName, kind, args)
    window.top.postMessage({ args: [...args], action: keyName, kind, extensionId }, '*');
  }


  // Specific senders
  const sendMutation = (keyName, ...args) => {
    send(keyName, 'mutation', ...args);
  }

  const sendAction = (keyName, ...args) => {
    send(keyName, 'action', ...args);
  }

  const sendGetter = (keyName, callbackFunc, args) => {
    const callbackId = addToCallbacks(callbackFunc);
    window.top.postMessage({ args, action: keyName, kind: 'getter', extensionId, callbackId }, '*');
  }

  const sendRegister = (keyName, ...args) => {
    send(keyName, 'register', ...args);
  }

  // ----------------------------------------------------------------
  // INITIALIZATION - Extension
  // ----------------------------------------------------------------
  const isReady = () => {
    const states = ['complete', 'interactive', 'loaded'];

    return !!states.find(state => document.readyState === state);
  };

  const onReady = initExtension => {
    console.log("inside extenstion on ready", extensionId, initExtension);
    if (isReady() && extensionId) {
      initExtension();
      return;
    }

    window.addEventListener('connected', initExtension);
  };

  
  const regWrapper = new RegisterWrapper(sendRegister);
  
  const api = {
    // GENERATED STUB START
    actions: {"application":{"load":(...args) => {
  sendAction("application/load", ...args);
},"logOut":(...args) => {
  sendAction("application/logOut", ...args);
}},"organisations":{"load":(...args) => {
  sendAction("organisations/load", ...args);
},"setCurrent":(...args) => {
  sendAction("organisations/setCurrent", ...args);
},"create":(...args) => {
  sendAction("organisations/create", ...args);
},"update":(...args) => {
  sendAction("organisations/update", ...args);
},"updateLogo":(...args) => {
  sendAction("organisations/updateLogo", ...args);
},"delete":(...args) => {
  sendAction("organisations/delete", ...args);
}},"projects":{"load":(...args) => {
  sendAction("projects/load", ...args);
},"create":(...args) => {
  sendAction("projects/create", ...args);
},"setActive":(...args) => {
  sendAction("projects/setActive", ...args);
},"update":(...args) => {
  sendAction("projects/update", ...args);
},"delete":(...args) => {
  sendAction("projects/delete", ...args);
}},"sites":{"load":(...args) => {
  sendAction("sites/load", ...args);
},"modeLoad":(...args) => {
  sendAction("sites/modeLoad", ...args);
},"getSiteMode":(...args) => {
  sendAction("sites/getSiteMode", ...args);
},"getPublicFileUrl":(...args) => {
  sendAction("sites/getPublicFileUrl", ...args);
},"setActive":(...args) => {
  sendAction("sites/setActive", ...args);
},"create":(...args) => {
  sendAction("sites/create", ...args);
},"moveSite":(...args) => {
  sendAction("sites/moveSite", ...args);
},"addHook":(...args) => {
  sendAction("sites/addHook", ...args);
},"updateHook":(...args) => {
  sendAction("sites/updateHook", ...args);
},"removeHook":(...args) => {
  sendAction("sites/removeHook", ...args);
},"checkURL":(...args) => {
  sendAction("sites/checkURL", ...args);
},"getPolicy":(...args) => {
  sendAction("sites/getPolicy", ...args);
},"update":(...args) => {
  sendAction("sites/update", ...args);
},"updateDataInList":(...args) => {
  sendAction("sites/updateDataInList", ...args);
},"setCurrentVersion":(...args) => {
  sendAction("sites/setCurrentVersion", ...args);
},"regenerateToken":(...args) => {
  sendAction("sites/regenerateToken", ...args);
},"delete":(...args) => {
  sendAction("sites/delete", ...args);
}},"versions":{"load":(...args) => {
  sendAction("versions/load", ...args);
},"loadParse":(...args) => {
  sendAction("versions/loadParse", ...args);
},"setCurrent":(...args) => {
  sendAction("versions/setCurrent", ...args);
},"addParseVersion":(...args) => {
  sendAction("versions/addParseVersion", ...args);
},"delete":(...args) => {
  sendAction("versions/delete", ...args);
},"addMessageToVersion":(...args) => {
  sendAction("versions/addMessageToVersion", ...args);
},"createTmpVersion":(...args) => {
  sendAction("versions/createTmpVersion", ...args);
},"create":(...args) => {
  sendAction("versions/create", ...args);
},"update":(...args) => {
  sendAction("versions/update", ...args);
},"updateDesc":(...args) => {
  sendAction("versions/updateDesc", ...args);
}},"user":{"authorize":(...args) => {
  sendAction("user/authorize", ...args);
},"confirmInvitation":(...args) => {
  sendAction("user/confirmInvitation", ...args);
},"googleAuth":(...args) => {
  sendAction("user/googleAuth", ...args);
},"githubAuth":(...args) => {
  sendAction("user/githubAuth", ...args);
},"bitbucketAuth":(...args) => {
  sendAction("user/bitbucketAuth", ...args);
},"load":(...args) => {
  sendAction("user/load", ...args);
},"update":(...args) => {
  sendAction("user/update", ...args);
},"updateAvatar":(...args) => {
  sendAction("user/updateAvatar", ...args);
},"updateSubscription":(...args) => {
  sendAction("user/updateSubscription", ...args);
},"regenerateToken":(...args) => {
  sendAction("user/regenerateToken", ...args);
},"logOut":(...args) => {
  sendAction("user/logOut", ...args);
}},"invoices":{"load":(...args) => {
  sendAction("invoices/load", ...args);
},"downloadCsv":(...args) => {
  sendAction("invoices/downloadCsv", ...args);
}},"site_user":{"load":(...args) => {
  sendAction("site_user/load", ...args);
},"delete":(...args) => {
  sendAction("site_user/delete", ...args);
},"addUser":(...args) => {
  sendAction("site_user/addUser", ...args);
}},"site_app":{"load":(...args) => {
  sendAction("site_app/load", ...args);
},"installApp":(...args) => {
  sendAction("site_app/installApp", ...args);
},"checkParseLogs":(...args) => {
  sendAction("site_app/checkParseLogs", ...args);
},"checkParseHealth":(...args) => {
  sendAction("site_app/checkParseHealth", ...args);
},"delete":(...args) => {
  sendAction("site_app/delete", ...args);
},"update":(...args) => {
  sendAction("site_app/update", ...args);
},"updateDataInList":(...args) => {
  sendAction("site_app/updateDataInList", ...args);
}},"parse_cloud":{"load":(...args) => {
  sendAction("parse_cloud/load", ...args);
},"update":(...args) => {
  sendAction("parse_cloud/update", ...args);
}},"project_user":{"load":(...args) => {
  sendAction("project_user/load", ...args);
},"delete":(...args) => {
  sendAction("project_user/delete", ...args);
},"addUser":(...args) => {
  sendAction("project_user/addUser", ...args);
}},"organisation_user":{"load":(...args) => {
  sendAction("organisation_user/load", ...args);
},"delete":(...args) => {
  sendAction("organisation_user/delete", ...args);
},"changeRole":(...args) => {
  sendAction("organisation_user/changeRole", ...args);
},"addUser":(...args) => {
  sendAction("organisation_user/addUser", ...args);
}},"invitation":{"load":(...args) => {
  sendAction("invitation/load", ...args);
},"delete":(...args) => {
  sendAction("invitation/delete", ...args);
},"changeRole":(...args) => {
  sendAction("invitation/changeRole", ...args);
}},"form":{"load":(...args) => {
  sendAction("form/load", ...args);
},"setCurrent":(...args) => {
  sendAction("form/setCurrent", ...args);
},"getPolicy":(...args) => {
  sendAction("form/getPolicy", ...args);
},"update":(...args) => {
  sendAction("form/update", ...args);
},"downloadCsv":(...args) => {
  sendAction("form/downloadCsv", ...args);
},"delete":(...args) => {
  sendAction("form/delete", ...args);
}},"comments":{"load":(...args) => {
  sendAction("comments/load", ...args);
},"create":(...args) => {
  sendAction("comments/create", ...args);
},"delete":(...args) => {
  sendAction("comments/delete", ...args);
}},"notifications":{}},


  
    mutations: {"application":{"setTryLoad":(...args) => {
  sendMutation("application/setTryLoad", ...args);
},"setLoading":(...args) => {
  sendMutation("application/setLoading", ...args);
},"setisNavDrawerMiniVariant":(...args) => {
  sendMutation("application/setisNavDrawerMiniVariant", ...args);
},"toggleisNavDrawerMiniVariant":(...args) => {
  sendMutation("application/toggleisNavDrawerMiniVariant", ...args);
},"setShowing404":(...args) => {
  sendMutation("application/setShowing404", ...args);
},"openModal":(...args) => {
  sendMutation("application/openModal", ...args);
},"closeModal":(...args) => {
  sendMutation("application/closeModal", ...args);
}},"organisations":{"setList":(...args) => {
  sendMutation("organisations/setList", ...args);
},"setCurrent":(...args) => {
  sendMutation("organisations/setCurrent", ...args);
},"create":(...args) => {
  sendMutation("organisations/create", ...args);
},"update":(...args) => {
  sendMutation("organisations/update", ...args);
},"delete":(...args) => {
  sendMutation("organisations/delete", ...args);
},"incSitesCount":(...args) => {
  sendMutation("organisations/incSitesCount", ...args);
},"incProjectsCount":(...args) => {
  sendMutation("organisations/incProjectsCount", ...args);
},"descSitesCount":(...args) => {
  sendMutation("organisations/descSitesCount", ...args);
},"descProjectsCount":(...args) => {
  sendMutation("organisations/descProjectsCount", ...args);
}},"projects":{"setList":(...args) => {
  sendMutation("projects/setList", ...args);
},"setActive":(...args) => {
  sendMutation("projects/setActive", ...args);
},"create":(...args) => {
  sendMutation("projects/create", ...args);
},"update":(...args) => {
  sendMutation("projects/update", ...args);
},"delete":(...args) => {
  sendMutation("projects/delete", ...args);
}},"sites":{"setList":(...args) => {
  sendMutation("sites/setList", ...args);
},"addToList":(...args) => {
  sendMutation("sites/addToList", ...args);
},"setActive":(...args) => {
  sendMutation("sites/setActive", ...args);
},"create":(...args) => {
  sendMutation("sites/create", ...args);
},"update":(...args) => {
  sendMutation("sites/update", ...args);
},"setPublicFileUrl":(...args) => {
  sendMutation("sites/setPublicFileUrl", ...args);
},"updateSlug":(...args) => {
  sendMutation("sites/updateSlug", ...args);
},"addWebhook":(...args) => {
  sendMutation("sites/addWebhook", ...args);
},"removeWebhook":(...args) => {
  sendMutation("sites/removeWebhook", ...args);
},"delete":(...args) => {
  sendMutation("sites/delete", ...args);
},"deleteProjectsSite":(...args) => {
  sendMutation("sites/deleteProjectsSite", ...args);
}},"versions":{"setList":(...args) => {
  sendMutation("versions/setList", ...args);
},"delete":(...args) => {
  sendMutation("versions/delete", ...args);
},"create":(...args) => {
  sendMutation("versions/create", ...args);
},"update":(...args) => {
  sendMutation("versions/update", ...args);
},"changeTmpVersion":(...args) => {
  sendMutation("versions/changeTmpVersion", ...args);
}},"user":{"set":(...args) => {
  sendMutation("user/set", ...args);
},"update":(...args) => {
  sendMutation("user/update", ...args);
},"setToken":(...args) => {
  sendMutation("user/setToken", ...args);
},"setEmail":(...args) => {
  sendMutation("user/setEmail", ...args);
},"deleteEmail":(...args) => {
  sendMutation("user/deleteEmail", ...args);
},"deleteToken":(...args) => {
  sendMutation("user/deleteToken", ...args);
},"setAccountToken":(...args) => {
  sendMutation("user/setAccountToken", ...args);
},"updateBitbucketToken":(...args) => {
  sendMutation("user/updateBitbucketToken", ...args);
},"incProjectsCount":(...args) => {
  sendMutation("user/incProjectsCount", ...args);
},"descSitesCount":(...args) => {
  sendMutation("user/descSitesCount", ...args);
},"descProjectsCount":(...args) => {
  sendMutation("user/descProjectsCount", ...args);
},"incSitesCount":(...args) => {
  sendMutation("user/incSitesCount", ...args);
}},"invoices":{"setList":(...args) => {
  sendMutation("invoices/setList", ...args);
}},"site_user":{"setList":(...args) => {
  sendMutation("site_user/setList", ...args);
},"delete":(...args) => {
  sendMutation("site_user/delete", ...args);
},"create":(...args) => {
  sendMutation("site_user/create", ...args);
},"update":(...args) => {
  sendMutation("site_user/update", ...args);
}},"site_app":{"setList":(...args) => {
  sendMutation("site_app/setList", ...args);
},"delete":(...args) => {
  sendMutation("site_app/delete", ...args);
},"create":(...args) => {
  sendMutation("site_app/create", ...args);
},"update":(...args) => {
  sendMutation("site_app/update", ...args);
},"updateParseSetting":(...args) => {
  sendMutation("site_app/updateParseSetting", ...args);
},"updateChiselPercent":(...args) => {
  sendMutation("site_app/updateChiselPercent", ...args);
},"setDeployedParseSetting":(...args) => {
  sendMutation("site_app/setDeployedParseSetting", ...args);
},"setServiceMessages":(...args) => {
  sendMutation("site_app/setServiceMessages", ...args);
},"setChiselMessages":(...args) => {
  sendMutation("site_app/setChiselMessages", ...args);
},"setApps":(...args) => {
  sendMutation("site_app/setApps", ...args);
},"changeTmpVersion":(...args) => {
  sendMutation("site_app/changeTmpVersion", ...args);
}},"parse_cloud":{"setCurrent":(...args) => {
  sendMutation("parse_cloud/setCurrent", ...args);
},"delete":(...args) => {
  sendMutation("parse_cloud/delete", ...args);
},"create":(...args) => {
  sendMutation("parse_cloud/create", ...args);
},"update":(...args) => {
  sendMutation("parse_cloud/update", ...args);
}},"project_user":{"setList":(...args) => {
  sendMutation("project_user/setList", ...args);
},"delete":(...args) => {
  sendMutation("project_user/delete", ...args);
},"create":(...args) => {
  sendMutation("project_user/create", ...args);
},"update":(...args) => {
  sendMutation("project_user/update", ...args);
}},"organisation_user":{"setList":(...args) => {
  sendMutation("organisation_user/setList", ...args);
},"delete":(...args) => {
  sendMutation("organisation_user/delete", ...args);
},"create":(...args) => {
  sendMutation("organisation_user/create", ...args);
},"update":(...args) => {
  sendMutation("organisation_user/update", ...args);
}},"invitation":{"setList":(...args) => {
  sendMutation("invitation/setList", ...args);
},"delete":(...args) => {
  sendMutation("invitation/delete", ...args);
},"create":(...args) => {
  sendMutation("invitation/create", ...args);
},"update":(...args) => {
  sendMutation("invitation/update", ...args);
}},"form":{"setList":(...args) => {
  sendMutation("form/setList", ...args);
},"delete":(...args) => {
  sendMutation("form/delete", ...args);
},"create":(...args) => {
  sendMutation("form/create", ...args);
},"update":(...args) => {
  sendMutation("form/update", ...args);
},"setCurrent":(...args) => {
  sendMutation("form/setCurrent", ...args);
}},"comments":{"setList":(...args) => {
  sendMutation("comments/setList", ...args);
},"delete":(...args) => {
  sendMutation("comments/delete", ...args);
},"create":(...args) => {
  sendMutation("comments/create", ...args);
},"update":(...args) => {
  sendMutation("comments/update", ...args);
}},"notifications":{"addToMessages":(...args) => {
  sendMutation("notifications/addToMessages", ...args);
},"removeFromMessages":(...args) => {
  sendMutation("notifications/removeFromMessages", ...args);
},"removeAllMessages":(...args) => {
  sendMutation("notifications/removeAllMessages", ...args);
}}},



    getters: {"application":{},"organisations":{"findById":(callbackFunc, ...args) => {
  sendGetter("organisations/findById", callbackFunc, ...args);
},"individual":(callbackFunc, ...args) => {
  sendGetter("organisations/individual", callbackFunc, ...args);
}},"projects":{"findById":(callbackFunc, ...args) => {
  sendGetter("projects/findById", callbackFunc, ...args);
}},"sites":{"findById":(callbackFunc, ...args) => {
  sendGetter("sites/findById", callbackFunc, ...args);
}},"versions":{"findById":(callbackFunc, ...args) => {
  sendGetter("versions/findById", callbackFunc, ...args);
},"activeVersion":(callbackFunc, ...args) => {
  sendGetter("versions/activeVersion", callbackFunc, ...args);
},"activeParseVersion":(callbackFunc, ...args) => {
  sendGetter("versions/activeParseVersion", callbackFunc, ...args);
}},"user":{},"invoices":{},"site_user":{"findById":(callbackFunc, ...args) => {
  sendGetter("site_user/findById", callbackFunc, ...args);
}},"site_app":{"findById":(callbackFunc, ...args) => {
  sendGetter("site_app/findById", callbackFunc, ...args);
}},"parse_cloud":{"findById":(callbackFunc, ...args) => {
  sendGetter("parse_cloud/findById", callbackFunc, ...args);
}},"project_user":{"findById":(callbackFunc, ...args) => {
  sendGetter("project_user/findById", callbackFunc, ...args);
}},"organisation_user":{"findById":(callbackFunc, ...args) => {
  sendGetter("organisation_user/findById", callbackFunc, ...args);
}},"invitation":{"findById":(callbackFunc, ...args) => {
  sendGetter("invitation/findById", callbackFunc, ...args);
}},"form":{"findById":(callbackFunc, ...args) => {
  sendGetter("form/findById", callbackFunc, ...args);
}},"comments":{"findById":(callbackFunc, ...args) => {
  sendGetter("comments/findById", callbackFunc, ...args);
},"findByVersionId":(callbackFunc, ...args) => {
  sendGetter("comments/findByVersionId", callbackFunc, ...args);
}},"notifications":{}},
    // GENERATED STUB END
  };

  return {
    initialize,
    onReady,
    ...api,
    register: {
    tab: (...args) => regWrapper.callFunc("tab", ...args)
},
  };
})();