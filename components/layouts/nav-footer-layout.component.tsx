import React, {ReactNode} from "react";
import Navbar from "./../landing-page/navbar.component";
import Footer from "./../landing-page/footer.component";
import RootLayout from "@/components/layouts/layout.component";

type Props = {
  children?: ReactNode
  title?: string
}

function NavFooterLayout({children, title}: Props) {
  return (
    <RootLayout title={title}>
      <div className="flex flex-col min-h-full bg-gray-50">
        {/* Navigation bar */}
        <Navbar/>

        {/* Children components */}
        {children}

        {/* Footer section */}
        <Footer/>
      </div>
    </RootLayout>
  );
}

export default NavFooterLayout;
