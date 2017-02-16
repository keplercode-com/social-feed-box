'use strict';

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


var NewsSource = function () {
    var newsContainer = "<p> Empty news container </p>";
    var rawData = new Object();

    return{
        SetNewsContainer : function (data) {
            newsContainer=data;
        },
        GetNewsContainer : function () {
            return newsContainer;
        },
        SetRawData : function (data) {
            rawData = data;
        },
        GetRawData : function () {
            return rawData;
        },
        rendered : false
    }
};

var NewsFeedFactory = function() {
    this.createNewsSource = function (platform) {
        var newsSource = Object.create(NewsSource());
        try {
            switch (platform){
                case 'facebook':
                    newsSource = new FacebookNews();
                    break;
                case 'twitter':
                    newsSource = new TwitterNews();
                    break;
                case 'instagram':
                    newsSource = new InstagramNews();
                    break;
                case 'reddit':
                    newsSource = new RedditNews();
                    break;
                default:
                    throw "Platform described incorrectly";
            }

            newsSource.platform = platform;

            return newsSource;
        }
        catch(err){
            console.log(err);
        }
    }
}

var RedditNews = function(){

    this.InfoGet = function () {
        console.log("reddit rawData get");
        $.ajax({
            url: "https://www.reddit.com/r/"+config.reddit.source+"/"+config.reddit.feedtype+".json",
            success: function(data){
                //console.log(data.data.children);
                this.SetRawData(data.data.children);
                console.log(this.GetRawData());
                  //  postsAppend(data.data.children)
                if(!this.rendered){
                    console.log("news isn't rendered yet");
                    CreateNewsContainer();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
        function CreateNewsContainer (){
           // this.setNewsContainer("");
            for(var index=0;index<config.limit;index++){
                var html='<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">'+
                    '<a href=https://www.reddit.com'+this.rawData[index].data.permalink+'?ref=share&ref_source=embed></a></blockquote>';
                this.newsContainer+=html;
            }
        };
    };

};

var factory = new NewsFeedFactory();

var ananas = factory.createNewsSource('reddit');

//ananas.InfoGet();

$("#container").html=ananas.newsContainer;

class NSource{
    constructor(){
        this.newsContainer =  "<p> Empty news container </p>";
        this.rawData = {"a": 1};
        this.setNewsContainer = function (data) {
            this.newsContainer=data;
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

        this.appendNewsContainer = function(id){
          $(id).append(this.getNewsContainer());
        };
        this.rendered = false;
    }
}

    class RedditNSource extends NSource {
        constructor() {
            super();
            this.createNewsContainer = function () {
                let data = this.getRawData();
                //console.log(data);
                this.setNewsContainer('');
                var html = '';
                for(var index=0;index<config.limit;index++){
                    html+='<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">'+
                        '<a href=https://www.reddit.com'+data.data.children[index].data.permalink+'?ref=share&ref_source=embed></a></blockquote>';
                }
                this.setNewsContainer(html);
            };

            this.render = function () {
                (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s);
                    js.src = "https://embed.redditmedia.com/widgets/platform.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script'));
            };

            this.GetInfo = function () {
                var setData = (data) => {
                    this.setRawData(data);
                    this.createNewsContainer();
                    this.appendNewsContainer("#form-content");
                    this.render();
                };
                $.ajax({
                    url: "https://www.reddit.com/r/" + config.reddit.source + "/" + config.reddit.feedtype + ".json",
                    success: function (data) {
                        setData(data);
                        //this.setRawData(data.data.children);
                        //console.log(this.getRawData());
                        if (!this.rendered) {
                            console.log("news isn't rendered yet");
                            // CreateNewsContainer();
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            };
        }
    }

    var rdt = new RedditNSource();

    rdt.GetInfo();

