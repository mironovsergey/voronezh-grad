import {css} from "styled-components";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";

const golos = Golos_Text({subsets: ["latin"]});
const unbounded = Unbounded({subsets: ["latin"]});

export const galleryCSS = css`
  .swiper{
    overflow: visible;

  }
  .image-gallery__label{
    // position:absolute;
    max-width: 100px;
    padding-right: 30px;
    color: var(--color-dark_grey);
    // bottom: 0;
    font-family: ${golos.style.fontFamily};

  }
`;
