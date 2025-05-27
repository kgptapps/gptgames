/**
 * Card themes for Memory Match Game
 * Organized by categories for better theme selection
 */

export const cardThemes = {
  animals: {
    name: "Animals",
    cards: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
    ],
  },
  fruits: {
    name: "Fruits",
    cards: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🥭",
    ],
  },
  vehicles: {
    name: "Vehicles",
    cards: [
      "🚗",
      "🚕",
      "🚙",
      "🚌",
      "🚎",
      "🏎️",
      "🚓",
      "🚑",
      "🚒",
      "🚚",
      "🚛",
      "✈️",
    ],
  },
  sports: {
    name: "Sports",
    cards: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
    ],
  },
  faces: {
    name: "Faces",
    cards: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
    ],
  },
};

/**
 * Get a subset of cards for a specific difficulty
 * @param {string} themeKey - The theme key
 * @param {string} difficulty - Difficulty level
 * @returns {Array} Array of cards for the given theme and difficulty
 */
export function getThemeCards(themeKey = "animals", difficulty = "medium") {
  const theme = cardThemes[themeKey] || cardThemes.animals;
  const cards = theme.cards;

  // Return different number of cards based on difficulty
  switch (difficulty) {
    case "easy":
      return cards.slice(0, 6);
    case "medium":
      return cards.slice(0, 8);
    case "hard":
      return cards.slice(0, 12);
    default:
      return cards.slice(0, 8);
  }
}

export default cardThemes;
