export const isMobile = () =>
  navigator?.userAgent?.match(/(iPhone|iPod|Android|ios)/i);
