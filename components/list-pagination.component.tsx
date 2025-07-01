import React from "react";

interface ListPaginationProps {
  page: number;
  pageSize: number;
  totalNum: number;
  handlePageChange: (page: number) => void;
}

export default function ListPagination({page, pageSize, totalNum, handlePageChange}: ListPaginationProps) {
  // Calculate the starting record number for the current page.
  function getPageStart() {
    let pageStart = 0;

    // Check if there are records to display
    if (totalNum > 0) {
      // Calculate the starting record based on the page number and page size
      pageStart = (page * pageSize) + 1;
    }
    return pageStart;
  }

  // Calculate the ending record number for the current page.
  function getPageEnd() {
    let pageEnd = 0;

    // Check if there are records to display
    if (totalNum > 0) {
      // Calculate the potential ending record based on the page number and page size
      const calculatedPageEnd = (page + 1) * pageSize;

      // Ensure the potential ending record does not exceed the total number of records
      pageEnd = Math.min(calculatedPageEnd, totalNum);
    }
    return pageEnd;
  }

  // Calculate page start and end numbers
  const pageStart = getPageStart();
  const pageEnd = getPageEnd();

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-md bg-white px-4 py-3 sm:px-6 mt-14">
      <div className="hidden sm:block">
        <span className="text-sm text-gray-700">
          Showing{" "}
          <span className="font-semibold text-gray-900">{pageStart.toLocaleString("en-US")}</span>
          {" "}to{" "}
          <span className="font-semibold text-gray-900">{pageEnd.toLocaleString("en-US")}</span>
          {" "}of{" "}
          <span className="font-semibold text-gray-900">{totalNum}</span> Records
        </span>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          disabled={page < 1}
          onClick={() => handlePageChange(page - 1)}
          className={`${page < 1 && "disabled:opacity-75"} inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`}>
          Previous
        </button>

        <button
          type="button"
          disabled={pageEnd >= totalNum}
          onClick={() => handlePageChange(page + 1)}
          className={`${pageEnd >= totalNum && "disabled:opacity-75"} ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
