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
        try {
            if(platform==='facebook'){
                newsSource = new FacebookNews();
            } else if (platform==='twitter') {
                newsSource = new TwitterNews();
            } else if (platform==='instagram'){
                newsSource = new InstagramNews();
            } else if (platform==='reddit'){
                newsSource = new RedditNews();
            } else {
                throw "Platform described incorrectly";
            }

            newsSource.platform = platform;

            newsSource.newsContainer = "<p> Empty news container </p>";


            newsSource.setNewsContainer = function (news) {
                newsSource.newsContainer = news;
            };

            newsSource.rawData = new Object();

            newsSource.rendered = false;

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
                this.rawData=data.data.children;
                console.log(this.rawData);
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
            for(index=0;index<config.limit;index++){
                html='<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">'+
                    '<a href=https://www.reddit.com'+this.rawData[index].data.permalink+'?ref=share&ref_source=embed></a></blockquote>';
                this.newsContainer+=html;
            }
        };
    };

};

var factory = new NewsFeedFactory();

var ananas = factory.createNewsSource('reddit');

ananas.InfoGet();

$("#container").html=ananas.newsContainer;

