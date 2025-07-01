
interface PagerProps {
  pageStart: number;
  pageEnd: number;
  totalNum: number;
}

export default function Pager({pageStart, pageEnd, totalNum}) {
  return (
    <nav
      className="flex items-center justify-between border border-gray-200 rounded-md bg-white px-4 py-3 sm:px-6 mt-14"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-medium">
            {pageStart}
          </span>
          {" to "}
          <span className="font-medium">
            {pageEnd}
          </span>{" "}of{" "}
          <span className="font-medium">{totalNum}</span>
          {" "}Records
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
        >
          Next
        </a>
      </div>
    </nav>
  );
}
