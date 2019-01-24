import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} from 'graphql';
import axios from 'axios';

// This object will instruct graphQL what a user object looks like
const UserType = new GraphQLObjectType({
  // Required prop capital U
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // resolve function will go to Database to look for real data
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
        //axios returns nested data and graphQL does not know that response is nested
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});
