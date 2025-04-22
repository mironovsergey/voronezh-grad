import {css} from "styled-components";
import {Unbounded} from "next/font/google";
const unbounded = Unbounded({subsets: ["latin"]});

export const documentsCSS = css`
    .document-list {
        height: 320px;
        display: flex;
        flex-direction: column;
        row-gap: 14px;
        .document-item {
            display: flex;
            flex-direction: row;
            background: rgba(246, 246, 245, 1);
            padding: 16px 20px;
            border-radius: 24px;
        }
        .document-download {
            flex-direction: row;
            display: flex;
            column-gap: 12px;
            align-items: center;
            margin-left: auto;
        }
        .document-title {
            font-family: ${unbounded.style.fontFamily};
            font-weight: 400;
            font-size: 17px;
            line-height: 1.2;
            letter-spacing: -0.008em;
            display:flex;
            align-items: center;
        }
    }
`;
