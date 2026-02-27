type NavLinxProps = {
  href: string;
  label: string;
};

export default function NavLinx({ href, label }: NavLinxProps) {
  return (
    <a href={href} className="transition-colors hover:text-foreground">
      {label}
    </a>
  );
}
