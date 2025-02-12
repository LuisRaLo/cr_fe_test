import { ReactNode } from "react";

interface TabContentProps {
  open: string;
  tabCategory: string;
  children?: ReactNode;
}

export default function TabContentComponent({
  open,
  tabCategory,
  children,
}: Readonly<TabContentProps>) {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color dark:text-dark-6 ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {children}
      </div>
    </div>
  );
}
