const PROMPTS = [
  "Something that made you smile today…",
  "A person who showed up for you…",
  "A small moment you almost missed…",
  "Something your body did for you today…",
  "A sound, smell, or taste you loved…",
  "Something that surprised you…",
  "Something someone did that made you happy",
  "A kind thing someone did for you today",
  "A drink/ snack/ food you absolutely love and got to eat or drink today ",
  "A person that just gets you ",
  "A song you enjoy listening to ",
  "A gift that makes you remember someone ",
  "Something you bought that you like ",
  "A goal you realized you’ve met",
  "Something new that happened to you",
  "A random thought that made you smile",
];

export function getRandomPrompt(exclude = "") {
  const options = PROMPTS.filter((p) => p !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

export default PROMPTS;
