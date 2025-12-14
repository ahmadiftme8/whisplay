"use client";

import React from "react";
import { createGlobalStyle, ThemeProvider, StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { styleReset } from "react95";

// List of props to block from leaking to the DOM
const blockedProps = new Set([
  'active',
  'fullWidth',
  'primary',
  'square',
  'shadow',
  'noPadding',
  'fixed',
  'isMultiRow',
  'variant',
  'hasMarks',
  'isFocused',
  'menu'
]);

function shouldForwardProp(propName: string, target: any) {
  if (typeof target === "string") {
    // For HTML elements, forward if valid HTML attribute AND not blocked
    return isPropValid(propName) && !blockedProps.has(propName);
  }
  // For other styled components, always forward
  return true;
}
// @ts-ignore
import original from "react95/dist/themes/original";
// @ts-ignore
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
// @ts-ignore
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

interface ProvidersProps {
  children: React.ReactNode;
}

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal;
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
`;

export function Providers({ children }: ProvidersProps) {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <>
        <GlobalStyles />
        <ThemeProvider theme={original}>{children}</ThemeProvider>
      </>
    </StyleSheetManager>
  );
}
