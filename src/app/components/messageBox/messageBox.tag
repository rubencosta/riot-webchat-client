var messageStore = require('../../stores/messageStore');

<message-box>
    <main>
        <div>
            <ul>
                <li each={messages}>{contents}</li>
            </ul>
        </div>
    </main>

    <script>
        this.on('update',function () {
            this.messages = messageStore.getChatById(messageStore.getOpenChatID()).messages;
        });

        this.on('mount', function () {
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });
    </script>

</message-box>