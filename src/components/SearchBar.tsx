import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SearchBar({ closeMenu }: { closeMenu: () => void }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [queryString, setQueryString] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryString) return toast.info("Please enter keyword for search");

    setQueryString("");
    closeMenu();
    const params = new URLSearchParams(searchParams);
    params.set("query", queryString);
    return replace(`/search?${params.toString()}`);
  };

  // pressing enter when focusing on the input field will submit the keyword for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <form className="m-0 md:mx-auto flex">
      <input
        name="query"
        placeholder="Search"
        aria-label="Search"
        className="p-2 rounded-l-md"
        value={queryString}
        onChange={(e) => setQueryString(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="btn rounded-l-none rounded-r-md px-3 text-lg"
        onClick={handleSearch}
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </form>
  );
}
