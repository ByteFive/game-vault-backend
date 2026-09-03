import { buildSchema } from "graphql";

export const schema = buildSchema(`
  enum LibraryGameStatus {
    want_to_play
    playing
    completed
    abandoned
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type Game {
    id: Int!
    name: String!
    description: String
    released: String
    rating: Float
    metacritic: Int
    cover: String
    genres: [String!]!
    platforms: [String!]!
    developers: [String!]!
  }

  type LibraryGame {
    gameId: Int!
    status: LibraryGameStatus!
    game: Game
  }

  type Library {
    id: ID!
    userId: ID!
    games: [LibraryGame!]!
    createdAt: String
    updatedAt: String
  }

  type Rating {
    id: ID!
    userId: ID!
    gameId: Int!
    rating: Int!
    review: String
    game: Game
    createdAt: String
    updatedAt: String
  }

  type Top5 {
    id: ID!
    userId: ID!
    gameId: Int!
    position: Int!
    game: Game
    createdAt: String
    updatedAt: String
  }

  type Query {
    games: [Game!]!
    game(id: Int!): Game

    me: User

    library: Library

    ratings: [Rating!]!
    ratingsByGame(gameId: Int!): [Rating!]!

    top5: [Top5!]!
  }

  type Mutation {
    addGameToLibrary(gameId: Int!): Library!

    updateLibraryGame(
      gameId: Int!
      status: LibraryGameStatus!
    ): LibraryGame!

    removeGameFromLibrary(gameId: Int!): Library!

    createRating(
      gameId: Int!
      rating: Int!
      review: String
    ): Rating!

    updateRating(
      id: ID!
      rating: Int!
      review: String
    ): Rating!

    deleteRating(id: ID!): Boolean!

    setTop5(
      gameId: Int!
      position: Int!
    ): Top5!

    removeTop5(position: Int!): Boolean!
  }
`);