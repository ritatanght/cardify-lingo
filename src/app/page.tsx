import Link from "next/link";
import { playpen } from "@/lib/fonts";
import { TbCards } from "react-icons/tb";
import { RiSpeakLine, RiCommunityLine } from "react-icons/ri";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-color-overlay relative flex justify-center items-center text-center rounded-none mb-6 md:rounded-md min-h-[min(500px,50vh)]">
        <Image
          src="/banner_img.png"
          priority={true}
          fill={true}
          alt=""
          className="mix-blend-overlay object-cover"
        />
        <div className="text-color-3 z-10 px-2 py-6 -mt-2">
          <h2
            className={`${playpen.className} text-4xl font-bold leading-tight mb-5 md:mb-16`}
          >
            Get Started <br />
            with Your Set
          </h2>
          <Link href="/sets/create" className="btn p-[0.8em]">
            Create My Set
          </Link>
        </div>
      </div>
      <div className="text-center flex flex-col gap-6 md:gap-4 md:flex-row justify-between w-11/12 mt-6 mb-4 mx-auto">
        <div className="basis-2/6 rounded-md p-4 bg-color-1/60">
          <TbCards
            aria-hidden="true"
            className="text-6xl drop-shadow inline text-gray-50"
          />
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Create Custom Flashcard Sets
          </h3>
          <p className="text-gray-600">
            Craft your personalized flashcard sets effortlessly. Integrate
            images into your cards, enhancing your learning experience with
            visual aids.
          </p>
        </div>
        <div className="basis-2/6 rounded-md p-4 bg-color-4/70">
          <RiSpeakLine
            aria-hidden="true"
            className="text-6xl drop-shadow inline text-gray-50"
          />{" "}
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Interactive Learning Experience
          </h3>
          <p className="text-gray-600">
            Explore quiz features that include image-based learning, voice
            recognition, and text-to-speech capabilities for a comprehensive
            learning experience.
          </p>
        </div>
        <div className="basis-2/6 rounded-md p-4 bg-color-2/80">
          <RiCommunityLine
            aria-hidden="true"
            className="text-6xl drop-shadow inline text-gray-50"
          />
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Explore and Learn from Others
          </h3>
          <p className="text-gray-600">
            Explore and learn from an array of language sets curated by
            passionate learners. Contribute, collaborate, and elevate your
            language skills together.
          </p>
        </div>
      </div>
    </>
  );
}
