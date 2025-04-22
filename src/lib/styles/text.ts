import {css} from "styled-components";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";

const golos = Golos_Text({subsets: ["latin"]});
const unbounded = Unbounded({subsets: ["latin"]});

export const textCSS = css`
    .container{
      width: var(--container-width);
      margin: 0 auto;
      font-family: ${golos.style.fontFamily};

    }
    h1,
    h2,
    h3,
    h4,
    h5 {
        font-family: ${unbounded.style.fontFamily};
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.008em;
        color: var(--color-black);
        margin-top: 60px;
    }
    h1 {
      font-size: 52px;
      margin-bottom: 30px;
    }
    h2 {
      font-size: 40px;
      margin-bottom: 23px;
    }
    h3 {
      font-size: 30px;
      margin-bottom: 20px
    }
    h4 {
      font-size: 25px;
      margin-bottom: 16px;
    }
    h5 {
      font-size: 20px;
      margin-bottom: 14px;
    }
    p{
      font-family: ${golos.style.fontFamily};
      font-weight: 400;
      font-size: 17px;
      line-height: 1.5;
      letter-spacing: -0.008em;
      color: var(--color-dark_grey);
      margin-bottom: 10px;
      margin-top: 0;
    }
    .quote{
       h4{
            font-size: 30px;
            line-height: 1.3;
            font-weight: 400;
            padding-right: 12px;
      }
      p{
        font-size: 14px;
        line-height: 18px;
      }
    }
`;
