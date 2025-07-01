import React, {Fragment, useEffect, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import {EllipsisVerticalIcon, PlusIcon} from "@heroicons/react/20/solid";
import AdminLayout from "@/components/layouts/admin-layout.component";
import Image from "next/image";
import axiosInstance from "@/services/api.services";
import EmptyData from "@/components/empty-data.component";
import ConfirmationModal from "@/components/confirmation-modal.component";
import {Offering} from "@/db/models";
import {_} from "@/utils/format.utils";
import Pagination from "@/components/list-pagination.component";

interface OfferingsGetResponse {
  offerings: Offering[];
  pageSize: number;
  totalNum: number;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

async function requestOfferings(config = {}): Promise<OfferingsGetResponse> {
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

export default function OfferingsList({initOfferings, pageSize, initTotalNum}) {
  // Local state properties
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState(null);
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

  function openConfirmationModal(offeringId: string) {
    setSelectedOfferingId(offeringId);
    setIsModalOpen(true);
  }

  function closeConfirmationModal() {
    setIsModalOpen(false);
  }

  function renderOffering(offering) {
    return (
      <Fragment>
        <div className="relative w-full h-[300px] md:w-[150px] md:h-[125px] bg-gray-200 border rounded overflow-hidden">
          <Image
            src={offering.pictures.length > 0 ? offering.pictures[0].path : null}
            className="object-cover"
            alt="Offering Picture"
            fill
          />
        </div>

        <div className="flex flex-1 flex-col gap-x-2">
          {/* Offering Details */}
          <div className="flex flex-wrap items-center md:space-y-1 gap-x-2">
            {/* Offering Title */}
            <p className="flex-1 text-sm font-semibold leading-6 text-gray-900 break-normal">
              {_(offering.title)}
            </p>

            {/* Offering Actions */}
            <div className="flex md:mb-auto md:items-center gap-x-4">
              <a
                target="_blank"
                href={`/available-offerings/${offering.id}`}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 md:block"
              >
                View Offering<span className="sr-only">, {offering.name}</span>
              </a>
              <Menu as="div" className="relative flex-none">
                <Menu.Button className="block p-2.5 text-gray-500 md:-m-2.5 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true"/>
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
                  <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({active}) => (
                        <a
                          href={`/admin/offerings/${offering.id}`}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1.5 text-sm leading-6 text-gray-900"
                          )}
                        >
                          Edit<span className="sr-only">, {offering.name}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({active}) => (
                        <button
                          onClick={() => openConfirmationModal(offering.id)}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "w-full px-3 py-1.5 text-sm text-left leading-6 text-gray-900"
                          )}
                        >
                          Delete<span className="sr-only">, {offering.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          {/* Offering Details */}
          <div className="hidden md:block">
            {/* Property Address */}
            <p className="text-sm leading-6 text-gray-500 font-medium">
              {_(offering.property_address)}
            </p>

            {/* Minimum and Total Capital Investment */}
            <p className="flex text-sm leading-6 text-gray-500 gap-x-2 flex-wrap">
              <span className="truncate">
                Min Investment:{" "}
                <span className="truncate font-medium">
                  {_(offering.minimum_investment, "currency")}
                </span>
              </span>
              {"•"}
              <span className="truncate">
                Total Capital Investment:{" "}
                <span className="truncate font-medium">
                  {_(offering.total_capital_investment, "currency")}
                </span>
              </span>
            </p>

            {/* Offering Create At and Created By */}
            <p className="flex text-sm leading-6 text-gray-500 gap-x-2 flex-wrap">
                <span className="truncate">
                  Created on{" "}
                  <span className="truncate font-medium">
                    {_(offering.created_at, "date")}
                  </span>
                </span>
              {"•"}
              <span className="truncate">
                  Updated on{" "}
                <span className="truncate font-medium">
                  {_(offering.updated_at, "date")}
                </span>
              </span>
              {"•"}
              <span className="truncate">
                Created by{" "}
                <span className="truncate font-medium capitalize">
                  {_(offering.admin.name)}
                </span>
              </span>
            </p>
          </div>

          {/* Offering Details Table (on mobile) */}
          <table className="md:hidden min-w-full mt-2 divide-y divide-gray-300">
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
        </div>
      </Fragment>
    );
  }

  async function deleteOffering(offeringId: string) {
    // Attempt to delete selected offering
    try {
      // Request to delete the selected offering record using the API
      const response = await axiosInstance.delete(`/api/offerings/${offeringId}`);

      // Retrieve number of deleted records
      const numDeleted = response.data;

      if (numDeleted > 0) {
        // Refresh list of offerings
        const offerings = await requestOfferings();

        // Update local state "offerings" property
        setOfferings(offerings);
      }
    } catch (e) {
      console.error(e);
      // TODO: Render error message
      // ...
    }
  }

  return (
    <AdminLayout title="Offerings List | Admin Dashboard">
      <div className="flex flex-1 flex-col space-y-4 mx-auto">
        {offerings.length > 0 ? (
          <Fragment>
            <a
              href="/admin/offerings/new"
              className="inline-flex rounded-md bg-slate-500 ml-auto px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true"/>
              New Offering
            </a>

            <div className="bg-white border rounded-lg shadow">
              <ul role="list" className="divide-y divide-gray-100">
                {offerings.map((offering, idx: number) => (
                  <li key={idx} className="w-full lg:w-[750px] xl:w-[900px] flex flex-col md:flex-row gap-x-6 gap-y-2 px-6 py-5">
                    {/* Render Offering details and actions */}
                    {renderOffering(offering)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
              title="Delete offering"
              description={"Are you sure you want to delete this offering? All of the data associated with this listing will be removed. This action cannot be undone."}
              isOpen={isModalOpen}
              onClose={closeConfirmationModal}
              onSubmit={() => deleteOffering(selectedOfferingId)}
            />

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
              title="No Offerings"
              description="Get started by creating a new offering."
              buttonTitle="New Offering"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
