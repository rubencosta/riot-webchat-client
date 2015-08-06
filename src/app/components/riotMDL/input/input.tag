<rmdl-input>
    <div class="mdl-textfield mdl-js-textfield {mdl-textfield--floating-label: !!opts.label}">
        <input class="mdl-textfield__input" type="{ opts.type }" autocomplete="off" id="{ opts.id }"/>
        <label class="mdl-textfield__label" for="{ opts.id }">{ opts.label }</label>
    </div>
    <script>
        this.on('mount', function () {
            componentHandler.upgradeDom();
        });
    </script>
</rmdl-input>