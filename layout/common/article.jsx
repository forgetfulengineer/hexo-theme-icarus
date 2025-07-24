const moment = require('moment');
const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const Related = require('./related');
const ArticleLicensing = require('hexo-component-inferno/lib/view/misc/article_licensing');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { url_for, date, date_xml, __, _p } = helper;

        const defaultLanguage = Array.isArray(config.language) && config.language.length ? config.language[0] : config.language;

        const indexLanguage = toMomentLocale(defaultLanguage || 'en');
        const language = toMomentLocale(page.lang || page.language || defaultLanguage || 'en');
        const cover = page.cover ? url_for(page.cover) : null;
        const updateTime = article && article.update_time !== undefined ? article.update_time : true;
        const isUpdated = page.updated && !moment(page.date).isSame(moment(page.updated));
        const shouldShowUpdated = page.updated && ((updateTime === 'auto' && isUpdated) || updateTime === true);
        const share = page.share === false ? false : true;

        return <Fragment>
            {/* Main content */}
            {!index && page.categories ?
            <div class="card">
                <div class="card-content">
                    <nav class="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><a href={url_for('/categories/')}>{_p('common.category', Infinity)}</a></li>
                            {page.categories.map(category => {
                                return <li><a href={url_for(category.path)}>{category.name}</a></li>;
                            })}
                        </ul>
                    </nav>
                </div>
            </div> : null}
            <div class="card">
                <article {...(index ? {} : { itemscope: true, itemtype: "http://schema.org/Article" })} class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {/* Title */}
                    {page.title !== '' && index ? <p class="title is-3 is-size-4-mobile"><a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a></p> : null}
                    {page.title !== '' && !index ? <h1 itemprop="headline" class="title is-3 is-size-4-mobile">{page.title}</h1> : null}
                    {/* Metadata */}
                    {page.layout !== 'page' ? <div class="article-meta is-size-7 level is-mobile mb-3">
                        <div class="level-left">
                            {/* PIN Icon */}
                            {page.top ? <i class="fas fa-thumbtack level-item" title="Pinned"></i> : null}
                            {/* 如果有更新顯示更新時間 */}
                            {/* Creation Date or Last Update Date */}
                            <span class="level-item">
                                <i class="fa-regular fa-calendar-days"></i>
                                <time {...(index ? {} : (shouldShowUpdated ? { itemprop: "dateModified" } : { itemprop: "datePublished" }))} dateTime={date_xml(page.date)} title={__(shouldShowUpdated ? 'article.licensing.updated_at' : 'article.licensing.created_at') + new Date(page.date).toLocaleString()}>{date(shouldShowUpdated ? date(page.updated) : date(page.date))}</time>
                            </span>
                            {/* author */}
                            {page.author ? <span class="level-item"> {page.author} </span> : null}
                            {/* Categories */}
                            {index && page.categories && page.categories.length ? <span class="level-item is-hidden-phone">
                                <i class="fa-regular fa-folder-open"></i>
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="link-muted" href={url_for(category.path)}>{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(<span>&nbsp;/&nbsp;</span>);
                                        }
                                    });
                                    return categories;
                                })()}
                            </span> : null}
                            {/* Read time */}
                            {article && article.readtime && article.readtime === true ? <span class="level-item">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${_p('article.read_time', time.locale(index ? indexLanguage : language).humanize())} (${_p('article.word_count', words)})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                            {!index && plugins && plugins.ga_count && plugins.ga_count.ga_count_api ? <span class="level-item" id="ga_container_page_pv"><i class="far fa-eye"></i><span id="ga_value_page_pv">-</span></span> : null}
                            {/* reply */}
                            {!index ? <span id="reply" class="level-item" style="cursor: pointer;"><i class="fa-regular fa-comment-dots"></i>回覆文章</span> : null}
                            {/* share */}
                            <span id="share" class="level-item copy" style="cursor: pointer;" title='複製連結' data-clipboard-text={page.permalink}><i class="fa-solid fa-link"></i>分享</span>
                        </div>
                    </div> : null}
                    {/* Thumbnail */}
                    {cover ? <div class="card-image">
                        {index ? <a href={url_for(page.link || page.path)} class="image">
                            <img class="fill" src={cover} alt={page.title || cover} loading="lazy" />
                        </a> : <span class="image">
                            <img itemprop="image" class="fill not-gallery-item" src={cover} alt={page.title || cover} loading="lazy" />
                        </span>}
                    </div> : null}
                    {/* Content/Excerpt */}
                    <div {...(index ? {} : { itemprop: "articleBody" })} class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {/* Licensing block */}
                    {!index && page.layout !== 'page' && article && article.licenses && Object.keys(article.licenses)
                        ? <ArticleLicensing.Cacheable page={page} config={config} helper={helper} /> : null}
                    {share ? <hr/> : null}
                    <div class="level is-flex">
                        {/* Tags */}
                        {page.tags && page.tags.length ? <div class="article-tags is-size-7">
                            <i class="fa-solid fa-tags"></i>
                            {page.tags.map(tag => {
                                return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}># {tag.name}</a>;
                            })}
                        </div> : null}
                        {/* "Read more" button */}
                        {index && page.excerpt ? <a class="article-more button is-small is-size-7" href={`${url_for(page.link || page.path)}`}><i class="fa-brands fa-readme"></i>{__('article.more')}</a> : null}
                    </div>
                    {/* Share button */}
                    {!index && share ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post related */}
            {!index ? <Related config={config} page={page} helper={helper} /> : null}
            {/* Comment */}
            {!index && page.comments ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
