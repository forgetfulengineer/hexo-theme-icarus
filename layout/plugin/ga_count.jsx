const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class GACount extends Component {
    render() {
        const { head, apiUrl, countUpJs } = this.props;

        if (head) return null;

        let gaCountJs = `
                        async function fetchAndRenderGAData() {
                            const url = "${apiUrl}";

                            try {
                                const response = await fetch(url);

                                if (!response.ok) throw new Error('API 回應錯誤');

                                const json = await response.json();
                                const initCountUp = (elementId, targetValue) => {
                                    const el = document.getElementById(elementId);

                                    if (el && window.countUp) {
                                        new countUp.CountUp(elementId, targetValue, {
                                            enableScrollSpy: true,
                                            scrollSpyOnce: true
                                        });
                                    }
                                };

                                requestAnimationFrame(() => {
                                    initCountUp('ga_value_site_pv', json.pv);
                                    initCountUp('ga_value_site_uv', json.uv);
                                    initCountUp('ga_value_page_pv', json.pageViews);
                                });
                            } catch (error) {
                                console.error('獲取 GA 數據失敗:', error);
                            }
                        }

                        if ('requestIdleCallback' in window) {
                            window.requestIdleCallback(fetchAndRenderGAData, { timeout: 2000 });
                        } else {
                            window.addEventListener('load', () => {
                                fetchAndRenderGAData();
                            });
                        }
                        `;

        return <Fragment>
                    <script src={countUpJs} defer></script>
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