'use client';
import { FC } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';
import type { MultipleFileProperty } from '@/types/umi-data';

const unbounded = Unbounded({ subsets: ["latin"] });
const golos = Golos_Text({ subsets: ["latin"] });

interface DocumentCardProps {
  file: MultipleFileProperty;
}

const DocumentCard: FC<DocumentCardProps> = ({ file }) => {
  const fileUrl = process.env.NEXT_PUBLIC_API_URL + file.src;
  const fileSizeMB = (file.size / 1048576).toFixed(2); // расчет МБ (1048576 = 1024*1024)

  return (
    <DocumentItem>
      <DocumentTitle>{file.title}</DocumentTitle>
      <DocumentDownload>
        <DocumentSize>{fileSizeMB} МБ</DocumentSize>
        <DownloadButton href={fileUrl}>
          Скачать
        </DownloadButton>
      </DocumentDownload>
    </DocumentItem>
  );
};

const DocumentItem = styled.div`
  display: flex;
  flex-direction: row;
  background: rgba(246, 246, 245, 1);
  padding: 16px 20px;
  border-radius: 24px;
  margin-bottom: 14px;
`;

const DocumentTitle = styled.div`
  font-family: ${unbounded.style.fontFamily};
  font-weight: 400;
  font-size: 17px;
  line-height: 1.2;
  letter-spacing: -0.008em;
  display: flex;
  align-items: center;
`;

const DocumentDownload = styled.div`
  flex-direction: row;
  display: flex;
  column-gap: 12px;
  align-items: center;
  margin-left: auto;
`;

const DocumentSize = styled.div`
  font-family: ${golos.style.fontFamily};
  font-size: 14px;
  color: rgba(51, 51, 51, 0.7);
`;

const DownloadButton = styled(Link)`
  padding: 3px 23px;
  width: fit-content;
  font-weight: 500;
  font-size: 17px;
  line-height: 48px;
  letter-spacing: -0.008em;
  font-family: ${golos.style.fontFamily};
  text-decoration: none;
  background: var(--color-red);
  border: 1px solid var(--color-red);
  color: white;
  transition: var(--transition-button);
  border-radius: 8px;

  &:hover {
    background: transparent;
    color: var(--color-black);
    border: 1px solid var(--color-red);
  }
`;

export default DocumentCard;
