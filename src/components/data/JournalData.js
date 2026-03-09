// ── Mock Data ─────────────────────────────────────────────────────────────
const TAGS = ["Family","Health","Work","Nature","Friends","Growth","Joy","Rest"];
const TAG_EMOJIS = { Family:"👨‍👩‍👧",Health:"🌿",Work:"💼",Nature:"🌤️",Friends:"🤝",Growth:"🌱",Joy:"✨",Rest:"🌙" };

const RAW_ENTRIES = [
  { date:"2026-03-07", entries:["Morning light coming through the curtains","My sister calling just to check in","A cup of tea that was perfectly brewed"], tags:["Family","Rest"] },
  { date:"2026-03-06", entries:["Finished a project I'd been putting off","The smell of rain on dry pavement","My body carrying me through a long walk"], tags:["Work","Nature"] },
  { date:"2026-03-05", entries:["A stranger holding the door open","Leftover pasta that tasted better the next day","Eight full hours of sleep"], tags:["Rest","Joy"] },
  { date:"2026-03-04", entries:["My friend's laugh over a voice note","Finally understanding a concept I'd been stuck on","Sunlight lasting a little longer each day"], tags:["Friends","Growth"] },
  { date:"2026-03-03", entries:["A playlist that matched my exact mood","The quiet of early morning before the world woke up","Fresh flowers on my desk"], tags:["Joy","Nature"] },
  { date:"2026-03-02", entries:["A long walk with no destination","My body fighting off a cold without medicine","Honest feedback that actually helped me grow"], tags:["Health","Growth"] },
  { date:"2026-03-01", entries:["Homemade food that reminded me of childhood","A colleague who covered for me without being asked","Getting lost in a book for two hours"], tags:["Family","Friends"] },
  { date:"2026-02-28", entries:["The first warm day of the year","A work win that felt genuinely earned","Waking up without an alarm"], tags:["Nature","Work","Rest"] },
  { date:"2026-02-27", entries:["My nephew's voice on a video call","A meditation session that actually quieted my mind","Clean sheets"], tags:["Family","Health"] },
  { date:"2026-02-26", entries:["A brilliant documentary that shifted my perspective","Unexpected free time in the afternoon","My plants finally growing"], tags:["Growth","Nature"] },
  { date:"2026-02-25", entries:["My best friend flying in for a surprise visit","A meal we cooked together","Laughing until we cried"], tags:["Friends","Joy"] },
  { date:"2026-02-24", entries:["A compliment from someone I respect","Finishing a hard workout","The view from the top of the hill"], tags:["Health","Growth"] },
  { date:"2026-02-22", entries:["A slow Sunday with nowhere to be","Good coffee, good book, good light","Feeling genuinely content"], tags:["Rest","Joy"] },
  { date:"2026-02-20", entries:["My team pulling together on a tight deadline","A phone call with Mum that lasted two hours","Realising how far I've come"], tags:["Work","Family","Growth"] },
  { date:"2026-02-18", entries:["Snow on the rooftops in the morning","Hot chocolate with a friend","A really good night's sleep"], tags:["Nature","Friends","Rest"] },
];

export { TAGS, TAG_EMOJIS, RAW_ENTRIES }