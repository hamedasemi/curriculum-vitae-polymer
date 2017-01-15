/**
 * ======================================================================
 * Polymer Constructor
 * ======================================================================
 */
Polymer({

    is: `app-component`,

    behaviors: [
        Polymer.Behaviors.DebugBehavior,
        Polymer.Behaviors.Resource
    ],

    listeners: {
        'on-start': `_onStart`,
        'on-origin': `_onOrigin`,
        'on-usage-category': `_onUsageCategory`,
        'on-postcode': `_onPostcode`,
        'on-area': `_onArea`,
        'on-duration': `_onDuration`,
        'on-contract-start-date-selection': `_onContractStartDateSelection`,
        'on-usage': `_onUsage`,
        'on-contract-type': `_onContractType`,
        'on-contract-selection': `_onContractSelection`,
        'on-personal-number': `_onPersonalNumber`,
        'on-organisation-number': `_onOrganisationNumber`,
        'on-electricity-address': `_onElectricityAddress`,
        'on-billing-address': `_onBillingAddress`,
        'on-customer-info-confirm': `_onCustomerInfoConfirm`,
        'on-contact-info-confirmed': `_onContactInfoConfirmed`,
        'on-submit-contract': `_onSubmitContract`,
        'on-contract-start-dates': `_onContractStartDates`,
        'on-analytics-event': `_onAnalyticsEvent`,
        'on-resettle-event': `_onResettleEvent`,
        'on-proxy-process-event': `_onProxyProcessEvent`,
        'on-notify-event': `_onNotifyEvent`
    },

    observers: [
        `_businessChanged(business)`,
        `_usageChanged(usage)`,
        `_durationChanged(duration)`,
        `_contractStartDateSelectionChanged(contractStartDateSelected)`,
        `_contractListChanged(contractList)`,
        `_contractTypeListChanged(contractTypeList)`,
        `_contractTypeChanged(contractType, contractList)`,
        `_usageCategoryAndContractListFiltedredByTypeChanged(usageCategory, contractListFiltedredByType)`,
        `_createContractDurationList(contractListFiltedredByTypeByUsage)`,
        `_durationAndContractListFiltedredByTypeByUsageChanged(duration, contractListFiltedredByTypeByUsage)`,
        `_createContractStartDateList(contractListFiltedredByTypeByUsageByDuration)`,
        `_contractStartDateSelectedAndContractListFiltedredByTypeByUsageByDurationChanged(contractStartDateSelected, contractListFiltedredByTypeByUsageByDuration)`,
        `_calculateOriginFee(origin, originList, usage)`,
        `_calculateOriginDiscount(originDiscount, usage, contractDuration)`,
        `_calculateMonthlyCost(usage, contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons)`,
        `_calculateAddons(contract, usage)`,
        `_contractListRequest(area, taxType, campaignId)`
    ],

    properties: {
        api: { type: Object, value: { endpoints: {} } },
        stages: { type: Array },
        origin: { type: String },
        originFee: { type: Number },
        originDiscount: { type: Object },
        originDiscountPrice: { type: Number },
        originList: { type: Array },
        selectedOrigin: { type: Object },
        usage: { type: Number },
        usageCategory: { type: String },
        usageCategoryList: { type: Array },
        video: { type: String },
        image: { type: String },
        postcode: { type: String },
        personalNumber: { type: String },
        organisationsNummer: { type: String },
        customerInfoRequestState: { type: String },
        area: { type: String },
        areaList: { type: Array },
        areaRequestState: { type: String },
        taxType: { type: String },
        contactFirstname: { type: String },
        contactLastname: { type: String },
        contactEmailAddress: { type: String },
        contactPhoneNumber: { type: String },
        addons: { type: Number },
        duration: { type: Number },
        durationList: { type: Array },
        contract: { type: Object },
        contractId: { type: String },
        contractDuration: { type: String },
        contractList: { type: Array },
        contractType: { type: String },
        contractTypeList: { type: Array },
        contractFixedFee: { type: Number },
        contractFixedFeeUnit: { type: String },
        contractElPriceTotal: { type: Number },
        contractElPriceUnit: { type: String },
        contractElPriceRaw: { type: Number },
        contractElPriceAddOn: { type: Number },
        contractElPriceVat: { type: Number },
        contractElPriceTax: { type: Number },
        contractBonuses: { type: Array },
        contractProducts: { type: Array },
        contractStartDateSelected: { type: String },
        contractEndDateSelected: { type: String },
        contractStartDateList: { type: Array },
        contractListFiltedredByType: { type: Array },
        contractListFiltedredByTypeByUsage: { type: Array },
        contractListFiltedredByTypeByUsageByDuration: { type: Array },
        contractListFiltedredByTypeByUsageByDurationByStartDate: { type: Array },
        submitContractRequestState: { type: String },
        analyticsEvent: { type: Object },
        proxyProcessEnabled: { type: Boolean, value: true },
        notification: { type: Object },
        resettle: { type: Boolean, value: false },
        resettlePreviousOwner: { type: String, value: null },
        resettleApartmentNumber: { type: String, value: null },
        contractStartDates: { type: String, value: null },
        meterPoint: { type: String, value: null },
        gridCode: { type: String, value: null },
        campaign: { type: Object, value: null },
        campaignId: { type: String },
        business: { type: Boolean, value: false }
    },


    /**
     * ======================================================================
     * Polymer Lifecycle
     * ======================================================================
     */

    attached() {

        // measure performance
        window.performance && performance.mark && performance.mark(`app-load-end`);
        window.performance && performance.measure && performance.measure(`App load`, `app-load-start`, `app-load-end`);

        this.async(() => {

            let campaignName = (this.campaignRouter.campaign) ? this.campaignRouter.campaign : `privat`;
            let stage = (this.router.stage) ? this.router.stage : `start`;
            this.set(`campaignRouter.campaign`, `${campaignName}/${stage}`);
            this._originListRequest(campaignName);

            typeof this.queryParams.area !== `undefined` && this.set(`area`, this.queryParams.area);
            typeof this.queryParams.taxType !== `undefined` && this.set(`taxType`, this.queryParams.taxType);
            typeof this.queryParams.postcode !== `undefined` && this.set(`postcode`, this.queryParams.postcode);
            typeof this.queryParams.origin !== `undefined` && this.set(`origin`, this.queryParams.origin);
            typeof this.queryParams.usageCategory !== `undefined` && this.set(`usageCategory`, this.queryParams.usageCategory);
            typeof this.queryParams.usage !== `undefined` && this.set(`usage`, this.queryParams.usage);

            this.lazyLoad();
        });

    },

    /**
     * ======================================================================
     * LISTENERS
     * ======================================================================
     */

    _onStart() {
        this.set(`router.stage`, `ursprung`);
    },

    _onOrigin(event) {
        let originType = event.detail.origin.type;
        this.set(`origin`, originType);
        this.set(`queryParams.origin`, originType);
        this.set(`video`, event.detail.origin.video);
        this.set(`image`, event.detail.origin.image);
        if (this.business) {
            let usageCategory = `COMPANY`;
            this.set(`usageCategory`, usageCategory);
            this.set(`queryParams.usageCategory`, usageCategory);
            this.set(`usage`, 25000);
            this.router.stage === `ursprung` && this.set(`router.stage`, `postnummer`);
        } else {
            this.router.stage === `ursprung` && this.set(`router.stage`, `forbrukning`);
        }
    },

    _onUsageCategory(event) {
        let usageCategory = this._calculateUsageCategory(event.detail.usage, this.usageCategory);
        this.set(`usageCategory`, usageCategory);
        this.set(`queryParams.usageCategory`, usageCategory);
        this.set(`usage`, event.detail.usage);
        this.set(`router.stage`, `postnummer`);
    },

    _onPostcode(event) {
        this._areaRequest(event.detail.postcode);
    },

    _onArea(event) {
        this.router.stage === `postnummer` && this.set(`router.stage`, `pris`);
        this.set(`area`, event.detail.area);
        this.set(`taxType`, this.notConfirmedTaxType);
        this.set(`postcode`, this.notConfirmedPostcode);
        this.set(`queryParams.area`, event.detail.area);
        this.set(`queryParams.postcode`, this.notConfirmedPostcode);
        this.set(`queryParams.taxType`, this.notConfirmedTaxType);
    },

    _onDuration(event) {
        this.set(`duration`, event.detail.duration);
        this.set(`queryParams.duration`, event.detail.duration);
    },

    _onContractStartDateSelection(event) {
        this.set(`contractStartDateSelected`, event.detail.contractStartDateSelected);
        this.set(`queryParams.contractStartDateSelected`, event.detail.contractStartDateSelected);
    },

    _onUsage(event) {
        this.set(`usage`, event.detail.usage);
        let usageCategory = this._calculateUsageCategory(event.detail.usage, this.usageCategory);
        this.set(`usageCategory`, usageCategory);
        this.set(`queryParams.usageCategory`, usageCategory);
        this.set(`queryParams.usage`, event.detail.usage);
    },

    _onContractType(event) {
        this.set(`contractType`, event.detail.contractType);
    },

    _onContractSelection() {
        this.set(`router.stage`, `kunduppgifter`);
    },

    _onPersonalNumber(event) {
        this._customerInfoRequest(event.detail.postcode, event.detail.personalNumber);
    },

    _onOrganisationNumber(event) {
        this._companyInfoRequest(event.detail.orgNumber, event.detail.token);
    },

    _onElectricityAddress(event) {
        this.set(`electricityAddress`, event.detail);
    },

    _onBillingAddress(event) {
        this.set(`billingAddress`, event.detail);
    },

    _onCustomerInfoConfirm(event) {
        this.set(`router.stage`, `startdatum`);
        this.set(`personalNumber`, event.detail.personalNumber);
        this.set(`organisationsNummer`, event.detail.organisationsNummer);
    },

    _onContactInfoConfirmed(event) {
        this.set(`contactFirstname`, event.detail.contactFirstname);
        this.set(`contactLastname`, event.detail.contactLastname);
        this.set(`contactEmailAddress`, event.detail.contactEmailAddress);
        this.set(`contactPhoneNumber`, event.detail.contactPhoneNumber);
        this.set(`router.stage`, `sammanfattning`);
    },

    _onSubmitContract(event) {
        this._submitContractRequest(event.detail.contract, event.detail.business);
    },

    _onContractStartDates() {
        this._contractStartDatesRequest();
    },

    _onAnalyticsEvent(event) {
        this.set(`analyticsEvent`, event.detail);
    },

    _onResettleEvent(event) {
        this.set(`resettle`, event.detail.resettle);
        this.set(`resettlePreviousOwner`, event.detail.previousOwner);
        this.set(`resettleApartmentNumber`, event.detail.apartmentNumber);
    },

    _onProxyProcessEvent(event) {
        this.set(`proxyProcessEnabled`, event.detail.enabled);
        this.set(`meterPoint`, event.detail.meterPoint);
        this.set(`gridCode`, event.detail.gridCode);
        this.set(`router.stage`, `kontaktuppgifter`);
    },

    _onNotifyEvent(event) {
        this.set(`notification`, event.detail);
    },

    /**
     * ======================================================================
     * Request and Responses
     * ======================================================================
     */

    _originListRequest(campaignName) {
        this.set(`campaign`, null);
        this.originListRequest = `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_ORIGINLIST}/${campaignName}`;
    },

    originListResponse(data) {
        this.set(`originList`, data.detail.response.originList);
        this.set(`usageCategoryList`, data.detail.response.usageList);
        this.set(`campaign`, data.detail.response.campaign);
        this.set(`campaignId`, data.detail.response.campaign.id);
        this.set(`business`, data.detail.response.campaign.campaignType === `business`);
        this.set(`video`, data.detail.response.campaign.attributes.startVideo);
        this.set(`image`, data.detail.response.campaign.attributes.startImage);
        document.body.setAttribute(`loaded`, ``);
    },

    originListError(data) {
        this.set(`router.stage`, `error`);
        this.error(`originListError: ${data.detail.request.parseResponse().error.message}`);
        this.set(`video`, `/assets/media/vatten.mp4`);
        this.set(`image`, `/assets/media/vatten.jpg`);
        document.body.setAttribute(`loaded`, ``);
    },

    _areaRequest(postcode) {
        if (postcode) {
            this.areaRequest = `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_AREALIST}/${postcode}`;
            this.set(`areaRequestState`, `indeterminate`);
        } else {
            this.set(`areaRequestState`, `active`);
            this.areaRequest = null;
        }
    },

    areaResponse(data) {
        if (data.detail.response.postalCode !== this.notConfirmedPostcode) {
            this.fire(`on-notify-event`, { message: this.localize(`notification.price-based-on-postcode`, `value`, data.detail.response.postalCode)});
        }
        this.areaRequest = null;
        this.set(`areaList`, data.detail.response.electricityAreas);
        this.set(`notConfirmedTaxType`, data.detail.response.taxType);
        this.set(`notConfirmedPostcode`, data.detail.response.postalCode);
        this.set(`areaRequestState`, `success`);
    },

    areaError(data) {
        this.areaRequest = null;
        let tempError = data.detail.request.parseResponse().error;
        let tempMessage = JSON.parse(tempError.message);
        let error = {};
        error.code = tempError.code;
        error.locale = tempMessage.errorString;
        error.message = tempMessage;
        this.set(`areaRequestError`, error);
        this.set(`areaRequestState`, `error`);
        this.error(`areaError: ${data.detail.request.parseResponse().error.message}`);
    },

    _contractListRequest(area, taxType, campaignId) {
        this.contractListRequest = `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_CONTRACTLIST}/${area}/${taxType}/${campaignId}`;
    },

    contractListResponse(data) {
        this.set(`contractList`, data.detail.response.items);
    },

    contractListError(data) {
        this.set(`router.stage`, `error`);
        this.error(`contractListError: ${data.detail.request.parseResponse().error.message}`);
    },

    _customerInfoRequest(postcode, personalNumber) {
        if (personalNumber && postcode){
            this.set(`customerInfoRequest`, `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_CUSTOMERINFO}/${personalNumber}/${postcode}`);
            this.set(`customerInfoRequestState`, `indeterminate`);
            this.set(`postcodeState`, `indeterminate`);
            this.set(`personalNumberState`, `indeterminate`);
        } else {
            this.set(`customerInfoRequest`, null);
            this.set(`customerInfoRequestState`, `active`);
            this.set(`postcodeState`, `active`);
            this.set(`personalNumberState`, `active`);
            this.set(`customerInfo`, null);
        }
    },

    customerInfoResponse(data) {
        this.set(`postcodeState`, `success`);
        this.set(`personalNumberState`, `success`);
        this.set(`customerInfoRequestState`, `success`);
        this.set(`customerInfoRequestError`, null);
        this.set(`customerInfoRequest`, null);
        const response = data.detail.response;
        this.set(`customerInfo`, {
            firstName: response.firstName,
            lastName: response.lastName,
            shortName: response.firstName,
            fullName: `${response.firstName} ${response.lastName}`,
            personNummer: response.personNummer,
            organisationsNummer: null,
            streetName: response.streetName,
            postalCode: response.postalCode,
            postalAddress: response.postalAddress
        });
    },

    customerInfoError(data) {
        let tempError = data.detail.request.parseResponse().error;
        let tempMessage = JSON.parse(tempError.message);
        tempError.code === 200 && this.set(`personalNumberState`, `success`);
        tempError.code === 200 && this.set(`postcodeState`, `success`);
        tempError.code === 400 && this.set(`personalNumberState`, `error`);
        tempError.code === 400 && this.set(`postcodeState`, `success`);
        tempError.code === 404 && this.set(`personalNumberState`, `success`);
        tempError.code === 404 && this.set(`postcodeState`, `success`);
        tempError.code === 412 && this.set(`personalNumberState`, `success`);
        tempError.code === 412 && this.set(`postcodeState`, `error`);
        this.set(`customerInfoRequest`, null);
        this.set(`customerInfoRequestError`, {
            code: tempError.code,
            message: tempMessage,
            locale: tempMessage.errorString,
            success: tempError.code === 200,
            hiddenIdentity: data.detail.request.status === 404,
            mismatched: tempError.code === 412
        });
        this.error(`contractListError: ${data.detail.request.parseResponse().error.message}`);
    },

    _companyInfoRequest(orgNumber, token) {
        if (orgNumber && token){
            this.set(`companyInfoRequest`, `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_COMPANYINFO}/${orgNumber}?token=${token}`);
            this.set(`companyInfoRequestState`, `indeterminate`);
        } else if (!orgNumber) {
            this.set(`companyInfoRequest`, null);
            this.set(`companyInfoRequestState`, `active`);
            this.set(`customerInfo`, null);
        }
    },

    companyInfoResponse(data) {
        this.set(`companyInfoRequest`, null);
        this.set(`companyInfoRequestState`, `success`);
        this.set(`companyInfoRequestError`, null);
        const response = data.detail.response;
        this.set(`customerInfo`, {
            firstName: null,
            lastName: null,
            shortName: response.name,
            fullName: response.name,
            personNummer: null,
            organisationsNummer: response.organisationsNummer,
            streetName: response.streetName,
            postalCode: response.postalCode,
            postalAddress: response.postalAddress
        });
    },

    companyInfoError(data) {
        let tempError = data.detail.request.parseResponse().error;
        let tempMessage = JSON.parse(tempError.message);
        this.set(`companyInfoRequest`, null);
        this.set(`companyInfoRequestState`, `error`);
        this.set(`companyInfoRequestError`, {
            locale: tempMessage.errorString
        });
        this.error(`companyInfoError: ${data.detail.request.parseResponse().error.message}`);
    },

    _contractStartDatesRequest() {
        this.set(`contractStartDatesRequest`, `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_STARTDATES}`);
    },

    contractStartDatesResponse(data) {
        this.set(`contractStartDates`, data.detail.response);
        this.set(`contractStartDatesRequest`, null);
    },

    contractStartDatesError(data) {
        this.set(`contractStartDatesRequest`, null);
        this.set(`router.stage`, `error`);
        this.error(`contractStartDatesError: ${data.detail.request.parseResponse().error.message}`);
    },

    _submitContractRequest(contract, business) {
        if (this.submitContractRequestState !== `indeterminate`) {
            this.submitContractBody = contract;
            if (business) {
                this.set(`submitContractRequest`, `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_SUBMITCONTRACT_BUSINESS}`);
            } else {
                this.set(`submitContractRequest`, `${CONFIG.API_BASE}/${CONFIG.API_VERSION}/${CONFIG.API_ENDPOINTS_SUBMITCONTRACT_CONSUMER}`);
            }
            this.set(`submitContractRequestState`, `indeterminate`);
        }
    },

    submitContractResponse() {
        this.set(`router.stage`, `tack`);
        this.set(`queryParams`, {});
        this.set(`submitContractRequestState`, `success`);
    },

    submitContractError(data) {
        this.set(`submitContractRequestState`, `error`);
        this.set(`router.stage`, `error`);
        this.error(`submitContractError: ${data.detail.request.parseResponse().error.message}`);
    },

    /**
     * ======================================================================
     * Observers
     * ======================================================================
     */

    _businessChanged(business) {
        if (business) {
            this.set(`stages`, [`start`,`ursprung`,`postnummer`,`pris`,`kunduppgifter`,`startdatum`,`kontaktuppgifter`,`sammanfattning`,`tack`]);
        } else {
            this.set(`stages`, [`start`,`ursprung`,`forbrukning`,`postnummer`,`pris`,`kunduppgifter`,`startdatum`,`kontaktuppgifter`,`sammanfattning`,`tack`]);
        }
    },

    _usageChanged(usage) {
        this.set(`queryParams.usage`, usage);
    },

    _durationChanged(duration) {
        this.set(`queryParams.duration`, duration);
    },

    _contractStartDateSelectionChanged(contractStartDateSelected) {
        this.set(`queryParams.contractStartDateSelected`, contractStartDateSelected);
    },

    _contractListChanged(contractList) {
        this.set(`contractTypeList`, this._createContractTypeList(contractList));
    },

    _contractTypeListChanged(contractTypeList) {
        this.set(`contractType`, typeof this.queryParams.contractType === `undefined` ? contractTypeList[0] : this.queryParams.contractType);
    },

    _contractTypeChanged(contractType, contractList) {
        this.set(`queryParams.contractType`, contractType);
        let contractListFiltedredByType = contractList.filter((contract) => {
            return contract.type === contractType;
        });
        if (contractListFiltedredByType.length > 0) {
            this.set(`contractListFiltedredByType`, contractListFiltedredByType);
        } else {
            this.error(`_contractTypeChanged: Could not find contract type: ${contractType}`);
        }
    },

    _usageCategoryAndContractListFiltedredByTypeChanged(usageCategory, contractListFiltedredByType) {
        let contractListFiltedredByTypeByUsage = contractListFiltedredByType.filter((contract) => {
            return contract.area === usageCategory;
        });
        if (contractListFiltedredByTypeByUsage.length > 0) {
            this.set(`contractListFiltedredByTypeByUsage`, contractListFiltedredByTypeByUsage);
        } else {
            this.error(`_usageCategoryAndContractListFiltedredByTypeChanged: Could not find usage category: ${usageCategory}`);
        }
    },

    _createContractDurationList(contractListFiltedredByTypeByUsage) {
        if (typeof contractListFiltedredByTypeByUsage[0].duration !== `undefined`) {
            let durationList = contractListFiltedredByTypeByUsage.map((contract) => {
                return contract.duration;
            });
            this.set(`durationList`, durationList);
            this.set(`duration`, typeof this.queryParams.duration === `undefined` ? durationList[0] : this.queryParams.duration);
        } else {
            this.set(`durationList`, null);
            this.set(`duration`, null);
        }
    },

    _durationAndContractListFiltedredByTypeByUsageChanged(duration, contractListFiltedredByTypeByUsage) {
        let contractListFiltedredByTypeByUsageByDuration = contractListFiltedredByTypeByUsage.filter((contract) => {
            return typeof contract.duration === `undefined` || contract.duration == duration;
        });
        this.set(`contractListFiltedredByTypeByUsageByDuration`, contractListFiltedredByTypeByUsageByDuration);
    },

    _createContractStartDateList(contractListFiltedredByTypeByUsageByDuration) {
        if (contractListFiltedredByTypeByUsageByDuration[0].pricePeriods) {
            let contractStartDateList = contractListFiltedredByTypeByUsageByDuration[0].pricePeriods.filter((pricePeriod) => {
                return pricePeriod.visible;
            });
            this.set(`contractStartDateList`, contractStartDateList);
            this.set(`contractStartDateSelected`, typeof this.queryParams.contractStartDateSelected === `undefined` ? contractStartDateList[0].startDate : this.queryParams.contractStartDateSelected);
        } else {
            this.set(`contractStartDateList`, null);
            this.set(`contractStartDateSelected`, null);
            this.set(`contractEndDateSelected`, null);
            this.error(`_createContractStartDateList: No price periods found on contract`);
        }
    },

    _contractStartDateSelectedAndContractListFiltedredByTypeByUsageByDurationChanged(contractStartDateSelected, contractListFiltedredByTypeByUsageByDuration) {
        let contractListFiltedredByTypeByUsageByDurationByStartDate = contractListFiltedredByTypeByUsageByDuration;
        let matchingPricePeriods = [];

        if (typeof contractListFiltedredByTypeByUsageByDuration[0].pricePeriods !== `undefined`) {

            // filter matching periods based on exact match of date
            matchingPricePeriods = contractListFiltedredByTypeByUsageByDuration[0].pricePeriods.filter((contract) => {
                return contract.startDate === contractStartDateSelected;
            });

            // if a matching period found use pricePeriod.contractEndDate as contractEndDateSelected
            if (matchingPricePeriods.length === 1) {
                this.set(`contractEndDateSelected`, (typeof matchingPricePeriods[0].contractEndDate === `undefined`) ? null : matchingPricePeriods[0].contractEndDate);
            } else {
                // if NOT a matching period found - filter pricePeriods by year and month
                const startDateSelected = new Date(contractStartDateSelected);
                matchingPricePeriods = contractListFiltedredByTypeByUsageByDuration[0].pricePeriods.filter((contract) => {
                    const contractStartDate = new Date(contract.startDate);
                    return contractStartDate.getFullYear() === startDateSelected.getFullYear() && contractStartDate.getMonth() === startDateSelected.getMonth();
                });
                // use pricePeriod.alternativeContractEndDate as contractEndDateSelected
                this.set(`contractEndDateSelected`, (typeof matchingPricePeriods[0].alternativeContractEndDate) === `undefined` ? null : matchingPricePeriods[0].alternativeContractEndDate);
            }
        } else {
            this.error(`_contractStartDateSelectedAndContractListFiltedredByTypeByUsageByDurationChanged: No price periods found on contract`);
        }

        if (matchingPricePeriods.length === 1) {
            contractListFiltedredByTypeByUsageByDurationByStartDate[0].price = matchingPricePeriods[0].price;
            this.set(`contractListFiltedredByTypeByUsageByDurationByStartDate`, contractListFiltedredByTypeByUsageByDurationByStartDate);
            this._createNewContract(contractListFiltedredByTypeByUsageByDurationByStartDate);
        } else {
            this.error(`_contractStartDateSelectedAndContractListFiltedredByTypeByUsageByDurationChanged: Could not find a matchingPricePeriod`);
        }
    },

    /**
     * Observer: Calculate the origin fee. The origin fee can have different price types.
     */
    _calculateOriginFee(originType, originList, usage) {
        let origin = originList.filter((origin) => {
            return origin.type === originType;
        });
        if (origin.length > 0) {
            const selectedOrigin = origin[0];
            const originDiscount = (typeof selectedOrigin.discount === `undefined`) ? null : selectedOrigin.discount;
            const originFee = this._calculateMonthlyCostForPriceType(selectedOrigin.price, usage, selectedOrigin.priceType);
            this.set(`selectedOrigin`, selectedOrigin);
            this.set(`originFee`, originFee);
            this.set(`originDiscount`, originDiscount);
        } else {
            this.set(`selectedOrigin`, null);
            this.error(`_calculateOriginFee: No origin found of type: ${originType}`);
        }
    },

    /**
     * Observer: Calculate the origin discount. Each origin can have a discount object which has a price & duration.
     */
    _calculateOriginDiscount(originDiscount, usage, contractDuration) {
        if (originDiscount) {
            let originDiscountPrice = this._calculateMonthlyCostForPriceType(originDiscount.price, usage, originDiscount.partType);
            if (typeof originDiscount.duration !== `undefined` && contractDuration) {
                let discountDuration = Math.min(originDiscount.duration, contractDuration);
                originDiscountPrice = originDiscountPrice * (discountDuration / contractDuration);
            }
            this.set(`originDiscountPrice`, originDiscountPrice);
        } else {
            this.set(`originDiscountPrice`, 0);
        }
    },

    /**
     * Observer: Calculate the monthly cost.
     */
    _calculateMonthlyCost(usage, contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons) {
        let monthlyCost = ((usage * contractElPriceTotal) / (12 * 100)) + contractFixedFee + originFee + originDiscountPrice + addons;
        let elUnit = this.localize(`unit.currency.swedishOrePerKwh`);
        let elUnitPrice = this._calculateElUnitPrice(monthlyCost, usage);
        let elUnitPriceComparisonList = this._calculateElUnitComparisionList(contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons);
        this.set(`monthlyCost`, monthlyCost);
        this.set(`elUnit`, elUnit);
        this.set(`elUnitPrice`, elUnitPrice);
        this.set(`elUnitPriceComparisonList`, elUnitPriceComparisonList);
    },

    /**
     * Observer: Calculate all the addons/products on a contract.
     */
    _calculateAddons(contract, usage) {
        if (typeof contract.products !== `undefined`) {
            let addon = contract.products
                .filter((product) => {
                    return product.required;
                })
                .map((product) => {
                    return {
                        price: this._calculateMonthlyCostForPriceType(product.price, usage, product.partType),
                        duration: product.duration
                    };
                })
                .map((product) => {
                    if (typeof product.duration !== `undefined` && typeof contract.duration !== `undefined`) {
                        let productDuration = Math.min(product.duration, contract.duration);
                        return product.price * (productDuration / contract.duration);
                    }
                    return product.price;
                })
                .reduce((prev, curr) => {
                    return prev + curr;
                }, 0);
            this.set(`addons`, addon);
        } else {
            this.set(`addons`, null);
        }
    },

    /**
     * ======================================================================
     * Methods Expressions & Declarations
     * ======================================================================
     */

    /**
     * Logic to handle stepping back in the sign up flow.
     */
    goBack() {
        let currentStageIndex = this.stages.indexOf(this.router.stage);
        let previousStage = this.stages[currentStageIndex - 1];
        this.set(`router.stage`, typeof previousStage === `undefined` ? this.stages[0] : previousStage);
    },

    /**
     * Toggles the campaign between default private campaign and default business campaign.
     */
    toggleCampaign() {
        if (this.campaign) {
            this.set(`queryParams`, {});
            this.set(`customerInfo`, null);
            const campaignName = (this.campaign.campaignType === `standard`) ? `foretag` : `privat`;
            this.set(`campaignRouter.campaign`, `${campaignName}/${this.router.stage}`);
            this._originListRequest(campaignName);
        }
    },

    /**
     * Create a new contract and abstract all info needed to variables.
     */
    _createNewContract(contractListFiltedredByTypeByUsageByDurationByStartDate) {
        let contract = contractListFiltedredByTypeByUsageByDurationByStartDate[0];
        this.set(`contract`, contract);
        this.set(`contractId`, contract.id);
        this.set(`contractDuration`, (typeof contract.duration === `undefined`) ? null : contract.duration);
        this.set(`contractFixedFee`, contract.price.fee);
        this.set(`contractFixedFeeUnit`, contract.price.feeUnit);
        this.set(`contractElPriceTotal`, contract.price.total);
        this.set(`contractElPriceUnit`, contract.price.unit);
        this.set(`contractElPriceRaw`, contract.price.raw);
        this.set(`contractElPriceAddOn`, contract.price.addOn);
        this.set(`contractElPriceVat`, contract.price.vat);
        this.set(`contractElPriceTax`, contract.price.tax);
        this.set(`contractBonuses`, contract.bonuses);
        this.set(`contractProducts`, contract.products);
    },

    _electricityExpenditures(electricityConsumption, electricityPrice, subunit = 100) {
        let electricityExpenditures = electricityConsumption * electricityPrice / subunit;
        return electricityExpenditures;
    },

    _electricityExpenses(subscriptionFee, originFee, originDiscountPrice, productsAddOn, yearLength = 12) {
        let electricityExpenses = (subscriptionFee + originFee + originDiscountPrice + productsAddOn) * yearLength;
        return electricityExpenses;
    },

    _totalCostsOfElectricityPerYear(electricityExpenditures, electricityExpenses) {
        let totalCostsOfElectricityPerYear = electricityExpenditures + electricityExpenses;
        return totalCostsOfElectricityPerYear;
    },

    _averageElectricityPrice(totalCostsOfElectricityPerYear, electricityConsumption, subunit = 100) {
        let averageElectricityPrice = totalCostsOfElectricityPerYear / electricityConsumption * subunit;
        return averageElectricityPrice;
    },

    _newElectricityPrice(usage, contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons) {
        let electricityExpenditures = this._electricityExpenditures(usage, contractElPriceTotal);
        let electricityExpenses = this._electricityExpenses(contractFixedFee, originFee, originDiscountPrice, addons);
        let totalCostsOfElectricityPerYear = this._totalCostsOfElectricityPerYear(electricityExpenditures, electricityExpenses);
        let averageElectricityPrice = this._averageElectricityPrice(totalCostsOfElectricityPerYear, usage);
        return averageElectricityPrice;
    },

    /**
     * Calculate the comparison list ("jämförpris") used to compare "Ditt elpris" to different yearly usage in kwh/år.
     */
    _calculateElUnitComparisionList(contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons) {
        const comparisonList = [
            { usage: 2000, unitPrice: null },
            { usage: 5000, unitPrice: null },
            { usage: 20000, unitPrice: null }
        ];
        const elUnitPriceComparisonList = comparisonList.map((comparison) => {
            return {
                usage: comparison.usage,
                unitPrice: this._newElectricityPrice(comparison.usage, contractElPriceTotal, contractFixedFee, originFee, originDiscountPrice, addons)
            };
        });
        return elUnitPriceComparisonList;
    },

    /**
     * Create the contract type list. This is hardcoded since there is only two types of contracts (FIXED & VARIABLE).
     */
    _createContractTypeList() {
        return [`VARIABLE`, `FIXED`];
    },

    /**
     * Calculate "ditt elpris" which is the customers yearly cost in öre/kwh.
     */
    _calculateElUnitPrice(monthlyCost, usage) {
        // return zero if user enters zero as usage. zero is not divisible.
        if (usage == 0) {
            return 0;
        } else {
            return (monthlyCost * 12 * 100) / usage;
        }
    },

    /**
     * Calculate the usage category which is determined by usage (kwh/år) or campaign type.
     */
    _calculateUsageCategory(usage, usageCategory) {
        if (usageCategory === `COMPANY`) {
            return `COMPANY`;
        } else if (usage > 8000) {
            return `HOUSE`;
        } else {
            return `APARTMENT`;
        }
    },

    /**
     * Calculate the monthly cost based on price type.
     */
    _calculateMonthlyCostForPriceType(price, usage, priceType) {
        if (priceType.toLowerCase() === `volume`) {
            // price is in kwh/öre. calculation: ((kwh/år * öre/kwh) / (12 * 100)) = cost in kr/mån.
            return ((usage * price) / (12 * 100));
        } else if (priceType.toLowerCase() === `amount`) {
            // price is in kr/mån. calculation: do nothing return price already in kr/mån.
            return price;
        } else {
            this.error(`_calculateMonthlyCostForPriceType: Unknown price type: ${priceType}`);
        }
    },

    /**
     * Lazy load static assets that are not part of the critical rendering path.
     */
    lazyLoad() {

        // measure performance
        window.performance && performance.mark && performance.mark(`start-lazy-load`);

        Polymer.RenderStatus.afterNextRender(this, function() {
            this.importHref(`/app/shared/lazy/lazy.html`, function() {
                window.performance && performance.mark && performance.mark(`end-lazy-load`);
                window.performance && performance.measure && performance.measure(`Lazy load`, `start-lazy-load`, `end-lazy-load`);
                this.importHref(`/app/shared/chat/chat.html`, null, null, true);
            }, null, true);
        });
    },

    hello() {
        return `hello`;
    }

});