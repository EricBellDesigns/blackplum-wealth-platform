import React, {FC} from "react";

interface ErrorObject {
  message: string;
}

interface ValidationErrorProps {
  className?: string;
  errors?: ErrorObject[];
}

const ValidationError: FC<ValidationErrorProps> = ({
  className,
  errors
}: ValidationErrorProps) => {
  if (errors && errors.length > 0) {
    return (
      <div className={"mt-1.5 flex flex-wrap gap-2 " + className}>
        {errors.map((error, idx) => (
          <span key={idx} className="text-sm text-red-600 font-medium">
            {error.message}
          </span>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export default ValidationError;
