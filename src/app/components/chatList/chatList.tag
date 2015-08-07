var messageStore = require('../../stores/messageStore');

<chat-list>
        <a each={chats} href="#" onclick={parent.updateOpenChatID} class="{mdl-navigation__link: true, active: active.call(this)}">
            <div class="shiat-user-list-item">
                <div class="shiat-user-list-image" style="{this.getProfilePictureStyle(user.profilePicture)}"></div>
            <div class="shiat-user-list-name">{user.name}</div>
            <div
                    class="shiat-user-list-timestamp">{lastMessage.timestamp}</div>
            <div class="shiat-user-list-message">{lastMessage.contents}</div>
            </div>
        </a>
    <style scoped>
        a.active {
            background-color: #757575;
            color: rgb(250,250,250) !important;
        }
        a:hover {
            background-color: rgb(224,224,224);
            color: #757575 !important;
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

        this.getProfilePictureStyle = function (imgUrl) {
            return 'background-image: url("'+ imgUrl +'")'
        }
    </script>
</chat-list>