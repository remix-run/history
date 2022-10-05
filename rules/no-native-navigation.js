module.exports = {
  meta: {
    fixable: false,
    messages: {
      unsafeFunction:
        "'{{ func }}' is not allowed as it might break the constant domain router. Please use the history from 'history/constantDomain' instead.",
    },
  },

  create(context) {
    return {
      MemberExpression(node) {
        if (node.object.name === "window" && node.property.name === "history") {
          context.report({
            node,
            messageId: "unsafeFunction",
            data: { func: "window.history" },
          });
        }
        if (
          node.object.object?.name === "window" &&
          node.object.property?.name === "location" &&
          ["replace", "assign"].includes(node.property.name)
        ) {
          context.report({
            node,
            messageId: "unsafeFunction",
            data: { func: `window.location.${node.property.name}` },
          });
        }
      },
      AssignmentExpression(node) {
        if (
          node.operator === "=" &&
          node.left.object?.object?.name === "window" &&
          node.left.object?.property?.name === "location" &&
          node.left.property?.name === "href"
        ) {
          context.report({
            node,
            messageId: "unsafeFunction",
            data: { func: `window.location.href =` },
          });
        }
      },
    };
  },
};
