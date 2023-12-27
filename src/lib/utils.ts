import { Card, CardFormData } from "../types/definitions";
import { deleteImage, uploadImage } from "./services";

/**
 *
 * @returns a promise for whether synthesis voices are available
 */
export const waitForVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    const voicesChanged = () => {
      window.speechSynthesis.onvoiceschanged = null; // Remove the listener after it fires
      resolve(window.speechSynthesis.getVoices());
    };

    // Check if voices are already available
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve(window.speechSynthesis.getVoices());
    } else {
      window.speechSynthesis.onvoiceschanged = voicesChanged;
    }
  });
};

/**
 * Takes in an array of cards and shuffle its order and return the newly sorted array
 * @param array Card[]
 * @returns array Card[]
 */
export const shuffleCards = (array: Card[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

/**
 * Takes in an array of cards and prep it before sending to backend
 * remove the image property and add or renew the image_url if any changes have been made
 * @param cardsArray
 * @returns
 */
export const addImageUrlToCards = async (cardsArray: CardFormData[]) => {
  const updatedCards = await Promise.all(
    cardsArray.map(async (card) => {
      let url = null;
      // when there is a newly uploaded file, it is stored in card.image
      if (card.image) {
        url = await uploadImage(card.image);
      }
      const { image, ...rest } = card;
      return { ...rest, image_url: url || card.image_url };
    })
  );
  return updatedCards;
};

/**
 * clean up the unused images stored in vercel blob
 * @param urlArray
 */
export const deleteImageUrls = async (urlArray: string[]) => {
  // loop through the array and delete the images by url
  if (urlArray.length > 0) {
    Promise.all(urlArray.map(async (url: string) => await deleteImage(url)));
  }
};

/**
 * Return a new array of cards, removing card id that has type string (ie. a temp id 'card-1')
 * @param cardsArray :CardFormData[]
 * @returns cardArray :CardFormData[]
 */
export const cleanUpCards = (cardsArray: CardFormData[]) => {
  return cardsArray.map((card) => {
    const newCard = { ...card };
    if (typeof newCard.id === "string") {
      delete newCard.id;
    }
    return newCard;
  });
};
