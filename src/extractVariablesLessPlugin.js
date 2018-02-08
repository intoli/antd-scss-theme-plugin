/**
 * A less plugin that extracts variables computed during the compilation of a less file.
 * This is a modified version of the plugin available at [1].
 *
 * [1]: https://github.com/Craga89/less-plugin-variables-output
 */
const SELECTOR = '__VARIABLES__';


class PostProcessor {
  constructor(less, callback) {
    this.callback = callback;
  }

  process(css) {
    // Extract contents of fake selector from compiled CSS.
    const selectorStart = css.indexOf(SELECTOR);
    const selectorEnd = css.lastIndexOf('}');
    const selectorContents = css.slice(selectorStart + SELECTOR.length + 2, selectorEnd).trim();

    // Parse the dummy selector's contents.
    const variables = selectorContents.split(';').reduce((accumulator, variable) => {
      const next = Object.assign({}, accumulator);
      if (variable) {
        const [name, ...value] = variable.split(':');
        next[name.trim()] = value.join(':').trim();
      }

      return next;
    }, {});

    this.callback(variables);

    // Remove slector from rendered less.
    return css.slice(0, selectorStart);
  }
}


class Visitor {
  constructor(less) {
    this.less = less;
    this.isPreEvalVisitor = true;
  }

  run(root) {
    // Create fake selector:
    // __VARIABLES__ {
    //   var-name: @var-name;
    // }
    const variables = root.variables();
    const rules = Object.keys(variables).map(variable => (
      `${variable.slice(1)}: ${variable};`
    ));
    const selector = `${SELECTOR}{${rules.join('\n')}}`;

    // Add the fake selector to less.
    this.less.parse(selector, { filename: SELECTOR }, (_, mixinRoot) => {
      root.rules.push(mixinRoot.rules[0]);
    });
  }
}


class ExtractVariablesPlugin {
  constructor(options) {
    this.minVersion = [2, 0, 0];
    if (!options.callback || (typeof options.callback !== 'function')) {
      throw new Error('Must supply a callback function that receives the parsed variables.');
    }
    this.callback = options.callback;
  }

  install(less, pluginManager) {
    pluginManager.addVisitor(new Visitor(less));
    pluginManager.addPostProcessor(new PostProcessor(less, this.callback));
  }
}


module.exports = ExtractVariablesPlugin;
