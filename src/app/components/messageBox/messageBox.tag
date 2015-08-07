require('./messageBox.styl');
require('../riotMDL/layout/content.tag');

var messageStore = require('../../stores/messageStore');

<message-box>
    <div each="{messages}" class="{message-item: true, reply: isReply(from)}">
        <div class="{mdl-shadow--2dp: true, message-item-content: true, reply: isReply(from)}">
            {contents}
        </div>
    </div>
    <style scoped>
        .message-item.reply {
            justify-content: flex-end;
        }

        .message-item-content.reply {
            background-color: #757575;
            color: rgb(250, 250, 250);
        }
    </style>
    <script>
        this.on('update', function () {
            this.messages = messageStore.getChatById(messageStore.getOpenChatID()).messages;
        });

        this.on('mount', function () {
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });

        this.isReply = function (from) {
            return from === 1;
        };
    </script>

</message-box>