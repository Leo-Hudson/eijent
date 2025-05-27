import { Home } from "@/components/Home";
import { fetchHomePageData, fetchPageMetaData } from "@/services";
import { logError } from "@/utils";

export async function generateMetadata() {
  try {
    const data = await fetchPageMetaData("/");
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

export default async function Page() {
  const data = await fetchHomePageData();
  return (
    <Home data={data} />
  );
}
