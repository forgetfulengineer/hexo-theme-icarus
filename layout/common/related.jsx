const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { helper, page } = this.props;
        const { __, popular_posts_json, url_for } = helper;
        let relatedData = popular_posts_json( { maxCount: 3 , ulClass: 'related-posts' , PPMixingRate: 0.0 , isImage: true } , page );

        if (!relatedData || !relatedData.json || relatedData.json.length == 0) {
            return null;
        }
        return <div class="card">
                    <div class="card-content">
                        <h3 class='title is-5'>你可能也想看</h3>
                        <div class="columns">
                        {relatedData.json.map((post) => (
                            <div class="column">
                                <figure class='image is-16by9'>
                                    <a href={url_for(post.path)}>
                                        <img src={post.img} alt={post.title} class={`${relatedData.class}-img`} />
                                    </a>
                                </figure>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>;
    }
};