import { getAllLanguages } from "@/db/queries/languages";
import SetForm from "@/components/create-edit-set/SetForm";
const Page = async () => {
  const languages = await getAllLanguages();

  return <SetForm mode="create" languages={languages} />;
};

export default Page;
