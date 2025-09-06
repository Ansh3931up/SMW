
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000/graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "graphql/**/*.{ts,tsx}",
    "component/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/dist/**",
    "!**/build/**"
  ],
  // optional:
  ignoreNoDocuments: true,
  generates: {
    "gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
