<mdl-layout-drawer>
    <div class="mdl-layout__drawer">
        <span class="mdl-layout-title">{opts.title}</span>
        <nav class="mdl-navigation">
            <yield></yield>
        </nav>
    </div>
    <script>
        this.on('mount', function() {
            componentHandler.upgradeDom();
        });
    </script>
</mdl-layout-drawer>