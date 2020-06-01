module.exports = class extends window.casthub.module {
    /**
     * Initialize the new Module.
     */
    constructor() {
        super();

        // Labels
        this.followers = [];

        // Keeps track of the current recent follower
        this.cursor = 0;

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
        await this.update();

        setInterval(() => this.fetch(), 1000*60);
        setInterval(() => this.update(), 1000*5);
    }

    async fetch() {

        try {
            let data = {};

            // Grab all the data we want/need for labels here
            const response = await window.casthub.fetch({
                integration: 'twitter',
                method: 'GET',
                url: 'followers/list',
            });

            // Grab the newest 5 followers from the response
            let recentFollowers = response.users.slice(0,5);

            data.followers = recentFollowers.map(follower => {
                return follower.screen_name;
            });

            await this.filesystem.set('data', data);

            this.followers = data.followers;

        } catch (e) {
            await this.filesystem.set('data', {});
            console.log(e);
        }

    }

    async update() {
        // Run logic to update label files here
        await this.filesystem.set('latestFollower', this.followers[0]);

        // Cycle through recent followers
        if(this.cursor >= this.followers.length) { this.cursor = 0; }
        await this.filesystem.set('recentFollowers', this.followers[this.cursor]);
        this.cursor++;
    }

};

