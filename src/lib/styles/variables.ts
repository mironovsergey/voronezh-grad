import { css } from 'styled-components';

export const variablesCSS = css`
  :root {
    --lg: 1600px;
    --md: 1280px;
    --sm: 640px;
    --container-width: calc(87.5vw - (15.625vw + 21.875vw));
    --transition-button: 0.25s cubic-bezier(0.645, 0.045, 0.355, 1.0);
    --color-black: rgba(31, 29, 29, 1);
    --color-dark_grey: rgba(66, 66, 69, 1);
    --color-light_grey: rgba(232, 232, 237, 0.6);
    --color-red: rgba(255, 79, 79, 1);
    --color-alert: rgba(232, 38, 44, 1);
    --gutter: clamp(16px, 5vw, 32px);

  }

  @media (max-width: var(--md)) and (min-width: var(--sm)) {
    :root {
      --container-width: calc(0.875vw - 0.0625vw);
    }
  }

  @media (max-width: var(--sm)) {
    :root {
      --container-width: calc(0.875vw - 0.0375vw);
    }
  }
`;
