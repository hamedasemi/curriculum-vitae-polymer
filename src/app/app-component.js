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
        'on-analytics-event': `_onAnalyticsEvent`,
        'on-notify-event': `_onNotifyEvent`
    },

    observers: [
        `_contractListRequest(area, taxType, campaignId)`
    ],

    properties: {
        api: { type: Object, value: { endpoints: {} } },
        stages: { type: Array },
        video: { type: String },
        image: { type: String },
        analyticsEvent: { type: Object },
        notification: { type: Object },
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


    _onAnalyticsEvent(event) {
        this.set(`analyticsEvent`, event.detail);
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


    /**
     * ======================================================================
     * Observers
     * ======================================================================
     */

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
     * Lazy load static assets that are not part of the critical rendering path.
     */
    lazyLoad() {

        // measure performance
        window.performance && performance.mark && performance.mark(`start-lazy-load`);

        Polymer.RenderStatus.afterNextRender(this, function() {
            this.importHref(`/app/shared/lazy/lazy.html`, function() {
                window.performance && performance.mark && performance.mark(`end-lazy-load`);
                window.performance && performance.measure && performance.measure(`Lazy load`, `start-lazy-load`, `end-lazy-load`);
                // this.importHref(`/app/shared/chat/chat.html`, null, null, true);
            }, null, true);
        });
    },

    hello() {
        return `hello`;
    }

});