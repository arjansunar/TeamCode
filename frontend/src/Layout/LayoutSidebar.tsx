import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export const LayoutSidebar = ({ children }: Props) => {
  return (
    <div>
      <div className="">Sidebar </div>
      {children}
    </div>
  );
};
