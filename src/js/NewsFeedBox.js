var source="TechRepublic";
var limit=10;
var access_token="217118902086318|LnQ-Eb3kR0-4uCo3xZJ93UbUans"
var platform='twitter'; //facebook / twitter

function contact_window_show() {
    document.getElementById('shaking-button').style.display = 'none';
    document.getElementById('feed-form').style.display = 'block';
}

function contact_window_hide() {
    document.getElementById('shaking-button').style.display = 'block';
    document.getElementById('feed-form').style.display = 'none';
}

window.onload  = function () {
    document.getElementById("form-loading").style.display='none';
}

function info_get(){
    switch (platform){
        case 'facebook':
            FBInfoGet();
            break;
        case 'twitter':
            TwitterInfoGet();
            break;
        default:
            console.log('Platform described incorrectly!');
    }
}

function TwitterInfoGet(){
    twttr.widgets.load();
    twttr.widgets.createTimeline(
        {
            sourceType: 'profile',
            screenName:  source
        },
        document.getElementById('form-content'),
        {
            width: '350',
            chrome: 'noheader'
        }).then(function (el) {
        document.getElementById("form-loading").style.display='none';
    });
}

function FBInfoGet() {
    $.get( "https://graph.facebook.com/"+source+"?fields=posts.limit("+limit+"){permalink_url}&access_token="+access_token,
        function(data){
            var post_links=[];
            data.posts.data.forEach(function(item){
                post_links.push(item.permalink_url);
            });
            FBInfoAppend(post_links);
        });
}

function FBInfoAppend(post_links){
    post_links.forEach(function(item){
        var a = document.createElement("div");
        a.className="postcontainer";
        a.innerHTML='<div class="fb-post" data-href="'+item+'" data-width="350"></div>'
        document.getElementById("form-content").appendChild(a);
    });

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '217118902086318',
            xfbml      : true,
            version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}


