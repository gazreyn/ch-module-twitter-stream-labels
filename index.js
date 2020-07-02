module.exports = class extends window.casthub.module {
    /**
     * Initialize the new Module.
     */
    constructor() {
        super();

        // UI
        this.$header = window.casthub.create('header');
        this.$header.icon = 'twitter';
        this.$header.color = '#1da1f2';
        this.$header.innerText = 'Twitter Labels';
        this.addEl(this.$header);

    }

    /**
     * Run any asynchronous code when the Module is mounted to DOM.
     *
     * @return {Promise}
     */
    async mounted() {
        await super.mounted();

        await this.fetch();

        setInterval(() => this.fetch(), 1000*60);
    }

    async fetch() {

        try {
            let data = {};

            /* Get Followers */
            // const followers = await window.casthub.fetch({
            //     integration: 'twitter',
            //     method: 'GET',
            //     url: 'followers/list',
            // });

            // let recentFollowers = followers.users.slice(0,5);
            // data.followers = recentFollowers.map(follower => {
            //     return follower.screen_name;
            // });
            
            /* Get Mentions */
            const mentionsResponse = await window.casthub.fetch({
                integration: 'twitter',
                method: 'GET',
                url: 'statuses/mentions_timeline',
            });   

            const mentions = Object.values(mentionsResponse);
            mentions.pop(); //Removes the status
            
            const recentMentions = mentions.map(mention => {
                return {
                    "displayName": mention.user.name,
                    "screenName": mention.user.screen_name,
                    "content": mention.text,
                    "avatar": mention.user.profile_image_url_https
                };
            });

            data.tweets = recentMentions;

            await this.filesystem.set('data', data);

        } catch (e) {
            // await this.filesystem.set('data', {});
            console.log(e);
        }
    }

};

