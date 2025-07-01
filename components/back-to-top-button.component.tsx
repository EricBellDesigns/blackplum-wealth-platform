import React from "react";
import {ArrowUpIcon} from "@heroicons/react/20/solid";

interface BackToTopButtonProps {
  show: boolean;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BackToTopButton({show}: BackToTopButtonProps) {
  function handleClick() {
    // Scroll to page top smoothly
    window.scrollTo({
      behavior: "smooth",
      top: 0
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames(
        show ? "opacity-100" : "opacity-0",
        "fixed right-5 bottom-5 p-2 rounded-full bg-gray-500 shadow-md transition-opacity duration-200 ease-in-out hover:bg-gray-600 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0"
      )}>
      <ArrowUpIcon className="h-8 w-8 text-white" strokeWidth={5} />
    </button>
  );
}
