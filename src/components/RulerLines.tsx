export default function RulerLines({
  variant = "left",
}: {
  variant?: "left" | "right";
}) {
  return (
    <div
      aria-hidden="true"
      className={`portfolio-ruler hidden md:block portfolio-ruler-${variant}`}
    />
  );
}
