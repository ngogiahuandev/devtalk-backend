import { GraphQLError } from 'graphql';

export function extractTokenFromHeader(
  authorizationHeader: string | undefined,
): string {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new GraphQLError('Missing or invalid Authorization header');
  }
  return authorizationHeader.split(' ')[1];
}
