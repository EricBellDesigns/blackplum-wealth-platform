import React from "react";

interface LoadingProps {
  size?: "small" | "medium";
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Loading({size = "medium"}: LoadingProps) {
  return (
    <div
      className={classNames(
        size === "small" ? "h-5 w-5" : "h-6 w-6",
        "inline-block animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      )}
      role="status">
    </div>
  );
}
