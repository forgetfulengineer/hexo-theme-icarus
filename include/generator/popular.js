/**
 * Register the Hexo generator for generating the <code>/popular/</code> page.
 * @module hexo/generator/popular
 */

/**
 * Register the Hexo generator for generating the <code>/popular/</code> page.
 * <p>
 * A <code>__categories: true</code> property will be attached to the page local
 * variables.
 *
 * @param {Hexo} hexo The Hexo instance.
 */
module.exports = function (hexo) {
    hexo.extend.generator.register('popular', locals => {
        console.log('第一組資料:');
        process.exit(1);
        return {
        path: 'categories/',
        layout: ['categories'],
        data: Object.assign({}, locals, {
            __categories: true
        })
        };
    });
};