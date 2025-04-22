'use client';
import { FC } from 'react';
import styled from 'styled-components';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';
import type { Group } from '@/types/umi-data';
import { getStringPropertyValue, getAllProperties } from '@/lib/property-values';

const unbounded = Unbounded({ subsets: ["latin"] });
const golos = Golos_Text({ subsets: ["latin"] });

const TextContent: FC<{ data: Group }> = ({ data }) => {
  const properties = getAllProperties(data);
  const textProp = properties.find(p => p.name === 'text_content_block_text');
  const textValue = getStringPropertyValue(textProp);

  return (
    <TextContainer>
      {textValue && <ContentWrapper dangerouslySetInnerHTML={{ __html: textValue }} />}
    </TextContainer>
  );
};

const TextContainer = styled.div`
  padding: 40px 0;
  max-width: var(--container-width);
  margin: 0 auto;

  @media (max-width: 1279px) {
    padding: 32px 20px;
  }
`;

const ContentWrapper = styled.div`
  font-family: ${golos.style.fontFamily};
  font-size: 16px;
  line-height: 150%;
  color: var(--color-black);

  h1, h2, h3, h4, h5, h6 {
    font-family: ${unbounded.style.fontFamily};
    margin-bottom: 16px;
    font-weight: 500;
  }

  h1 {
    font-size: 40px;
    line-height: 120%;
  }

  h2 {
    font-size: 32px;
    line-height: 120%;
  }

  p {
    margin-bottom: 16px;
  }

  a {
    color: var(--color-black);
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  ul, ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
  }
`;

export default TextContent;
