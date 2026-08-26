'use strict';

const FORBIDDEN_PATHS = ['searchParams', 'query', 'body', 'params', 'headers', 'cookies'];
const FORBIDDEN_NAMES = ['userId', 'user_id', 'ownerId', 'owner_id', 'requesterId', 'requester_id'];

/** Ban reading userId/ownerId from client-controlled request data. */
const noClientUseridRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow reading userId/ownerId from client-controlled request data. ' +
        'The authenticated user must come from the server-side session only.',
    },
    schema: [],
    messages: {
      forbidden:
        'Reading `{{name}}` from `{{path}}` is forbidden. ' +
        'Use `getCurrentUserId()` from `@/lib/auth/session` to derive the user from the session.',
    },
  },
  create(context) {
    function checkMemberAccess(node) {
      if (node.type !== 'MemberExpression') return;
      const prop = node.property;
      if (prop.type !== 'Identifier') return;
      if (!FORBIDDEN_NAMES.includes(prop.name)) return;
      const obj = node.object;
      if (obj.type !== 'Identifier') return;
      if (!FORBIDDEN_PATHS.includes(obj.name)) return;
      context.report({ node: prop, messageId: 'forbidden', data: { name: prop.name, path: obj.name } });
    }
    return {
      MemberExpression: checkMemberAccess,
      VariableDeclarator(node) {
        const id = node.id;
        if (id.type !== 'ObjectPattern') return;
        for (const prop of id.properties) {
          if (prop.type !== 'Property') continue;
          if (prop.key.type !== 'Identifier') continue;
          if (!FORBIDDEN_NAMES.includes(prop.key.name)) continue;
          if (prop.value.type !== 'Identifier') continue;
          if (!FORBIDDEN_PATHS.includes(prop.value.name)) continue;
          context.report({ node: prop.key, messageId: 'forbidden', data: { name: prop.key.name, path: prop.value.name } });
        }
      },
    };
  },
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[property.name='dangerouslySetInnerHTML']",
        message: 'dangerouslySetInnerHTML is banned. Use safe text rendering.',
      },
    ],
  },
  overrides: [
    // App code: `src/app/**/*.tsx` and `src/components/**/*.tsx` + their server siblings.
    // These files must NEVER read userId from request data.
    {
      files: ['src/app/**/*.ts', 'src/app/**/*.tsx', 'src/components/**/*.ts', 'src/components/**/*.tsx'],
      excludedFiles: [
        // Server-only code that legitimately talks to the DB by ID
        'src/app/api/**',
        'src/app/**/route.ts',
        'src/lib/auth/session.ts',
        'src/lib/auth/**',
        'src/lib/supabase/**',
        'src/lib/rate-limit/**',
        'src/lib/audit.ts',
        'src/lib/errors.ts',
        'src/middleware.ts',
        'src/env.ts',
        'tests/**',
        'node_modules/**',
        '.next/**',
      ],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "MemberExpression[property.name='dangerouslySetInnerHTML']",
            message: 'dangerouslySetInnerHTML is banned.',
          },
          {
            selector:
              "MemberExpression[object.name='searchParams'][property.name='userId'], MemberExpression[object.name='query'][property.name='userId'], MemberExpression[object.name='body'][property.name='userId'], MemberExpression[object.name='params'][property.name='userId']",
            message:
              'Reading `userId` from `searchParams/query/body/params` is forbidden. Use `getCurrentUserId()` from `@/lib/auth/session`.',
          },
        ],
      },
    },
  ],
};
