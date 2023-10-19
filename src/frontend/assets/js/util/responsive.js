/**
 * 브라우저 크기에 따라 보여지는 보드 개수 조절
 * @param {number} browserWidth
 * @param {number} browserHeight
 * @param {number} itemsPerPage
 * @returns {number}
 */
export function setItemsPerPage(browserWidth, browserHeight, itemsPerPage) {
  if (browserWidth < 1835) {
    itemsPerPage = 3;
  } else if (browserWidth < 2850) {
    itemsPerPage = 6;
  } else if (browserWidth < 3150) {
    itemsPerPage = 9;
  } else {
    itemsPerPage = 12;
  }

  if (browserHeight < 935) {
    if (browserWidth < 1835) {
      itemsPerPage = 1;
    } else if (browserWidth < 2850) {
      itemsPerPage = 2;
    } else if (browserWidth < 3150) {
      itemsPerPage = 3;
    } else {
      itemsPerPage = 4;
    }
  } else if (browserHeight < 1310) {
    if (browserWidth < 1835) {
      itemsPerPage = 2;
    } else if (browserWidth < 2850) {
      itemsPerPage = 4;
    } else if (browserWidth < 3150) {
      itemsPerPage = 6;
    } else {
      itemsPerPage = 8;
    }
  }
  return itemsPerPage;
}
