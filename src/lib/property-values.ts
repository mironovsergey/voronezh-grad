import type { Property, IntProperty, StringProperty, VideoFileProperty, ImageProperty, Group } from '@/types/umi-data';

export const isIntProperty = (prop: Property | undefined): prop is IntProperty => {
  return prop?.type === 'int' || prop?.type === 'boolean';
};

export const getIntPropertyValue = (prop: Property | undefined): number | undefined => {
  return isIntProperty(prop) ? prop.value.value : undefined;
};

export const isStringProperty = (prop: Property | undefined): prop is StringProperty => {
    return prop?.type === 'string' || prop?.type === 'text' || prop?.type === 'wysiwyg';
}

export const getStringPropertyValue = (prop: Property | undefined): string | undefined => {
    return isStringProperty(prop) ? prop.value.value : undefined;
}

// Функции для работы с видеофайлами
export const isVideoFileProperty = (prop: Property | undefined): prop is VideoFileProperty => {
    return prop?.type === 'video_file';
}

export const getVideoFilePropertyValue = (prop: Property | undefined): string | undefined => {
    return isVideoFileProperty(prop) ? prop.value.value : undefined;
}

// Функции для работы с изображениями
export const isImageProperty = (prop: Property | undefined): prop is ImageProperty => {
    return prop?.type === 'img_file';
}

export const getImagePropertyValue = (prop: Property | undefined): string | undefined => {
    return isImageProperty(prop) ? prop.value.value : undefined;
}

export const getAllProperties = (item: Group): Property[] => {
    if (item.property) return Object.values(item.property);
    if (item.properties?.group) {
        return Object.values(item.properties.group).flatMap(g =>
            g.property ? Object.values(g.property) : []
        );
    }
    return [];
};
