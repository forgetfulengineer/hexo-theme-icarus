const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Twikoo extends Component {
    render() {
        const {
        envId,
        jsUrl,
        } = this.props;
        const js = `twikoo.init({
            envId: '${envId}',
            onCommentLoaded: function () {
                var commentContents = document.getElementsByClassName('tk-content');
                for (var i = 0; i < commentContents.length; i++) {
                    var commentItem = commentContents[i];
                    var imgEls = commentItem.getElementsByTagName('img');
                    if (imgEls.length > 0) {
                        for (var j = 0; j < imgEls.length; j++) {
                            var imgEl = imgEls[j];
                            var aEl = document.createElement('a');
                            aEl.setAttribute('class', 'tk-lg-link');
                            aEl.setAttribute('href', imgEl.getAttribute('src'));
                            aEl.setAttribute('data-src', imgEl.getAttribute('src'));
                            aEl.appendChild(imgEl.cloneNode(false));
                            imgEl.parentNode.insertBefore(aEl, imgEl.nextSibling);
                            imgEl.remove();
                        }
                        if (typeof $.fn.lightGallery === 'function') {
                            $(commentItem).lightGallery({
                                selector: '.tk-lg-link'
                            });
                        }
                    }
                }
            }
        });`;
        return (
        <Fragment>
            <div id="twikoo" class="content twikoo"></div>
            <script src={jsUrl}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>
        );
    }
}

Twikoo.Cacheable = cacheComponent(Twikoo, 'comment.twikoo', (props) => {
    const { comment } = props;
    return {
        envId: comment.envId,
        jsUrl: comment.jsUrl || 'https://cdn.jsdelivr.net/npm/twikoo/dist/twikoo.all.min.js',
    };
});

module.exports = Twikoo;