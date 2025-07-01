import React, {ReactNode} from "react";
import Navbar from "./../landing-page/navbar.component";
import RootLayout from "@/components/layouts/layout.component";

type Props = {
  children?: ReactNode
  title?: string
}

function NavLayout({children, title}: Props) {
  return (
    <RootLayout title={title}>
      <div className="flex flex-col min-h-full">
        {/* Navigation bar */}
        <Navbar showBack={true}/>

        {/* Children components */}
        {children}
      </div>
    </RootLayout>
  );
}

export default NavLayout;
