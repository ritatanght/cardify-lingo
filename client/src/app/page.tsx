import Image from "next/image";
import Link from "next/link";
import { playpen } from "./ui/fonts";
import "./ui/Home.scss";

export default function Home() {
  return (
    <>
      <div className="banner-container flex justify-center items-center text-center rounded-none mb-6 md:rounded-md bg-[url('/Background_img.png')] bg-cover bg-center bg-no-repeat min-h-[min(500px,50vh)]">
        <div className="banner__content text-color-3">
          <h2
            className={`${playpen.className} text-4xl font-bold leading-snug mb-[0.8em]`}
          >
            Get Started with <br />
            Your Flashcard Set
          </h2>
          <Link href="/sets/create" className="btn p-[0.8em]">
            Create My Set
          </Link>
        </div>
      </div>
      <div className="columns-container text-center flex flex-col gap-6 md:gap-4 md:flex-row justify-between w-11/12 mt-6 mb-4 mx-auto">
        <div className="column basis-2/6 rounded-md p-4">
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Create Your Own Flashcards Sets
          </h3>
          <p>
            Create personalized flashcard sets for your unique learning needs.
            Whether it&apos;s for language learning, test preparation, or any
            other subject, start creating your sets in just a few simple steps.
          </p>
        </div>
        <div className="column basis-2/6 rounded-md p-4">
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Elevate Your Learning Journey
          </h3>
          <p>
            Discover the power of text-to-speech technology for a more engaging
            and immersive learning experience. Let your flashcards come to life
            with audio assistance.
          </p>
        </div>
        <div className="column basis-2/6 rounded-md p-4">
          <h3 className={`${playpen.className} text-2xl font-bold mb-2`}>
            Explore and Learn from Others
          </h3>
          <p>
            Dive into a world of knowledge with flashcard sets crafted by our
            community of avid learners. Browse and study from a wide range of
            topics.
          </p>
        </div>
      </div>
    </>
  );
}
