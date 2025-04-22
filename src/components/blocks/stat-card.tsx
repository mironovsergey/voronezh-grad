"use client";
import {FC, useEffect} from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import {Unbounded} from "next/font/google";
import {Golos_Text} from "next/font/google";
import type {Group, Property} from "@/types/umi-data";
import {getStringPropertyValue, getImagePropertyValue, getVideoFilePropertyValue, getAllProperties} from "@/lib/property-values";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const unbounded = Unbounded({subsets: ["latin"]});
const golos = Golos_Text({subsets: ["latin"]});

const CARD_BACKGROUNDS = [
    "rgba(243, 99, 99, 1)",
    "rgba(67, 181, 160, 1)",
    "black",
    "rgba(101, 127, 192, 1)",
    "rgba(212, 173, 150, 1)",
];

// Получаем цвет фона для карточки по индексу
const getBackgroundColor = (index: number): string => {
    // Используем модульное деление для получения индекса цвета
    const colorIndex = index % CARD_BACKGROUNDS.length;
    return CARD_BACKGROUNDS[colorIndex];
};

const StatCard: FC<{data: Group; index?: number}> = ({data, index = 0}) => {
    // Инициализация Fancybox для видео
    useEffect(() => {
        Fancybox.bind("[data-fancybox]", {
            hideScrollbar: true,
            compact: true,
            autoFocus: true,
            trapFocus: true,
            placeFocusBack: true,
            dragToClose: true,
            mainClass: "grad-fancybox",
        });

        return () => {
            Fancybox.destroy();
        };
    }, []);

    const properties = getAllProperties(data);

    const headingProps = ["stat_card_block_heading"];

    const subheadingProps = ["stat_card_block_subheading"];

    const textProps = ["stat_card_block_text"];


    const heading =
        getStringPropertyValue(properties.find((p: Property) => headingProps.includes(p.name))) || data.title;
    const subheading = getStringPropertyValue(properties.find((p: Property) => subheadingProps.includes(p.name)));
    const text = getStringPropertyValue(properties.find((p: Property) => textProps.includes(p.name)));

    // Обработка изображения превью для видео
    const previewProp = properties.find((p: Property) =>
        ["stat_card_block_preview"].includes(p.name)
    );
    const preview = getImagePropertyValue(previewProp);
    const fullPreviewUrl = preview ? `${process.env.NEXT_PUBLIC_API_URL}${preview}` : "";

    // Обработка видео
    const videoProp = properties.find((p: Property) =>
        ["stat_card_block_video"].includes(p.name)
    );
    const video = getVideoFilePropertyValue(videoProp);
    const fullVideoUrl = video ? `${process.env.NEXT_PUBLIC_API_URL}${video}` : "";
    const hasVideo = !!video;

    // Обработка иконки
    // TODO: добавить стили для карточки с иконкой
    const iconProp = properties.find((p: Property) =>
        ["stat_card_block_icon"].includes(p.name)
    );
    const icon = getImagePropertyValue(iconProp);
    const fullIconUrl = icon ? `${process.env.NEXT_PUBLIC_API_URL}${icon}` : "";

    // Обработка возможной ссылки
    let link: string | undefined = undefined;
    const linkProp = properties.find((p: Property) =>
        ["stat_card_block_link"].includes(p.name)
    );

    if (linkProp?.value && typeof linkProp.value === "object" && "page" in linkProp.value) {
        const pages = Object.values(linkProp.value.page || {});
        if (pages.length > 0 && "link" in pages[0] && pages[0].link) {
            link = pages[0].link;
        }
    }

    const backgroundcolor = getBackgroundColor(index);

    const cardContent = (
        <CardContent backgroundcolor={backgroundcolor}>
            {icon && (
                <IconContainer>
                    <Icon src={fullIconUrl} alt="Icon" width={64} height={64} unoptimized />
                </IconContainer>
            )}

            {heading && <Heading>{heading}</Heading>}
            {subheading && <Subheading>{subheading}</Subheading>}

            {preview && (
                <PreviewContainer>
                    <Preview src={fullPreviewUrl} alt={heading || "Preview"} fill unoptimized />

                    {hasVideo && (
                        <VideoPlayButton data-fancybox href={fullVideoUrl} aria-label="Воспроизвести видео">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="white" />
                            </svg>
                        </VideoPlayButton>
                    )}
                </PreviewContainer>
            )}

            {text && <Text>{text}</Text>}
        </CardContent>
    );

    // Если есть ссылка, оборачиваем в Link, иначе просто возвращаем контент
    return link ? (
        <CardLink href={link} backgroundcolor={backgroundcolor}>
            {cardContent}
        </CardLink>
    ) : (
        <CardContainer backgroundcolor={backgroundcolor}>{cardContent}</CardContainer>
    );
};

const CardContainer = styled.div<{backgroundcolor: string}>`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background-color: ${({backgroundcolor}) => backgroundcolor};
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 180px;
`;

const CardLink = styled(Link)<{backgroundcolor: string}>`
    text-decoration: none;
    color: inherit;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background-color: ${({backgroundcolor}) => backgroundcolor};
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 180px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
    }
`;

const CardContent = styled.div<{backgroundcolor: string}>`
    padding: 24px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${({backgroundcolor}) => backgroundcolor};
    color: white;
`;

const IconContainer = styled.div`
    margin-bottom: 16px;
`;

const Icon = styled(Image)`
    object-fit: contain;
`;

const Heading = styled.h3`
    font-family: ${unbounded.style.fontFamily};
    font-weight: 500;
    font-size: 70px;
    line-height: 120%;
    margin: 0 0 8px 0;
    color: white;
`;

const Subheading = styled.p`
    font-family: ${golos.style.fontFamily};
    font-weight: 400;
    font-size: 16px;
    line-height: 140%;
    margin: 0 0 16px 0;
    color: white;
`;

const PreviewContainer = styled.div`
    position: relative;
    width: 100%;
    height: 180px;
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
`;

const Preview = styled(Image)`
    object-fit: cover;
`;

const VideoPlayButton = styled.a`
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
    cursor: pointer;
    z-index: 10;
    transition: transform 0.2s ease-in-out, background 0.2s ease-in-out;

    &:hover {
        transform: scale(1.1);
        background: rgba(255, 107, 107, 1);
    }
`;

const Text = styled.p`
    font-family: ${golos.style.fontFamily};
    font-weight: 400;
    font-size: 14px;
    line-height: 140%;
    color: white;
    margin: 0;
`;

export default StatCard;
