const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/Movie');
const Directors = require('../models/Director');

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return Directors.findById(parent.director);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({director: parent.id});
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt)  }
            },
            async resolve(parent, { name, age }) {
                const existing = await Directors.findOne({ name });
                if (existing) {
                    return existing;
                }

                const director = new Directors({
                    name,
                    age
                });

                return await director.save();
            }
        }, 
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                director: { type: GraphQLID }
            },
            async resolve(parent, { name, genre, director }) {
                const existing = await Movies.findOne({ name, director });
                if (existing) {
                    return existing;
                }

                const movie = new Movies({
                    name,
                    genre,
                    director
                });

                return await movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Directors.findByIdAndRemove(args.id);
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Movies.findByIdAndRemove(args.id);
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            async resolve(parent, { id, name, age }) {
                return await Directors.findByIdAndUpdate(
                    id,
                    { name, age },
                    { new: true }
                );
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                director: { type: GraphQLID }
            },
            async resolve(parent, { id, name, genre, director }) {
                return await Movies.findByIdAndUpdate(
                    id,
                    { name, genre, director },
                    { new: true }
                );
            }
        }
    })
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                return Directors.find({});
            }
        }
    },
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});