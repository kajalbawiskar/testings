import Typo from "typo-js";

let dictionary = null;

// Load the dictionary only once
const loadDictionary = async () => {
  try {
    const affResponse = await fetch("/dictionaries/en_US/en_US.aff");
    const dicResponse = await fetch("/dictionaries/en_US/en_US.dic");

    if (!affResponse.ok || !dicResponse.ok) {
      throw new Error("Failed to load dictionary files.");
    }

    const affData = await affResponse.text();
    const dicData = await dicResponse.text();

    dictionary = new Typo("en_US", affData, dicData);
  } catch (error) {
    console.error("Error loading dictionary:", error);
  }
};
loadDictionary();

const autoCorrectPrompt = async (prompt) => {
  if (!dictionary) {
    console.warn("Dictionary not loaded yet. Returning original prompt.");
    return prompt;
  }

  return prompt
    .split(" ")
    .map((word) => (dictionary.check(word) ? word : dictionary.suggest(word)?.[0] || word))
    .join(" ");
};

export default autoCorrectPrompt;
