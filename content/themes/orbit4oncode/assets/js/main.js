/*====================================================
  TABLE OF CONTENT
  1. function declearetion
  2. Initialization
====================================================*/

/*===========================
 1. function declearetion
 ==========================*/
 var themeApp = {

    setcolumn: function () {
        $container = $('#item-container');
        $items = $('.item');
        conWidth = $('#item-container').width();
        col = 0;
        if (conWidth > 1600) {
            col = 4;
        }
        else if (conWidth > 1200) {
            col = 3;
        }
        else if (conWidth > 767) {
            col = 2;
        }
        else {
            col = 1;
        }
        colspace = 30;
        var width = Math.floor((conWidth - (colspace * (col + 1))) / col);
        $items.css('width', width);
    },
    masonryLayout: function () {
        themeApp.setcolumn();

        var $msnry = $container.masonry({
            itemSelector: '.item',
            columnWidth: '.item',
            isAnimated: true,
            transitionDuration: 0
        });
        $items.hide();
        $container.imagesLoaded(function () {
            $items.addClass('animate').show();
            $msnry.masonry();
        });
    },
    loadMore: function () {
        var $next_page_link = $('.older-posts').attr('href');
        var $load_more = $('.page-loader');
        var $load_button_string = $load_more.html();
        var $loading_string = '<i class="fa fa-circle-o-notch fa-spin"></i> Please wait...';
        var $end_post_string = 'No more Post';

        // set loading string - CASE: no more post
        if ($next_page_link === undefined) {
            $load_more.html($end_post_string);
        }

        $load_more.on('click', function (e) {
            e.preventDefault();
            if ($next_page_link !== undefined) {
                $load_more.html($loading_string);
                $.ajax({
                    url: $next_page_link,
                }).success(function (result) {
                    var $html = $(result);
                    var $newContent = $('#item-container', $html).contents();
                    $($newContent).hide();
                    $container.append($newContent);
                    themeApp.setcolumn();
                    themeApp.responsiveIframe();
                    $newContent.imagesLoaded(function () {
                        $('.post').addClass('animate').show();
                        // responsive_iframe();
                        $container.masonry('appended', $newContent);
                        $html = "";
                        if ($next_page_link === undefined) {
                            $load_more.text($end_post_string);
                        } else {
                            $load_more.text($load_button_string);
                        }
                    });
                    $next_page_link = $('.older-posts', $html).attr('href');
                    themeApp.commentCount();
                });
            }
        });
    },
    masonryOnResize: function () {
        $(window).resize(function () {
            themeApp.setcolumn();
            themeApp.masonryLayout.$msnry;
        });
    },
    responsiveIframe: function () {
        $('.post').fitVids();
    },
    highlighter: function () {
        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    },
    commentCount: function () {
        var s = document.createElement('script'); s.async = true;
        s.type = 'text/javascript';
        s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
        (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
    },
    headerToggle: function () {
        $('.toggle-button').on('click', function () {
            $('.header').toggleClass('opened');
            $('.main-content-wrapper').toggleClass('expanded');
            $('.top-bar').toggleClass('expanded');
            setTimeout(function () {
                themeApp.masonryLayout();
            }, 400);
        });
    },
    sidebarToggle: function () {
        $('.sidebar-open').on('click', function () {
            $('.sidebar-wrap').toggleClass('opened');
            $('.top-bar').toggleClass('push-left');
        });
    },
    siteSearch: function () {
        var list = [];
        $('.search-icon, #search-field').on('click', function (e) {
            e.preventDefault();
            if (list.length == 0 && typeof searchApi !== undefined) {
                $.get(searchApi)
                    .done(function (data) {
                        list = data.posts;
                        search();
                        
                    })
                    .fail(function (err) {
                        console.log(err);
                    });
            }
            $('#search-field').focus();
        });
        function search() {
            if (list.length > 0) {
                var options = {
                    shouldSort: true,
                    tokenize: true,
                    matchAllTokens: true,
                    threshold: 0,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 1,
                    keys: [{
                        name: 'title'
                    }, {
                        name: 'plaintext'
                    }]
                }
                fuse = new Fuse(list, options);
                $('#search-field').on("keyup", function () {
                    keyWord = this.value;
                    var result = fuse.search(keyWord);
                    console.log(result);
                    var output = '';
                    $.each(result, function (key, val) {
                        output += '<li><a href="' + val.url + '">' + val.title + '</a></li>';
                    });
                    $("#results ul").html(output);
                });
            }
        }
    },
    sidebarScrollbar: function () {
        $('.sidebar').niceScroll({
            cursorwidth: 8,
            cursorborder: "0px solid #00ffff",
            cursorborderradius: 0,
            scrollspeed: 40,
            mousescrollstep: 60,
            railpadding: { right: 0 },
            autohidemode: false,
        });
    },
    facebook: function () {
        var fb_page = '<iframe src="//www.facebook.com/plugins/likebox.php?href=' + facebook_page_url + '&amp;width=262&amp;colorscheme=light&amp;show_faces=true&amp;stream=false&amp;header=false&amp;height=300" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100%; height:300px;" allowTransparency="true"></iframe>';
        $('#fb').append(fb_page);
        $("#fb").fitVids();
    },
    gallery: function () {
        var images = document.querySelectorAll('.kg-gallery-image img');
        images.forEach(function (image) {
            var container = image.closest('.kg-gallery-image');
            var width = image.attributes.width.value;
            var height = image.attributes.height.value;
            var ratio = width / height;
            container.style.flex = ratio + ' 1 0%';
        });
        mediumZoom('.kg-gallery-image img', {
            margin: 30
        });
    },
    backToTop: function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 100) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        $('#back-to-top').on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 1000);
            return false;
        });
    },
    init: function () {
        themeApp.masonryLayout();
        themeApp.responsiveIframe();
        themeApp.highlighter();
        themeApp.commentCount();
        themeApp.headerToggle();
        themeApp.sidebarToggle();
        themeApp.siteSearch();
        themeApp.sidebarScrollbar();
        themeApp.facebook();
        themeApp.loadMore();
        themeApp.masonryOnResize();
        themeApp.gallery();
        themeApp.backToTop();
    }
}

/*===========================
 2. Initialization
 ==========================*/
$(document).ready(function () {
    themeApp.init();
});
