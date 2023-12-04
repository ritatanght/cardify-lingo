import "../../Create-Edit-Set.scss";import { getAllCategories, getSet } from "@/app/lib/api";
import { Category, FullSet } from "@/app/lib/definitions";
import SetForm from "@/app/ui/components/SetForm";

const Page = async ({ params }: { params: { id: string } }) => {
  const categories: Category[] = await getAllCategories();
  const setData: FullSet = await getSet(params.id);

  return <SetForm mode="edit" categories={categories} setData={setData} />;
};

export default Page;