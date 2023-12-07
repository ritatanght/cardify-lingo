import { getSet } from "@/app/lib/api";
import SetContainer from "./SetContainer";
import { AxiosError, isAxiosError } from "axios";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  try {
    const setData = await getSet(params.id);
    return <SetContainer fullSetData={setData} />;
  } catch (err: any | AxiosError) {
    if (isAxiosError(err) && err.response?.status === 404) {
      notFound();
    } else {
      console.log(err);
    }
  }
}
