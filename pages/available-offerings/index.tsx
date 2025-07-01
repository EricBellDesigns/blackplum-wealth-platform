import Image from "next/image";
import React, {Fragment, useEffect, useState} from "react";
import {_} from "@/utils/format.utils";
import axiosInstance from "@/services/api.services";
import EmptyData from "@/components/empty-data.component";
import NavFooterLayout from "@/components/layouts/nav-footer-layout.component";
import Pagination from "@/components/list-pagination.component";
import {Offering} from "@/db/models";

interface OfferingsGetResponse {
  offerings: Offering[];
  pageSize: number;
  totalNum: number;
}

function getColorForProgress(n: number): string {
  if (n < 0 || n > 100) {
    throw new Error("n must be between 0 and 100");
  }

  const R = Math.round((255 * n) / 100);
  const G = Math.round((255 * (100 - n)) / 100);
  const B = 0;

  return `rgb(${R}, ${G}, ${B})`;
}

async function requestOfferings(config): Promise<OfferingsGetResponse> {
  try {
    // Request a list of offerings from the API
    const response = await axiosInstance.get("/api/offerings", config);
    return response.data;
  } catch (e) {
    console.error(e);
    // TODO: Render error message
    // ...
  }
}

// Request data from server before component loads
export async function getServerSideProps({req}) {
  // Explicitly attach request auth header
  // https://stackoverflow.com/a/69058105
  const headers = {
    withCredentials: true,
    Cookie: req.headers.cookie
  };

  // Retrieve list of paginated offerings returned by API
  const {offerings: initOfferings, pageSize, totalNum: initTotalNum} = await requestOfferings({headers});

  console.log(`Number of offerings: ${initOfferings.length}`);

  // Pass data to the page via props
  return {props: {initOfferings, pageSize, initTotalNum}};
}

const INITIAL_REQUEST_PARAMS = {page: 0};

export default function AvailableOfferings({initOfferings, pageSize, initTotalNum}) {
  // Local state properties
  const [requestParams, setRequestParams] = useState(INITIAL_REQUEST_PARAMS);
  const [offerings, setOfferings] = useState(initOfferings);
  const [totalNum, setTotalNum] = useState(initTotalNum);

  async function fetchOfferings() {
    // Retrieve a list of offerings returned by API
    const {offerings, totalNum} = await requestOfferings(requestParams);

    // Update local state properties
    setOfferings(offerings);
    setTotalNum(totalNum);
  }

  useEffect(() => {
    // Request new offerings every time request params change
    fetchOfferings();
  }, [requestParams]);

  async function handlePageChange(newPage: number) {
    // Scroll page to the top
    window.scrollTo({top: 0});

    // Merge previous request params state with updated filter options
    const updatedRequestParams = Object.assign({}, requestParams, {page: newPage});

    // Update local request params state
    setRequestParams(updatedRequestParams);
  }

  return (
    <NavFooterLayout title="Available Offerings | Black Plum">
      {/* Available Offerings List */}
      <div className="flex flex-1 flex-col h-full mx-auto max-w-2xl px-4 pt-24 pb-10 sm:pb-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Available Offerings</h2>

        {offerings.length > 0 ? (
          <Fragment>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8">
              {offerings.map((offering, idx: number) => (
                <div
                  key={idx}
                  className="group relative flex flex-col mb-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
                >
                  <a href={`/available-offerings/${offering.id}`}
                     className="relative w-full h-[300px] bg-gray-200 overflow-hidden">
                    <Image
                      src={offering.pictures.length > 0 ? offering.pictures[0].path : null}
                      alt="Offering Picture"
                      className="object-cover"
                      fill
                    />
                  </a>
                  <div className="flex flex-1 flex-col space-y-4 p-5">
                    <a href={`/available-offerings/${offering.id}`} className="text-base font-semibold text-blue-500">
                      {_(offering.title)}
                    </a>
                    <p className="text-sm text-gray-500">
                      {_(offering.property_address)}
                    </p>

                    {/* Loan and property details */}
                    <table className="min-w-full divide-y divide-gray-300">
                      <tbody className="bg-white border rounded">
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Deal Type
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.offering_type)}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Investor Yield
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.investor_yield, "percentage")}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Funding Goal
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.total_capital_investment, "currency")}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Target Funding Date
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.target_funding_date, "date")}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          County
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.county)}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Lien Position
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.lien_position)}
                        </td>
                      </tr>
                      <tr className="odd:bg-gray-50 border-b">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                          Property Type
                        </td>
                        <td className="whitespace-nowrap p-2 text-sm text-gray-500">
                          {_(offering.property_type)}
                        </td>
                      </tr>
                      </tbody>
                    </table>

                    {/* Pledge Progress bar */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Pledged</p>
                      <div className="overflow-hidden rounded-full bg-gray-200">
                        <div
                          style={{
                            width: `${offering.progress}%`,
                            backgroundColor: getColorForProgress(offering.progress)
                          }}
                          className="h-2 rounded-full"/>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex mx-auto items-center gap-x-3">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Follow
                      </button>
                      <a href={`/available-offerings/${offering.id}`}
                         className="inline-flex items-center gap-x-1 rounded-md bg-blue-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        View More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Menu */}
            <Pagination
              totalNum={totalNum}
              pageSize={pageSize}
              page={requestParams.page}
              handlePageChange={handlePageChange}
            />
          </Fragment>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyData
              title="No available offerings"
              description="New listings will show here soon."
            />
          </div>
        )}
      </div>
    </NavFooterLayout>
  );
}
