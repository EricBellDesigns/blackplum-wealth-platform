interface InputObject {
  [key: string]: any;
}

export function getFormData(object: InputObject) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key] || ""));
  return formData;
}
