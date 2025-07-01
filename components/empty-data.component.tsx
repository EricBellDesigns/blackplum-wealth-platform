import React from "react";
import {InboxIcon} from "@heroicons/react/24/solid";
import {PlusIcon} from "@heroicons/react/20/solid";

interface EmptyDataProps {
  title: string;
  description: string;
  buttonTitle?: string;
}

const EmptyData = ({title, description, buttonTitle}: EmptyDataProps) => {
  return (
    <div className="px-12 py-6 text-center rounded-lg border-2 border-dashed border-gray-300">
      <InboxIcon className="mx-auto h-12 w-12 text-gray-400" />

      {/* Title and Description */}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      {/* Render Action Button */}
      {buttonTitle ? (
        <div className="mt-6">
          <a
            href="/admin/offerings/new"
            className="inline-flex items-center rounded-md bg-slate-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {buttonTitle}
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyData;
