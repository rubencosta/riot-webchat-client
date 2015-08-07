var messageStore = require('../../stores/messageStore');
require('../riotMDL/input/input.tag');

<reply-box>
    <form onsubmit="{submit}">
        <input type="text" name="input">
    </form>
    <style scoped>
        form {
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        input {
            width: 100%;
            padding: 4px;
        }
    </style>
    <script>
        this.on('update', function () {
            this.input.value = '';
        });

        this.on('mount', function () {
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });

        this.submit = function () {
            if(!this.input.value){
                return false;
            }
            messageStore.trigger('sendMessage', {
                contents: this.input.value,
                timestamp: +new Date(),
                from: 1
            });
        };

    </script>
</reply-box>