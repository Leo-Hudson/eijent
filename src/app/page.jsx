import { Home } from "@/components/Home";
import { fetchHomePageData } from "@/services";


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
  const data = await fetchHomePageData();
  return (
    <Home data={data} />
  );
}
