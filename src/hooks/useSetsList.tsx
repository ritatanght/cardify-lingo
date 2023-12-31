import { useState } from "react";
import { useUser } from "@/context/UserProvider";
import { toast } from "react-toastify";
import { deleteSetById } from "../lib/services";
import { Set } from "../types/definitions";

const useSetsList = (initialSet: Set[] = []) => {
  const [sets, setSets] = useState<Set[] | []>(initialSet);
  const { removeFromFavList } = useUser();

  const deleteSet = (setId: number) => {
    deleteSetById(setId)
      .then((res) => {
        if (res.status === 200) {
          const updatedSets = sets.filter((set) => set.id !== setId);
          setSets(updatedSets);
          removeFromFavList(setId);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.info(err.response.data.message);
        } else {
          console.error("Error deleting the set: ", err);
        }
      });
  };

  return { sets, setSets, deleteSet };
};

export default useSetsList;
