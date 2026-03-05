interface CircleIconProps {
  color: string;
  icon: React.ReactNode;
  size?: number;
}

export const CircleIcon = ({ color, size = 16, icon }: CircleIconProps) => (
  <div
    className="p-3 rounded-full flex items-center justify-center"
    style={{
      backgroundColor: `${color}20`,
      width: `${size}px`,
      height: `${size}px`,
    }}
  >
    <div style={{ color }}>{icon}</div>
  </div>
);
