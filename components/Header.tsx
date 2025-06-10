'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

const userNavigation = [
  { name: 'プロフィール', href: '#', icon: UserIcon },
  { name: '設定', href: '#', icon: Cog6ToothIcon },
  { name: 'ログアウト', href: '#', icon: ArrowRightOnRectangleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 shadow-sm sm:gap-x-4 sm:px-4 lg:px-6">
      <div className="flex flex-1 gap-x-3 self-stretch lg:gap-x-4">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            検索
          </label>
          <MagnifyingGlassIcon
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-7 pr-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 text-xs bg-transparent"
            placeholder="プロジェクトやファイルを検索..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-2 lg:gap-x-3">
          <button
            type="button"
            className="flex items-center gap-x-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-0.5 h-3 w-3" aria-hidden="true" />
            新しいスキャン
          </button>

          <button
            type="button"
            className="-m-1.5 p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">通知を見る</span>
            <BellIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="hidden lg:block lg:h-4 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          <Menu as="div" className="relative">
            <Menu.Button className="-m-1 flex items-center p-1">
              <span className="sr-only">ユーザーメニューを開く</span>
              <img
                className="h-6 w-6 rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-2 text-xs font-semibold leading-5 text-gray-900 dark:text-gray-100"
                  aria-hidden="true"
                >
                  田中太郎
                </span>
                <ChevronDownIcon
                  className="ml-1 h-4 w-4 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-1.5 w-44 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-700' : '',
                          'flex items-center gap-x-2 px-3 py-1 text-xs leading-5 text-gray-900 dark:text-gray-100'
                        )}
                      >
                        <item.icon className="h-3 w-3 text-gray-400" />
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
} 