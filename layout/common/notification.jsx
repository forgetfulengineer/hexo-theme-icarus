const { Component } = require('inferno');

{/* Copy notification */}
module.exports = class extends Component {
    render() {
        return <div class="notification">
            <i class="fa-regular fa-copy"></i>複製完成
        </div>;
    }
}
