import {graphqlClient} from "@/client/api";
import { getCurrentUserQuery } from "@/graphql/query/user";
import { RequestDocument } from "graphql-request";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "@/gql/graphql";


export const useCurrentUser = (): UseQueryResult<User | null, Error> & { user: User | undefined } => {
  const query = useQuery<{ getCurrentUser: User | null }, Error, User | null>({
    queryKey: ['current-user'],
    queryFn: () =>
      graphqlClient.request<{ getCurrentUser: User | null }>(
        getCurrentUserQuery as unknown as RequestDocument
      ),
    select: (data) => data.getCurrentUser ?? null,
  });
  return { ...query, user: query.data ?? undefined };
};
