export const generateImageURL = ({
  wix_url,
  original = false,
  fit = "fill",
  q = "90",
  h = "1080",
  w = "1920",
}) => {
  if (!wix_url) return "";

  const cleanUrl = wix_url.split("#")[0];

  if (!cleanUrl.startsWith("wix:image://v1/") && !cleanUrl.startsWith("wix:vector://v1/")) {
    return wix_url;
  }

  const isImage = cleanUrl.startsWith("wix:image://v1/");

  const baseURL = isImage
    ? "https://static.wixstatic.com/media/"
    : "https://static.wixstatic.com/shapes/";

  const resourceId = cleanUrl
    .replace(isImage ? "wix:image://v1/" : "wix:vector://v1/", "")
    .split("/")[0]
    .replace("#", "");

  return original
    ? baseURL + resourceId
    : `${baseURL}${resourceId}/v1/${fit}/w_${w},h_${h},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
};

export const generateImageURLAlternate = ({
  wix_url,
  original = false,
  fit = "fill",
  q = "90",
  h = "1080",
  w = "1920",
}) => {
  if (!wix_url) return "";
  if (!wix_url.startsWith("wix:image://v1/")) return wix_url;

  const baseURL = "https://static.wixstatic.com/media/";
  const urlParts = wix_url.split('/');
  const imageId = urlParts[urlParts.length - 1].split('?')[0];

  return original
    ? baseURL + imageId
    : `${baseURL}${imageId}/v1/${fit}/w_${w},h_${h},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
};

export const formatProductImageURL = (url) => {
  if (!url) return "";

  const [beforeHash, afterHash] = url.split("#");
  const hashPart = afterHash ? `#${afterHash}` : "";

  if (!beforeHash.includes("v1/")) {
    return url;
  }

  const [protocol, path] = beforeHash.split("v1/");

  if (!path) return url;

  const parts = path.split("/");
  const idPart = parts[0].split("~")[0];
  const extension = path.split(".").pop();

  return `${protocol}v1/https:/${idPart}~mv2.${extension}${hashPart}`;
};

export const generateVideoURL = (videoSRC) => {
  
  if (videoSRC && videoSRC.startsWith("wix:video://v1/")) {
    const videoID = videoSRC.replace('wix:video://v1/', '').split('/')[0];
    return `https://video.wixstatic.com/video/${videoID}/file`;
  } else {
    return videoSRC;
  }
}

export const generateSVGURL = (wix_url) => {

  if (!wix_url.startsWith("wix:vector://v1/")) {
    return wix_url
  }
  let wixImageURL = "";
  wixImageURL = "https://static.wixstatic.com/shapes/";
  let splitUrl = wix_url.split("/")
  return wixImageURL + splitUrl[splitUrl.length - 2];

}