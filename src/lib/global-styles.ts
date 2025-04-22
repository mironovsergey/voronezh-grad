import { createGlobalStyle } from 'styled-components';
import {notFoundCSS} from './styles/not-found';
import { variablesCSS } from './styles/variables';
import { containerCSS } from './styles/container';
import { buttonsCSS } from './styles/buttons';
import { textCSS } from './styles/text';
import { galleryCSS } from './styles/gallery';
import { documentsCSS } from './styles/documents';

export const GlobalStyle = createGlobalStyle`
  main{overflow-x: clip; overflow-y: visible;}
  ${notFoundCSS}
  ${variablesCSS}
  ${containerCSS}
  ${buttonsCSS}
  ${textCSS}
  ${galleryCSS}
  ${documentsCSS}
`;
