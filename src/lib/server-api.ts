export const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Ошибка загрузки данных.');
  }

  const data: T = await response.json();

  return data;
};
