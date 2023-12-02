"use client";
import { useState, useEffect } from "react";
import useSetsList from "@/app/hooks/useSetsList";
// import Spinner from "react-bootstrap/Spinner";
import { getCategoryById } from "@/app/lib/api";
import { Category, Set } from "@/app/lib/definitions";
import SetItem from "../../ui/components/SetItem";
import Loading from "@/app/loading";

type categoryData = {
  category: Category["name"];
  sets: Set[];
};

const user = { id: 1, username: "john_doe" };

export default function Page({ params }: { params: { slug: string } }) {
  // const { user } = useUser();
  const { sets, setSets, deleteSet } = useSetsList();
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategoryById(params.slug)
      .then((data: categoryData) => {
        setCategory(data.category);
        setSets(data.sets);
      })
      .catch((err) => {
        //toast.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [params.slug, setSets]);

  if (isLoading) {
    return (
      <Loading />
      // <      <Spinner animation="border" variant="primary" role="status">
      //         <span className="visually-hidden">Loading...</span>
      //       </Spinner>>
    );
  }

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
        onDelete={() => deleteSet(set.id)}
      />
    ));

  return (
    <main className="Category-container">
      {category ? (
        <h1 className="text-3xl md:text-4xl mb-7">
          Category: <span className="text-color-5">{category}</span>
        </h1>
      ) : (
        <h1 className="text-center">Category Not Found</h1>
      )}
      {displaySet.length === 0 ? (
        <h2>There are currently no sets in this category.</h2>
      ) : (
        <section>{setsElements}</section>
      )}
    </main>
  );
}
