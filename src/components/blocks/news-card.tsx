"use client";
import {FC, useState, useEffect} from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";

const unbounded = Unbounded({subsets: ["latin"]});
const golos = Golos_Text({subsets: ["latin"]});

// Интерфейс для новости из API
interface NewsItem {
    id: string;
    name: string;
    link: string;
    publish_time: string;
}

const NewsCard: FC<{data: NewsItem}> = ({data}) => {
    const [imageUrl, setImageUrl] = useState<string>("/images/news-placeholder.jpg");

    // Получаем изображение
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
                const apiUrl = `${baseUrl}/upage/${data.id}.anons_pic.json`;
                const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error("Image fetch failed");
                const json = await response.json();
                const path = json.property?.value?.value;
                if (path) setImageUrl(`${baseUrl}${path}`);
            } catch (err) {
                console.error("Failed to fetch news image:", err);
            }
        };
        fetchImage();
    }, [data.id]);

    const title = data.name || "Новость";
    const date = formatDate(parseInt(data.publish_time || "0", 10));

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const link = data.link ? (data.link.startsWith("http") ? data.link : `${baseUrl}${data.link}`) : "#";

    return (
        <CardContainer href={link}>
            <ImageContainer>
                <CardImage src={imageUrl} alt={title} fill sizes="33vw" priority={false} />
            </ImageContainer>

            <CardContent>
                {date && <CardDate>{date}</CardDate>}
                <CardTitle>{title}</CardTitle>
            </CardContent>
        </CardContainer>
    );
};

// Format Unix timestamp to readable date
const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const CardContainer = styled(Link)`
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
    background: white;
    transition: transform 0.3s ease;
    padding-bottom: 24px;
    &:hover {
        transform: translateY(-4px);

        img {
            transform: scale(1.05);
        }
    }
    @media (max-width: 1279px) {
        width: 100%;
        flex-direction: column-reverse;
        padding-bottom: 0;
        img {
            width: 100%;
        }
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 12.5vw;
    aspect-ratio: 16 / 10;

    flex-shrink: 0;
    overflow: hidden;

    @media (max-width: 1279px) {
        width: 100%;
    }
`;

const CardImage = styled(Image)`
    object-fit: cover;
    transition: transform 0.5s ease;
    box-sizing: border-box;
    border-radius: 4px;
    padding-top: 24px;
    padding-left: 24px;
    width: 100%;
    height: auto;
    @media (max-width: 1279px) {
        padding-right: 24px;
        padding-bottom: 24px;
    }
`;

const CardContent = styled.div`
    padding: 20px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const CardDate = styled.div`
    font-family: ${golos.style.fontFamily};
    font-size: 13px;
    line-height: 120%;
    color: rgba(51, 51, 51, 0.6);
    margin-bottom: auto;
`;

const CardTitle = styled.h3`
    font-family: ${unbounded.style.fontFamily};
    font-size: 20px;
    line-height: 130%;
    margin: 10px 0;
    font-weight: 500;
    color: var(--color-black);

    @media (max-width: 767px) {
        font-size: 18px;
    }
`;

export default NewsCard;
