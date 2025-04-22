import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { Unbounded } from 'next/font/google';
import { Golos_Text } from 'next/font/google';
import type { Group, Property, Page } from '@/types/umi-data';
import { getStringPropertyValue, getImagePropertyValue, getVideoFilePropertyValue, getIntPropertyValue } from '@/lib/property-values';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const unbounded = Unbounded({ subsets: ["latin"] });
const golos = Golos_Text({ subsets: ["latin"] });

const PromoCard: FC<{ data: Group }> = ({ data }) => {
  // Реф для хранения видео URL
  const videoUrlRef = useRef<string>('');

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      hideScrollbar: true,
      compact: true,
      autoFocus: true,
      trapFocus: true,
      placeFocusBack: true,
      dragToClose: true,
      mainClass: "grad-fancybox"
    });

    return () => {
      Fancybox.destroy();
    };
  }, []);

  // Простой доступ к свойствам из любого возможного места
  const getAllProperties = (item: Group): Property[] => {
    if (item.property) return Object.values(item.property);
    if (item.properties?.group) {
      return Object.values(item.properties.group).flatMap(g =>
        g.property ? Object.values(g.property) : []);
    }
    return [];
  };

  const properties = getAllProperties(data);

  // Извлечение значений
  const title = getStringPropertyValue(
    properties.find((p: Property) =>  p.name === 'promo_page_block_heading')
  );

  const subtitle = getStringPropertyValue(
    properties.find((p: Property) => p.name === 'promo_page_block_subheading')
  );

  const text_sm = getStringPropertyValue(
    properties.find((p: Property) => p.name === 'promo_page_block_text-sm')
  );

  const text_lg = getStringPropertyValue(
    properties.find((p: Property) => p.name === 'promo_page_block_text-lg')
  );

  const is_dark = getIntPropertyValue(
    properties.find((p: Property) => p.name === 'promo_page_block_isdark')
  );


  // Обработка изображения с новой функцией
  const imageProp = properties.find((p: Property) => p.name === 'promo_page_block_image');
  const image = getImagePropertyValue(imageProp);

  // Обработка видео с новой функцией
  const videoProp = properties.find((p: Property) => p.name === 'promo_page_block_video');
  const video = getVideoFilePropertyValue(videoProp);
  const hasVideo = !!video;

  // Обработка ссылки
  let link: string | undefined = undefined;
  const linkProp = properties.find((p: Property) => p.name === 'promo_page_block_link');
  if (linkProp?.value && 'page' in linkProp.value) {
    const pages = Object.values(linkProp.value.page || {}) as Page[];
    if (pages.length > 0 && 'link' in pages[0] && pages[0].link) {
      link = pages[0].link;
    }
  }

  const fullImageUrl = image ? `${process.env.NEXT_PUBLIC_API_URL}${image}` : '';
  const fullVideoUrl = video ? `${process.env.NEXT_PUBLIC_API_URL}${video}` : '';

  // Сохраняем URL видео в ref для использования в обработчике клика
  videoUrlRef.current = fullVideoUrl;

  // Обработчик клика для воспроизведения видео
  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Программно открываем Fancybox
    if (videoUrlRef.current) {
      Fancybox.show([{
        src: videoUrlRef.current,
        type: 'html5video'
      }]);
    }
  };

  const cardContent = (
    <CardContent>
      <BackgroundContainer>
        {image && (
          <CardBackground
            src={fullImageUrl}
            alt={title || 'card-background'}
            fill
            unoptimized
          />
        )}

        {hasVideo && (
          <VideoPlayButton
            onClick={handleVideoClick}
            aria-label="Воспроизвести видео"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white"/>
            </svg>
          </VideoPlayButton>
        )}
      </BackgroundContainer>

      <ContentWrapper>
        <Title $isDark={!is_dark}>{title}</Title>
        {subtitle && <Subtitle $isDark={!is_dark}>{subtitle}</Subtitle>}
      </ContentWrapper>
      {text_sm && <Subtitle $isDark={!is_dark} style={{padding:24}}>{text_sm}</Subtitle>}
      {text_lg && <Text_LG $isDark={!is_dark} style={{padding:24}}>{text_lg}</Text_LG>}
    </CardContent>
  );

  return link ? (
    <CardLink href={link}>{cardContent}</CardLink>
  ) : (
    <CardContainer>{cardContent}</CardContainer>
  );
};

interface BackgroundProps {
  $hasImage?: boolean;
  $isDark?: boolean;
}

const CardContainer = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  min-height: 220px;
  display: flex;
  flex-direction: column;
`;

const CardContent = styled.div`
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgba(246, 246, 245, 1);
  color: #333;
  position: relative;
`;

const BackgroundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
`;

const CardBackground = styled(Image)`
  object-fit: cover;
  z-index: 1;
`;

const VideoPlayButton = styled.button`
  pointer-events: all;
  cursor: pointer;
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 44px;
  height: 44px;
  background: rgba(255, 107, 107, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  z-index: 10;
  transition: transform 0.2s ease-in-out, background 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
    background: rgba(255, 107, 107, 1);
  }
`;

const ContentWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const Title = styled.h3<BackgroundProps>`
  font-family: ${unbounded.style.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 120%;
  margin: 0 0 8px 0;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--color-black)'};
  display: block;
`;

const Subtitle = styled.p<BackgroundProps>`
  font-family: ${golos.style.fontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin: 0 0 8px 0;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--color-black)'};
`;

const Text_LG = styled.p<BackgroundProps>`
  font-family: ${unbounded.style.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 52px;
  line-height: 120%;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 999;
  width: fit-content;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'var(--color-black)'};
`;

export default PromoCard;
