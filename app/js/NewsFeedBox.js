"use strict";

var platform = 'reddit'; //facebook / twitter / reddit / instagram


var source = "TechRepublic";
var limit = 10;
var access_token = "217118902086318|LnQ-Eb3kR0-4uCo3xZJ93UbUans";

//instagram settings
var token = '2881888039.fcdc991.945a7e2b197a429cba59f302c3698bb3',
    // insta acces token
userid = 'self',
    // works only with "self" for now
num_photos = 4; // limit of instagram photos

//reddit settings
var subreddit = 'all';
var feedtype = 'hot'; // hot / new / rising / controversial / top


function contact_window_show() {
    document.getElementById('shaking-button').style.display = 'none';
    document.getElementById('feed-form').style.display = 'block';
}

function contact_window_hide() {
    document.getElementById('shaking-button').style.display = 'block';
    document.getElementById('feed-form').style.display = 'none';
}

window.onload = function () {
    hideLoader();
};

function hideLoader() {
    document.getElementById("form-loading").style.display = 'none';
}

function info_get() {
    switch (platform) {
        case 'facebook':
            FBInfoGet();
            break;
        case 'twitter':
            TwitterInfoGet();
            break;
        case 'instagram':
            InsagramGetPhotos();
            break;
        case 'reddit':
            RedditInfoGet();
            break;
        default:
            console.log('Platform described incorrectly!');
    }
}

function TwitterInfoGet() {
    twttr.widgets.load();
    twttr.widgets.createTimeline({
        sourceType: 'profile',
        screenName: source
    }, document.getElementById('form-content'), {
        width: '350',
        chrome: 'noheader'
    }).then(function (el) {
        hideLoader();
    });
}

function FBInfoGet() {
    $.get("https://graph.facebook.com/" + source + "?fields=posts.limit(" + limit + "){permalink_url}&access_token=" + access_token, function (data) {
        var post_links = [];
        data.posts.data.forEach(function (item) {
            post_links.push(item.permalink_url);
        });
        FBInfoAppend(post_links);
    });
}

function FBInfoAppend(post_links) {
    post_links.forEach(function (item) {
        var a = document.createElement("div");
        a.className = "postcontainer";
        a.innerHTML = '<div class="fb-post" data-href="' + item + '" data-width="350"></div>';
        document.getElementById("form-content").appendChild(a);
    });

    window.fbAsyncInit = function () {
        FB.init({
            appId: '217118902086318',
            xfbml: true,
            version: 'v2.8'
        });
        FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}

function InsagramGetPhotos() {
    var links = [];
    $.ajax({
        url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent', // or /users/self/media/recent for Sandbox
        dataType: 'jsonp',
        type: 'GET',
        data: { access_token: token, count: num_photos },
        success: function success(data) {

            for (x in data.data) {
                links.push(data.data[x].link); // - Instagram post URL
            }
            appendPhotos();
        },
        error: function error(data) {
            console.log(data); // send the error notifications to console
        }
    });

    //url=
    function appendPhotos() {
        var htmlElementsCollection = [];
        succed = 0;
        for (x in links) {
            $.ajax({
                url: 'https://api.instagram.com/oembed?maxwidth=346&url=' + links[x],
                dataType: 'jsonp',
                type: 'GET',
                async: false,
                success: function success(data) {
                    succed += 1;
                    htmlElementsCollection.push(data.html);
                    if (succed == num_photos) {
                        hideLoader();
                        orderedAppend();
                    }
                    //$('#form-content').append(data.html);
                },
                error: function error(data) {
                    console.log(data); // send the error notifications to console
                }
            });
        }

        function orderedAppend() {
            tmp = htmlElementsCollection.slice(0); //clone html elements array
            for (x in htmlElementsCollection) {
                for (y in htmlElementsCollection) {
                    if (tmp[x].search(links[y]) > 0) {
                        htmlElementsCollection[y] = tmp[x]; //order it by links
                    }
                }
            }
            for (x in htmlElementsCollection) {
                $("#form-content").append(htmlElementsCollection[x]); //append ordered array of html elements
            }
        }
    }
}

function RedditInfoGet() {
    $.ajax({
        url: "https://www.reddit.com/r/" + subreddit + "/" + feedtype + ".json",
        success: function success(data) {
            //   console.log(data.data.children);
            postsAppend(data.data.children);
        },
        error: function error(data) {
            console.log(data);
        }
    });

    function postsAppend(data) {
        var html = '';
        for (var index = 0; index < limit; index++) {
            html += '<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">' + '<a href=https://www.reddit.com' + data[index].data.permalink + '?ref=share&ref_source=embed></a></blockquote>';
        }
        $("#form-content").append(html);
        (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.src = "https://embed.redditmedia.com/widgets/platform.js";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script');
    }
}