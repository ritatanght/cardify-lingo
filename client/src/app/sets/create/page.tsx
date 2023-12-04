import { getAllCategories } from "@/app/lib/api";
import SetForm from "@/app/ui/components/SetForm";

const Page = async () => {
  const categories = await getAllCategories();

  return <SetForm mode="create" categories={categories} />;
};

export default Page;
