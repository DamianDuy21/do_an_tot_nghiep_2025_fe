export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const deepTrimObj = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  const trimmed = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      trimmed[key] = value.trim();
    } else if (typeof value === "object" && value !== null) {
      trimmed[key] = deepTrimObj(value);
    } else {
      trimmed[key] = value;
    }
  }

  return trimmed;
};

export const formatFileSize = (bytes) => {
  if (typeof bytes !== "number" || isNaN(bytes)) return "0 B";

  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getFileExtension = (fileName) => {
  if (!fileName) return "";
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const copyToClipboard = (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getLocalImageAsFile = async (fileName) => {
  // Đường dẫn file ảnh (giả sử để trong thư mục public/images/avatar)
  const response = await fetch(`/images/avatar/${fileName}`);
  const blob = await response.blob();

  // Lấy MIME type từ blob
  const fileType = blob.type || "image/png";

  // Tạo File object (giống như khi input chọn file)
  const file = new File([blob], fileName, { type: fileType });
  return file;
};

export const getProfilePicUrl = (profilePic) => {
  if (!profilePic) return null;

  if (typeof profilePic === "string") return profilePic;

  if (profilePic.url) return profilePic.url;

  if (profilePic instanceof File || profilePic instanceof Blob) {
    return URL.createObjectURL(profilePic);
  }

  return null;
};
