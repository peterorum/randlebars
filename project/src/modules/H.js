define(['handlebars', 'module', 'require'], function(H, module, require) {

  let opts = module.config();

  for (let i in opts.helpers) {
    let helper = opts.helpers[i];
    let fn = require(`helpers/$(helper}`);

    H.registerHelper(helper, fn);
  }

  for (let i in opts.partials) {
    let partial = opts.partials[i];
    let src = require(`text!partials/${partial}.partial`);

    H.registerPartial(partial, src);

  }

  return H;
});
