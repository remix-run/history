var context = require.context('../packages', true, /-test\.(js|ts)$/);
context.keys().forEach(context);
