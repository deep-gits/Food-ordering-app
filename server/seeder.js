const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const categories = [
  { name: 'Pizza', icon: '🍕', description: 'Freshly baked Italian pizzas' },
  { name: 'Burgers', icon: '🍔', description: 'Juicy handcrafted burgers' },
  { name: 'Vegan', icon: '🥗', description: 'Plant-based healthy options' },
  { name: 'Sushi', icon: '🍱', description: 'Fresh Japanese rolls & sashimi' },
  { name: 'Desserts', icon: '🍰', description: 'Sweet treats and indulgences' },
  { name: 'Drinks', icon: '🥤', description: 'Refreshing beverages' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });
    console.log('Categories seeded');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@foodapp.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    });
    console.log('Users seeded');

    // Create menu items
    const menuItems = [
      // Pizza
      { name: 'Margherita Pizza', description: 'Classic tomato sauce, fresh mozzarella, and basil leaves on a crispy thin crust.', price: 12.99, category: catMap['Pizza'], isFeatured: true, isAvailable: true, preparationTime: 25, tags: ['vegetarian', 'classic'], image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
      { name: 'Pepperoni Feast', description: 'Loaded with spicy pepperoni, mozzarella, and our signature tomato sauce.', price: 15.99, category: catMap['Pizza'], isFeatured: true, isAvailable: true, preparationTime: 25, tags: ['spicy', 'meaty'], image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
      { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, red onions, and cheddar cheese.', price: 16.99, category: catMap['Pizza'], isAvailable: true, preparationTime: 30, tags: ['bbq', 'chicken'], image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80' },
      { name: 'Veggie Supreme', description: 'Bell peppers, mushrooms, olives, onions, and sundried tomatoes on tomato base.', price: 14.49, category: catMap['Pizza'], isAvailable: true, preparationTime: 25, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80' },
      // Burgers
      { name: 'Classic Smash Burger', description: 'Double smashed beef patties, American cheese, pickles, onions & special sauce.', price: 11.99, category: catMap['Burgers'], isFeatured: true, isAvailable: true, preparationTime: 15, tags: ['classic', 'beef'], image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
      { name: 'Spicy Jalapeño Burger', description: 'Juicy beef patty with jalapeños, pepper jack cheese, sriracha mayo & crispy lettuce.', price: 13.49, category: catMap['Burgers'], isAvailable: true, preparationTime: 15, tags: ['spicy', 'beef'], image: 'https://images.unsplash.com/photo-1594212204856-11b0e12e0e41?w=500&q=80' },
      { name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms, Swiss cheese, caramelized onions on a brioche bun.', price: 13.99, category: catMap['Burgers'], isAvailable: true, preparationTime: 20, tags: ['mushroom'], image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' },
      // Vegan
      { name: 'Quinoa Power Bowl', description: 'Quinoa, roasted chickpeas, avocado, kale, cherry tomatoes with tahini dressing.', price: 13.99, category: catMap['Vegan'], isFeatured: true, isAvailable: true, preparationTime: 10, tags: ['healthy', 'gluten-free'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
      { name: 'Jackfruit Tacos', description: 'Pulled jackfruit with smoky spices, mango salsa, and lime crema in corn tortillas.', price: 12.49, category: catMap['Vegan'], isAvailable: true, preparationTime: 15, tags: ['tacos', 'gluten-free'], image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80' },
      { name: 'Impossible Burger', description: 'Plant-based patty with vegan cheese, lettuce, tomato, and vegan mayo.', price: 14.99, category: catMap['Vegan'], isAvailable: true, preparationTime: 15, tags: ['plant-based'], image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&q=80' },
      // Sushi
      { name: 'Dragon Roll', description: 'Shrimp tempura inside, topped with avocado and spicy mayo drizzle.', price: 16.99, category: catMap['Sushi'], isFeatured: true, isAvailable: true, preparationTime: 20, tags: ['seafood', 'spicy'], image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
      { name: 'Salmon Nigiri (6 pcs)', description: 'Fresh Atlantic salmon slices over seasoned sushi rice.', price: 13.99, category: catMap['Sushi'], isAvailable: true, preparationTime: 15, tags: ['seafood', 'classic'], image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80' },
      // Desserts
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.', price: 8.99, category: catMap['Desserts'], isFeatured: true, isAvailable: true, preparationTime: 15, tags: ['chocolate', 'warm'], image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500&q=80' },
      { name: 'New York Cheesecake', description: 'Creamy classic cheesecake on a graham cracker crust with berry compote.', price: 7.99, category: catMap['Desserts'], isAvailable: true, preparationTime: 5, tags: ['cold', 'creamy'], image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
      // Drinks
      { name: 'Fresh Lemonade', description: 'House-squeezed lemonade with mint and a hint of ginger. Served chilled.', price: 4.49, category: catMap['Drinks'], isAvailable: true, preparationTime: 5, tags: ['cold', 'refreshing'], image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80' },
      { name: 'Mango Lassi', description: 'Thick and creamy mango yogurt drink, lightly spiced with cardamom.', price: 5.49, category: catMap['Drinks'], isFeatured: true, isAvailable: true, preparationTime: 5, tags: ['cold', 'creamy'], image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&q=80' },
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin: admin@foodapp.com / admin123');
    console.log('User:  john@example.com  / password123');
    console.log('─────────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
