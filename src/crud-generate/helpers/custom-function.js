export const thousandSeparator = (nominal, prefix = "") => {
  if (typeof nominal !== "string") {
    nominal = nominal.toString();
  }

  if (!/^\d+$/g.test(nominal)) {
    return nominal;
  }

  let i = 0;
  let initialLengthStr = -3;
  let nominalArr = nominal.split("");
  while (i < Math.floor(nominal.length / 3)) {
    let lengthStr = initialLengthStr - i;
    if (Math.sign(lengthStr) * lengthStr < nominalArr.length) {
      nominalArr.splice(lengthStr, 0, ",");
      initialLengthStr -= 3;
    }
    i++;
  }
  return `${prefix}${nominalArr.join("")}`;
};
