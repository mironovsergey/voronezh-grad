import type { MenuItem } from '@/types/menu-data';
import Link from 'next/link';

const Nav = ({ items }: { items: MenuItem[] }) => {
  return (
    <nav>
      {items.map((item) => (
        <Link key={item.id} href={item.link}>
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
