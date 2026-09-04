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
    createdAt: String
    updatedAt: String
  }

  type Profile {
    name: String!
    email: String!
    avatar: String
    reviewsQuantity: Int!
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
    comment: String
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

  type RegisterPayload {
    message: String!
    user: User!
  }

  type LoginPayload {
    message: String!
  }

  type UpdateLibraryPayload {
    message: String!
    game: LibraryGame!
  }

  type RemoveLibraryPayload {
    message: String!
    library: Library!
  }

  type DeleteRatingPayload {
    message: String!
  }

  type UpdateTop5Payload {
    message: String!
    top5: [Top5!]!
  }

  type DeleteTop5Payload {
    message: String!
  }

  type Query {
    games: [Game!]!

    game(
      id: Int!
    ): Game

    me: User

    profile: Profile!

    library: Library!

    ratings: [Rating!]!

    ratingsByGame(
      gameId: Int!
    ): [Rating!]!

    top5: [Top5!]!
  }

  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
    ): RegisterPayload!

    login(
      email: String!
      password: String!
    ): LoginPayload!

    addGameToLibrary(
      gameId: Int!
    ): Library!

    updateLibraryGame(
      gameId: Int!
      status: LibraryGameStatus!
    ): UpdateLibraryPayload!

    removeGameFromLibrary(
      gameId: Int!
    ): RemoveLibraryPayload!

    createRating(
      gameId: Int!
      rating: Int!
      comment: String
    ): Rating!

    updateRating(
      id: ID!
      rating: Int!
      comment: String
    ): Rating!

    deleteRating(
      id: ID!
    ): DeleteRatingPayload!

    createTop5(
      gameId: Int!
      position: Int!
    ): Top5!

    updateTop5(
      position: Int!
      newPosition: Int!
    ): UpdateTop5Payload!

    removeTop5(
      position: Int!
    ): DeleteTop5Payload!
  }
`);
