const { GraphQLServer } = require("graphql-yoga");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");
const Redis = require("ioredis");
const { useResponseCache } = require("@envelop/response-cache");
const { createRedisCache } = require("@envelop/response-cache-redis");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
  },
});

const USERS = {
  1: { id: "1", name: "John Doe" },
  2: { id: "2", name: "Jane Doe" },
  3: { id: "3", name: "Jack Doe" },
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: () => ({
      user: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: (_, args) => {
          return USERS[args.id];
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
      updateUser: {
        type: UserType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve: (_, args) => {
          return USERS[args.id];
        },
      },
    }),
  }),
});

const redis = new Redis("redis://localhost:6379");
const cache = createRedisCache({ redis });

const server = new GraphQLServer({
  schema,
  plugins: [useResponseCache({ cache, includeExtensionMetadata: true })],
});

server.start();
