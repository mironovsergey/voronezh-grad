'use client';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';

const unbounded = Unbounded({ subsets: ["latin"] });
const golos = Golos_Text({ subsets: ["latin"] });

interface VerticalScrollSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

const VerticalScrollSection: FC<VerticalScrollSectionProps> = ({
  title,
  description,
  children
}) => {
  // Если title и description не были переданы как props, извлекаем их из данных
  const blockTitle = title;

  const blockDescription = description;

  return (
    <ScrollSectionContainer>
      <StickyTextContainer>
        {blockTitle && <SectionTitle>{blockTitle}</SectionTitle>}
        {blockDescription && <SectionDescription>{blockDescription}</SectionDescription>}
      </StickyTextContainer>

      <ScrollContentContainer>
        {children}
      </ScrollContentContainer>
    </ScrollSectionContainer>
  );
};

const ScrollSectionContainer = styled.section`
  display: flex;
  position: relative;
  width: 100%;
  margin: 3rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StickyTextContainer = styled.div`
  position: sticky;
  top: 100px; // Регулируйте это значение в зависимости от высоты header
  align-self: flex-start;
  width: 40%;
  padding-right: 2rem;
  z-index: 10;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    top: 0;
    padding-right: 0;
    margin-bottom: 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-family: ${unbounded.style.fontFamily};
  font-weight: 500;
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--color-black, #333333);
`;

const SectionDescription = styled.div`
  font-family: ${golos.style.fontFamily};
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-gray, #666666);
  max-width: 90%;
`;

const ScrollContentContainer = styled.div`
  width: 60%;
  padding-top: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default VerticalScrollSection;
