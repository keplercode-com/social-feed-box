'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

window.onload = function () {
    hideLoader();
};

var NewsSource = function NewsSource() {
    _classCallCheck(this, NewsSource);

    this.newsContainer = "<p> Empty news container </p>";
    this.rawData = { "a": 1 };
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
};

var RedditNewsSource = function (_NewsSource) {
    _inherits(RedditNewsSource, _NewsSource);

    function RedditNewsSource() {
        _classCallCheck(this, RedditNewsSource);

        var _this = _possibleConstructorReturn(this, (RedditNewsSource.__proto__ || Object.getPrototypeOf(RedditNewsSource)).call(this));

        _this.createNewsContainer = function () {
            var data = this.getRawData();
            //console.log(data);
            this.setNewsContainer('');
            var html = '';
            for (var index = 0; index < config.limit; index++) {
                html += '<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">' + '<a href=https://www.reddit.com' + data.data.children[index].data.permalink + '?ref=share&ref_source=embed></a></blockquote>';
            }
            this.setNewsContainer(html);
        };

        _this.render = function () {
            (function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);js.id = id;
                js.src = "https://embed.redditmedia.com/widgets/platform.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'reddit-widgets');
        };

        _this.getInfo = function () {
            var _this2 = this;

            var setData = function setData(data) {
                _this2.setRawData(data);
                _this2.createNewsContainer();
            };
            var renderData = function renderData() {
                _this2.appendNewsContainer('#' + config.news_container_id);
                _this2.render();
                _this2.rendered = true;
            };
            var isRendered = function isRendered() {
                return _this2.rendered;
            };
            $.ajax({
                url: "https://www.reddit.com/r/" + config.reddit.source + "/" + config.reddit.feedtype + ".json",
                success: function success(data) {
                    setData(data);
                    //this.setRawData(data.data.children);
                    //console.log(this.getRawData());
                    if (!isRendered()) {
                        renderData();
                    }
                },
                error: function error(data) {
                    console.log(data);
                }
            });
        };
        return _this;
    }

    return RedditNewsSource;
}(NewsSource);

var TwitterNewsSource = function (_NewsSource2) {
    _inherits(TwitterNewsSource, _NewsSource2);

    function TwitterNewsSource() {
        _classCallCheck(this, TwitterNewsSource);

        var _this3 = _possibleConstructorReturn(this, (TwitterNewsSource.__proto__ || Object.getPrototypeOf(TwitterNewsSource)).call(this));

        _this3.getInfo = function () {
            (function (d, s, id) {
                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);js.id = id;
                js.src = "https://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'twitter-widgets');

            twttr.widgets.load();
            twttr.widgets.createTimeline({
                sourceType: 'profile',
                screenName: source
            }, document.getElementById(config.news_container_id), {
                width: '350',
                chrome: 'noheader'
            }).then(function (el) {
                hideLoader();
            });
        };
        return _this3;
    }

    return TwitterNewsSource;
}(NewsSource);

var FacebookNewsSource = function (_NewsSource3) {
    _inherits(FacebookNewsSource, _NewsSource3);

    function FacebookNewsSource() {
        _classCallCheck(this, FacebookNewsSource);

        var _this4 = _possibleConstructorReturn(this, (FacebookNewsSource.__proto__ || Object.getPrototypeOf(FacebookNewsSource)).call(this));

        _this4.render = function () {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: config.facebook.app_id,
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
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script', 'facebook-jssdk');
        };

        _this4.createNewsContainer = function () {
            var data = this.getRawData();
            this.setNewsContainer('');
            var html = '';
            data.forEach(function (item) {
                var tmp = '<div class="postcontainer"><div class="fb-post" data-href="' + item + '" data-width="350"></div></div>';
                html += tmp;
            });
            this.setNewsContainer(html);
        };

        _this4.getInfo = function () {
            var _this5 = this;

            var setData = function setData(data) {
                _this5.setRawData(data);
                _this5.createNewsContainer();
            };
            var renderData = function renderData() {
                _this5.appendNewsContainer('#' + config.news_container_id);
                _this5.render();
                _this5.rendered = true;
            };
            var isRendered = function isRendered() {
                return _this5.rendered;
            };
            $.get("https://graph.facebook.com/" + config.facebook.source + "?fields=posts.limit(" + config.limit + "){permalink_url}&access_token=" + config.facebook.acces_token, function (data) {
                var post_links = [];
                data.posts.data.forEach(function (item) {
                    post_links.push(item.permalink_url);
                });
                setData(post_links);
                if (!isRendered()) {
                    renderData();
                }
            });
        };
        return _this4;
    }

    return FacebookNewsSource;
}(NewsSource);

var NewsFeedFactory = function NewsFeedFactory() {
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
        } catch (err) {
            console.log(err);
        }
    };
};

var factory = new NewsFeedFactory();

var ananas = factory.createNewsSource('facebook');

ananas.getInfo();