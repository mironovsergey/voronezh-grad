import type { MenuData } from '@/types/menu-data';
import { fetchData } from '@/lib/server-api';
import Nav from '@/components/elements/nav';

const Header = async () => {
  let menuData: MenuData | null = null;

  try {
    menuData = await fetchData<MenuData>(
      `${process.env.NEXT_PUBLIC_API_URL}/udata/menu/draw/593.json`
    );
  } catch {
    return null;
  }

  if (!menuData || !menuData.item) {
    return null;
  }

  const menuItems = Object.values(menuData.item);

  return (
    <header>
      <Nav items={menuItems} />
    </header>
  );
};

export default Header;
