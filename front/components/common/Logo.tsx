export default function Logo({ color = "#196B3A" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 140"
      width="160"
      height="45"
      className="transition-colors duration-500 hover:fill-green-700"
    >
      <text
        x="20"
        y="95"
        fontFamily="Poppins, Inter, system-ui"
        fontWeight="700"
        fontSize="86"
        fill={color}
        letterSpacing="-2"
      >
        melon
      </text>
      <rect x="278" y="86" width="34" height="8" rx="4" fill="#FF9A5A" />
    </svg>
  );
}
