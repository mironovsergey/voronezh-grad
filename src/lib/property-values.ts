import type { Property, IntProperty } from '@/types/umi-data';

export const isIntProperty = (prop: Property | undefined): prop is IntProperty => {
  return prop?.type === 'int' || prop?.type === 'boolean';
};

export const getIntPropertyValue = (prop: Property | undefined): number | undefined => {
  return isIntProperty(prop) ? prop.value.value : undefined;
};
