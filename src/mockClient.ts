import ApolloClient, { ApolloClientOptions } from "apollo-client";
import {
  InMemoryCache as Cache,
  NormalizedCacheObject
} from "apollo-cache-inmemory";
import { DocumentNode } from "apollo-link";
import { MockLink } from "./mockLink";

export type RequestHandler<TData = any, TVariables = any> = (
  variables: TVariables
) => RequestHandlerResponse<TData>;

export type RequestHandlerResponse<T> = { data: T; errors?: any[] };

export type MockApolloClient = ApolloClient<NormalizedCacheObject> & {
  setRequestHandler: (query: DocumentNode, handler: RequestHandler) => void;
};

export interface MockApolloClientOptions {
  clientOptions?: Partial<ApolloClientOptions<any>>;
}

export const createMockClient = (
  { clientOptions }: MockApolloClientOptions = { clientOptions: {} }
): MockApolloClient => {
  const mockLink = new MockLink();

  const client = new ApolloClient({
    cache: new Cache(),
    ...clientOptions,
    link: mockLink
  });

  const mockMethods = {
    setRequestHandler: mockLink.setRequestHandler.bind(mockLink)
  };

  return Object.assign(client, mockMethods);
};
