import React, {useEffect, useState} from "react";
import NavLayout from "@/components/layouts/nav-layout.component";
import OfferingLayout from "@/components/layouts/offering-layout.component";
import Image from "next/image";
import {BriefcaseIcon, BuildingOfficeIcon, ChartPieIcon} from "@heroicons/react/24/outline";
import {PaperClipIcon} from "@heroicons/react/24/solid";
import axiosInstance from "@/services/api.services";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {formatFileSize} from "@/utils/file.utils";
import {_} from "@/utils/format.utils";
import BackToTopButton from "@/components/back-to-top-button.component";

// Request data from server before component loads
export async function getServerSideProps({req, query}) {
  // Get the offering id passed in the url
  const id = query.id;

  // Explicitly attach request auth header
  // https://stackoverflow.com/a/69058105
  const headers = {
    withCredentials: true,
    Cookie: req.headers.cookie
  };

  // Request a particular offering from the API
  const response = await axiosInstance.get(`/api/offerings/${id}`, {headers});

  // Capture the offering object returned by API
  const offering = response.data;

  console.log(`Fetched offering: ${offering}`);

  // Pass data to the page via props
  return {props: {offering}};
}

export default function OfferingDetails({offering}) {
  const router = useRouter();

  // Retrieve session details
  const {data: session, status} = useSession();

  // Local state properties
  const [showBackToTop, setShowBackToTop] = useState(false);

  if (session === null) {
    // Redirect unauthenticated user to login page
    router.push("/login");
  }

  useEffect(() => {
    // Add a scroll event listener to track scrolling
    window.addEventListener("scroll", handleScroll);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    // Check the scroll position to determine when to show the button
    if (window.scrollY > 100) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  }

  function renderPictures() {
    return (
      <Carousel>
        {offering.pictures.map((picture, idx: number) => (
          <div key={idx} className="w-full h-[250px] sm:h-[500px]">
            <Image
              src={picture.path}
              alt="Property picture"
              className="object-cover"
              fill
            />
          </div>
        ))}
      </Carousel>
    );
  }

  function renderAttachments() {
    // Check if the offering has any documents attached
    if (offering.documents.length > 0) {
      return (
        <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
          {offering.documents.map((document, idx) => (
            <li key={idx} className="flex items-center justify-between py-4 pl-4 pr-5 leading-6">
              <div className="flex w-0 flex-1 items-center space-x-2">
                <PaperClipIcon className="h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                <div className="flex min-w-0 flex-1 gap-2">
                <span className="truncate font-medium capitalize">
                  {document.filename}
                </span>
                  <span className="flex-shrink-0 text-gray-400">
                  {formatFileSize(document.size)}
                </span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <a download href={document.path} className="font-medium text-blue-500 hover:text-blue-600">
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <div className="rounded-md border border-gray-200">
          <p className="flex items-center p-4 text-gray-700 gap-x-2">
            No documents attached.
          </p>
        </div>
      );
    }
  }

  if (session) {
    return (
      <NavLayout>
        <OfferingLayout title={`${offering.title} | Black Plum`}>
          <div className="xl:w-[950px] flex flex-1 flex-col space-y-4 mx-auto mb-10">
            <div className="bg-white border rounded-lg overflow-hidden shadow">
              {/* Offering Pictures */}
              <div id="pictures">
                {renderPictures()}
              </div>

              {/* Offering Title */}
              <h3 className="px-4 py-6 sm:px-6 text-xl font-semibold leading-6 text-gray-900">
                {_(offering.title)}
              </h3>

              {/* Deal Information section */}
              <div id="deal" className="border-t">
                <div className="bg-gray-100/75 px-4 py-3 sm:py-5 sm:px-6 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-6 h-6"/>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      Deal Information
                    </h3>
                  </div>
                  <p className="mt-1 max-w-2xl leading-6 text-gray-500">
                    Details and terms related to the investment opportunity.
                  </p>
                </div>

                <div className="sm:px-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-3">
                    {/* 1st Row */}
                    <div className="px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Offering Type
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.offering_type)}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Target Funding Date
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.target_funding_date, "date")}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Investor Yield
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.investor_yield, "percentage")}
                      </dd>
                    </div>

                    {/* 2nd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Minimum Investment
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.minimum_investment, "currency")}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Total Capital Investment
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.total_capital_investment, "currency")}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Gross Protective Equity
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.gross_protective_equity, "currency")}
                      </dd>
                    </div>

                    {/* 3rd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Monthly Payment to Investor
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.monthly_pmt_to_investor, "currency")}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-2 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Exit Strategy
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.exit_strategy)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Property Details section */}
              <div id="property" className="border-t">
                <div className="bg-gray-100/75 px-4 py-3 sm:py-5 sm:px-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <BuildingOfficeIcon className="w-6 h-6"/>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      Property Details
                    </h3>
                  </div>
                  <p className="mt-1 max-w-2xl leading-6 text-gray-500">
                    Information about the real estate offering for investment.
                  </p>
                </div>

                <div className="sm:px-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-3">
                    {/* 1st Row */}
                    <div className="px-4 py-3 sm:py-5 sm:col-span-3 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Property Address
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.property_address)}
                      </dd>
                    </div>

                    {/* 2nd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Property Type
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.property_type)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Occupancy
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.occupancy)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Market Value
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.market_value, "currency")}
                      </dd>
                    </div>

                    {/* 3rd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Assessor Parcel Number
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.apn)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Bedrooms
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.bedrooms)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Bathrooms
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.bathrooms)}
                      </dd>
                    </div>

                    {/* 4th Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        County
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.county)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Square Footage
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.square_footage, "decimal")}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Lot Size
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.lot_size, "decimal")}
                      </dd>
                    </div>


                    {/* 5th Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Year Built
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.year_built)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Exterior
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.exterior)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Zoning
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.zoning)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Debt Stack section */}
              <div id="debt-stack" className="border-t">
                <div className="bg-gray-100/75 px-4 py-3 sm:py-5 sm:px-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <ChartPieIcon className="w-6 h-6"/>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      Debt Stack
                    </h3>
                  </div>
                  <p className="mt-1 max-w-2xl leading-6 text-gray-500">
                    Investment capital structure and details.
                  </p>
                </div>

                <div className="sm:px-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-3">
                    {/* 1st Row */}
                    <div className="px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Existing First Mortgage
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {offering.existing_first_mortgage ? "Yes (has mortgage)" : "No (doesn't have mortgage)"}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:py-5 sm:col-span-2 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Borrower Credit Score
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.borrower_credit_score)}
                      </dd>
                    </div>

                    {/* 2nd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Loan Type
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.loan_type)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Lien Position
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.lien_position)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Payment Type
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.payment_type)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Loan Term
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.loan_term)}
                      </dd>
                    </div>

                    {/* 3rd Row */}
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Prepaid Interest
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.prepaid_interest)}
                      </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3 sm:py-5 sm:col-span-1 sm:px-0">
                      <dt className="font-medium leading-6 text-gray-900">
                        Guaranteed Interest
                      </dt>
                      <dd className="mt-1 leading-6 text-gray-700 sm:mt-2">
                        {_(offering.guaranteed_interest)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Attachments section */}
              <div id="attachments" className="border-t">
                <div className="bg-gray-100/75 px-4 py-3 sm:py-5 sm:px-6 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <PaperClipIcon className="w-6 h-6"/>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                      Attachments
                    </h3>
                  </div>
                  <p className="mt-1 max-w-2xl leading-6 text-gray-500">
                    Attached documents related to the offering.
                  </p>
                </div>

                <div className="px-4 py-3 sm:py-5">
                  {renderAttachments()}
                </div>
              </div>
            </div>
          </div>

          {/* Back To Top Button */}
          <BackToTopButton show={showBackToTop} />
        </OfferingLayout>
      </NavLayout>
    );
  }
}
