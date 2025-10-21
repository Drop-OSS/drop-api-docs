import { Page } from '../index.js'

export default {
  path: 'web/import',
  title: 'Import',
  meta: "On this page, we'll dive into how to import games and versions on Drop, and the options for both.",
  description: `While games and versions should be covered in separate sections, importing is a complicated enough of a process to warrant a separate page. Importing is the process of pulling and providing metadata for various complex objects in Drop, namely games and versions.

Both games and versions in Drop are required to imported manually, due to them having additional metadata that must be user-provided.`,
  sections: [
    {
      title: 'Game metadata',
      description:
        "Game metadata is provided by a series of backend 'metadata providers'. Drop unifies them all into a single API to import the metadata, and handle authentication seamlessly.",
    },
  ],
  endpoints: [
    {
      name: 'Fetch unimported games',
      path: '/api/v1/admin/import/game',
      apiLevel: 'system',
      acl: 'import:game:read',
      description:
        'This endpoint fetches all unimported games on the instance.',
      method: 'GET',
      response: {
        json: `{
        "unimportedGames": [
            {
                "game": "Abiotic Factor",
                "library": {
                    "id": "8dc4b769-090f-4aec-b73a-d8fafc84f418",
                    "name": "Example Library",
                    "backend": "Filesystem",
                    "options": {
                        "baseDir": "./.data/library"
                    },
                    "working": true
                }
            },
            {
                "game": "Balatro",
                "library": {
                    "id": "8dc4b769-090f-4aec-b73a-d8fafc84f418",
                    "name": "Example Library",
                    "backend": "Filesystem",
                    "options": {
                        "baseDir": "./.data/library"
                    },
                    "working": true
                }
            },
            {
                "game": "SuperTuxKart",
                "library": {
                    "id": "8dc4b769-090f-4aec-b73a-d8fafc84f418",
                    "name": "Example Library",
                    "backend": "Filesystem",
                    "options": {
                        "baseDir": "./.data/library"
                    },
                    "working": true
                }
            }
        ]
    }`,
      },
    },
    // Search metadata,
    {
      name: 'Import game',
      path: '/api/v1/admin/import/game',
      method: 'POST',
      apiLevel: 'system',
      acl: 'import:game:new',
      description: 'This endpoint imports a game, optionally with metadata.',
      body: {
        library: {
          type: 'string',
          description:
            "The ID of the library you're importing from. Fetched from `library.id` on the GET endpoint.",
          example: `"8dc4b769-090f-4aec-b73a-d8fafc84f418"`,
        },
        path: {
          type: 'string',
          description:
            "Path of the game you're importing. Fetched from the `game` on the GET endpoint.",
          example: `"SuperTuxKart"`,
        },
        metadata: {
          type: 'object',
          description: `
        Optional, metadata to import from. It requires three fields if set:
        \`\`\`json
        {
            "id": "game ID",
            "sourceId": "source ID",
            "name": "Name of game"
        }
        \`\`\`

        All these properties are returned from the search endpoint. While you can guess these values, as they are generally the internal IDs of the respective platforms, they *are* internal values and are not recommended to be guessed.

        For example, if you had the game already from IGDB, you may be able to use:
        \`\`\`json
        {
            "id": "<IGDB ID>",
            "sourceId": "IGDB",
            "name": "<Name of game on IGDB>"
        }
        \`\`\`

        Without searching for the game first. *This is officially not recommended, but we are unlikely to break this behaviour.*
`,
          example: `{
                id: "289018",
                sourceId: "IGDB",
                name: "Example Block Game"
            }`,
        },
      },
      response: {
        json: `{
        "taskId": "..."
    }`,
      },
    },
  ],
} satisfies Page
