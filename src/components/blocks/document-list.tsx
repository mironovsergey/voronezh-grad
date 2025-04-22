'use client';
import { FC } from 'react';
import styled from 'styled-components';
import DocumentCard from './document-card';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';
import type { Group, MultipleFileProperty } from '@/types/umi-data';
import { getStringPropertyValue, getAllProperties } from '@/lib/property-values';

const unbounded = Unbounded({ subsets: ["latin"] });
const golos = Golos_Text({ subsets: ["latin"] });

const DocumentList: FC<{ data: Group }> = ({ data }) => {
  const properties = getAllProperties(data);
  const title = getStringPropertyValue(
    properties.find(p => p.name === 'document_list_block_heading')
  ) || 'Документы';

  const description = getStringPropertyValue(
    properties.find(p => p.name === 'document_list_block_description')
  );

  // Получаем список документов
  const documentsProp = properties.find(p => p.name === 'document_list_block_files');
  const documents: MultipleFileProperty[] = documentsProp?.value
    ? Object.values(documentsProp.value)
    : [];

  // Если нет документов
  if (documents.length === 0) {
    return <EmptyContainer>Нет доступных документов</EmptyContainer>;
  }

  return (
    <DocumentListContainer>
      <DocumentListHeader>
        <DocumentListTitle>{title}</DocumentListTitle>
        {description && <DocumentListDescription>{description}</DocumentListDescription>}
      </DocumentListHeader>

      <DocumentsContainer>
        {documents.map(file => (
          <DocumentCard key={file.id} file={file} />
        ))}
      </DocumentsContainer>
    </DocumentListContainer>
  );
};

const EmptyContainer = styled.div`
  padding: 2rem 0;
  text-align: center;
  color: #666;
  font-family: ${golos.style.fontFamily};
`;

const DocumentListContainer = styled.div`
  padding: 40px 0;
  max-width: var(--container-width);
  margin: 0 auto;

  @media (max-width: 1279px) {
    padding: 32px 20px;
  }
`;

const DocumentListHeader = styled.div`
  margin-bottom: 32px;
`;

const DocumentListTitle = styled.h2`
  font-family: ${unbounded.style.fontFamily};
  font-size: 40px;
  line-height: 120%;
  font-weight: 500;
  margin: 0 0 16px 0;
  color: var(--color-black);
`;

const DocumentListDescription = styled.p`
  font-family: ${golos.style.fontFamily};
  font-size: 16px;
  line-height: 150%;
  color: rgba(51, 51, 51, 0.8);
  max-width: 800px;
`;

const DocumentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default DocumentList;
