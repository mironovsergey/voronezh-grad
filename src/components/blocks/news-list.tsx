"use client";

import {FC, useState} from "react";
import styled from "styled-components";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";
import type {Group} from "@/types/umi-data";
import {getStringPropertyValue, getAllProperties} from "@/lib/property-values";
import NewsCard from "./news-card";
import { fetchData } from "@/lib/server-api";

const unbounded = Unbounded({subsets: ["latin"]});
const golos = Golos_Text({subsets: ["latin"]});

// Интерфейс для новости из API
interface NewsItem {
    id: string;
    name: string;
    link: string;
    publish_time: string;
}

// Интерфейс для ответа API с новостями
interface NewsResponse {
    items: {
        item: {
            [key: string]: {
                id: string;
                name: string;
                link: string;
                href: string;
                publish_time: string;
                lent_id: string;
                lent_name: string;
                lent_link: string;
            };
        };
    };
    total: number;
    archive_link: string;
}

const NewsList: FC<{
    data: Group;
    newsItems?: NewsItem[];
    initialTotal?: number;
    displayLimit?: number;
}> = ({data, newsItems = [], displayLimit = 2}) => {
    const properties = getAllProperties(data);
    const [items, setItems] = useState<NewsItem[]>(newsItems);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState<number>(displayLimit);
    const [bulkNewsLoaded, setBulkNewsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const title = getStringPropertyValue(properties.find((p) => p.name === "news_list_block_heading")) || "Новости";
    const description = getStringPropertyValue(properties.find((p) => p.name === "news_list_block_description"));
    const loadMoreNews = async () => {
        // Если уже загрузили все новости, просто показываем еще displayLimit из уже загруженных
        if (bulkNewsLoaded) {
            setVisibleCount(prevCount => Math.min(prevCount + displayLimit, items.length));
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Загружаем сразу 100 новостей
            const bulkLimit = 100;
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

            // Формируем полный URL для запроса новостей через JSON API
            const newsApiUrl = `${baseUrl}/udata://news/lastlist/novosti///${bulkLimit}/0.json`;

            //TODO: Убрать прокси, когда будет настроен CORS на сервере
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(newsApiUrl)}`;
            const newsData: NewsResponse = await fetchData(proxyUrl);
            console.log("newsData", newsData);

            if (!newsData.items?.item) {
                setBulkNewsLoaded(true);
                return;
            }

            // Преобразуем объект новостей в массив упрощенных объектов
            const allItems = Object.values(newsData.items.item).map(item => ({
                id: item.id,
                name: item.name,
                link: item.link,
                publish_time: item.publish_time
            }));

            // Добавляем только те новости, которых еще нет в списке
            const existingIds = new Set(items.map(item => item.id));
            const uniqueNewItems = allItems.filter(item => !existingIds.has(item.id));

            // Добавляем новые новости к уже имеющимся
            setItems(prevItems => [...prevItems, ...uniqueNewItems]);

            // Показываем следующие displayLimit новостей
            setVisibleCount(prevCount => prevCount + displayLimit);

            setBulkNewsLoaded(true);
        } catch (error) {
            console.error("Ошибка при загрузке новостей:", error);
            setError("Не удалось загрузить дополнительные новости");
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return <EmptyContainer>Нет доступных новостей</EmptyContainer>;
    }

    const visibleItems = items.slice(0, visibleCount);
    const hasMoreItems = visibleCount < items.length || !bulkNewsLoaded;

    return (
        <NewsListContainer>
            <NewsListHeader>
                <NewsListTitle>{title}</NewsListTitle>
                {description && <NewsListDescription>{description}</NewsListDescription>}
            </NewsListHeader>

            <NewsGrid>
                {visibleItems.map((item, index) => (
                    <NewsCard key={`${item.id}-${index}`} data={item} />
                ))}
            </NewsGrid>

            <ShowMoreButtonContainer>
                <ShowMoreButton onClick={loadMoreNews} disabled={isLoading || !hasMoreItems}>
                    {isLoading ? "Загрузка..." : "Показать больше"}
                </ShowMoreButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </ShowMoreButtonContainer>
        </NewsListContainer>
    );
};

const EmptyContainer = styled.div`
    padding: 2rem 0;
    text-align: center;
    color: #666;
    font-family: ${golos.style.fontFamily};
`;

const NewsListContainer = styled.div`
    padding: 120px 0;
    width: 99vw;
    margin: 0 auto;
    background-color: #f3f8fc;
    box-sizing: border-box;
    @media (max-width: 1279px) {
        padding: 32px 20px;
    }
        @media (max-width: 767px) {
        }
`;

const NewsListHeader = styled.div`
    margin-bottom: 32px;
    text-align: center;
`;

const NewsListTitle = styled.h2`
    font-family: ${unbounded.style.fontFamily};
    font-size: 40px;
    line-height: 120%;
    font-weight: 500;
    margin: 0 0 40px 0;
    color: var(--color-black);
`;

const NewsListDescription = styled.p`
    font-family: ${golos.style.fontFamily};
    font-size: 16px;
    line-height: 150%;
    color: rgba(51, 51, 51, 0.8);
    max-width: 800px;
    margin: 0 auto;
`;

const NewsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--gutter);
    margin-bottom: 60px;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 0 6.25vw;
    @media (max-width: 639px) {
        grid-template-columns: 1fr;
        grid-gap: 16px;
    }
`;

const ShowMoreButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 16px;
`;

const ShowMoreButton = styled.button`
    padding: 12px 24px;
    background-color: transparent;
    border: 1px solid #333;
    color: #333;
    font-family: ${golos.style.fontFamily};
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-size: 16px;
    cursor: pointer;

    &:hover:not(:disabled) {
        background-color: #333;
        color: white;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #e53935;
    margin-top: 8px;
    font-family: ${golos.style.fontFamily};
    font-size: 14px;
`;

export default NewsList;
