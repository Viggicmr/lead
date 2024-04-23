import { gql } from '@apollo/client';

export const GET_SPECIALTY = gql`
query FindManySubspecialties($filter: SubspecialtyFilterInput, $orderBy: SubspecialtyOrderByInput, $lastCursor: String, $limit: Float) {
  subspecialties(
    filter: $filter
    orderBy: $orderBy
    first: $limit
    after: $lastCursor
  ) {
    edges {
      node {
        id
        name
        specialty{
          name
        }

      }
      cursor
    }
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;