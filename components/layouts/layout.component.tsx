import React, {Fragment, ReactNode} from "react";
import Head from "next/head";

type Props = {
  children?: ReactNode
  title?: string
  description?: string
}

const DEFAULT_DESCRIPTION = "Wealth Management Platform for investing, buying and personal finance management.";

function RootLayout({children, title = "Home | BlackPlum", description = DEFAULT_DESCRIPTION}: Props) {
  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <meta name="description" content={description}/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      {/* Children components */}
      {children}
    </Fragment>
  );
}

export default RootLayout;
