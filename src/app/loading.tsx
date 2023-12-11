import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
export default function Loading() {
  const randomColorNum = ["1", "2", "4"];
  const color = `text-color-${
    randomColorNum[Math.floor(Math.random() * randomColorNum.length)]
  }`;
  return (
    <main className={`text-center text-5xl py-10 ${color}`}>
      <FontAwesomeIcon icon={faSpinner} spinPulse />
    </main>
  );
}
