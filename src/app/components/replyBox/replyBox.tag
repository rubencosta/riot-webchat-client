var messageStore = require('../../stores/messageStore');
require('../riotMDL/input/input.tag');

<reply-box>
    <form onsubmit="{submit}">
        <rmdl-input type="text" id="input" label="type here to reply"></rmdl-input>
    </form>
    <script>
        this.on('update', function () {
            this.tags['rmdl-input']['{ opts.id }'].value = '';
        });

        this.on('mount', function () {
            messageStore.on('updated', this.update)
        });

        this.on('unmount', function () {
            messageStore.off('updated', this.update)
        });

        this.submit = function () {
            if(!this.tags['rmdl-input']['{ opts.id }'].value){
                return false;
            }
            messageStore.trigger('sendMessage', {
                contents: this.tags['rmdl-input']['{ opts.id }'].value,
                timestamp: +new Date(),
                from: 1
            });
        };

    </script>
</reply-box>