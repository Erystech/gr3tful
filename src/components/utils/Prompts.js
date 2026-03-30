const PROMPTS = [
  "Something that made you smile today…",
  "A person who showed up for you…",
  "A small moment you almost missed…",
  "Something your body did for you today…",
  "A sound, smell, or taste you loved…",
  "Something that surprised you…",
];

export function getRandomPrompt(exclude = "") {
  const options = PROMPTS.filter((p) => p !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

export default PROMPTS;
