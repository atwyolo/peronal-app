/** The slide a scrolled carousel track shows. Clamped, because the iOS overscroll bounce reports offsets out of range. */
export const getCarouselIndex = (scrollLeft: number, slideWidth: number, gap: number, total: number): number => {
  const step = slideWidth + gap;
  if (step === 0) return 0;

  return Math.min(Math.max(Math.round(scrollLeft / step), 0), total - 1);
};
