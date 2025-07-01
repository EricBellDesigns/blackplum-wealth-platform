import imageCompression from "browser-image-compression";

const defaultOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1800,
  useWebWorker: true
};

export function compressFile(imageFile: File, options = defaultOptions) {
  return imageCompression(imageFile, options);
}

export function formatFileSize(file_size: number): string {
  if (!file_size || file_size == 0) {
    return null;
  }

  // If the file size is less than 1 KB, display it in bytes
  if (file_size < 1024) {
    return `${file_size} B`;
  } else if (file_size < 1024 * 1024) {
    // If the file size is less than 1 MB, convert to KB with two decimal places
    const sizeInKB = (file_size / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  } else if (file_size < 1024 * 1024 * 1024) {
    // If the file size is less than 1 GB, convert to MB with two decimal places
    const sizeInMB = (file_size / (1024 * 1024)).toFixed(2);
    return `${sizeInMB} MB`;
  } else {
    // If the file size is 1 GB or more, convert to GB with two decimal places
    const sizeInGB = (file_size / (1024 * 1024 * 1024)).toFixed(2);
    return `${sizeInGB} GB`;
  }
}
