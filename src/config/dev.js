const CONFIG = {
    "ENV_NAME": "DEV",
    "API_BASE": "https://api-dot-dev-euw-rost-fortum.appspot.com/_ah/api/rost",
    "API_VERSION": "v1",
    "API_ENDPOINTS_ORIGINLIST": "origins",
    "API_ENDPOINTS_CONTRACTLIST": "prices",
    "API_ENDPOINTS_CUSTOMERINFO": "addresses/consumer",
    "API_ENDPOINTS_COMPANYINFO": "addresses/business",
    "API_ENDPOINTS_AREALIST": "areas",
    "API_ENDPOINTS_SUBMITCONTRACT_CONSUMER": "contracts/consumer",
    "API_ENDPOINTS_SUBMITCONTRACT_BUSINESS": "contracts/business",
    "API_ENDPOINTS_STARTDATES": "dates",
    "ANALYTICS_TAGMANAGERKEY": "GTM-KH5SSB",
    "RECAPTCHA_SITEKEY": "6LerZwoUAAAAALXatN6-IihrwN7dgR_QsukciQqh"
};

console.debug("[CONFIG][" + CONFIG.ENV_NAME + "]", CONFIG);