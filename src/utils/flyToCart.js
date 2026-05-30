export function triggerFlyToCart(fromElement) {
  const cartBtn = document.querySelector('[aria-label^="Shopping bag"]');
  if (!fromElement || !cartBtn) return;

  const fromRect = fromElement.getBoundingClientRect();
  const toRect = cartBtn.getBoundingClientRect();

  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = toRect.left + toRect.width / 2;
  const endY = toRect.top + toRect.height / 2;

  const particle = document.createElement("div");
  particle.className = "cart-particle";
  particle.style.cssText = `
    left: ${startX - 10}px;
    top: ${startY - 10}px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #111111;
    --target-x: ${endX - startX}px;
    --target-y: ${endY - startY}px;
  `;

  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 850);
}
