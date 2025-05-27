import { ContainerLoader } from "@/components/ContainerLoader";
import { CustomLink } from "@/components/CustomLink";
import { fetchErrorPageContent, fetchPageMetaData } from "@/services";
import { logError } from "@/utils";
import { generateSVGURL } from "@/utils/generateImageURL";

export async function generateMetadata() {
  try {
    const data = await fetchPageMetaData("error");
    const metadata = {
      title: data?.title,
      description: data?.description,
      creator: data?.creator,
      authors: data?.authors,
      openGraph: data?.openGraph
    };

    if (process.env.ENVIRONMENT === "PRODUCTION" && data.noFollowTag) {
      metadata.robots = "noindex,nofollow";
    }

    return metadata;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}

export default async function NotFound() {
  const data = await fetchErrorPageContent();

  const { title, logo, buttonLabel, buttonAction } = data;
  const logoUrl = generateSVGURL(logo);

  return (
    <section className="section-error">
      <ContainerLoader />

      <div className="container-img">
        <img src={logoUrl} className="media  " />
      </div>
      <h3 className="fs--36 fw-700 white-1 mt-lg-30 mt-mobile-20">{title}</h3>
      <CustomLink to={buttonAction} className="btn-1 mt-lg-40 mt-mobile-30">
        <span>{buttonLabel}</span>
      </CustomLink>
    </section>
  );
}