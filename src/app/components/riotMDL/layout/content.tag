<rmdl-layout-content>
    <main class="mdl-layout__content">
        <div class="page-content"><!-- Your content goes here --></div>
    </main>
    <script>
        this.on('mount', function() {
            componentHandler.upgradeDom();
        });
    </script>
</rmdl-layout-content>