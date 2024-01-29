import { FunctionComponent, ReactNode } from "react";
import MyHeader from "@/features/layout/my-header/my-header";

const PageLayout: FunctionComponent<{
  localDB?: boolean;
  children: ReactNode;
}> = ({ localDB = false, children }) => {
  return (
    <div className="flex flex-auto flex-col h-full">
      <MyHeader localDB={localDB} />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default PageLayout;
