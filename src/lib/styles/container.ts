import {css} from "styled-components";

export const containerCSS = css`

    .container {
        display: block;
        column-gap: var(--gutter);
        width: var(--container-width);
        margin: 0 auto;
    }

    @media (max-width: 639px) {
        .container {
        }
    }

    @media (min-width: 640px) and (max-width: 1279px) {
        .container {
        }
    }

    @media (min-width: 1280px) and (max-width: 1600px) {
        .container {
        }
    }
`;
