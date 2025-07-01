import React, {ChangeEvent, useEffect, useState} from "react";
import Datepicker from "tailwind-datepicker-react";
import AdminLayout from "@/components/layouts/admin-layout.component";
import {DocumentTextIcon, PaperClipIcon, PhotoIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {ArrowsPointingOutIcon, CalendarIcon, HomeIcon} from "@heroicons/react/20/solid";
import Image from "next/image";
import dayjs from "dayjs";
import ValidationError from "@/components/validation-error.component";
import Loading from "@/components/loading.component";
import {useRouter} from "next/router";
import axiosInstance from "@/services/api.services";
import {compressFile} from "@/utils/file.utils";
import {getFormData} from "@/utils/form.utils";

type ValidationErrorMessage = {
  message: string
}

interface ValidationErrors {
  [key: string]: ValidationErrorMessage[];
}

const propertyTypeOptions = [
  "SFR",
  "MFR",
  "Duplex",
  "Tri-Plex",
  "Condo",
  "Commercial"
];

const occupancyOptions = [
  "Owner Occupied",
  "Tenant Occupied",
  "Vacant",
  "Under Construction"
];

const loanTypeOptions = [
  "Cash Out",
  "Cash Out Refi",
  "Rate & Term Refi",
  "Purchase Fix/Flip",
  "Purchase"
];

const paymentTypeOptions = [
  "Interest Only",
  "Fully Amortized"
];

const lienPositionOptions = [
  "1st",
  "2nd"
];

const mortgageOptions = [
  {value: "true", title: "Yes"},
  {value: "false", title: "No"}
];

const datePickerOptions = {
  todayBtn: false,
  clearBtn: false,
  datepickerClassNames: "p-0 border rounded-lg"
}

export async function getServerSideProps({req, query}) {
  // Get the offering id passed in the url
  const offeringId = query.offeringId;

  // Explicitly attach request auth header
  // https://stackoverflow.com/a/69058105
  const headers = {
    withCredentials: true,
    Cookie: req.headers.cookie
  };

  // Request a list of credit cards from the API
  const response = await axiosInstance.get(`/api/offerings/${offeringId}`, {headers});

  // Capture list of credit cards returned by API
  const {admin, pictures, documents, ...initOffering} = response.data;

  // Pass data to the page via props
  return {props: {initOffering, initPictures: pictures, initDocuments: documents}};
}

export default function NewOffering({initOffering, initPictures, initDocuments}) {
  const router = useRouter();

  // Local state properties
  const [offering, setOffering] = useState(initOffering);
  const [pictures, setPictures] = useState(initPictures);
  const [documents, setDocuments] = useState(initDocuments);
  const [show, setShow] = useState(false);
  const [existingMortgage, setExistingMortgage] = useState(initOffering.existing_first_mortgage.toString());
  const [selectedDate, setSelectedDate] = useState(new Date(initOffering.target_funding_date));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    window.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      // Don't hide the date picker menu if user clicks within datepicker element
      if (document.getElementById("datepicker")?.contains(target)) {
        return;
      }

      // Hide date picker menu on click outside
      setShow(false);
    });
  }, [setShow]);

  function handleDateChange(selectedDate: Date) {
    console.log(selectedDate);
    // Update "selected date" local state property
    setSelectedDate(selectedDate);
  }

  function handleClose(state: boolean) {
    setShow(state);
  }

  function updateOfferingObject(propertyName: string, propertyValue: any) {
    setOffering((prevOfferingObject) => {
      return Object.assign({}, prevOfferingObject, {
        [propertyName]: propertyValue
      });
    });
  }

  async function onPictureChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      // Convert FlatList to Array representing uploaded files
      const uploadedFiles = Array.from(e.target.files);

      // Compress uploaded pictures
      const promises = [];
      for (const file of uploadedFiles) {
        const compressedPicture = compressFile(file);
        promises.push(compressedPicture);
      }

      // Push selected pictures to "pictures" state array
      const compressedPictures = await Promise.all(promises);
      const updatedPictures = pictures.concat(compressedPictures);

      // Upload "pictures" local state property
      setPictures(updatedPictures);
    }
  }

  async function onDocumentChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      // Convert FlatList to Array representing uploaded files
      const uploadedFiles = Array.from(e.target.files);

      // Push selected pictures to "pictures" state array
      const updatedDocuments = documents.concat(uploadedFiles);

      // Upload "pictures" local state property
      setDocuments(updatedDocuments);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Render loading spinner to indicate activity
    setLoading(true);

    // Determine which pictures to add (only if their instance is Blob)
    const picturesToAdd = pictures.filter(picture => picture instanceof Blob);

    // Determine which pictures to delete (difference between the original list of pictures and state pictures array)
    const picturesToDelete = initPictures.filter(originalPicture => !pictures.some(picture => originalPicture.id === picture.id));

    // Determine which documents to add (only if their instance is Blob)
    const documentsToAdd = documents.filter(document => document instanceof Blob);

    // Determine which documents to delete (difference between the original list of documents and state documents array)
    const documentsToDelete = initDocuments.filter(originalDocument => !documents.some(document => originalDocument.id === document.id));

    // Format "date" and "existing first mortgage" properties
    const offeringPayload = Object.assign({}, offering, {
      target_funding_date: dayjs(selectedDate).format("YYYY-MM-DD"),
      documents_to_delete: JSON.stringify(documentsToDelete),
      pictures_to_delete: JSON.stringify(picturesToDelete),
      existing_first_mortgage: existingMortgage
    });

    // Create a new FormData object with the form element
    const formData = getFormData(offeringPayload);

    // Append each added picture to the FormData object
    for (const pictureToAdd of picturesToAdd) {
      formData.append("pictures_to_add", pictureToAdd);
    }
    // Append each added document to the FormData object
    for (const documentToAdd of documentsToAdd) {
      formData.append("documents_to_add", documentToAdd);
    }

    // Send offering properties as form data together with pictures
    const headers = {
      "Content-Type": "multipart/form-data"
    };

    try {
      // Make a PUT request to create a new offering
      await axiosInstance.put(`/api/offerings/${offering.id}`, formData, {headers});

      // Navigate user back to offerings list
      router.push("/admin/offerings");
    } catch (error: any) {
      // Retrieve validation errors returned by API
      const validationErrors = error.response.data;
      // Set error message to display on the page
      setErrors(validationErrors);
      // Hide loading spinner
      setLoading(false);
    }
  }

  function removePicture(pictureIdx: number) {
    // Remove the selected picture from local array of pictures
    const updatedPictures = pictures.filter((picture, idx) => idx !== pictureIdx);

    // Update local state "pictures" property
    setPictures(updatedPictures);
  }

  function renderUploadedPictures() {
    return (
      <div className="grid grid-cols-12 gap-4 mt-4">
        {pictures.map((picture, idx) => {
          const src = picture.path || URL.createObjectURL(picture);
          return (
            <div key={idx} className="relative aspect-video col-span-6 sm:col-span-4 border border-gray-900/25 rounded">
              <Image src={src} alt={picture.name} className="object-cover" fill />
              <button type="button"
                      onClick={() => removePicture(idx)}
                      className="absolute top-[-10px] right-[-10px] text-red-500 bg-white rounded-full shadow">
                <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" aria-hidden="true"/>
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  function removeDocument(documentIdx: number) {
    // Remove the selected document from local array of documents
    const updatedDocuments = documents.filter((document, idx) => idx !== documentIdx);

    // Update local state "documents" property
    setDocuments(updatedDocuments);
  }

  function renderUploadedDocuments() {
    return (
      <div className="grid grid-cols-12 gap-4 mt-4">
        {documents.map((document, idx) => (
          <div key={idx} className="relative flex flex-col p-3 mb-auto col-span-6 sm:col-span-3 space-y-2 border-2 border-gray-200 rounded-lg">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-600" aria-hidden="true" />
            <p className="text-sm text-gray-700 text-center">{document.filename || document.name}</p>
            <button type="button"
                    onClick={() => removeDocument(idx)}
                    className="absolute top-[-20px] right-[-15px] text-red-500 bg-white rounded-full shadow">
              <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-600" aria-hidden="true"/>
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <AdminLayout title={`${offering.title} | Admin Dashboard`}>
      <form className="md:max-w-[1000px] mx-auto" onSubmit={handleSubmit}>
        <div className="space-y-10 divide-y divide-gray-900/10">

          {/* Deal Information Section */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Deal Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details and terms related to the investment opportunity or transactions.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 sm:grid-cols-6">
                  {/* Deal Title field */}
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                      Title
                    </label>
                    <div className="mt-2">
                      <div
                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={offering.title}
                          onChange={(e) => updateOfferingObject("title", e.target.value)}
                          className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Oceanview Beachfront Villa in Malibu, California"
                        />
                      </div>
                    </div>
                    <ValidationError errors={errors.title}/>
                  </div>

                  {/* Offering Type field */}
                  <div className="sm:col-span-4 sm:col-start-1">
                    <label htmlFor="offering_type" className="block text-sm font-medium leading-6 text-gray-900">
                      Offering Type
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="offering_type"
                        id="offering_type"
                        value={offering.offering_type}
                        onChange={(e) => updateOfferingObject("offering_type", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Residential Rental Propert"
                      />
                    </div>
                    <ValidationError errors={errors.offering_type}/>
                  </div>

                  {/* Target Funding Date field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="target_funding_date" className="block text-sm font-medium leading-6 text-gray-900">
                      Target Funding Date
                    </label>
                    <div id="datepicker" className="relative mt-2 rounded-md shadow-sm">
                      <Datepicker options={datePickerOptions} onChange={handleDateChange} show={show} setShow={handleClose}>
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                            <CalendarIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                          </div>
                        </div>
                        <input
                          type="text"
                          name="target_funding_date"
                          id="target_funding_date"
                          className="block w-full rounded-md border-0 py-1.5 pl-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                          value={dayjs(selectedDate).format("YYYY-MM-DD")}
                          onFocus={() => setShow(true)}
                          placeholder="YYYY-MM-DD"
                          readOnly
                        />
                      </Datepicker>
                    </div>
                    <ValidationError errors={errors.target_funding_date}/>
                  </div>

                  {/* Minimum Investment field */}
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="minimum_investment" className="block text-sm font-medium leading-6 text-gray-900">
                      Minimum Investment
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="minimum_investment"
                        id="minimum_investment"
                        value={offering.minimum_investment}
                        onChange={(e) => updateOfferingObject("minimum_investment", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="5,000.00"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="minimum_investment">
                          USD
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.minimum_investment}/>
                  </div>

                  {/* Total Capital Investment field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="total_capital_investment"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Total Capital Investment
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="total_capital_investment"
                        id="total_capital_investment"
                        value={offering.total_capital_investment}
                        onChange={(e) => updateOfferingObject("total_capital_investment", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="500,000.00"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="total_capital_investment">
                          USD
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.total_capital_investment}/>
                  </div>

                  {/* Monthly Payment to Investor field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="monthly_pmt_to_investor"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Monthly PMT to Investor
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="monthly_pmt_to_investor"
                        id="monthly_pmt_to_investor"
                        value={offering.monthly_pmt_to_investor}
                        onChange={(e) => updateOfferingObject("monthly_pmt_to_investor", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="2,500.00"
                        step="0.01"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="monthly_pmt_to_investor">
                          USD
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.monthly_pmt_to_investor}/>
                  </div>

                  {/* Investor Yield field */}
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="investor_yield" className="block text-sm font-medium leading-6 text-gray-900">
                      Investor Yield
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        name="investor_yield"
                        id="investor_yield"
                        value={offering.investor_yield}
                        onChange={(e) => updateOfferingObject("investor_yield", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="5.00"
                        step="0.01"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="investor_yield">
                          %
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.investor_yield}/>
                  </div>

                  {/* Gross Protective Equity field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="gross_protective_equity"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Gross Protective Equity
                    </label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="gross_protective_equity"
                        id="gross_protective_equity"
                        value={offering.gross_protective_equity}
                        onChange={(e) => updateOfferingObject("gross_protective_equity", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="500,000.00"
                        step="0.01"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="monthly_pmt_to_investor">
                          USD
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.gross_protective_equity}/>
                  </div>

                  {/* Exit Strategy field */}
                  <div className="col-span-full">
                    <label htmlFor="exit_strategy" className="block text-sm font-medium leading-6 text-gray-900">
                      Exit Strategy
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        id="exit_strategy"
                        name="exit_strategy"
                        value={offering.exit_strategy}
                        onChange={(e) => updateOfferingObject("exit_strategy", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Sale to a Property Developer in 5 Years"
                      />
                    </div>
                    <ValidationError errors={errors.exit_strategy}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 pt-6 sm:pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Property Details</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Input information about the real estate asset you are offering for investment.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 sm:grid-cols-6">

                  {/* Pictures drop zone */}
                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                      Pictures
                    </label>
                    <div
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="pictures"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a picture</span>
                            <input
                              id="pictures"
                              type="file"
                              className="sr-only"
                              onChange={onPictureChange}
                              accept="image/*"
                              multiple />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    <ValidationError errors={errors.pictures}/>

                    {/* Renders uploaded picture thumbnails */}
                    {renderUploadedPictures()}
                  </div>

                  {/* Documents drop zone */}
                  <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                      Documents
                    </label>
                    <div
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PaperClipIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="documents"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a document</span>
                            <input
                              id="documents"
                              type="file"
                              className="sr-only"
                              onChange={onDocumentChange}
                              accept=".pdf, .xlsx, .xls, .csv"
                              multiple />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PDF, XLS, XLSX up to 10MB</p>
                      </div>
                    </div>
                    <ValidationError errors={errors.documents}/>

                    {/* Renders uploaded picture thumbnails */}
                    {renderUploadedDocuments()}
                  </div>

                  {/* Property Address field */}
                  <div className="sm:col-span-6">
                    <label htmlFor="property_address" className="block text-sm font-medium leading-6 text-gray-900">
                      Property Address
                    </label>
                    <div className="mt-2">
                      <div
                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500">
                        <input
                          type="text"
                          name="property_address"
                          id="property_address"
                          value={offering.property_address}
                          onChange={(e) => updateOfferingObject("property_address", e.target.value)}
                          className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="123 Oceanfront Drive, Malibu, California, 90265"
                        />
                      </div>
                    </div>
                    <ValidationError errors={errors.property_address}/>
                  </div>

                  {/* Property Type field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="property_type" className="block text-sm font-medium leading-6 text-gray-900">
                      Property Type
                    </label>
                    <div className="mt-2 rounded-md shadow-sm">
                      <select
                        id="property_type"
                        name="property_type"
                        value={offering.property_type}
                        onChange={(e) => updateOfferingObject("property_type", e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                      >
                        {propertyTypeOptions.map((propertyType, idx) => (
                          <option key={idx}>{propertyType}</option>
                        ))}
                      </select>
                    </div>
                    <ValidationError errors={errors.property_type}/>
                  </div>

                  {/* Occupancy field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="occupancy" className="block text-sm font-medium leading-6 text-gray-900">
                      Occupancy
                    </label>
                    <div className="mt-2 rounded-md shadow-sm">
                      <select
                        id="occupancy"
                        name="occupancy"
                        value={offering.occupancy}
                        onChange={(e) => updateOfferingObject("occupancy", e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                      >
                        {occupancyOptions.map((occupancy, idx) => (
                          <option key={idx}>{occupancy}</option>
                        ))}
                      </select>
                    </div>
                    <ValidationError errors={errors.occupancy}/>
                  </div>

                  {/* Market Value field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="market_value"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Market Value
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="market_value"
                        id="market_value"
                        value={offering.market_value}
                        onChange={(e) => updateOfferingObject("market_value", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="500,000.00"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="market_value">
                          USD
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.market_value}/>
                  </div>

                  {/* APN field */}
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="apn" className="block text-sm font-medium leading-6 text-gray-900">
                      APN
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="apn"
                        id="apn"
                        value={offering.apn}
                        onChange={(e) => updateOfferingObject("apn", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="123-456-789"
                      />
                    </div>
                    <ValidationError errors={errors.apn}/>
                  </div>

                  {/* County field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="county" className="block text-sm font-medium leading-6 text-gray-900">
                      County
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="county"
                        id="county"
                        value={offering.county}
                        onChange={(e) => updateOfferingObject("county", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Los Angeles County"
                      />
                    </div>
                    <ValidationError errors={errors.county}/>
                  </div>

                  {/* Year Built field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="year_built"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Year Built
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        name="year_built"
                        id="year_built"
                        value={offering.year_built}
                        onChange={(e) => updateOfferingObject("year_built", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="2014"
                      />
                    </div>
                    <ValidationError errors={errors.year_built}/>
                  </div>

                  {/* Square Footage field */}
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="square_footage" className="block text-sm font-medium leading-6 text-gray-900">
                      Square Footage
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <ArrowsPointingOutIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                        </div>
                      </div>
                      <input
                        type="number"
                        name="square_footage"
                        id="square_footage"
                        value={offering.square_footage}
                        onChange={(e) => updateOfferingObject("square_footage", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-8 pr-14 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="2,500"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm" id="market_value">
                          Sqrt ft
                        </span>
                      </div>
                    </div>
                    <ValidationError errors={errors.square_footage}/>
                  </div>

                  {/* Lot Size field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="lot_size"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Lot Size
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <ArrowsPointingOutIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                        </div>
                      </div>
                      <input
                        type="number"
                        name="lot_size"
                        id="lot_size"
                        value={offering.lot_size}
                        onChange={(e) => updateOfferingObject("lot_size", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="0.25 acres"
                      />
                    </div>
                    <ValidationError errors={errors.lot_size}/>
                  </div>

                  {/* Bedrooms field */}
                  <div className="sm:col-span-1">
                    <label htmlFor="bedrooms"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Bedrooms
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <HomeIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                        </div>
                      </div>
                      <input
                        type="number"
                        name="bedrooms"
                        id="bedrooms"
                        value={offering.bedrooms}
                        onChange={(e) => updateOfferingObject("bedrooms", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="3"
                      />
                    </div>
                    <ValidationError errors={errors.bedrooms}/>
                  </div>

                  {/* Bathrooms field */}
                  <div className="sm:col-span-1">
                    <label htmlFor="bathrooms"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Bathrooms
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                          <HomeIcon className="h-4 w-4 text-gray-400" aria-hidden="true"/>
                        </div>
                      </div>
                      <input
                        type="number"
                        name="bathrooms"
                        id="bathrooms"
                        value={offering.bathrooms}
                        onChange={(e) => updateOfferingObject("bathrooms", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-8 pr-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="2"
                      />
                    </div>
                    <ValidationError errors={errors.bathrooms}/>
                  </div>

                  {/* Exterior field */}
                  <div className="col-span-full">
                    <label htmlFor="exterior" className="block text-sm font-medium leading-6 text-gray-900">
                      Exterior
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        id="exterior"
                        name="exterior"
                        value={offering.exterior}
                        onChange={(e) => updateOfferingObject("exterior", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Well-maintained brick facade, spacious backyard with a garden."
                      />
                    </div>
                    <ValidationError errors={errors.exterior}/>
                  </div>

                  {/* Zoning field */}
                  <div className="col-span-full">
                    <label htmlFor="zoning" className="block text-sm font-medium leading-6 text-gray-900">
                      Zoning
                    </label>
                    <div className="mt-2">
                      <textarea
                        rows={3}
                        id="zoning"
                        name="zoning"
                        value={offering.zoning}
                        onChange={(e) => updateOfferingObject("zoning", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="Residential R-1: single-family residential use only."
                      />
                    </div>
                    <ValidationError errors={errors.zoning}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Debt Stack Section */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 pt-6 sm:pt-10 md:grid-cols-3">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Debt Stack</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide investors with investment capital structure and details.
              </p>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 sm:grid-cols-6">

                  {/* Existing 1st Mortgage field */}
                  <div className="sm:col-span-3">
                    <label className="text-sm font-semibold text-gray-900">Existing First Mortgage</label>
                    <p className="text-sm text-gray-500 mt-1">Does the borrow already have a mortgage?</p>
                    <fieldset className="mt-2">
                      <legend className="sr-only">Notification method</legend>
                      <div className="flex items-center space-x-10">
                        {mortgageOptions.map((mortgageOption, idx: number) => (
                          <div key={idx} className="flex items-center">
                            <input
                              type="radio"
                              value={mortgageOption.value}
                              name="existing_first_mortgage"
                              id={`existing_first_mortgage_${mortgageOption.value}`}
                              onChange={(e) => setExistingMortgage(e.target.value)}
                              defaultChecked={mortgageOption.value === initOffering.existing_first_mortgage.toString()}
                              className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor={`existing_first_mortgage_${mortgageOption.value}`}
                                   className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                              {mortgageOption.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Borrower Credit Score field */}
                  <div className="sm:col-span-2 sm:col-start-5">
                    <label htmlFor="borrower_credit_score"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Borrower Credit Score
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="number"
                        name="borrower_credit_score"
                        id="borrower_credit_score"
                        value={offering.borrower_credit_score}
                        onChange={(e) => updateOfferingObject("borrower_credit_score", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="700"
                      />
                    </div>
                    <ValidationError errors={errors.borrower_credit_score}/>
                  </div>

                  {/* Loan Type field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="loan_type" className="block text-sm font-medium leading-6 text-gray-900">
                      Loan Type
                    </label>
                    <div className="mt-2 rounded-md shadow-sm">
                      <select
                        id="loan_type"
                        name="loan_type"
                        value={offering.loan_type}
                        onChange={(e) => updateOfferingObject("loan_type", e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                      >
                        {loanTypeOptions.map((loanType, idx) => (
                          <option key={idx}>{loanType}</option>
                        ))}
                      </select>
                    </div>
                    <ValidationError errors={errors.loan_type}/>
                  </div>

                  {/* Lien Position field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="lien_position" className="block text-sm font-medium leading-6 text-gray-900">
                      Lien Position
                    </label>
                    <div className="mt-2 rounded-md shadow-sm">
                      <select
                        id="lien_position"
                        name="lien_position"
                        value={offering.lien_position}
                        onChange={(e) => updateOfferingObject("lien_position", e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                      >
                        {lienPositionOptions.map((lienPosition, idx) => (
                          <option key={idx}>{lienPosition}</option>
                        ))}
                      </select>
                    </div>
                    <ValidationError errors={errors.lien_position}/>
                  </div>

                  {/* Payment Type field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="payment_type" className="block text-sm font-medium leading-6 text-gray-900">
                      Payment Type
                    </label>
                    <div className="mt-2 rounded-md shadow-sm">
                      <select
                        id="payment_type"
                        name="payment_type"
                        value={offering.payment_type}
                        onChange={(e) => updateOfferingObject("payment_type", e.target.value)}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                      >
                        {paymentTypeOptions.map((paymentType, idx) => (
                          <option key={idx}>{paymentType}</option>
                        ))}
                      </select>
                    </div>
                    <ValidationError errors={errors.payment_type}/>
                  </div>

                  {/* Loan Term field */}
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="loan_term" className="block text-sm font-medium leading-6 text-gray-900">
                      Loan Term
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="loan_term"
                        name="loan_term"
                        value={offering.loan_term}
                        onChange={(e) => updateOfferingObject("loan_term", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="10 years"
                      />
                    </div>
                    <ValidationError errors={errors.loan_term}/>
                  </div>

                  {/* Prepaid Interest field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="prepaid_interest"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Prepaid Interest
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="prepaid_interest"
                        name="prepaid_interest"
                        value={offering.prepaid_interest}
                        onChange={(e) => updateOfferingObject("prepaid_interest", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="6 months"
                      />
                    </div>
                    <ValidationError errors={errors.prepaid_interest}/>
                  </div>

                  {/* Guaranteed Interest field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="guaranteed_interest"
                           className="block text-sm font-medium leading-6 text-gray-900">
                      Guaranteed Interest
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <input
                        type="text"
                        id="guaranteed_interest"
                        name="guaranteed_interest"
                        value={offering.guaranteed_interest}
                        onChange={(e) => updateOfferingObject("guaranteed_interest", e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                        placeholder="6 months"
                      />
                    </div>
                    <ValidationError errors={errors.guaranteed_interest}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel and Submit buttons */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:gap-y-8 pt-6 sm:pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0"></div>
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 sm:col-start-2">
            <div className="flex items-center justify-end gap-x-8 p-4 sm:px-8">
              <a href="/admin/offerings" className="text-sm font-semibold leading-6 text-gray-900">
                Cancel
              </a>
              <button
                type="submit"
                disabled={loading}
                style={{width: 85, height: 36}}
                className="flex justify-center items-center bg-blue-500 px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {loading ? <Loading size="small"/> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
