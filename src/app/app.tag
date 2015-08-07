require('./components/messageBox/messageBox.tag');
require('./components/chatList/chatList.tag');
require('./components/replyBox/replyBox.tag');

require('material-design-lite');
require('material-design-lite.css');

<app>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--overlay-drawer-button">
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">Chats</span>
            <nav class="mdl-navigation">
                <chat-list title="chats"></chat-list>
            </nav>
        </div>
        <main class="mdl-layout__content">
            <div class="page-content">
                <message-box></message-box>
            </div>
            <reply-box></reply-box>
        </main>
    </div>
    <style>
        body {
            height: 100%;
        }
    </style>
</app>