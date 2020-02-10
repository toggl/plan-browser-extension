# Firefox development

Install [web-ext](https://github.com/mozilla/web-ext)

    $ npm i -g web-ext

Start watcher:

    $ cd app && web-ext run

This should open up Firefox with the extension installed for testing. The utility reloads the extension whenever files change in `app/`.
