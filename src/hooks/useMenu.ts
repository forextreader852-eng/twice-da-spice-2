import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, orderBy } from 'firebase/firestore';
import { MenuItem, Category } from '../types';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const seedData: Omit<MenuItem, 'id'>[] = [
    { name: "Sizzling Seekh Kebab", description: "Traditional beef kebabs grilled over coal with secret spices.", price: 1200, category: "BBQ", image: "https://images.unsplash.com/photo-1603360946369-dc9bb0258143?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Peshawari Chapli Kabab", description: "Special hand-minced beef patties with pomegranate seeds and marrow fat.", price: 1400, category: "BBQ", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1850&auto=format&fit=crop", isAvailable: true },
    { name: "Malai Boti", description: "Creamy chicken pieces marinated in yogurt and cream.", price: 950, category: "BBQ", image: "https://images.unsplash.com/photo-1626777552726-4a6b547b4e5c?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Zinger Burger Pro", description: "Extra crispy chicken fillet with spicy mayo & cheese.", price: 650, category: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Seekh Kabab Roll", description: "Soft paratha wrapped around grilled beef kababs with chutney and onions.", price: 450, category: "Fast Food", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1964&auto=format&fit=crop", isAvailable: true },
    { name: "Lahori Chicken Karahi", description: "Freshly prepared in butter with spices and fresh herbs.", price: 2100, category: "Desi", image: "https://images.unsplash.com/photo-1645177623570-7493e4c052e9?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Beef Haleem Special", description: "Slow-cooked lentil and beef stew, garnished with fried onions, ginger and lemon.", price: 850, category: "Desi", image: "https://images.unsplash.com/photo-1631515243349-e1cb75fffa1b?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Garlic Naan", description: "Soft, leavened bread topped with fresh garlic and cilantro.", price: 150, category: "Desi", image: "https://images.unsplash.com/photo-1601050690597-df056fb1cdb1?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Mutton Ribs BBQ", description: "Tender ribs grilled to perfection with lemon and salt.", price: 3500, category: "BBQ", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop", isAvailable: true },
    { name: "Chicken Manchurian", description: "Diced chicken in a zesty tomato-based gravy with bell peppers.", price: 1100, category: "Chinese", image: "https://images.unsplash.com/photo-1525755662778-9892b524287e?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Chicken Chow Mein", description: "Street style noodles with crunchy vegetables.", price: 850, category: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=1984&auto=format&fit=crop", isAvailable: true },
    { name: "Mint Margarita", description: "Refreshing blend of mint, lime and soda.", price: 250, category: "Drinks", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Mango Lassi", description: "Thick and creamy yogurt drink with real mango pulp.", price: 350, category: "Drinks", image: "https://images.unsplash.com/photo-1571006682855-3fc2759f26b5?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Peshawari Kahwa", description: "Traditional green tea with cardamom, saffron and crushed almonds.", price: 150, category: "Drinks", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1974&auto=format&fit=crop", isAvailable: true },
    { name: "Gulab Jamun", description: "Hot milk-solid balls dipped in rose-scented syrup.", price: 400, category: "Desi", image: "https://images.unsplash.com/photo-1593560739933-573fe4fdCC57?q=80&w=1934&auto=format&fit=crop", isAvailable: true },
    { name: "Afghani Tikka (Chicken)", description: "Succulent chicken chunks marinated in a mild blend of white pepper and lemon.", price: 1100, category: "BBQ", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1850&auto=format&fit=crop", isAvailable: true },
    { name: "Loaded Fries (Masala)", description: "Crispy fries topped with spicy masala, melted cheese, and garlic mayo.", price: 550, category: "Fast Food", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1974&auto=format&fit=crop", isAvailable: true },
    { name: "Egg Fried Rice", description: "Classic Chinese fried rice with bits of egg and fresh spring onions.", price: 750, category: "Chinese", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1925&auto=format&fit=crop", isAvailable: true },
    { name: "Daal Mash (Fry)", description: "Traditional lentils fried in desi ghee with green chillies and ginger.", price: 650, category: "Desi", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1974&auto=format&fit=crop", isAvailable: true },
    { name: "Special Doodh Patti", description: "Rich, creamy tea made with pure milk and premium tea leaves.", price: 180, category: "Drinks", image: "https://images.unsplash.com/photo-1563911191470-8559a19d87ee?q=80&w=1964&auto=format&fit=crop", isAvailable: true },
    { name: "Kheer", description: "Rich and creamy traditional rice pudding.", price: 350, category: "Desi", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Chicken Tikka (Leg)", description: "Quarter chicken leg piece marinated in hot spices and charcoal grilled.", price: 450, category: "BBQ", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1850&auto=format&fit=crop", isAvailable: true },
    { name: "Mutton Nihari", description: "Traditional slow-cooked beef shank stew in a rich spicy gravy.", price: 1800, category: "Desi", image: "https://images.unsplash.com/photo-1545231027-63b6f0a77ad6?q=80&w=2070&auto=format&fit=crop", isAvailable: true },
    { name: "Crispy Beef Burger", description: "Double beef patty with grilled onions, mushrooms and swiss cheese.", price: 950, category: "Fast Food", image: "https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f6?q=80&w=2071&auto=format&fit=crop", isAvailable: true },
    { name: "Fresh Lime Soda", description: "Classic digestive drink with fresh lemon, salt and sugar.", price: 180, category: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974&auto=format&fit=crop", isAvailable: true },
    { name: "Vegetable Spring Rolls", description: "Crispy fried rolls stuffed with seasoned julienne vegetables.", price: 450, category: "Chinese", image: "https://images.unsplash.com/photo-1623934133912-6a75787625ae?q=80&w=2070&auto=format&fit=crop", isAvailable: true }
  ];

  const fetchMenu = async () => {
    try {
      const q = query(collection(db, 'menu'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("Seeding initial menu data...");
        for (const item of seedData) {
          await addDoc(collection(db, 'menu'), item);
        }
        await fetchMenu();
        return;
      }

      const menuItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      
      setItems(menuItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return { items, loading };
}
