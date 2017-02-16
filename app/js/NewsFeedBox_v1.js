'use strict';

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var config = {
    platform: 'reddit',
    limit: 10,
    facebook: {
        source: 'keplercode',
        acces_token: "217118902086318|LnQ-Eb3kR0-4uCo3xZJ93UbUans"
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

var NewsSource = function NewsSource() {
    var newsContainer = "<p> Empty news container </p>";
    var rawData = new Object();

    return {
        SetNewsContainer: function SetNewsContainer(data) {
            newsContainer = data;
        },
        GetNewsContainer: function GetNewsContainer() {
            return newsContainer;
        },
        SetRawData: function SetRawData(data) {
            rawData = data;
        },
        GetRawData: function GetRawData() {
            return rawData;
        },
        rendered: false
    };
};

var NewsFeedFactory = function NewsFeedFactory() {
    this.createNewsSource = function (platform) {
        var newsSource = Object.create(NewsSource());
        try {
            switch (platform) {
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
        } catch (err) {
            console.log(err);
        }
    };
};

var RedditNews = function RedditNews() {

    this.InfoGet = function () {
        console.log("reddit rawData get");
        $.ajax({
            url: "https://www.reddit.com/r/" + config.reddit.source + "/" + config.reddit.feedtype + ".json",
            success: function success(data) {
                //console.log(data.data.children);
                this.SetRawData(data.data.children);
                console.log(this.GetRawData());
                //  postsAppend(data.data.children)
                if (!this.rendered) {
                    console.log("news isn't rendered yet");
                    CreateNewsContainer();
                }
            },
            error: function error(data) {
                console.log(data);
            }
        });
        function CreateNewsContainer() {
            // this.setNewsContainer("");
            for (var index = 0; index < config.limit; index++) {
                var html = '<blockquote class="reddit-card" data-card-controls="0" data-card-width="350px" data-card-created="1487070719">' + '<a href=https://www.reddit.com' + this.rawData[index].data.permalink + '?ref=share&ref_source=embed></a></blockquote>';
                this.newsContainer += html;
            }
        };
    };
};

var factory = new NewsFeedFactory();

var ananas = factory.createNewsSource('reddit');

//ananas.InfoGet();

$("#container").html = ananas.newsContainer;

var NSource = function NSource() {
    _classCallCheck(this, NSource);

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

var RedditNSource = function (_NSource) {
    _inherits(RedditNSource, _NSource);

    function RedditNSource() {
        _classCallCheck(this, RedditNSource);

        var _this = _possibleConstructorReturn(this, (RedditNSource.__proto__ || Object.getPrototypeOf(RedditNSource)).call(this));

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
                js = d.createElement(s);
                js.src = "https://embed.redditmedia.com/widgets/platform.js";
                fjs.parentNode.insertBefore(js, fjs);
            })(document, 'script');
        };

        _this.GetInfo = function () {
            var _this2 = this;

            var setData = function setData(data) {
                _this2.setRawData(data);
                _this2.createNewsContainer();
                _this2.appendNewsContainer("#form-content");
                _this2.render();
            };
            $.ajax({
                url: "https://www.reddit.com/r/" + config.reddit.source + "/" + config.reddit.feedtype + ".json",
                success: function success(data) {
                    setData(data);
                    //this.setRawData(data.data.children);
                    //console.log(this.getRawData());
                    if (!this.rendered) {
                        console.log("news isn't rendered yet");
                        // CreateNewsContainer();
                    }
                },
                error: function error(data) {
                    console.log(data);
                }
            });
        };
        return _this;
    }

    return RedditNSource;
}(NSource);

var rdt = new RedditNSource();

rdt.GetInfo();