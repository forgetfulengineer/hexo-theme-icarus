const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class GACount extends Component {
    render() {
        const { head, apiUrl, countUpJs } = this.props;

        if (head) return null;

        let gaCountJs = `(function() {
                            var url = "${apiUrl}";
                            fetch(url, { method: 'get' })
                                .then(response => response.json())
                                .then(json => {
                                    var sitePvElement = document.getElementById('ga_value_site_pv');
                                    var siteUvElement = document.getElementById('ga_value_site_uv');
                                    var pvElement = document.getElementById('ga_value_page_pv');

                                    if (sitePvElement) {
                                        const sitePv = new countUp.CountUp('ga_value_site_pv', json.pv, { enableScrollSpy: true, scrollSpyOnce: true });
                                    }
                                    if (siteUvElement) {
                                        const siteUv = new countUp.CountUp('ga_value_site_uv', json.uv, { enableScrollSpy: true, scrollSpyOnce: true });
                                    }
                                    if (pvElement) {
                                        const pagePv = new countUp.CountUp('ga_value_page_pv', json.pageViews, { enableScrollSpy: true, scrollSpyOnce: true });
                                    }
                                });
                        })();`;

        return <Fragment>
                    <script src={countUpJs}></script>
                    <script dangerouslySetInnerHTML={{ __html: gaCountJs }}></script>
                </Fragment>;
    }
}

GACount.Cacheable = cacheComponent(GACount, 'plugin.ga_count', props => {
    const { helper, head, page, plugin } = props;
    const { url_for, cdn } = helper;
    const apiBase = plugin.ga_count_api;
    const path = url_for(page.path);
    const apiUrl = (page.layout == 'post') ? `${apiBase}?path=${encodeURIComponent(path)}` : apiBase;
    const countUpJs = cdn('countup.js', '2.9.0', 'dist/countUp.umd.js');

    return { head, apiUrl, countUpJs };
});

module.exports = GACount;