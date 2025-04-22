export type Page = {
    id: number;
    parentId: number;
    link: string;
    "object-id": number;
    "object-guid": string;
    "type-id": number;
    "type-guid": string;
    "alt-name": string;
    "update-time": number;
    name: string;
    href: string;
    "is-default"?: boolean;
    "is-visible"?: boolean;
    "is-active": boolean;
    basetype: {
        id: number;
        module: string;
        method: string;
        "hide-pages": number;
        title: string;
    };
};

export type StringProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "string" | "wysiwyg" | "text";
    title: string;
    "is-important": string;
    value: {
        value: string;
    };
};

export type IntProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "int";
    title: string;
    "is-important": string;
    value: {
        value: number;
    };
};

export type BooleanProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "boolean";
    title: string;
    "is-important": string;
    value: {
        value: number;
    };
};

export type RelationProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "relation";
    title: string;
    "is-important": string;
    multiple: string;
    "guide-id": string;
    "public-guide": number;
    value: {
        item: {
            [key: string]: {
                id: number;
                guid: string;
                name: string;
                "type-id": number;
                "type-guid": string;
                "update-time": string;
                ownerId: number;
                locked: number;
                href: string;
            };
        };
    };
};

export type SymlinkProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "symlink";
    title: string;
    "is-important": string;
    value: {
        page: {
            [key: string]: Page;
        };
    };
};

export type ImageProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "img_file";
    title: string;
    "is-important": string;
    value: {
        path: string;
        folder: string;
        name: string;
        ext: string;
        is_broken: string;
        value: string;
        width: number;
        height: number;
        alt: string;
        title: string;
    };
};

export type VideoFileProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "video_file";
    title: string;
    "is-important": string;
    value: {
        path: string;
        folder: string;
        name: string;
        ext: string;
        is_broken: string;
        value: string;
    };
};

export type MultipleImageProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "multiple_image";
    title: string;
    "is-important": string;
    value: {
        [key: string]: {
            id: number;
            path: string;
            size: number;
            ext: string;
            title: string;
            ord: number;
            folder_hash: string;
            file_hash: string;
            src: string;
            alt: string;
            width: number;
            height: number;
        };
    };
};

export type MultipleFileProperty = {
    id: number;
    "object-id": number;
    name: string;
    type: "multiple_file";
    title: string;
    "is-important": string;
    value: {
        [key: string]: {
            id: number;
            path: string;
            size: number;
            ext: string;
            title: string;
            ord: number;
            folder_hash: string;
            file_hash: string;
            src: string;
        };
    };
};

export type Property =
    | StringProperty
    | IntProperty
    | BooleanProperty
    | RelationProperty
    | SymlinkProperty
    | ImageProperty
    | VideoFileProperty
    | MultipleImageProperty
    | MultipleFileProperty;

export type Group = {
    id: number;
    name: string;
    title: string;
    tip: string;
    property?: {
        [key: string]: Property;
    };
    properties?: {
      [key: string]: Property;
  };
};

export type UmiData = {
    module: string;
    method: string;
    domain: string;
    "domain-id": number;
    "domain-url": string;
    "system-build": string;
    lang: string;
    "lang-id": number;
    "pre-lang": string;
    header: string;
    title: string;
    "site-name": string;
    csrf: string | null;
    meta: {
        keywords: string;
        description: string;
    };
    "request-url": string;
    "template-id": number;
    pageId?: number;
    "is-default"?: boolean;
    "request-uri": string;
    user: {
        id: number;
        type: string;
    };
    parents?: {
        page?: {
            [key: string]: Page;
        };
    };
    page?: Page & {
        properties: {
            group: {
                [key: string]: Group;
            };
        };
    };
};
