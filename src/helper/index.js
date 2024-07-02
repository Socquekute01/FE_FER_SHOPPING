const convertMoney = (price = 0) => {
  if (price) return price.toLocaleString("vi-VN").replaceAll(".", ",");
  return price;
};

export { convertMoney };
