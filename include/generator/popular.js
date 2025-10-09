/**
 * Register the Hexo generator for generating the <code>/popular/</code> page.
 * @module hexo/generator/popular
 */

const axios = require('axios');

/**
 * Register the Hexo generator for generating the <code>/popular/</code> page.
 *
 * @param {Hexo} hexo The Hexo instance.
 */
module.exports = function (hexo) {
    hexo.extend.generator.register('popular', async function (locals) {
        const themeConfig = hexo.theme.config;
        const apiURL = themeConfig?.popular_post?.popular_post_api;

        if (!apiURL) {
            return [];
        }

        try {
            const response = await axios.get(apiURL, { timeout: 5000 });
            const { month = [], allTime = [] } = response.data || {};
            const postMap = buildPostMap(locals.posts.toArray());
            const monthTopPosts = getTopPostsList(month, postMap);
            const allTimeTopPosts = getTopPostsList(allTime, postMap);

            if (!monthTopPosts || !allTimeTopPosts) {
                return [];
            }

            return [{
                path: 'popular/index.html',
                layout: ['popular'],
                data: {
                    monthTopPosts,
                    allTimeTopPosts,
                    updatedAt: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }),
                    __popular: true
                },
            }];
        } catch (err) {
            hexo.log.error('[popular-generator] 無法呼叫熱門文章 API：', err.message || err);
            return [];
        }
    });

    hexo.extend.helper.register('is_popular', function (page = null) {
        return (page === null ? this.page : page).__popular === true;
    });
};

function buildPostMap(allPosts) {
  const map = new Map();
  allPosts.forEach(post => {
    map.set(post.path.replace(/^\//, ''), post);
    map.set(post.permalink, post);
  });
  return map;
}

function getTopPostsList(list, postMap) {
    return list
        .map(item => {
            const path = item.path.replace(/^\//, '');
            const matchedPost = postMap.get(path) || postMap.get(item.path) || null;
            if (!matchedPost) return null;

            return {
                title: matchedPost.title,
                date: matchedPost.date,
                cover: matchedPost.cover,
                url: matchedPost.permalink,
                categories: matchedPost.categories,
            };
        })
        .filter(Boolean)
        .slice(0, 5);
}
