const dot = require('dot');
const fs = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function(content) {
  const options = loaderUtils.getOptions(this);
  if (this.cacheable) {
    this.cacheable();
  }

  options.selfcontained = true;
  dot.templateSettings = Object.assign(dot.templateSettings, options);

  const resourcePath = this.resourcePath;
  content = fs.readFileSync(resourcePath);

  const embedPartial = path => {
    this.addDependency(path);
    return fs.readFileSync(path);
  };

  return (
    'export default ' +
    dot.template(content, undefined, {
      import(importPath) {
        if (path.isAbsolute(importPath)) {
          return embedPartial(require.resolve(importPath));
        }

        return embedPartial(
          require.resolve(path.join(path.dirname(resourcePath), importPath))
        );
      },
    })
  );
};
