import type {UmiData} from "@/types/umi-data";
import {notFound} from "next/navigation";
import {fetchData} from "@/lib/server-api";
import {getBlockComponent} from "@/lib/block-components";
import {getIntPropertyValue} from "@/lib/property-values";

const Page = async ({params}: {params: Promise<{slug?: string[]}>}) => {
    const resolvedParams = await params;

    const path = resolvedParams.slug ? `/${resolvedParams.slug.join("/")}` : "/";

    let data: UmiData | null = null;

    try {
        data = await fetchData<UmiData>(`${process.env.NEXT_PUBLIC_API_URL}${path}.json`);
    } catch {
        notFound();
    }

    if (!data || !data.page) {
        notFound();
    }

    const groups = Object.values(data.page.properties.group).filter((group) => group.name.endsWith("_block"));

    const blocks = groups
        .map((group) => {
            const properties = Object.values(group.property);
            const activeProp = properties.find((p) => p.name === `${group.name}_active`);
            const orderProp = properties.find((p) => p.name === `${group.name}_order`);

            const isActive = getIntPropertyValue(activeProp) === 1;
            const order = getIntPropertyValue(orderProp) ?? Infinity;
            const Component = getBlockComponent(group.name);
            return {Component, isActive, order, data: group};
        })
        .filter((block) => block.isActive && block.Component)
        .sort((a, b) => a.order - b.order);

    return (
        <main>
            <div>
                {blocks.map((block) => {
                    const BlockComponent = block.Component;
                    return BlockComponent ? <BlockComponent key={block.data.id} data={block.data} /> : null;
                })}
            </div>
        </main>
    );
};

export default Page;
