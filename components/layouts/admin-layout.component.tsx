import React, {Fragment, ReactNode, useEffect, useState} from "react";
import {signOut, useSession} from "next-auth/react";
import {Dialog, Transition} from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {useRouter} from "next/navigation";
import RootLayout from "@/components/layouts/layout.component";
import ProfileMenu from "@/components/profile-menu.component";
import whiteLogo from "@/public/logo-white.png";
import Image from "next/image";
import {isAuthorized} from "@/utils/auth.utils";

type Props = {
  children?: ReactNode
  title?: string
}

const navigation = [
  {name: "Available Offerings", href: "/admin/offerings", icon: HomeIcon, current: true}
];

const userNavigation = [
  {name: "Your profile", href: "#"},
  {name: "Settings", href: "#"}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout({children, title}: Props) {
  const router = useRouter();

  // Retrieve session details
  const {data: session, status} = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authorized to access dashboard
  const authorized = isAuthorized(session, status, "admin");

  // Check if user is authorized after session is initialized
  useEffect(() => {
    if (authorized === false) {
      // Redirect unauthorized user to login page
      router.push("/admin/login");
    }
  }, [status]);

  function handleLogout() {
    // Handle user logout using next-auth
    signOut();
  }

  if (authorized === true) {
    return (
      <RootLayout title={title}>
        <div className="h-full">
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80"/>
              </Transition.Child>

              <div className="fixed inset-0 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                        </button>
                      </div>
                    </Transition.Child>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-600 px-6 pb-4">
                      <div className="flex h-16 shrink-0 justify-center items-center border-b border-white">
                        <span className="sr-only">Your Company</span>
                        <Image
                          src={whiteLogo}
                          alt="Logo"
                          className="w-[125px] h-auto"
                        />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-slate-700 text-white"
                                        : "text-slate-200 hover:text-white hover:bg-slate-700",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current ? "text-white" : "text-slate-200 group-hover:text-white",
                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li className="mt-auto">
                            <button
                              onClick={handleLogout}
                              className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-200 hover:bg-slate-700 hover:text-white"
                            >
                              <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-slate-200 group-hover:text-white"
                                aria-hidden="true"
                              />
                              Log Out
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-600 px-6 pb-4">
              <div className="flex h-16 shrink-0 justify-center items-center border-b border-white">
                <span className="sr-only">Your Company</span>
                <Image
                  src={whiteLogo}
                  alt="Logo"
                  className="w-[125px] h-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-slate-700 text-white"
                                : "text-slate-200 hover:text-white hover:bg-slate-700",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? "text-white" : "text-slate-200 group-hover:text-white",
                                "h-6 w-6 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <button
                      onClick={handleLogout}
                      className="w-full group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <ArrowRightOnRectangleIcon
                        className="h-6 w-6 shrink-0 text-slate-200 group-hover:text-white"
                        aria-hidden="true"
                      />
                      Log Out
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="w-full h-screen">
            <div
              className="fixed w-full top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
              <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                      onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
              </button>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true"/>

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex items-center ml-auto gap-x-4 lg:gap-x-6">
                  <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true"/>
                  </button>

                  {/* Separator */}
                  <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"/>

                  {/* Profile Avatar and Username */}
                  <ProfileMenu
                    avatarPath={session.user.image}
                    username={session.user.name}
                    loading={status !== "authenticated"}
                  />
                </div>
              </div>
            </div>

            {/* Children components */}
            <main className="flex flex-col min-h-full py-20 sm:py-24 lg:pl-72 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </RootLayout>
    );
  }
}
