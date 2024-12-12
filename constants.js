const HAPPY_WIN_RATE = 0.6;
const SAD_WIN_RATE = 0.4;

const getDateAfter = (year, month, day) => {
  const date = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}T23:59:59.999Z`
  );

  return { $gt: date };
};

module.exports = { HAPPY_WIN_RATE, SAD_WIN_RATE, getDateAfter };
