const insights = [
  "Fastest route selected – you'll be there in no time!",
  "Your driver knows the area like the back of their hand.",
  "Sit back and relax, the ride will be smooth.",
  "Quietest route picked – perfect for a nap.",
  "The local coffee shop near your dropoff has great reviews!",
  "High demand today, but we found you a nearby driver.",
  "This route avoids all the usual traffic hotspots.",
];

module.exports = function getRandomInsight() {
  return insights[Math.floor(Math.random() * insights.length)];
};