"use client";
import {FC, useState, useEffect, useCallback} from "react";
import styled from "styled-components";
import StatCard from "./stat-card";
import {Group, UmiData, Property, Page} from "@/types/umi-data";
import {getStringPropertyValue} from "@/lib/property-values";
import Link from "next/link";
import {Golos_Text} from "next/font/google";

const golos = Golos_Text({subsets: ["latin"]});

const StatList: FC<{data: Group}> = ({data}) => {
    const [statItems, setStatItems] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAllProperties = (item: Group): Property[] => {
        if (item.property) return Object.values(item.property);
        if (item.properties?.group) {
            return Object.values(item.properties.group).flatMap((g) => (g.property ? Object.values(g.property) : []));
        }
        return [];
    };

    const properties = getAllProperties(data);

    const title = getStringPropertyValue(properties.find((p) => p.name === "stat_list_block_heading")) || data.name;

    const text = getStringPropertyValue(properties.find((p) => p.name === "stat_list_block_text")) || "";

    const buttonText =
        getStringPropertyValue(properties.find((p) => p.name === "stat_list_block_btn-text")) || "Подробнее";

    let buttonLink = "/";
    const linkProp = properties.find((p) => p.name === "stat_list_block_btn-link");
    if (linkProp?.value && "page" in linkProp.value) {
        const pages = Object.values(linkProp.value.page || {}) as Page[];
        if (pages.length > 0 && "link" in pages[0] && pages[0].link) {
            buttonLink = pages[0].link;
        }
    }

    const fetchStatItems = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const properties = getAllProperties(data);
            const linksProperty = properties.find((p) => p.name === "stat_list_block_links");

            if (!linksProperty?.value || !("page" in linksProperty.value)) {
                setStatItems([]);
                setIsLoading(false);
                return;
            }

            const pages = Object.values(linksProperty.value.page || {}) as Page[];
            if (pages.length === 0) {
                setStatItems([]);
                setIsLoading(false);
                return;
            }

            const fetched = await Promise.all(
                pages.map(async (page) => {
                    try {
                        const apiUrl = `/api/proxy?url=${encodeURIComponent(page.link)}`;
                        const res = await fetch(apiUrl);
                        if (!res.ok) throw new Error(`Ошибка при загрузке ${page.name}`);
                        const pageData: UmiData = await res.json();
                        return pageData.page || null;
                    } catch (e) {
                        return null;
                    }
                })
            );

            setStatItems(fetched.filter(Boolean) as unknown as Group[]);
        } catch (e) {
            setError("Не удалось загрузить статистику");
        } finally {
            setIsLoading(false);
        }
    }, [data]);

    useEffect(() => {
        fetchStatItems();
    }, [fetchStatItems]);

    if (isLoading) return <LoadingContainer>Загрузка статистики...</LoadingContainer>;
    if (error) return <ErrorContainer>{error}</ErrorContainer>;
    if (statItems.length === 0) return <div>Нет статистики для отображения</div>;

    return (
        <StatListContainer>
            <StickyContainer>
                <h2 dangerouslySetInnerHTML={{__html: title}} />
                <p>{text}</p>
                {buttonLink && <ButtonLink href={buttonLink}>{buttonText}</ButtonLink>}
            </StickyContainer>

            <CardsFrame>
                {statItems.slice(0, 5).map((item, index) => (
                    <CardItem key={item.id || `stat-item-${index}`} $index={index}>
                        <StatCard data={item} index={index} />
                    </CardItem>
                ))}
            </CardsFrame>
        </StatListContainer>
    );
};

const StickyContainer = styled.div`
    position: sticky;
    display: block;
    top: 100px;
    z-index: 3;
    width: 50%;
    height: fit-content;
    padding: 0 20px 80px;
    margin: 0 auto;
    h2 {
        margin-bottom: 24px;
        overflow: hidden;
        text-align: left;
        font-size: 40px;
        line-height: 120%;
    }

    p {
        max-width: 80%;
        text-align: left;
        font-size: 20px;
        line-height: 130%;
        margin-bottom: 40px;
    }

    @media (max-width: 640px) {
        width: 90%;
        position: relative;
        top: 0;
        padding-bottom: 40px;
        h2 {
            font-size: 27px;
        }
        p {
            max-width: unset;
        }
    }
`;

const ButtonLink = styled(Link)`
    align-self: flex-end;
    padding: 12px 24px;
    background-color: #333;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
    font-family: ${golos.style.fontFamily};
    &:hover {
        background-color: #555;
    }
`;

const CardsFrame = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    padding-bottom: 38%;
    min-height: 600px;
    @media (max-width: 768px) {
        height: unset;
    }
`;

const CardItem = styled.div<{$index: number}>`
    position: absolute;
    width: 25vw;
    height: 340px;
    z-index: 10;
    /* Точное позиционирование для каждой карточки по макету */
    ${(props) => {
        switch (props.$index) {
            case 0:
                return `
          top: 0;
          right: 12.5vw;
        `;
            case 1:
                return `
          top: 240px;
          left: 12.5vw;
        `;
            case 2:
                return `
          top: 480px;
          right: 21.875vw;
        `;
            case 3:
                return `
          top: 720px;
          left: 21.875vw;
        `;
            case 4:
                return `
          top: 960px;
          right: 12.5vw;
        `;
            default:
                return "";
        }
    }}

    @media (max-width: 768px) {
        position: relative;
        width: 90%;
        left: auto !important;
        right: auto !important;
        top: auto !important;
        margin: 0 auto 20px;
        z-index: 1;
    }
`;

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

const StatListContainer = styled.div`
    position: relative;
    overflow: visible; /* Изменяем с hidden на visible для работы sticky */
`;

export default StatList;
