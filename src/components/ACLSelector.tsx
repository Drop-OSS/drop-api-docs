'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

/* === COPY FROM DROP SOURCE === */
export const userACLs = [
  'read',

  'store:read',

  'object:read',
  'object:update',
  'object:delete',

  'notifications:read',
  'notifications:mark',
  'notifications:listen',
  'notifications:delete',

  'screenshots:new',
  'screenshots:read',
  'screenshots:delete',

  'collections:new',
  'collections:read',
  'collections:delete',
  'collections:add',
  'collections:remove',
  'library:add',
  'library:remove',

  'clients:read',
  'clients:revoke',

  'news:read',

  'settings:read',
] as const
const userACLPrefix = 'user:'

export type UserACL = Array<(typeof userACLs)[number]>

export const systemACLs = [
  'setup',

  'auth:read',
  'auth:simple:invitation:read',
  'auth:simple:invitation:new',
  'auth:simple:invitation:delete',

  'notifications:read',
  'notifications:mark',
  'notifications:listen',
  'notifications:delete',

  'library:read',
  'library:sources:read',
  'library:sources:new',
  'library:sources:update',
  'library:sources:delete',

  'game:read',
  'game:update',
  'game:delete',
  'game:version:update',
  'game:version:delete',
  'game:image:new',
  'game:image:delete',

  'company:read',
  'company:update',
  'company:create',
  'company:delete',

  'import:version:read',
  'import:version:new',

  'import:game:read',
  'import:game:new',

  'user:read',
  'user:delete',

  'news:read',
  'news:create',
  'news:delete',

  'tags:read',
  'tags:create',
  'tags:delete',

  'task:read',
  'task:start',

  'maintenance:read',

  'settings:update',
] as const
const systemACLPrefix = 'system:'

export type SystemACL = Array<(typeof systemACLs)[number]>

export type GlobalACL =
  | `${typeof systemACLPrefix}${(typeof systemACLs)[number]}`
  | `${typeof userACLPrefix}${(typeof userACLs)[number]}`
/* === END COPY FROM DROP SOURCE === */

export default function ACLSelector({
  mode,
  addACL,
  selectedACLS,
}: {
  mode: 'system' | 'user'
  addACL: (v: string) => void
  selectedACLS: string[]
}) {
  const [query, setQuery] = useState('')

  const acls = (mode === 'system' ? systemACLs : userACLs).filter(
    (e) => !selectedACLS.includes(e),
  )

  return (
    <Combobox
      as="div"
      onChange={(acl) => {
        setQuery('')
        addACL(acl as string)
      }}
    >
      <Label className="block text-sm/6 font-medium text-gray-900 dark:text-white">
        Select ACL
      </Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-blue-500"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery('')}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronDownIcon
            className="size-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        <ComboboxOptions
          transition
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
        >
          {query.length > 0 && (
            <ComboboxOption
              value={{ id: null, name: query }}
              className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-blue-600 data-focus:text-white data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-blue-500"
            >
              {query}
            </ComboboxOption>
          )}
          {acls.map((acl) => (
            <ComboboxOption
              key={acl}
              value={acl}
              className="cursor-default px-3 py-2 text-gray-900 select-none data-focus:bg-blue-600 data-focus:text-white data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-blue-500"
            >
              <span className="block truncate">{acl}</span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}
