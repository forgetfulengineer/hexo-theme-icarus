const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { page } = this.props;

        return (
            <>
                <div class="card">
                    <article class="card-content article" role="article">
                        <div class="content">
                            <h1 itemprop="headline" class="title is-size-4-mobile">
                                <i class="fa-solid fa-fire has-text-danger mr-2"></i>
                                熱門文章
                            </h1>
                            <div class="tabs is-toggle is-toggle-rounded is-fullwidth">
                                <ul class="mx-0 my-0">
                                    <li class="is-active"><a class="is-size-5 has-text-weight-bold" href="#month">月排行</a></li>
                                    <li><a class="is-size-5 has-text-weight-bold" href="#alltime">歷史排行</a></li>
                                </ul>
                            </div>
                            {this.renderList('month', page.monthTopPosts)}
                            {this.renderList('alltime', page.allTimeTopPosts, true)}
                            <article class="message mt-5">
                                <div class="message-body">
                                    <p>
                                        <i class="fa-regular fa-clock"></i>
                                        更新時間：<code>{page.updatedAt}</code>
                                    </p>
                                </div>
                            </article>
                        </div>
                    </article>
                </div>
            </>
        );
    }

    renderList(id, posts, hidden = false) {
        const { date, date_xml } = this.props;

        return (
            <div id={id} class={`tab-content${hidden ? ' is-hidden' : ''}`}>
                {posts.map((post, index) => (
                    <div class="columns is-vcentered">
                        <div class="column is-1 has-text-centered is-hidden-mobile">
                            <span class={`has-text-weight-bold ${index < 3 ? 'is-size-4' : ''}`}>
                                {index === 0 ? '🥇' :
                                    index === 1 ? '🥈' :
                                        index === 2 ? '🥉' :
                                            index + 1}
                            </span>
                        </div>
                        <div class="column is-3">
                            <div class="image is-16by9">
                                <a href={post.url}>
                                    <img src={post.cover} alt={post.title} class="popular-posts-img" />
                                </a>
                            </div>
                        </div>
                        <div class="column is-8">
                            <p class="is-size-7 has-text-grey mb-0">
                                <time dateTime={date_xml(post.date)}>
                                    {date(post.date)}
                                </time>
                            </p>
                            <p class="has-text-weight-bold mb-0">
                                <a href={post.url}>{post.title}</a>
                            </p>
                            {this.renderCategories(post.categories)}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    renderCategories(categories) {
        return (
            <p class="is-size-7 has-text-grey">
                {categories.map((category, i) => (
                    <>
                        <a class="link-muted" href={this.props.url_for(category.path)}>
                            {category.name}
                        </a>
                        {i < categories.length - 1 && <span>&nbsp;/&nbsp;</span>}
                    </>
                ))}
            </p>
        );
    }
};
