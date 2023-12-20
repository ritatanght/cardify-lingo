import { Card, CardFormData } from "../types/definitions";
import { deleteImage, uploadImage } from "./services";

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
