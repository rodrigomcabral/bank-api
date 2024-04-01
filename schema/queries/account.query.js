import { GraphQLInt, GraphQLList } from "graphql";
import Account from "../types/Account.js";
import AccountService from "../../services/account.service.js";
import AccountResolver from "../resolvers/account.resolver.js";

const accountQueries = {
  getAccounts: {
    type: new GraphQLList(Account),
    //resolving we dont need to add the new route name at the index
    resolve: () => AccountResolver.getAccounts(),
  },
  getAccount: {
    type: Account,
    args: {
      id: {
        name: "id",
        type: GraphQLInt,
      },
    },
    resolve: (_, args) => AccountResolver.getAccount(args.id),
  },
};

export default accountQueries;
