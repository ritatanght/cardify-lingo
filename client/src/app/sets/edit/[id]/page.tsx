import { getAllLanguages, getSet } from "@/app/lib/api";
import { AxiosError, isAxiosError } from "axios";
import SetForm from "@/app/ui/components/SetForm";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  try {
    const [categories, setData] = await Promise.all([
      getAllLanguages(),
      getSet(params.id),
    ]);

    return <SetForm mode="edit" categories={categories} setData={setData} />;
  } catch (err: any | AxiosError) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    } else {
      console.log(err);
    }
  }
};

export default Page;
