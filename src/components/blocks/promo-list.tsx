'use client';
import { FC, useRef, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import PromoCard from './promo-card';
import { Unbounded } from 'next/font/google';
import { Group, UmiData, Property, Page } from '@/types/umi-data';
import { getStringPropertyValue } from '@/lib/property-values';

const unbounded = Unbounded({ subsets: ["latin"] });

const PromoList: FC<{ data: Group }> = ({ data }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [promoItems, setPromoItems] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllProperties = (item: Group): Property[] => {
    if (item.property) return Object.values(item.property);
    if (item.properties?.group) {
      return Object.values(item.properties.group).flatMap(g =>
        g.property ? Object.values(g.property) : []);
    }
    return [];
  };

  const fetchPromoItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const properties = getAllProperties(data);
      const linksProperty = properties.find(p => p.name === 'promo_list_block_links');

      if (!linksProperty?.value || !('page' in linksProperty.value)) {
        setPromoItems([]);
        setIsLoading(false);
        return;
      }

      const promoPages = Object.values(linksProperty.value.page || {}) as Page[];

      if (promoPages.length === 0) {
        setPromoItems([]);
        setIsLoading(false);
        return;
      }

      const fetchedItems = await Promise.all(
        promoPages.map(async (page: Page) => {
          try {
            const apiUrl = `/api/proxy?url=${encodeURIComponent(page.link)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
              throw new Error(`Ошибка при загрузке ${page.name}`);
            }

            const pageData: UmiData = await response.json();
            return pageData?.page || null;
          } catch (e) {
            return null;
          }
        })
      );

      const validItems = fetchedItems.filter(Boolean) as unknown as Group[];
      setPromoItems(validItems);

    } catch (e) {
      setError('Не удалось загрузить промо-акции');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchPromoItems();
  }, [fetchPromoItems]);

  const handleScrollNav = (direction: 'prev' | 'next') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'next' ? container.clientWidth : -container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // TODO: убрать debug
  if (isLoading) return <LoadingContainer>Загрузка промо-акций...</LoadingContainer>;
  if (error) return <ErrorContainer>{error}</ErrorContainer>;
  if (promoItems.length === 0) return <div>Нет промо-акций для отображения</div>;

  return (
    <PromoListContainer>
      <GridContainer ref={scrollContainerRef}>
        {promoItems.length >= 2 ? (
          <>
            <DoubleCardColumn>
              <CardItem>
                <PromoCard data={promoItems[0]} />
                {getDateForItem(promoItems[0])}
              </CardItem>

              <CardItem>
                <PromoCard data={promoItems[1]} />
                {getDateForItem(promoItems[1])}
              </CardItem>
            </DoubleCardColumn>

            {promoItems.slice(2).map((item) => (
              <CardItem key={item.id}>
                <PromoCard data={item} />
                {getDateForItem(item)}
              </CardItem>
            ))}
          </>
        ) : (
          <CardItem>
            <PromoCard data={promoItems[0]} />
            {getDateForItem(promoItems[0])}
          </CardItem>
        )}
      </GridContainer>

      <NavigationButtons>
        <NavButton onClick={() => handleScrollNav('prev')} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavButton>
        <NavButton onClick={() => handleScrollNav('next')} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </NavButton>
      </NavigationButtons>
    </PromoListContainer>
  );
};

// Вспомогательная функция для получения даты из элемента
const getDateForItem = (item: Group) => {
  const getAllProperties = (item: Group): Property[] => {
    if (item.property) return Object.values(item.property);
    if (item.properties?.group) {
      return Object.values(item.properties.group).flatMap(g =>
        g.property ? Object.values(g.property) : []);
    }
    return [];
  };

  const properties = getAllProperties(item);
  const dateProp = properties.find(p => p.name === 'promo_card_date' || p.name === 'promo_page_block_date');
  const dateValue = getStringPropertyValue(dateProp);

  return dateValue ? <CardDate>{dateValue}</CardDate> : null;
};

const LoadingContainer = styled.div`
  padding: 2rem 0;
  text-align: center;
  color: #666;
`;

const ErrorContainer = styled.div`
  padding: 2rem 0;
  text-align: center;
  color: #f44336;
`;

const PromoListContainer = styled.div`
  position: relative;
  margin: 60px 0 40px;
  padding: 0;
  width: 100%;
  overflow: hidden;
`;

const GridContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 280px;
  grid-gap: var(--gutter);
  overflow-x: auto;
  padding: 4px 0 20px;
  margin: 0 -4px;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-columns: unset;
    grid-auto-flow: unset;
    overflow-x: visible;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr 2fr;
  }

  @media (max-width: 767px) {
    grid-gap: 16px;
    padding-bottom: 16px;
  }
`;

const DoubleCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;

  @media (max-width: 767px) {
    gap: 16px;
  }
`;

const CardItem = styled.div<{ isHalf?: boolean }>`
  scroll-snap-align: start;
  position: relative;
  height: ${props => props.isHalf ? 'calc(50% - 12px)' : '100%'};

  @media (max-width: 767px) {
    height: ${props => props.isHalf ? 'calc(50% - 8px)' : '100%'};
  }
`;

const CardDate = styled.div`
  font-family: ${unbounded.style.fontFamily};
  font-size: 13px;
  line-height: 120%;
  color: rgba(66, 66, 69, 0.8);
  margin-top: 8px;
`;

const NavigationButtons = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    position: absolute;
    right: 0;
    top: -50px;
    gap: 8px;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &:active {
    background: #eeeeee;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;

export default PromoList;
