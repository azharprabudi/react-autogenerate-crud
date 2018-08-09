export const thousandSeparator = (nominal, prefix = "") => {
  if (typeof nominal !== "string") {
    nominal = nominal.toString();
  }

  let i = 0;
  let initialLengthStr = -3;
  let nominalArr = nominal.split("");
  while (i < Math.floor(nominal.length / 3)) {
    let lengthStr = initialLengthStr - i;
    if (Math.sign(lengthStr) * lengthStr < nominalArr.length) {
      nominalArr.splice(nominalArr.length + lengthStr, 0, ",");
      initialLengthStr -= 3;
    }
    i++;
  }
  return `${prefix}${nominalArr.join("")}`;
};
