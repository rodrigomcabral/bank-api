import { GraphQLSchema, GraphQLObjectType } from "graphql";
import AccountQuery from "./queries/account.query.js";
import accountMutation from "./mutation/account.mutation.js";

const Schema = new GraphQLSchema({
  types: null,
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      //in here I could address all of the queries taht can be done, but its too daunting to put
      ...AccountQuery,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    fields: {
      ...accountMutation,
    },
  }),
});

export default Schema;
//exporting variables with uppercase
