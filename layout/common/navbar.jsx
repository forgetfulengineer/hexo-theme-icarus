const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const classname = require('hexo-component-inferno/lib/util/classname');

function isSameLink(a, b) {
    function santize(url) {
        let paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
            paths = paths.slice(0, paths.length - 1);
        }
        return paths.join('/');
    }
    return santize(a) === santize(b);
}

class Navbar extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            menu,
            links,
            showToc,
            tocTitle,
            showSearch,
            searchTitle
        } = this.props;

        let navbarLogo = '';
        if (logo) {
            if (logo.text) {
                navbarLogo = logo.text;
            } else {
                navbarLogo = <img src={logoUrl} alt={siteTitle} height="28" />;
            }
        } else {
            navbarLogo = siteTitle;
        }

        return <nav class="navbar navbar-main">
            <div class="container navbar-container">
                <div class="navbar-brand justify-content-center">
                    <a class="navbar-item navbar-logo" href={siteUrl}>
                        {navbarLogo}
                    </a>
                    <div class="navbar-end is-flex">
                        {showToc ? <a class="navbar-item is-hidden-tablet catalogue" title={tocTitle} href="javascript:;">
                                <button class="button is-small">
                                    <span class="icon is-small">
                                        <i class="fas fa-list-ul"></i>
                                    </span>
                                    <span>文章目錄</span>
                                </button>
                            </a> : null}
                        {showSearch ? <a class="navbar-item is-hidden-desktop search" title={searchTitle} href="javascript:;">
                            <i class="fas fa-search"></i>
                        </a> : null}
                    </div>
                    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                    </a>
                </div>
                <div class="navbar-menu">
                    {Object.keys(menu).length ? <div class="navbar-start">
                        {Object.keys(menu).map(name => {
                            const item = menu[name];
                            if (typeof item.url === 'string') {
                                return <a class={classname({ 'navbar-item': true, 'is-active': item.active })} href={item.url}>{name}</a>;
                            } else {
                                const self_url = item['url']['self']['suburl'];
                                return <div class="navbar-item has-dropdown is-hoverable">
                                            <div class={classname({ 'navbar-link': true, 'is-active': item.active})}>
                                                <a class={classname({ 'link-muted': true })} href={self_url}>{name}</a>
                                            </div>
                                            <div class="navbar-dropdown">
                                                {Object.keys(item.url).map(subname => {
                                                    if (subname == 'self') return;
                                                    const suburl = item.url[subname]['suburl'];
                                                    return <a class={classname({ 'navbar-item': true })} href={suburl}>{subname}</a>;
                                                })}
                                            </div>
                                        </div>
                            }
                        })}
                    </div> : null}
                    <div class="navbar-end is-hidden-touch">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <a class="navbar-item" target="_blank" rel="noopener" title={name} href={link.url}>
                                    {link.icon ? <i class={link.icon}></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}
                        {showSearch ? <a class="navbar-item search" title={searchTitle} href="javascript:;">
                            <i class="fas fa-search"></i>
                        </a> : null}
                    </div>
                </div>
            </div>
        </nav>;
    }
}

module.exports = cacheComponent(Navbar, 'common.navbar', props => {
    const { config, helper, page } = props;
    const { url_for, _p, __ } = helper;
    const { logo, title, navbar, widgets, search } = config;

    const hasTocWidget = Array.isArray(widgets) && widgets.find(widget => widget.type === 'toc');
    const showToc = (config.toc === true || page.toc) && hasTocWidget && ['page', 'post'].includes(page.layout);

    const menu = {};
    if (navbar && navbar.menu) {
        const pageUrl = typeof page.path !== 'undefined' ? url_for(page.path) : '';
        Object.keys(navbar.menu).forEach(name => {
            if (typeof navbar.menu[name] === 'string') {
                const url = url_for(navbar.menu[name]);
                const active = isSameLink(url, pageUrl);
                menu[name] = { url, active };
            } else {
                const url = {};
                let active = false;
                Object.keys(navbar.menu[name]).forEach(subname => {
                    const suburl = url_for(navbar.menu[name][subname]);
                    active = (active) ? active : isSameLink(suburl, pageUrl);
                    url[subname] = { suburl }
                })
                menu[name] = { url, active };
            }
        });
    }

    const links = {};
    if (navbar && navbar.links) {
        Object.keys(navbar.links).forEach(name => {
            const link = navbar.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        menu,
        links,
        showToc,
        tocTitle: _p('widget.catalogue', Infinity),
        showSearch: search && search.type,
        searchTitle: __('search.search')
    };
});
