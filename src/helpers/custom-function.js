/* not used just created */
export const findExistingData = (objName, value, data) => {
  let left = 0;
  let right = data.length - 1;
  let index = 0;

  while (left < right) {
    if (data[left][objName] === value) {
      index = left;
    }

    if (data[right][objName] === value) {
      index = right;
    }

    left++;
    right--;
  }

  let newData = [...data];
  newData.splice(index, 1);

  return { index, data: newData };
};
