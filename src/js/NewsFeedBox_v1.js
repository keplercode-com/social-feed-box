var config={
    platform:'reddit',
    limit: 10,
    facebook:{
        source: 'keplercode',
        acces_token: "217118902086318|LnQ-Eb3kR0-4uCo3xZJ93UbUans"
    },
    twitter:{
        source: 'TechRepublic'
    },
    instagram:{
        source: 'self',
        access_token: '2881888039.fcdc991.945a7e2b197a429cba59f302c3698bb3'
    },
    reddit:{
        source: 'all',
        feedtype: 'hot'
    }
};



function NewsFeedFactory() {
    this.createNewsSource = function (platform) {
        var newsSource;
        if(platform==='facebook'){
            newsSource = new FacebookNews();
        } else if (platform==='twitter') {
            newsSource = new TwitterNews();
        } else if (platform==='instagram'){
            newsSource = new InstagramNews();
        } else if (platform==='reddit'){
            newsSource = RedditNews();
        }
    }
}