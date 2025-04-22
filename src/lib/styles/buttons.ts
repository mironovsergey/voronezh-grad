import { css } from 'styled-components';
import { Golos_Text } from 'next/font/google';

const golos = Golos_Text({subsets:['latin']});

export const buttonsCSS = css`
  .btn{
    padding: 3px 23px;
    width: fit-content;
    font-weight: 500;
    font-size: 17px;
    line-height: 48px;
    letter-spacing: -0.008em;
    font-family: ${golos.style.fontFamily};
    text-decoration: none;
    color: var(--color-black);
    backdrop-filter: blur(7px);
    border-radius: 8px;
  }
  .btn-primary{
    background: var(--color-red);
    border: 1px solid var(--color-red);
    color: white;
    transition: var(--transition-button);
    font-family: ${golos.style.fontFamily};
    &:hover{
      background: transparent;
      color: var(--color-black);
      border: 1px solid var(--color-red);
    }
  }
  .btn-secondary{
    background: var(--color-light_grey);
    border: 1px solid var(--color-light_grey);
    transition: var(--transition-button);
    &:hover{
      background: transparent;
      border: 1px solid var(--color-light_grey);
    }
  }

  @media (max-width: var(--lg)) and (min-width: var(--md)) {
    :root {
      --container-width: calc(0.875vw - 0.0625vw);
    }
  }

  @media (max-width: var(--md)) {
    :root {
      --container-width: calc(0.875vw - 0.0375vw);
    }
  }
`;
