import Link, { LinkProps } from "next/link";
import React, { FC } from "react";

type AppLinkProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement>;

const AppLink: FC<AppLinkProps> = (props) => {
  return (
    <Link
      {...props}
      className={`text-accent hover:text-accent-focus font-bold ${props.className}`}
    >
      {props.children}
    </Link>
  );
};

export default AppLink;
