'use client'
import { ChangeEvent, useState } from 'react'
import ACLSelector from './ACLSelector'

export default function PayloadGenerator() {
  const [appName, setAppName] = useState('')
  const [acls, setAcls] = useState<string[]>([])
  const [mode, setMode] = useState<'system' | 'user'>('user')

  const payload = btoa(JSON.stringify({ name: appName, acls }))

  function updateAppName(event: ChangeEvent<HTMLInputElement>) {
    setAppName(event.target.value)
  }

  function addACL(acl: string) {
    if (acls.includes(acl)) return
    if (!acl) return
    setAcls([...acls, acl])
  }

  function removeACL(acl: string) {
    const index = acls.findIndex((e) => e === acl)
    if (index == -1) return
    setAcls([...acls.slice(0, index), ...acls.slice(index + 1)])
  }

  function setToggleMode(systemOn: boolean) {
    setMode(systemOn ? 'system' : 'user')
    setAcls([])
  }

  return (
    <>
      <div>
        <h3>Payload Generator</h3>
        <p>
          If you don't want to mess around with JavaScript consoles, you can use
          this UI tool to generate your payload.
        </p>
        <div className="not-prose grid grid-cols-3">
          <div className="col-span-2 space-y-2 border-r border-zinc-300 pr-4 dark:border-zinc-700">
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="My App"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-blue-500"
                  value={appName}
                  onChange={updateAppName}
                />
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="flex grow flex-col">
                <label
                  id="mode-label"
                  className="text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  User
                </label>
                <span
                  id="mode-description"
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Use User ACLs
                </span>
              </span>
              <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-blue-600 transition-colors duration-200 ease-in-out has-checked:bg-blue-600 has-focus-visible:outline-2 dark:bg-white/5 dark:inset-ring-white/10 dark:outline-blue-500 dark:has-checked:bg-blue-500">
                <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
                <input
                  id="mode"
                  name="mode"
                  type="checkbox"
                  aria-labelledby="mode-label"
                  aria-describedby="mode-description"
                  className="absolute inset-0 appearance-none focus:outline-hidden"
                  onChange={(v) => setToggleMode(v.target.checked)}
                />
              </div>
              <span className="flex grow flex-col text-right">
                <label
                  id="mode-label"
                  className="text-sm/6 font-medium text-gray-900 dark:text-white"
                >
                  System
                </label>
                <span
                  id="mode-description"
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Use System ACLs
                </span>
              </span>
            </div>

            <div className='flex flex-row items-center gap-2 flex-wrap'>
                {acls.map((acl) => (
              <>
                <span
                  key={acl}
                  className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 inset-ring inset-ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:inset-ring-blue-400/30"
                >
                  {acl}
                  <button
                    type="button"
                    className="group relative -mr-1 size-3.5 cursor-pointer rounded-xl hover:bg-blue-600/20 dark:hover:bg-blue-500/30"
                    onClick={() => removeACL(acl)}
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      viewBox="0 0 14 14"
                      className="size-3.5 stroke-blue-700/50 group-hover:stroke-blue-700/75 dark:stroke-blue-400 dark:group-hover:stroke-blue-300"
                    >
                      <path d="M4 4l6 6m0-6l-6 6" />
                    </svg>
                    <span className="absolute -inset-1" />
                  </button>
                </span>
              </>
            ))}
            </div>

            <ACLSelector mode={mode} addACL={addACL} selectedACLS={acls} />
          </div>
          <div className="pl-4 font-mono break-all">{payload}</div>
        </div>
      </div>
    </>
  )
}
