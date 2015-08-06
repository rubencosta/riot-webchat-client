var messageStore = require('../../stores/messageStore');

<reply-box>
    <form onsubmit={submit}>
        <input type="text" placeholder="Type here to reply..." name="input">
    </form>
    <script>
        this.on('update', function () {
            this.input.value = '';
        });

        this.on('mount', function () {
            this.input.value = '';
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });

        this.submit = function () {
            messageStore.trigger('sendMessage', {
                contents: this.input.value,
                timestamp: +new Date(),
                from: 1
            });
        };
    </script>
</reply-box>