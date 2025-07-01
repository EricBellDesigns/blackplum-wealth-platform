import Image from "next/image";
import {Dialog} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import logo from "@/public/logo.png";
import {useRouter} from "next/router";
import ProfileMenu from "@/components/profile-menu.component";
import {useSession} from "next-auth/react";
import {ArrowLeftIcon} from "@heroicons/react/20/solid";

type NavbarProps = {
  showBack?: boolean;
};

const navigation = [
  {name: "Available Offerings", href: "/available-offerings"},
  {name: "About", href: "/#about"},
  {name: "Contact Us", href: "/#contact-us"}
];

export default function Navbar({showBack = false}: NavbarProps) {
  const router = useRouter();

  // Retrieve session details
  const {data: session, status} = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white border-b shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          {showBack ? (
            <a href="/available-offerings" className="flex -m-1.5 p-1.5 gap-x-2 items-center">
              <ArrowLeftIcon className="h-6 w-6 text-gray-900"/>
              <span className="text-base lg:text-sm font-semibold leading-6 text-gray-900">
                Go Back
              </span>
            </a>
          ) : (
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                src={logo}
                alt="Logo"
                className="w-[125px] h-auto"
              />
            </a>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 ${router.pathname.includes(item.href) ? "text-blue-500" : "text-gray-900"}`}>
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            // Profile Avatar and Username
            <ProfileMenu
              avatarPath={session.user.image}
              username={session.user.name}
              loading={status !== "authenticated"}
            />
          ) : (
            <a href="/login" className="text-sm font-semibold leading-6 text-blue-500">
              Sign in <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50"/>
        <Dialog.Panel
          className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                src={logo}
                alt="Logo"
                className="w-[125px] h-auto"
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                {session ? (
                  <div className="flex items-center gap-x-1">
                    {/* Profile Avatar and Username */}
                    <ProfileMenu
                      avatarPath={session.user.image}
                      username={session.user.name}
                      loading={status !== "authenticated"}
                    />
                    {/* Profile Username */}
                    <span className="lg:flex lg:items-center">
                      <span className="ml-3 font-semibold leading-6 text-gray-900 capitalize" aria-hidden="true">
                        {session.user.name}
                      </span>
                    </span>
                  </div>
                ) : (
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Sign in
                  </a>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}