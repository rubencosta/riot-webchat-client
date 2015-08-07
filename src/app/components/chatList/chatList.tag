var messageStore = require('../../stores/messageStore');

<chat-list>
        <a each={chats} href="#" onclick={parent.updateOpenChatID} class="{mdl-navigation__link: true, active: active.call(this)}">
            {user.name} , {lastMessage.contents}
        </a>
    <style scoped>
        a.active {
            background-color: #000066;
        }
    </style>

    <script>
        this.on('update', function () {
            this.openChatID = messageStore.getOpenChatID();
            this.chats = [];
            let allChats = messageStore.getAllChats();
            allChats.forEach(chat => {
                let messagesLength = chat.messages.length;
                this.chats.push({
                    id: chat.id,
                    lastMessage: chat.messages[messagesLength - 1],
                    lastAccess: chat.lastAccess,
                    user: chat.user
                });
            });

            this.chats.sort(function (a, b) {
                if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
                    return -1;
                }
                if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
                    return 1;
                }
                return 0;
            });
        });

        this.on('mount', function () {
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });

        this.active = function () {
            return this.openChatID === this.id;
        };

        this.updateOpenChatID = function (e) {
            messageStore.trigger('updateOpenChatID', e.item.id);
        }
    </script>
</chat-list>