/**
 * A JSX component that renders simple Google structured data.
 * @module layout/misc/structured_data
 */
const { Component } = require('inferno');
const { stripHTML, escapeHTML } = require('hexo-util');

/**
 * A JSX component that renders simple Google structured data.
 *
 * @name StructuredData
 */
module.exports = class extends Component {
  render() {
    const { page, config, helper, images } = this.props;
    const { full_url_for, is_home, is_post, is_category, is_page } = helper;
    const { structured_data = {} } = config.head;
    const siteUrl = config.url;
    const language = config.language;
    const title = structured_data.title || page.title || config.title;
    let description = structured_data.description || page.description || page.excerpt || page.content || config.description;
    const canonical = full_url_for(structured_data.url || page.permalink || page.current_url || config.url);
    const author = structured_data.author || config.author;
    const publisher = structured_data.publisher || title;
    const publisherLogo = structured_data.publisher_logo || config.logo;
    const schemaData = [];

    const person = {
      '@type': 'Person',
      '@id': 'https://forgetfulengineer.github.io/about/#person',
      name: author,
      image: 'https://forgetfulengineer.github.io/img/og_image.png',
      url: 'https://forgetfulengineer.github.io/about/',
      jobTitle: "Software Engineer",
      sameAs: [
        "https://github.com/forgetfulengineer",
      ]
    };

    const organization = {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: publisher,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: full_url_for(publisherLogo)
      }
    };

    const breadcrumbList = {
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '分類',
          item: 'https://forgetfulengineer.github.io/categories/'
        }
      ]
    };

    if (description) {
      description = escapeHTML(
        stripHTML(description)
          .replace(/\n/g, ' ')
          .slice(0, 210)
          .trim()
      );
    }

    // 首頁（WebSite）
    if (is_home()) {
      schemaData.push({
        '@type': 'WebSite',
        '@id': `${siteUrl}#website`,
        url: siteUrl,
        name: title,
        alternateName: "forgetfulengineer",
        inLanguage: language,
        author: person,
        publisher: organization,
        description: description,
      });
    }

    // 文章頁 (TechArticle + BreadcrumbList)
    if (is_post()) {
      schemaData.push({
        '@type': 'TechArticle',
        '@id': `${canonical}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical
        },
        url: canonical,
        headline: title,
        description: description,
        image: [full_url_for(images)],
        datePublished: page.date ? page.date.toISOString() : undefined,
        dateModified: page.updated ? page.updated.toISOString() : undefined,
        inLanguage: language,
        author: person,
        publisher: organization,
        keywords: page.tags ? page.tags.map(t => t.name).join(',') : undefined,
        articleSection: page.categories ? page.categories.map(cat => cat.name) : undefined
      });

      let position = 2;
      if (page.categories && page.categories.length > 0) {
        page.categories.forEach((cat) => {
          breadcrumbList.itemListElement.push({
            '@type': 'ListItem',
            position: position++,
            name: cat.name,
            item: full_url_for(cat.path)
          });
        });
      }

      breadcrumbList.itemListElement.push({
        '@type': 'ListItem',
        position: position,
        name: title,
        item: canonical
      });

      schemaData.push(breadcrumbList);
    }

    // 分類頁 (CollectionPage)
    if (is_category()) {
      const categoryName = page.category || title;

      schemaData.push({
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        name: categoryName + ' 技術文章列表',
        headline: categoryName + ' 技術文章列表',
        url: canonical,
        description: `收錄 ${categoryName} 相關技術文章、經驗分享整理。`,
        inLanguage: language,
        mainEntity: {
          '@type': 'ItemList',
          '@id': `${canonical}#itemlist`,
          numberOfItems: page.posts.length,
          itemListElement: (page.posts).slice(0, 20).map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: full_url_for(post.link || post.path),
            name: post.title
          }))
        }
      });

      let position = 2;

      if (page.parents && page.parents.length > 0) {
        page.parents.forEach((cat) => {
          breadcrumbList.itemListElement.push({
            '@type': 'ListItem',
            position: position++,
            name: cat.name,
            item: full_url_for(cat.path)
          });
        });
      }
      breadcrumbList.itemListElement.push({
        '@type': 'ListItem',
        position: position++,
        name: page.category,
        item: canonical
      });
      schemaData.push(breadcrumbList);
    }

    if (!is_home() && !is_post() && !is_category()) {
      if (is_page() && page.path.startsWith('about/')) {
        schemaData.push({
          '@type': 'AboutPage',
          '@id': `${canonical}#aboutpage`,
          url: canonical,
          name: '關於 ' + author,
          headline: '關於 ' + author,
          description: description,
          inLanguage: language,
          mainEntity: {
            "@id": "https://forgetfulengineer.github.io/about/#person"
          }
        });
        schemaData.push(person);
      } else {
        schemaData.push({
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: title,
          headline: title,
          description: description,
          inLanguage: language,
          author: person,
          publisher: organization,
        });
      }
    }

    if (schemaData.length === 0) return null;

    const finalSchema = {
      '@context': 'https://schema.org',
      '@graph': schemaData
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
      ></script>
    );
  }
};