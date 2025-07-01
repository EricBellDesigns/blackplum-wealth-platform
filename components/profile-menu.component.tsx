import Image from "next/image";
import React, {Fragment} from "react";
import {signOut} from "next-auth/react";
import {Menu, Transition} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import defaultAvatar from "/public/default-avatar.jpg";
import {ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";

interface ProfileMenuProps {
  avatarPath?: string;
  username?: string;
  loading: boolean;
}

const userNavigation = [
  {name: "Your profile", href: "#"},
  {name: "Settings", href: "#"}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileMenu({avatarPath, username, loading}: ProfileMenuProps) {
  function handleLogout() {
    // Handle user logout using next-auth
    signOut();
  }

  return (
    <Menu as="div" className="relative">
      {!loading ? (
        <Menu.Button className="-m-1.5 flex items-center">
          <span className="sr-only">Open user menu</span>
          {/* Profile Avatar */}
          <Image
            src={avatarPath || defaultAvatar}
            alt="Default Avatar"
            className="h-9 w-9 border rounded-full"
          />

          {/* Profile Username */}
          <span className="hidden lg:flex lg:items-center">
            <span className="ml-3 text-sm font-semibold leading-6 text-gray-900 capitalize" aria-hidden="true">
              {username}
            </span>
            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true"/>
          </span>
        </Menu.Button>
      ) : (
        // Loading Skeleton
        <div className="animate-pulse flex space-x-4">
          {/* Avatar Placeholder */}
          <div className="rounded-full bg-gray-200 h-9 w-9"></div>

          <div className="hidden flex-1 lg:flex lg:items-center space-y-6 py-1">
            {/* Username Placeholder */}
            <div className="w-28 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 z-10 py-2 mt-2.5 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          <div className="mb-1.5">
            {userNavigation.map((item) => (
              <Menu.Item key={item.name}>
                {({active}) => (
                  <a
                    href={item.href}
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3.5 py-1.5 text-sm leading-6 text-gray-900"
                    )}
                  >
                    {item.name}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
          <div className="border-t border-gray-200">
            <Menu.Item>
              <button
                onClick={handleLogout}
                className="flex w-full px-3.5 py-1.5 mt-1.5 items-center text-sm leading-6 text-left text-gray-900 gap-x-1.5 hover:bg-gray-50">
                <ArrowRightOnRectangleIcon
                  className="h-5 w-5 text-gray-900"
                  aria-hidden="true"
                />
                Log Out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
