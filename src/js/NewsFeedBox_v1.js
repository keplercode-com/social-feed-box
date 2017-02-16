'use strict';

var config = {
    platform: 'reddit',
    limit: 10,
    news_container_id: 'form-content',
    facebook: {
        source: 'keplercode',
        acces_token: "217118902086318|LnQ-Eb3kR0-4uCo3xZJ93UbUans",
        app_id: '217118902086318'
    },
    twitter: {
        source: 'TechRepublic'
    },
    instagram: {
        source: 'self',
        access_token: '2881888039.fcdc991.945a7e2b197a429cba59f302c3698bb3'
    },
    reddit: {
        source: 'all',
        feedtype: 'hot'
    }
};


function contact_window_show() {
    document.getElementById('shaking-button').style.display = 'none';
    document.getElementById('feed-form').style.display = 'block';
}

function contact_window_hide() {
    document.getElementById('shaking-button').style.display = 'block';
    document.getElementById('feed-form').style.display = 'none';
}

function hideLoader() {
    document.getElementById("form-loading").style.display = 'none';
}


window.onload  = function () {
    hideLoader();
};

class NewsSource {
    constructor() {
        this.newsContainer = "<p> Empty news container </p>";
        this.rawData = {"a": 1};
        this.setNewsContainer = function (data) {
            this.newsContainer = data;
        };
        this.getNewsContainer = function () {
            return this.newsContainer;
        };
        this.setRawData = function (data) {
            this.rawData = data;
        };
        this.getRawData = function () {
            return this.rawData;
        };

        this.appendNewsContainer = function (id) {
            $(id).append(this.getNewsContainer());
        };
        this.rendered = false;
    }
}

class RedditNewsSource extends NewsSource {
    constructor() {
        super();
        this.createNewsContainer = function () {
            let data = this.getRawData();
            //console.log(data);
            this.setNewsContainer('');
            var html = '';
            for (var index = 0; index < config.limit; index++) {
                html += '<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">' +
                    '<a href=https://www.reddit.com' + data.data.children[index].data.permalink + '?ref=share&ref_source=embed></a></blockquote>';
            }
            this.setNewsContainer(html);
        };

        this.render = function () {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://embed.redditmedia.com/widgets/platform.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'reddit-widgets'));
        };

        this.getInfo = function () {
            var setData = (data) => {
                this.setRawData(data);
                this.createNewsContainer();
            };
            var renderData = () => {
                this.appendNewsContainer('#'+config.news_container_id);
                this.render();
                this.rendered=true;
            };
            var isRendered = () =>{
                return this.rendered;
            };
            $.ajax({
                url: "https://www.reddit.com/r/" + config.reddit.source + "/" + config.reddit.feedtype + ".json",
                success: function (data) {
                    setData(data);
                    //this.setRawData(data.data.children);
                    //console.log(this.getRawData());
                    if (!isRendered()) {
                       renderData();
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        };
    }
}

class TwitterNewsSource extends NewsSource {
    constructor() {
        super();
        this.getInfo = function () {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'twitter-widgets'));

            twttr.widgets.load();
            twttr.widgets.createTimeline(
                {
                    sourceType: 'profile',
                    screenName:  source
                },
                document.getElementById(config.news_container_id),
                {
                    width: '350',
                    chrome: 'noheader'
                }).then(function (el) {
                hideLoader();
            });
        };
    };
}

class FacebookNewsSource extends NewsSource{
    constructor(){
        super();
        this.render = function () {
            window.fbAsyncInit = function() {
                FB.init({
                    appId      : config.facebook.app_id,
                    xfbml      : true,
                    version    : 'v2.8'
                });
                FB.AppEvents.logPageView();
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        };
        
        this.createNewsContainer = function () {
            let data = this.getRawData();
            this.setNewsContainer('');
            var html='';
            data.forEach(function (item) {
                let tmp='<div class="postcontainer"><div class="fb-post" data-href="' + item + '" data-width="350"></div></div>';
                html+=tmp;
            });
            this.setNewsContainer(html);
        };

        this.getInfo = function () {
            var setData = (data) => {
                this.setRawData(data);
                this.createNewsContainer();
            };
            var renderData = () => {
                this.appendNewsContainer('#'+config.news_container_id);
                this.render();
                this.rendered=true;
            };
            var isRendered = () =>{
                return this.rendered;
            };
            $.get("https://graph.facebook.com/" + config.facebook.source + "?fields=posts.limit(" + config.limit + "){permalink_url}&access_token=" + config.facebook.acces_token, function (data) {
                var post_links = [];
                data.posts.data.forEach(function (item) {
                    post_links.push(item.permalink_url);
                });
                setData(post_links);
                if(!isRendered()){
                    renderData();
                }
            });

        }
    }
}

var NewsFeedFactory = function () {
    this.createNewsSource = function (platform) {
        var newsSource = new NewsSource();
        try {
            switch (platform) {
                case 'facebook':
                    newsSource = new FacebookNewsSource();
                    break;
                case 'twitter':
                    newsSource = new TwitterNewsSource();
                    break;
                case 'instagram':
                    newsSource = new InstagramNews();
                    break;
                case 'reddit':
                    newsSource = new RedditNewsSource();
                    break;
                default:
                    throw "Platform described incorrectly";
            }

            newsSource.platform = platform;

            return newsSource;
        }
        catch (err) {
            console.log(err);
        }
    }
};

var factory = new NewsFeedFactory();

var ananas = factory.createNewsSource('facebook');

ananas.getInfo();