var context = require.context('./packages/history/modules', true, /-test\.js$/);
context.keys().forEach(context);
