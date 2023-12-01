"use client";
import { useState, useEffect } from "react"; 
// import useSetsList from "../hooks/useSetsList";
// import { useUser } from "../context/UserProvider";// import { toast } from "react-toastify";
// import Spinner from "react-bootstrap/Spinner";
import "./Category.scss";
import { getCategoryById } from "@/app/lib/api";
import { Category, Set } from "@/app/lib/definitions";
import SetItem from "../../ui/components/SetItem";

type categoryData = {
  category: Category["name"];
  sets: Set[];
};

const user = { id: 1, username: "john_doe" };

export default function Page({ params }: { params: { slug: string } }) {
  // const { user } = useUser();
  // const { sets, setSets, deleteSet } = useSetsList();
  const [sets, setSets] = useState<Set[] | []>([]);
  const [category, setCategory] = useState("");
  //const [isLoading, setIsLoading] = useState(true);
console.log(category)
  useEffect(() => {
    getCategoryById(Number(params.slug))
      .then((data: categoryData) => {
        setCategory(data.category);
        setSets(data.sets);
      })
      .catch((err) => {
        //toast.error(err);
      });
    //.finally(() => setIsLoading(false));
  }, [params.slug]);

  // if (isLoading) {
  //   return (
  //     <Spinner animation="border" variant="primary" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </Spinner>
  //   );
  // }

  if (!category)
    return (
      <main>
        <h1 className="text-center">Category Not Found</h1>
      </main>
    );

  // If a set is marked private, it will only show up in the search if the current user is the set owner
  const displaySet = sets.filter((set) => {
    if (set.private) {
      if (user && user.id === set.user_id) return set;
    } else {
      return set;
    }
  });

  const setsElements =
    Array.isArray(displaySet) &&
    displaySet.map((set) => (
      <SetItem
        key={set.id}
        set={set}
        setOwner={set.username}
        //onDelete={() => deleteSet(set.id)}
      />
    ));

  return (
    <main className="Category-container">
      <h1>
        Category: <span>{category}</span>
      </h1>
      {displaySet.length === 0 ? (
        <h2>There are currently no sets in this category.</h2>
      ) : (
        <section>{setsElements}</section>
      )}
    </main>
  );
}
