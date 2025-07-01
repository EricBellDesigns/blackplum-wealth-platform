import React, {ReactNode, useState} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import RootLayout from "@/components/layouts/layout.component";
import {CurrencyDollarIcon} from "@heroicons/react/20/solid";

type Props = {
  children?: ReactNode
  title?: string
}

const navigation = [
  {name: "Pictures", href: "#pictures", icon: PhotoIcon, current: true},
  {name: "Deal", href: "#deal", icon: BriefcaseIcon, current: false},
  {name: "Property", href: "#property", icon: BuildingOfficeIcon, current: false},
  {name: "Debt Stack", href: "#debt-stack", icon: ChartPieIcon, current: false},
  {name: "Attachments", href: "#attachments", icon: PaperClipIcon, current: false}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function OfferingLayout({children, title}: Props) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  function toggleSidebar() {
    setSidebarExpanded(!sidebarExpanded);
  }

  function renderSidebarButton() {
    const Icon = sidebarExpanded ? ArrowLeftIcon : ArrowRightIcon;

    return (
      <button onClick={toggleSidebar}
              className="absolute top-7 right-[-30px] p-2 bg-gray-50 z-50 border rounded-full shadow">
        <Icon className="h-5 w-5"/>
      </button>
    )
  }

  return (
    <RootLayout title={title}>
      <div className="flex">
        {/* Static sidebar for desktop */}
        <div className={classNames(
          sidebarExpanded ? "lg:w-[250px]" : "lg:w-[90px]",
          "relative pt-20 lg:flex justify-center shadow-md duration-200"
        )}>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className={classNames(
            sidebarExpanded ? "lg:w-[200px]" : "lg:w-[70px]",
            "bg-white hidden lg:fixed lg:flex flex-col gap-y-5 rounded-b duration-200"
          )}>
            {/* Display Sidebar Toggle button */}
            {renderSidebarButton()}

            <nav className="flex flex-1 flex-col p-3">
              <ul role="list" className="flex flex-1 flex-col gap-y-7 divide-y-2">
                <li>
                  <ul role="list" className="-mx-2 space-y-1 mb-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-100 text-blue-500"
                              : "text-gray-700 hover:text-blue-500 hover:bg-gray-100",
                            sidebarExpanded ? "justify-start" : "justify-center",
                            "group flex rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? "text-blue-500" : "text-gray-400 group-hover:text-blue-500",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          <span className={classNames(
                            sidebarExpanded ? "opacity-100 ml-2" : "opacity-0",
                            "transition-opacity duration-500 whitespace-nowrap"
                          )}>
                            {sidebarExpanded ? item.name : null}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul role="list" className="pt-4 border-t border-gray-200">
                    <li>
                      <button
                        type="submit"
                        style={{height: 36}}
                        className="w-full flex justify-center items-center bg-blue-500 px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        <span className={classNames(
                          sidebarExpanded ? "opacity-100 mr-1" : "opacity-0",
                          "transition-opacity duration-500 whitespace-nowrap"
                        )}>
                          {sidebarExpanded ? "Pledge Now" : null}
                        </span>
                        <CurrencyDollarIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="w-full h-full">
          {/* Children components */}
          <main className="flex flex-col min-h-full pt-24 bg-gray-100">
            {children}
          </main>
        </div>
      </div>
    </RootLayout>
  );
}
