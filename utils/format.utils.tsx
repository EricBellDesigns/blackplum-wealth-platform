import dayjs from "dayjs";

type FormatProp = "currency" | "percentage" | "decimal" | "iso-date" | "date";

export function _(value: any, format?: FormatProp) {
  // Check if the value is not empty
  if (!value) {
    return (
      <span className="text-gray-300">——</span>
    );
  } else {
    switch (format) {
      case "currency":
        return "$" + parseFloat(value).toLocaleString("en-US", {minimumFractionDigits: 2});
      case "percentage":
        return parseFloat(value).toLocaleString("en-US", {minimumFractionDigits: 2}) + "%";
      case "decimal":
        return parseFloat(value).toLocaleString("en-US", {minimumFractionDigits: 2});
      case "iso-date":
        return dayjs(value).format("YYYY-MM-DD");
      case "date":
        return dayjs(value).format("MMMM D, YYYY");
      default:
        return value;
    }
  }
}
