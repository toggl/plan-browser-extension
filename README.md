# Teamweek button

## Requirements
You need to have node.js and npm installed. That's it.

## Building
We use Gulp as a build system, Browserify to compile our JS files and LESS for stylesheets.

To build scripts and styles, run `npm run-script build`. To watch for changes in scripts and styles run `npm run-script watch`.

The extension files are in the `app` directory. You can open this directory from Chrome using the "Load unpacked extension" button.

## Contributing

If you want to help us with Teamweek Button by adding a new integration, follow these steps.

### Figure out where the button will go

The button is an element that is inserted into any page with a content script. This means you need to find a suitable parent element place to put it in.

### Create a new content script

Create a suitably named new file in the `src/bootloader` directory. Add this line to the header of the file:

```js
var twb = require('../utils/content');
```

This will add the `twb` object into the script. This object is used to find parent elements, create the button element and insert it into the page.

Let's start with an example. This is a simplified version of the Google Calendar content script:

```js
twb.observe('.eb-root', function(bubble) {
  var title = bubble.querySelector('.eb-title').textContent;

  var button = twb.create({
    task: {name: title},
    anchor: 'screen'
  });

  var container = bubble.querySelector('.eb-actions-right');
  twb.prepend(button, container);

  return button;
}, function(button) {
  twb.remove(button);
});
```

The first line tells the extension to wait until an element with the specified selector appears on the page. When that happens, it will call the supplied function with the element.

After extracting the text that we will use as task title, we create the button. You don't need to worry about what's in the button variable, you will only pass it to other functions that know what to do.

In this case, `task: {name: title}` specifies the task name (also known as task title) and `anchor: 'screen'` says that we want the task popup to be centered on the screen.

Then we find the element in which the button element will be inserted and insert it as the first child.

Finally, we call `return button`. This is so that the script can keep track of all buttons on the page so that it can remove them when needed.

The second function is called with the value we have returned from the first function. In this case, we simply remove the button from the page.

### Include your domain in the manifest

Open the `/app/manifest.json`, go to the `content_scripts` section and add the following:
```json
{
  "matches": ["https://*.[domain_name.com]/*"],
  "js": ["scripts/content_[your script name].js"],
  "css": ["styles/global.css"]
}
```
This entry is what makes the extension use your script.

In case you notice the button doesn't quite fit the container you can define a stylesheet with less. Create a .less file in the `src/button/styles` with a suitable name. To reference the file include the route in the css property of your domain's section of the manifest file, it would look something like:
```json
{
  "matches": ["https://*.[domain_name.com]/*"],
  "js": ["scripts/content_[your script name].js"],
  "css": ["styles/global.css", "styles/[your stylesheet name].css"]
}
```


### Test the integration

You can run `npm run build` or `npm run watch` to compile extension code.

Then you [load the extension into Chrome](https://developer.chrome.com/extensions/getstarted#unpacked).

### Pull request

If everything works, make a pull request!

When you have any problems or you don't understand something, open a issue and we will do our best to help you.

## API

**twb.observe([element,] selector, setupFn(element), teardownFn(button))**

*element* - Limit the selector to only this element  
*selector* - Look for elements matching this selector  
*setupFn(element)* - Called when a matching element is found  
*teardownFn(button)* - Called when a matching element is removed

Finds all matching elements and calls the supplied function with an element. If new elements are added in the future, it will register them and call the function.

**twb.create(params)**

*params.task* - Used to fill popup fields with values from the page  
*params.task.name* - Title of the new task  
*params.task.start_date* and *params.task.end_date* - Task start and end dates. Must be instances of Date.  
*params.task.start_time* and *params.task.end_time* - Task start and end times. Must be a string with the format "HH:MM", for example "13:30".  
*params.task.estimated_hours* - Task estimate  
*params.anchor* - Either `'screen'` to show the popup in the center of the screen or `'element'` to show it next to the button.

Create a new button. Return value of this function is then used when calling other functions on the `twb` object.

**twb.append(button, element)**  
**twb.prepend(button, element)**

Append or prepend the button to the element.

**twb.remove(button)**

Removes the button from the page.

# Linting

If you are using Atom make sure you have installed these packages:
* [linter](https://atom.io/packages/linter)
* [linter-eslint](https://atom.io/packages/linter-eslint)
* [linter-less](https://atom.io/packages/linter-less)
