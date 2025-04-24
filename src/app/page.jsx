import { Home } from "@/components/Home";
import { getHomePageData } from "@/services";


export async function generateMetadata() {
  try {
    const data = {
      title: "Eijent"
    };
    return data;
  } catch (error) {
    logError("Error in metadata(home page):", error);
  }
}

export default async function Page() {
  const data = await getHomePageData();
  return (
    <Home data={data} />
  );
}
