import type { Group, Property } from "@/types/umi-data";
import NewsList from "./news-list";
import { getStringPropertyValue, getAllProperties } from "@/lib/property-values";

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

// Серверный компонент для загрузки новостей
const NewsListServer = async ({ data }: { data: Group }) => {
    // Всегда запрашиваем 4 новости с сервера, чтобы знать, нужно ли активировать кнопку
    const serverLimit = 4;

    // Формируем URL для запроса новостей через JSON API
    const newsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/udata://news/lastlist/novosti///${serverLimit}/0.json`;

    let newsItems: NewsItem[] = [];
    let totalItems = 0;

    try {
        // Используем Next.js fetch с ISR (revalidate каждый час)
        const response = await fetch(newsApiUrl, {
            next: { revalidate: 3600 }, // revalidate every hour
        });

        if (!response.ok) {
            throw new Error("Failed to fetch news data");
        }

        const newsData: NewsResponse = await response.json();

        totalItems = newsData.total;

        // Извлекаем новости из вложенной структуры items.item и преобразуем их
        // в нужную структуру (оставляем только id, name, link, publish_time)
        if (newsData?.items?.item) {
            newsItems = Object.values(newsData.items.item).map(item => ({
                id: item.id,
                name: item.name,
                link: item.link,
                publish_time: item.publish_time
            }));
        }
    } catch (error) {
        console.error("Failed to fetch news items:", error);
    }

    return (
        <NewsList
            data={data}
            newsItems={newsItems}
            initialTotal={totalItems}
        />
    );
};

export default NewsListServer;
