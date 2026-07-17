/**
* Zahid
* Default feed Layout
* 2022-10-15 08:45:50
*/
(function () {
    // Loader
    var loader=new function(){this.rC=-1,this.r=[],this.add=function(t){this.r.push(t)},this.addTag=function(t,e){var i=document.getElementsByTagName("head")[0],s=t.indexOf(".js")>0?"script":"link",n=document.createElement(s);i.appendChild(n),n.onload=e,n.charset="UTF-8","script"===s?(n.type="text/javascript",n.src=t):"link"===s&&(n.rel="stylesheet",n.href=t)},this.loadNext=function(){if(this.rC++,this.rC>=this.r.length)this.done();else{var t=this.r[this.rC];this.addTag(t,this.loadNext.bind(this))}},this.done=function(){this.onResourcesLoaded(window.Curator)},this.load=function(t){this.onResourcesLoaded=t,this.loadNext()}};

    // Config
    var config = {"post":{"template":"post-grid","matchHeights":false,"minWidth":200,"imageHeight":"100%","showTitles":false,"showShare":false,"showComments":false,"showLikes":false,"autoPlayVideos":false,"clickAction":"open-popup","clickReadMoreAction":"open-popup","maxLines":0},"widget":{"template":"widget-grid-carousel","autoPlay":true,"autoLoad":true,"infinite":true,"rows":2,"controlsOver":true,"controlsShowOnHover":false,"speed":5000,"duration":700,"panesVisible":-1,"useCss":true,"moveAmount":0,"easing":null,"verticalSpacing":0,"horizontalSpacing":0,"autoLoadNew":false,"lazyLoadType":"image_only","gridMobile":false},"popup":{"deepLink":false,"template":"popup","templateWrapper":"popup-wrapper","autoPlayVideos":false},"lang":"en","container":"#curator-feed-default-feed-layout","debug":0,"hidePoweredBy":true,"embedSource":"","forceHttps":false,"feed":{"id":"64bff649-ff19-4dfa-a417-c1b51f182dcf","apiEndpoint":"https:\/\/api.curator.io","postsPerPage":12,"params":{},"limit":50},"filter":{"template":"filter","showNetworks":false,"showSources":false,"showAll":false,"default":"all","limitPosts":false,"limitPostNumber":0,"period":""},"type":"GridCarousel","theme":"sydney"};
    var colours = {"widgetBgColor":"transparent","bgColor":"#ffffff","borderColor":"#cccccc","iconColor":"#FFFFFF","textColor":"#222222","linkColor":"#999999","dateColor":"#000000","footerColor":"#ffffff","tabIndexColor":"#cccccc"};
    var styles = {};

    // Bootstrap
    function loaderCallback () {
        window.Curator.loadWidget(config, colours, styles);
    }

    // Run Loader
    loader.add('curator/curator.embed.css');
    loader.add('curator/curator.css');
    loader.add('curator/curator.embed.js');
    loader.load(loaderCallback);
})();
