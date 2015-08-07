<rmdl-layout>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--overlay-drawer-button">
        <yield></yield>
    </div>
    <style>
        body {
            height: 100%;
        }
    </style>
    <script>
        this.on('mount', function() {
            componentHandler.upgradeDom();
        });
    </script>
</rmdl-layout>