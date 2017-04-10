export function randomGradient() {
  const hueA = ~~(Math.random() * 360);
  const hueB = ~~(Math.random() * 360);
  const angle = ~~(Math.random() * 360);
  const size = ~~(Math.random() * 100);

  return (
    `repeating-linear-gradient(
       ${ angle }deg,
       hsla(${ hueA }, 80%, 40%, 0.7),
       hsla(${ hueA }, 80%, 40%, 0.7) ${ size }px,
       hsla(${ hueB }, 80%, 80%, 0.7) ${ size }px,
       hsla(${ hueB }, 80%, 80%, 0.7) ${ size * 2 }px
     )`
  );
}
