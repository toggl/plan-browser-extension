# Firefox development

Ensure your node version matches `.nvmrc`

Install node modules:

    $ npm i

Start build+watcher:

    $ npm run start

Launch Firefox with the extension pre-installed using [web-ext](https://github.com/mozilla/web-ext).

    $ npm run firefox

This should open up Firefox with the extension installed for testing. The utility reloads the extension whenever files change in `build/` folder.

# Reviewer

Ensure your node version matches `.nvmrc`

Install node modules:

    $ npm i

Run `npm run firefox-release` to generate an archive in the local `tmp` directory.
