/**
 * A lot of these docs are copy-pasted and modified, and I may miss things as I write them.
 * This script is designed to catch these errors.
 */

import fs from 'fs'
import { micromark } from 'micromark'
import { mdx } from 'micromark-extension-mdx'
import { parse } from 'node-html-parser'
import path from 'path'

function findFiles(dir) {
  const files = fs.readdirSync(dir)
  let results = []
  for (const file of files) {
    const abs = path.join(dir, file)
    if (fs.statSync(abs).isDirectory()) {
      results.push(...findFiles(abs))
    } else if (abs.endsWith('.mdx')) {
      results.push(abs)
    }
  }
  return results
}

const mdxs = findFiles('./src')

const whitelist = [
  'export const metadata',
  'Not required for this example.',
  "The above ACL isn't required to access resources, only if you want to access user-restricted or internal objects.",
]

const overlaps = {}

for (const mdxFile of mdxs) {
  const contents = fs.readFileSync(mdxFile, 'utf-8')
  if (!contents) continue
  const md = micromark(contents, { extensions: [mdx()] })
  const html = parse(md)

  const strings = [...html.getElementsByTagName('p')]

  for (const ele of strings) {
    const str = ele.innerText
    const whitelisted = whitelist.find((e) => str.includes(e))
    if (whitelisted) continue
    if (overlaps[str])
      throw `Overlap detected between ${mdxFile} and ${overlaps[str]}: ${str}`
    overlaps[str] = mdxFile
  }
}

console.log('All checks passed!')
