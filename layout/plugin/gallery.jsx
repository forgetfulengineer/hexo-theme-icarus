/**
 * Light Gallery plugins JSX component.
 * @module view/plugin/gallery
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Light Gallery plugins JSX component.
 *
 * @see http://sachinchoolur.github.io/lightGallery/
 * @example
 * <Gallery
 *     head={true}
 *     lightGallery={{
 *         jsUrl: '/path/to/lightgallery.js',
 *         cssUrl: '/path/to/lightgallery.css'
 *     }} />
 */
class Gallery extends Component {
  render() {
    const { head, lightGallery } = this.props;
    if (head) {
      return (
        <>
          <link rel="stylesheet" href={lightGallery.cssUrl} media="print" onload="this.media='all'" />
        </>
      );
    }

    return (
      <>
        <script src={lightGallery.jsUrl} defer={true}></script>
      </>
    );
  }
}

/**
 * Cacheable Light Gallery plugins JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Gallery.Cacheable
 *     head={true}
 *     helper={{ cdn: function() {...} }} />
 */
Gallery.Cacheable = cacheComponent(Gallery, 'plugin.gallery', (props) => {
  const { head, helper } = props;
  return {
    head,
    lightGallery: {
      jsUrl: helper.cdn('lightgallery', '1.10.0', 'dist/js/lightgallery.min.js'),
      cssUrl: helper.cdn('lightgallery', '1.10.0', 'dist/css/lightgallery.min.css'),
    },
  };
});

module.exports = Gallery;