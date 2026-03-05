import Link, { LinkProps } from "next/link";

type AppLinkProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

const AppLink = (props: AppLinkProps) => (
  <Link
    {...props}
    className={`text-brand-pink hover:text-brand-pink-foreground font-bold ${props.className}`}
  >
    {props.children}
  </Link>
);

export default AppLink;
