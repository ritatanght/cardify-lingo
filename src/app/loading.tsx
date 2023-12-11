import { CgSpinner } from "react-icons/cg";
export default function Loading() {
  const randomColorNum = ["1", "2", "4"];
  const color = `text-color-${
    randomColorNum[Math.floor(Math.random() * randomColorNum.length)]
  }`;
  return (
    <div className={`text-6xl py-10 mt-4 ${color}`}>
      <CgSpinner className="animate-spin mx-auto" />
    </div>
  );
}
