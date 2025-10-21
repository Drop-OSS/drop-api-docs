type ACLMode = 'user' | 'system'

export type Page = {
  path: string
  title: string
  meta: string
  description: string
  sections: Array<{ title: string; description: string }>
  endpoints: Array<
    {
      name: string
      path: string
      apiLevel: ACLMode
      acl: string
      description: string
      response: {
        description?: string
        json: string
      }
    } & (
      | { method: 'GET' | 'HEAD'; body?: undefined }
      | {
          method: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
          body:
            | string
            | {
                [key: string]: {
                  type: string
                  description: string
                  example: string
                }
              }
        }
    )
  >
}

async function createCodeGroupSection(endpoint: Page['endpoints'][number]) {
  if (endpoint.method == 'GET' || endpoint.method == 'HEAD' || !endpoint.body) {
    return `
    <CodeGroup title="Request" tag="${endpoint.method}" label="${endpoint.path}">

    \`\`\`bash {{ title: 'cURL' }}
    curl -${endpoint.method == 'GET' ? 'G' : 'I'} http://localhost:3000${endpoint.path} \\
      -H "Authorization: Bearer {token}"
    \`\`\`

    \`\`\`js
    const response = await fetch("http://localhost:3000${endpoint.path}", {
        headers: {
            Authorization: "Bearer {token}"
        },${endpoint.method == 'HEAD' ? '\n        method: "HEAD"' : ''}
    });

    const results = await response.json();
    \`\`\`

    </CodeGroup>`
  }

  return `
<CodeGroup title="Request" tag="${endpoint.method}" label="${endpoint.path}">

    \`\`\`bash {{ title: 'cURL' }}
    curl -X POST http://localhost:3000${endpoint.path} \\
      -H "Authorization: Bearer {token}" \\
      -H "Content-Type: application/json" \\
      -d "{ ... }"
    \`\`\`

    \`\`\`js
${(await prettier.format(`const response = await fetch("http://localhost:3000${endpoint.path}", {
        headers: {
            Authorization: "Bearer {token}"
        },
        method: "${endpoint.method}",
        ${
          typeof endpoint.body == 'string'
            ? 'body: /* see notes */'
            : `body: {
            ${Object.entries(endpoint.body)
              .map(([name, { example }]) => `${name}: ${example},`)
              .join('\n')}
        }`
        }
    });

    const body = await response.json();`, {parser: "typescript"})).split("\n").map((v) => `    ${v}`).join("\n")}
    \`\`\`

    </CodeGroup>
`
}

function createRequestDescription(endpoint: Page['endpoints'][number]) {
  if (!endpoint.body) return ''
  if (typeof endpoint.body == 'string')
    return `## Request
  
  ${endpoint.body}`
  return `
    ## Request
  
    <Properties>
${Object.entries(endpoint.body)
  .map(
    ([name, { type, description }]) => `
      <Property name="${name}" type="${type}">
        ${description.trim()}
      </Property>
`,
  )
  .join('\n')}
    </Properties>

  `
}

import fs from 'node:fs'
import { join } from 'node:path'
import prettier from 'prettier'

const pages = ['./pages/import']

for (const page of pages) {
  const pageData: Page = (await import(page)).default

  const header = `
export const metadata = {
  title: "${pageData.title}",
  description: "${pageData.meta}"
};
  
# ${pageData.title}
  
${pageData.description}`.trim()

  const sections = pageData.sections.map((section) =>
    `
## ${section.title}
  
${section.description}`.trim(),
  )

  const endpoints = await Promise.all(
    pageData.endpoints.map(async (endpoint) =>
      `
## ${endpoint.name} {{ tag: '${endpoint.method}', label: '${endpoint.path}', apilevel: "${endpoint.apiLevel}", acl: "${endpoint.acl}" }}
  
<Row>
  <Col>

    ${endpoint.description}

${createRequestDescription(endpoint)}

    ${
      endpoint.response.description
        ? `## Response
    
    ${endpoint.response.description}`
        : ''
    }

  </Col>
  <Col sticky>

${await createCodeGroupSection(endpoint)}

    \`\`\`json {{ title: 'Response' }}
${(await prettier.format(endpoint.response.json, { parser: 'json', })).split("\n").map((v) => `    ${v}`).join("\n")}
    \`\`\`

  </Col>
</Row>`.trim(),
    ),
  )

  const finalPage = [header, ...sections, ...endpoints].join('\n\n---\n\n')

  fs.mkdirSync(pageData.path, { recursive: true })
  fs.writeFileSync(pageData.path + '/page.mdx', finalPage)
}
