import Image from "next/image";
import Link from "next/link";
import { playpen } from "./ui/fonts";
import "./ui/Home.scss";

export default function Home() {
  return (
    <div className="home-container">
      <div className="banner-container">
        <div className="banner__content">
          <h2 className={`${playpen.className} text-4xl`}>
            Get Started with <br />
            Your Flashcard Set
          </h2>
          <Link href="/sets/create">Create My Set</Link>
        </div>
      </div>
      <div className="columns-container">
        <div className="column">
          <h3 className={`${playpen.className} text-2xl`}>
            Create Your Own Flashcards Sets
          </h3>
          <p>
            Create personalized flashcard sets for your unique learning needs.
            Whether it&apos;s for language learning, test preparation, or any
            other subject, start creating your sets in just a few simple steps.
          </p>
        </div>
        <div className="column">
          <h3 className={`${playpen.className} text-2xl`}>
            Elevate Your Learning Journey
          </h3>
          <p>
            Discover the power of text-to-speech technology for a more engaging
            and immersive learning experience. Let your flashcards come to life
            with audio assistance.
          </p>
        </div>
        <div className="column">
          <h3 className={`${playpen.className} text-2xl`}>
            Explore and Learn from Others
          </h3>
          <p>
            Dive into a world of knowledge with flashcard sets crafted by our
            community of avid learners. Browse and study from a wide range of
            topics.
          </p>
        </div>
      </div>
    </div>
  );
}
