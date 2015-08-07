var messageStore = require('../../stores/messageStore');

<chat-list>
        <a each={chats} href="#" onclick={parent.updateOpenChatID} class="{mdl-navigation__link: true, active: active.call(this)}">
            {user.name}
        </a>
    <style scoped>
        a.active {
            background-color: #000066;
        }
    </style>

    <script>
        this.on('update', function () {
            this.openChatID = messageStore.getOpenChatID();
            this.chats = messageStore.getAllChats();
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