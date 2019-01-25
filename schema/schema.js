import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';
import axios from 'axios';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // Closure
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(resp => resp.data);
      }
    }
  })
});

// This object will instruct graphQL what a user object looks like
const UserType = new GraphQLObjectType({
  // Required prop capital U
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      //resolve function can allow us to use company instead of companyId
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(resp => resp.data);
      }
    }
  })
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
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      // What type you want to return after mutation
      type: UserType,
      args: {
        // GraphQLNonNull says that prop will be required
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      // {firstName, age} is destructuring
      resolve(parentValue, { firstName, age, companyId }) {
        return axios
          .post(`http://localhost:3000/users`, {
            firstName,
            age,
            companyId
          })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation
});
