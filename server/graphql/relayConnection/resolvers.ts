const Node = {
  __resolveType(obj, context, info) {
    if (obj.question) {
      return "Question";
    }

    throw new Error(
      "Node interface is implemented only by Question type. much luv, smile more:)"
    );
  }
};
const Edge = {
  __resolveType(obj, context, info) {
    if (obj.node.question) {
      return "QuestionEdge";
    }

    throw new Error(
      "Edge interface is implemented only by QuestionEdge type. much luv, smile more:)"
    );
  }
};

const Connection = {
  __resolveType(obj, context, info) {
    // NOTE: what if there are 0 edges?

    if (!obj.edges.length) {
      throw new Error(
        "Cannot identify the type of Connection interface, since it has 0 edges"
      );
    }

    if (obj.edges[0].node.question) {
      return "QuestionConnection";
    }

    throw new Error(
      "Connection interface is implemented only by QuestionConnection type. much luv, smile more:)"
    );
  }
};

export { Connection, Edge, Node };
