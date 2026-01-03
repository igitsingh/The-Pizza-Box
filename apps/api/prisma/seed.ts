import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // 1. Create Admin User
    const email = 'admin@thepizzabox.com';
    const password = 'adminpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: hashedPassword,
            name: 'Admin User',
            role: Role.ADMIN,
            phone: '1234567890',
        },
    });

    console.log('Admin user created:', admin.email);

    // 0. Safety Check for Production
    if (process.env.NODE_ENV === 'production' && !process.env.FORCE_SEED) {
        console.error('🔴 DANGER: Attempting to seed in PRODUCTION mode without FORCE_SEED.');
        console.error('   This action has been blocked to prevent data loss.');
        console.error('   To force seed, run: FORCE_SEED=true npm run prisma:seed');
        process.exit(1);
    }

    // 1. Check for existing data
    const categoryCount = await prisma.category.count();
    if (categoryCount > 0 && !process.env.FORCE_SEED) {
        console.log('Database already contains data. Skipping seed to prevent data loss.');
        return;
    }

    console.log('Seeding database...');

    // 2. Create Categories
    const categories = [
        {
            name: 'Pizzas',
            slug: 'pizzas',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
            seoTitle: 'Order Best Pizzas Online in Meerut | The Pizza Box',
            seoDescription: 'Order fresh and hot pizzas online from The Pizza Box. Best pizza delivery in Prabhat Nagar, Meerut. Wide range of veg and non-veg pizzas.',
        },
        {
            name: 'Burgers',
            slug: 'burgers',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
            seoTitle: 'Best Burgers in Meerut | Crispy Chicken & Veg Burgers',
            seoDescription: 'Craving burgers? Order juicy and crispy burgers from The Pizza Box. Best burger delivery in Meerut.',
        },
        {
            name: 'Sides',
            slug: 'sides',
            image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500&q=80',
            seoTitle: 'Garlic Bread, Wings & Sides Delivery | The Pizza Box',
            seoDescription: 'Complete your meal with our delicious sides. Garlic bread, chicken wings, and more available for delivery in Meerut.',
        },
        {
            name: 'Beverages',
            slug: 'beverages',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',
            seoTitle: 'Cold Drinks & Shakes Delivery | The Pizza Box',
            seoDescription: 'Thirsty? Order cold drinks and thick shakes from The Pizza Box to go with your meal.',
        },
        {
            name: 'Desserts',
            slug: 'desserts',
            image: 'https://images.unsplash.com/photo-1563729768640-d65d19a33227?w=500&q=80',
            seoTitle: 'Delicious Desserts | The Pizza Box',
            seoDescription: 'Sweet treats to end your meal. Order desserts online in Meerut.',
        },
        {
            name: 'Deals',
            slug: 'deals',
            image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&q=80',
            seoTitle: 'Best Pizza Deals & Offers | The Pizza Box',
            seoDescription: 'Save big with our exclusive pizza deals and combos. Best offers in Prabhat Nagar.',
        },
        {
            name: 'Pasta',
            slug: 'pasta',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80',
            seoTitle: 'Creamy Pasta Delivery | The Pizza Box',
            seoDescription: 'Order rich and creamy pasta online. White sauce, red sauce, and more.',
        },
        {
            name: 'New',
            slug: 'new',
            image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500&q=80',
            seoTitle: 'New Arrivals | The Pizza Box',
            seoDescription: 'Check out the latest additions to our menu. Try something new today!',
        }
    ];

    const createdCategories = [];
    for (const cat of categories) {
        const upserted = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: cat,
            create: cat,
        });
        createdCategories.push(upserted);
    }

    const pizzaCategory = createdCategories.find(c => c.name === 'Pizzas');
    const burgerCategory = createdCategories.find(c => c.name === 'Burgers');
    const sidesCategory = createdCategories.find(c => c.name === 'Sides');
    const beveragesCategory = createdCategories.find(c => c.name === 'Beverages');

    const dessertsCategory = createdCategories.find(c => c.name === 'Desserts');
    const pastaCategory = createdCategories.find(c => c.name === 'Pasta');
    const newCategory = createdCategories.find(c => c.name === 'New');

    // 2.5 Create Locations
    const locations = [
        {
            name: 'Prabhat Nagar',
            slug: 'best-pizza-in-prabhat-nagar-meerut',
            seoTitle: 'Best Pizza in Prabhat Nagar Meerut | Top Rated Local Delivery',
            seoDescription: 'Hungry in Prabhat Nagar? Order the best pizza in Prabhat Nagar, Meerut from The Pizza Box. Hand-tossed, fresh ingredients, and lightning-fast delivery. Order now!',
            content: `
                <h1>Best Pizza in Prabhat Nagar Meerut</h1>
                <p>Welcome to **The Pizza Box**, your #1 destination for authentic, mouth-watering pizzas in the heart of Prabhat Nagar. We take pride in being the most-loved local pizza brand, outperforming national chains with our fresh dough and premium toppings.</p>
                <h2>Why we are the Top Choice in Prabhat Nagar?</h2>
                <ul>
                    <li><strong>Freshly Made:</strong> Every pizza is prepared only after you order.</li>
                    <li><strong>Local Favorite:</strong> Trusted by thousands of residents in Prabhat Nagar.</li>
                    <li><strong>Fast Delivery:</strong> Hot and fresh pizza at your doorstep within 30 minutes.</li>
                </ul>
                <p>Order today and experience the difference!</p>
            `
        },
        {
            name: 'Veg Pizza in Meerut',
            slug: 'best-veg-pizza-in-meerut',
            seoTitle: 'Best Veg Pizza in Meerut | Fresh & 100% Pure Veg | The Pizza Box',
            seoDescription: 'Craving the best veg pizza in Meerut? The Pizza Box offers a wide range of delicious, 100% pure vegetarian pizzas. From Paneer Makhani to Cheese Burst, order online now!',
            content: `
                <h1>Best Veg Pizza in Meerut</h1>
                <p>Searching for "best veg pizza near me"? Look no further! The Pizza Box is Meerut's specialized vegetarian pizza outlet. We use 100% pure vegetarian ingredients to ensure the most authentic taste.</p>
                <h2>Our Bestselling Veg Pizzas</h2>
                <p>Our customers swear by our Paneer Tikka Pizza and Veggie Paradise. Loaded with fresh capsicum, onion, tomato, and premium mozzarella cheese.</p>
            `
        },
        {
            name: 'Affordable Pizza Meerut',
            slug: 'affordable-pizza-delivery-meerut',
            seoTitle: 'Affordable Pizza in Meerut | Best Taste at Low Price',
            seoDescription: 'Get high-quality pizza at student-friendly prices. Affordable pizza delivery in Meerut starting at just ₹169. Quality you can trust, price you can afford.',
            content: `
                <h1>Affordable Pizza in Meerut</h1>
                <p>Luxury taste doesn't have to be expensive. At The Pizza Box, we provide the most affordable pizza in Meerut without compromising on quality or hygiene. Perfect for students and families!</p>
            `
        },
        {
            name: 'Late Night Pizza Meerut',
            slug: 'late-night-pizza-delivery-meerut',
            seoTitle: 'Late Night Pizza Delivery Meerut | Midnight Cravings Fixed',
            seoDescription: 'Hungry at midnight? We provide the fastest late-night pizza delivery in Meerut. Order hot and fresh pizzas even after 11 PM. Satisfaction guaranteed.',
            content: `
                <h1>Late Night Pizza Delivery Meerut</h1>
                <p>Don't let midnight hunger pangs ruin your vibe. We are Meerut's favorite late-night food partner. Order from our extensive menu and get it delivered hot to your doorstep anywhere in Meerut.</p>
            `
        },
        {
            name: 'Cheese Burst Pizza Meerut',
            slug: 'cheese-burst-pizza-meerut',
            seoTitle: 'Extra Loaded Cheese Burst Pizza in Meerut | Order Online',
            seoDescription: 'Love extra cheese? Try our signature Cheese Burst Pizza in Meerut. Infused with creamy liquid cheese that overflows with every bite. The ultimate cheesy delight!',
            content: `
                <h1>Cheese Burst Pizza Meerut</h1>
                <p>Experience the ultimate cheese explosion! Our Cheese Burst crust is famous across Meerut for its rich, creamy filling. Whether it\'s a simple Margherita or a loaded Veggie Island, our regular cheese burst makes it 10x better.</p>
            `
        },
        {
            name: 'Saket',
            slug: 'pizza-delivery-saket-meerut',
            seoTitle: 'Best Pizza Delivery in Saket Meerut | The Pizza Box',
            seoDescription: 'Experience the best pizza delivery in Saket, Meerut. Fast, fresh, and delicious pizzas from The Pizza Box. Order online and get exclusive Saket-only deals!',
            content: '<h1>Pizza Delivery in Saket</h1><p>Residents of Saket trust The Pizza Box for their weekend cravings. We deliver hot and fresh across Saket with a 30-minute guarantee.</p>'
        },
        {
            name: 'Shastri Nagar',
            slug: 'pizza-delivery-shastri-nagar-meerut',
            seoTitle: 'Best Pizza & Burger Delivery in Shastri Nagar Meerut',
            seoDescription: 'Order fresh pizza and juicy burgers in Shastri Nagar, Meerut. Fast home delivery from The Pizza Box. Top rated restaurant in Shastri Nagar.',
            content: '<h1>Food Delivery in Shastri Nagar</h1><p>Enjoy the best pizzas and burgers in Shastri Nagar. We deliver hot and fresh to your doorstep.</p>'
        },
        {
            name: 'Ganga Nagar',
            slug: 'food-delivery-ganga-nagar-meerut',
            seoTitle: 'Online Food Delivery in Ganga Nagar Meerut | The Pizza Box',
            seoDescription: 'Craving pizza in Ganga Nagar? The Pizza Box offers the fastest food delivery in Ganga Nagar, Meerut. Order online now!',
            content: '<h1>Ganga Nagar Food Delivery</h1><p>Serving the residents of Ganga Nagar with delicious meals and quick delivery.</p>'
        },
        {
            name: 'Ganga Nagar',
            slug: 'food-delivery-ganga-nagar-meerut',
            seoTitle: 'Online Food Delivery in Ganga Nagar Meerut | The Pizza Box',
            seoDescription: 'Craving pizza in Ganga Nagar? The Pizza Box offers the fastest food delivery in Ganga Nagar, Meerut. Order online now!',
            content: '<h1>Ganga Nagar Food Delivery</h1><p>Serving the residents of Ganga Nagar with delicious meals and quick delivery.</p>'
        },
        {
            name: 'Modipuram',
            slug: 'pizza-delivery-modipuram-meerut',
            seoTitle: 'Pizza Delivery in Modipuram Meerut | Hot & Fresh',
            seoDescription: 'Live in Modipuram? Get piping hot pizzas delivered to your home. Best pizza shop near Modipuram, Meerut.',
            content: '<h1>Pizza Delivery Modipuram</h1><p>We cover Modipuram and nearby areas. Order your favorite pizza today.</p>'
        },
        {
            name: 'Defence Colony',
            slug: 'defence-colony-meerut-food-delivery',
            seoTitle: 'Defence Colony Meerut Food Delivery | Pizza & Snacks',
            seoDescription: 'Premium food delivery in Defence Colony, Meerut. Order gourmet pizzas, garlic bread, and more from The Pizza Box.',
            content: '<h1>Defence Colony Delivery</h1><p>Exclusive delivery service for Defence Colony residents.</p>'
        },
        {
            name: 'Pallavpuram',
            slug: 'pallavpuram-meerut-pizza-delivery',
            seoTitle: 'Pizza Delivery in Pallavpuram Phase 1 & 2 Meerut',
            seoDescription: 'Serving both Phase 1 and Phase 2 of Pallavpuram. Best pizza delivery service in Pallavpuram, Meerut.',
            content: '<h1>Pallavpuram Pizza Delivery</h1><p>Fast delivery across Pallavpuram. Try our bestsellers today.</p>'
        },
        {
            name: 'Kanker Khera',
            slug: 'kanker-khera-meerut-food-delivery',
            seoTitle: 'Food Delivery in Kanker Khera Meerut | Order Online',
            seoDescription: 'Order food online in Kanker Khera. We deliver pizzas, burgers, and pastas to Kanker Khera, Meerut.',
            content: '<h1>Kanker Khera Food Delivery</h1><p>Delicious food delivered to Kanker Khera. Order online now.</p>'
        },
        {
            name: 'Meerut Cantt',
            slug: 'meerut-cantt-pizza-delivery',
            seoTitle: 'Pizza Delivery in Meerut Cantt | The Pizza Box',
            seoDescription: 'Serving the Meerut Cantt area with the best pizzas in town. Order online for quick delivery to Cantonment area.',
            content: '<h1>Meerut Cantt Pizza Delivery</h1><p>We are proud to serve the Meerut Cantonment area with premium quality pizzas.</p>'
        },
        {
            name: 'Abulane',
            slug: 'abulane-meerut-food-delivery',
            seoTitle: 'Food Delivery Abulane Meerut | Pizza & Fast Food',
            seoDescription: 'Shopping in Abulane? Order a quick bite or get food delivered to your home in Abulane, Meerut.',
            content: '<h1>Abulane Food Delivery</h1><p>Quick bites and meal delivery in the heart of Meerut, Abulane.</p>'
        },
        {
            name: 'Begum Bridge',
            slug: 'begum-bridge-meerut-pizza',
            seoTitle: 'Pizza Delivery near Begum Bridge Meerut',
            seoDescription: 'Hot pizza delivery near Begum Bridge. The Pizza Box is your go-to place for tasty food in central Meerut.',
            content: '<h1>Begum Bridge Pizza</h1><p>Serving the busy area of Begum Bridge with tasty pizzas.</p>'
        }
    ];

    for (const loc of locations) {
        await prisma.location.upsert({
            where: { slug: loc.slug },
            update: loc,
            create: loc,
        });
    }

    // 3. Create Menu Items
    // Clear existing items to avoid duplicates if re-seeding (optional, but good for clean slate)
    // await prisma.item.deleteMany({}); 

    if (pizzaCategory) {
        const pizzas = [
            {
                name: 'Cheese & Tomato Pizza',
                description: 'A classic choice loved across Prabhat Nagar. Fresh tomato, rich mozzarella, and a crisp base make this the perfect affordable veg pizza in Meerut for everyday cravings.',
                price: 169,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
                slug: 'cheese-and-tomato-pizza',
                seoTitle: 'Cheese & Tomato Pizza | Best Veg Pizza in Prabhat Nagar Meerut',
                seoDescription: 'Order Cheese & Tomato Pizza online in Meerut. Fresh tomatoes, mozzarella cheese, and crispy crust. Best affordable veg pizza in Prabhat Nagar.',
                altText: 'Cheese and Tomato Pizza with fresh toppings'
            },
            {
                name: 'Cheese N Corn Pizza',
                description: 'A creamy, cheesy delight topped with sweet American corn. One of the highest-rated veg pizzas in Meerut for its balance of taste and value.',
                price: 169,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                slug: 'cheese-n-corn-pizza',
                seoTitle: 'Cheese N Corn Pizza Delivery | Sweet Corn Pizza Meerut',
                seoDescription: 'Delicious Cheese N Corn Pizza with sweet American corn and creamy cheese. Top-rated veg pizza in Meerut available for delivery.',
                altText: 'Cheese N Corn Pizza with sweet corn toppings'
            },
            {
                name: 'Cheese N Capsicum Pizza',
                description: 'Loaded with fresh capsicum and mozzarella, this pizza is a favourite for those who love light, crunchy toppings with classic Italian flavours.',
                price: 169,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
                slug: 'cheese-n-capsicum-pizza',
                seoTitle: 'Cheese N Capsicum Pizza | Crunchy Veg Pizza in Meerut',
                seoDescription: 'Order Cheese N Capsicum Pizza. Fresh capsicum and mozzarella cheese on a crispy base. A favorite light and crunchy pizza in Meerut.',
                altText: 'Cheese N Capsicum Pizza with fresh green peppers'
            },
            {
                name: 'Cheese N Onion Pizza',
                description: 'Perfectly caramelized onions combined with stretchy cheese create a deliciously comforting pizza, ideal for quick meals or late-night orders in Meerut.',
                price: 169,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80',
                slug: 'cheese-n-onion-pizza',
                seoTitle: 'Cheese N Onion Pizza | Caramelized Onion Pizza Meerut',
                seoDescription: 'Comforting Cheese N Onion Pizza with caramelized onions and stretchy cheese. Perfect for late-night cravings in Meerut.',
                altText: 'Cheese N Onion Pizza with caramelized onions'
            },
            {
                name: 'Cheese N Paneer With Onion Pizza',
                description: 'Soft paneer cubes, onions, and mozzarella come together to create a rich, flavorful pizza perfect for paneer lovers in Prabhat Nagar.',
                price: 199,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'cheese-n-paneer-with-onion-pizza',
                seoTitle: 'Cheese N Paneer Onion Pizza | Paneer Pizza Prabhat Nagar',
                seoDescription: 'Rich Cheese N Paneer With Onion Pizza. Soft paneer cubes and onions. A must-try for paneer lovers in Prabhat Nagar, Meerut.',
                altText: 'Cheese N Paneer With Onion Pizza loaded with toppings'
            },
            {
                name: 'Cheese N Paneer With Mushroom Pizza',
                description: 'A premium pizza loaded with fresh mushrooms and soft paneer — a popular choice among mushroom fans who love restaurant-style flavours at home.',
                price: 209,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                slug: 'cheese-n-paneer-with-mushroom-pizza',
                seoTitle: 'Cheese N Paneer Mushroom Pizza | Premium Veg Pizza Meerut',
                seoDescription: 'Premium Cheese N Paneer With Mushroom Pizza. Fresh mushrooms and soft paneer. Restaurant-style flavor delivered to your home in Meerut.',
                altText: 'Cheese N Paneer With Mushroom Pizza'
            },
            {
                name: 'Spicy Sweet Corn Pizza',
                description: 'Combining the sweetness of corn with light spices, this pizza offers a fun flavour twist loved by families and kids in Meerut.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
                slug: 'spicy-sweet-corn-pizza',
                seoTitle: 'Spicy Sweet Corn Pizza | Sweet & Spicy Pizza Meerut',
                seoDescription: 'Spicy Sweet Corn Pizza combining sweet corn with light spices. A fun flavor twist loved by kids and families in Meerut.',
                altText: 'Spicy Sweet Corn Pizza'
            },
            {
                name: 'Spicy Chilli Pizza',
                description: 'A signature spicy pizza layered with green chillies and cheese — perfect for spice lovers searching for bold flavours in Prabhat Nagar.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
                slug: 'spicy-chilli-pizza',
                seoTitle: 'Spicy Chilli Pizza | Bold Spicy Pizza Prabhat Nagar',
                seoDescription: 'Signature Spicy Chilli Pizza with green chillies and cheese. Perfect for spice lovers in Prabhat Nagar looking for bold flavors.',
                altText: 'Spicy Chilli Pizza with green chillies'
            },
            {
                name: 'Chilli Paneer Mushroom Pizza',
                description: 'A fusion pizza that mixes Indo-Chinese taste with Italian crust. Loaded with paneer, mushrooms, chillies — ideal for those who enjoy spicy, tangy blends.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'chilli-paneer-mushroom-pizza',
                seoTitle: 'Chilli Paneer Mushroom Pizza | Indo-Chinese Fusion Pizza',
                seoDescription: 'Fusion Chilli Paneer Mushroom Pizza. Indo-Chinese taste with Italian crust. Spicy and tangy blend with paneer and mushrooms.',
                altText: 'Chilli Paneer Mushroom Pizza'
            },
            {
                name: 'Chilli Paneer Pizza',
                description: 'One of the best-selling pizzas at The Pizza Box. Soft paneer chunks tossed with chilli seasoning make it a top pick among students & youngsters.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'chilli-paneer-pizza',
                seoTitle: 'Chilli Paneer Pizza | Best Selling Spicy Paneer Pizza',
                seoDescription: 'Chilli Paneer Pizza, a bestseller at The Pizza Box. Soft paneer chunks with chilli seasoning. Top pick for students in Meerut.',
                altText: 'Chilli Paneer Pizza with spicy paneer chunks'
            },
            {
                name: 'Paneer Makhani Pizza',
                description: 'Rich makhani gravy, paneer cubes & cheese on a soft crust — North Indian flavours meet Italian style. Extremely popular in Meerut.',
                price: 209,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'paneer-makhani-pizza',
                seoTitle: 'Paneer Makhani Pizza | North Indian Fusion Pizza Meerut',
                seoDescription: 'Paneer Makhani Pizza with rich makhani gravy and paneer cubes. North Indian flavors on a soft Italian crust. Popular in Meerut.',
                altText: 'Paneer Makhani Pizza with rich gravy'
            },
            {
                name: 'Tandoori Paneer Pizza',
                description: 'Smoky tandoori paneer, bold spices, and melted cheese create a restaurant-style pizza that’s a hit for parties and family orders.',
                price: 209,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'tandoori-paneer-pizza',
                seoTitle: 'Tandoori Paneer Pizza | Smoky Paneer Pizza Delivery',
                seoDescription: 'Smoky Tandoori Paneer Pizza with bold spices and melted cheese. Restaurant-style pizza perfect for parties in Meerut.',
                altText: 'Tandoori Paneer Pizza with smoky toppings'
            },
            {
                name: 'Half Tandoori & Half Veggie Pizza',
                description: 'A dual-flavour pizza giving you two experiences in one — perfect for indecisive eaters or couples sharing a meal.',
                price: 209,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                slug: 'half-tandoori-half-veggie-pizza',
                seoTitle: 'Half Tandoori & Half Veggie Pizza | Dual Flavor Pizza',
                seoDescription: 'Half Tandoori & Half Veggie Pizza. Two flavors in one. Perfect for sharing or indecisive eaters in Meerut.',
                altText: 'Half Tandoori and Half Veggie Pizza'
            },
            {
                name: 'Half Paneer & Half Margherita Pizza',
                description: 'Simple meets indulgent. Margherita on one side, paneer on the other — ideal for a balanced meal.',
                price: 209,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
                slug: 'half-paneer-half-margherita-pizza',
                seoTitle: 'Half Paneer & Half Margherita Pizza | Balanced Pizza Choice',
                seoDescription: 'Half Paneer & Half Margherita Pizza. Simple Margherita meets indulgent paneer. Ideal balanced meal for pizza lovers.',
                altText: 'Half Paneer and Half Margherita Pizza'
            },
            {
                name: 'Half Veg Loaded & Half Mexican Pizza',
                description: 'Veg loaded for Indian taste + Mexican seasoning for tangy chilli flavour — best of both worlds.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
                slug: 'half-veg-loaded-half-mexican-pizza',
                seoTitle: 'Half Veg Loaded & Half Mexican Pizza | Indian & Mexican Fusion',
                seoDescription: 'Half Veg Loaded & Half Mexican Pizza. Veg loaded for Indian taste plus Mexican seasoning for tangy flavor. Best of both worlds.',
                altText: 'Half Veg Loaded and Half Mexican Pizza'
            },
            {
                name: 'Half Makhani & Half Spicy Chilli Pizza',
                description: 'A sweet, buttery makhani flavour combined with spicy chilli — great for people who love experimenting.',
                price: 209,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'half-makhani-half-spicy-chilli-pizza',
                seoTitle: 'Half Makhani & Half Spicy Chilli Pizza | Sweet & Spicy Combo',
                seoDescription: 'Half Makhani & Half Spicy Chilli Pizza. Sweet buttery makhani flavor combined with spicy chilli. Great for experimental pizza lovers.',
                altText: 'Half Makhani and Half Spicy Chilli Pizza'
            },
            {
                name: 'Indo Western Veggie Pizza',
                description: 'Olives, tomato, baby corn, mushrooms & mozzarella make this a premium exotic pizza — one of the most flavour-rich veg pizzas in Meerut.',
                price: 239,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
                slug: 'indo-western-veggie-pizza',
                seoTitle: 'Indo Western Veggie Pizza | Premium Exotic Veg Pizza',
                seoDescription: 'Indo Western Veggie Pizza with olives, tomato, baby corn, and mushrooms. One of the most flavor-rich premium veg pizzas in Meerut.',
                altText: 'Indo Western Veggie Pizza with exotic toppings'
            },
            {
                name: 'Double Cheese Margherita Pizza',
                description: 'Cheese lovers’ favourite. Extra mozzarella, creamy flavour, and classic Italian taste.',
                price: 219,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
                slug: 'double-cheese-margherita-pizza',
                seoTitle: 'Double Cheese Margherita Pizza | Extra Cheese Pizza Meerut',
                seoDescription: 'Double Cheese Margherita Pizza. A cheese lover\'s favorite with extra mozzarella and creamy flavor. Classic Italian taste.',
                altText: 'Double Cheese Margherita Pizza'
            },
            {
                name: 'Peppy Paneer Pizza',
                description: 'Paneer, capsicum, and red paprika — a Domino’s-style flavour recreated with a local twist.',
                price: 219,
                isVeg: true,
                isSpicy: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
                slug: 'peppy-paneer-pizza',
                seoTitle: 'Peppy Paneer Pizza | Spicy Paneer Pizza with Local Twist',
                seoDescription: 'Peppy Paneer Pizza with paneer, capsicum, and red paprika. Domino\'s-style flavor recreated with a local twist in Meerut.',
                altText: 'Peppy Paneer Pizza with red paprika'
            },
            {
                name: 'Farm House Pizza',
                description: 'Onion, capsicum, tomato, mushrooms create a garden-fresh pizza ideal for veggie lovers.',
                price: 219,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                slug: 'farm-house-pizza',
                seoTitle: 'Farm House Pizza | Garden Fresh Veggie Pizza Meerut',
                seoDescription: 'Farm House Pizza with onion, capsicum, tomato, and mushrooms. Garden-fresh pizza ideal for veggie lovers in Meerut.',
                altText: 'Farm House Pizza with fresh vegetables'
            },
            {
                name: 'Mexican Green Wave Pizza',
                description: 'Mexican herbs, jalapenos, capsicum & onions give a spicy-tangy flavour—very popular among students.',
                price: 219,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
                slug: 'mexican-green-wave-pizza',
                seoTitle: 'Mexican Green Wave Pizza | Spicy Mexican Pizza Meerut',
                seoDescription: 'Mexican Green Wave Pizza with herbs, jalapenos, capsicum, and onions. Spicy-tangy flavor popular among students in Meerut.',
                altText: 'Mexican Green Wave Pizza with jalapenos'
            },
            {
                name: 'Cheesy Mozzarella Delight Pizza',
                description: 'Extra smooth mozzarella and buttery crust — a soft, rich, cheesy experience.',
                price: 199,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
                slug: 'cheesy-mozzarella-delight-pizza',
                seoTitle: 'Cheesy Mozzarella Delight Pizza | Rich Cheesy Pizza',
                seoDescription: 'Cheesy Mozzarella Delight Pizza with extra smooth mozzarella and buttery crust. A soft, rich, and cheesy experience.',
                altText: 'Cheesy Mozzarella Delight Pizza'
            },
            {
                name: 'Veggie Island Pizza',
                description: 'Loaded with veggies, mozzarella, olives, capsicum & onion — perfect for group sharing.',
                price: 239,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
                slug: 'veggie-island-pizza',
                seoTitle: 'Veggie Island Pizza | Loaded Veggie Pizza for Sharing',
                seoDescription: 'Veggie Island Pizza loaded with veggies, mozzarella, olives, capsicum, and onion. Perfect for group sharing in Meerut.',
                altText: 'Veggie Island Pizza loaded with veggies'
            }
        ];

        // Define Standard Options
        const sizeOption = {
            name: 'Size',
            choices: [
                { name: 'Regular', price: 0 },
                { name: 'Medium', price: 200 },
                { name: 'Large', price: 400 }
            ]
        };

        const crustOption = {
            name: 'Crust',
            choices: [
                { name: 'New Hand Tossed', price: 0 },
                { name: 'Wheat Thin Crust', price: 50 },
                { name: 'Cheese Burst', price: 99 },
                { name: 'Fresh Pan Pizza', price: 50 }
            ]
        };

        // Define Standard Addons
        const standardAddons = [
            { name: 'Extra Cheese', price: 60 },
            { name: 'Black Olives', price: 40 },
            { name: 'Jalapenos', price: 40 },
            { name: 'Red Paprika', price: 40 },
            { name: 'Golden Corn', price: 40 }
        ];

        for (const item of pizzas) {
            const createdItem = await prisma.item.create({ data: { ...item, categoryId: pizzaCategory.id } });

            // Create Size Option
            const sizeOpt = await prisma.itemOption.create({
                data: {
                    itemId: createdItem.id,
                    name: sizeOption.name
                }
            });
            for (const choice of sizeOption.choices) {
                await prisma.optionChoice.create({
                    data: {
                        optionId: sizeOpt.id,
                        name: choice.name,
                        price: choice.price
                    }
                });
            }

            // Create Crust Option
            const crustOpt = await prisma.itemOption.create({
                data: {
                    itemId: createdItem.id,
                    name: crustOption.name
                }
            });
            for (const choice of crustOption.choices) {
                await prisma.optionChoice.create({
                    data: {
                        optionId: crustOpt.id,
                        name: choice.name,
                        price: choice.price
                    }
                });
            }

            // Create Addons
            for (const addon of standardAddons) {
                await prisma.itemAddon.create({
                    data: {
                        itemId: createdItem.id,
                        name: addon.name,
                        price: addon.price
                    }
                });
            }
        }
    }

    if (burgerCategory) {
        const burgers = [
            {
                name: 'Crispy Chicken Burger',
                description: 'Crispy fried chicken patty with lettuce and mayo.',
                price: 199,
                isVeg: false,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
                slug: 'crispy-chicken-burger',
                seoTitle: 'Crispy Chicken Burger | Best Chicken Burger Meerut',
                seoDescription: 'Crispy Chicken Burger with fried chicken patty, lettuce, and mayo. Best chicken burger in Meerut.',
                altText: 'Crispy Chicken Burger'
            },
            {
                name: 'Veggie Burger',
                description: 'A huge vegetable patty with special sauces.',
                price: 149,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
                slug: 'veggie-burger',
                seoTitle: 'Veggie Burger | Delicious Veg Burger Meerut',
                seoDescription: 'Veggie Burger with a huge vegetable patty and special sauces. Delicious veg burger option in Meerut.',
                altText: 'Veggie Burger'
            },
            {
                name: 'Spicy Paneer Burger',
                description: 'Rich paneer patty with spicy sauce.',
                price: 179,
                isVeg: true,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
                slug: 'spicy-paneer-burger',
                seoTitle: 'Spicy Paneer Burger | Spicy Veg Burger Meerut',
                seoDescription: 'Spicy Paneer Burger with rich paneer patty and spicy sauce. A spicy treat for burger lovers in Meerut.',
                altText: 'Spicy Paneer Burger'
            }
        ];
        for (const item of burgers) {
            await prisma.item.create({ data: { ...item, categoryId: burgerCategory.id } });
        }
    }

    if (sidesCategory) {
        const sides = [
            {
                name: 'Garlic Breadsticks',
                description: 'Baked to perfection with garlic butter.',
                price: 129,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80',
                slug: 'garlic-breadsticks',
                seoTitle: 'Garlic Breadsticks | Freshly Baked Sides',
                seoDescription: 'Garlic Breadsticks baked to perfection with garlic butter. The perfect side for your pizza.',
                altText: 'Garlic Breadsticks'
            },
            {
                name: 'Stuffed Garlic Bread',
                description: 'Freshly baked garlic bread with cheese and corn filling.',
                price: 159,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1619535860434-7f086338b3d2?w=800&q=80',
                slug: 'stuffed-garlic-bread',
                seoTitle: 'Stuffed Garlic Bread | Cheese & Corn Filled Bread',
                seoDescription: 'Stuffed Garlic Bread with cheese and corn filling. Freshly baked and delicious.',
                altText: 'Stuffed Garlic Bread'
            },
            {
                name: 'Spicy Chicken Wings',
                description: 'Juicy chicken wings tossed in spicy sauce.',
                price: 249,
                isVeg: false,
                isSpicy: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
                slug: 'spicy-chicken-wings',
                seoTitle: 'Spicy Chicken Wings | Juicy Wings Meerut',
                seoDescription: 'Juicy Spicy Chicken Wings tossed in spicy sauce. A perfect non-veg side dish.',
                altText: 'Spicy Chicken Wings'
            }
        ];
        for (const item of sides) {
            await prisma.item.create({ data: { ...item, categoryId: sidesCategory.id } });
        }
    }

    if (beveragesCategory) {
        const beverages = [
            {
                name: 'Coke (500ml)',
                description: 'Refreshing carbonated soft drink.',
                price: 60,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
                slug: 'coke-500ml',
                seoTitle: 'Coke (500ml) | Refreshing Drink',
                seoDescription: 'Refreshing Coke (500ml) to accompany your meal.',
                altText: 'Coke Bottle'
            },
            {
                name: 'Chocolate Shake',
                description: 'Thick and creamy chocolate milkshake.',
                price: 149,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
                slug: 'chocolate-shake',
                seoTitle: 'Chocolate Shake | Creamy Milkshake Meerut',
                seoDescription: 'Thick and creamy Chocolate Shake. A sweet treat to end your meal.',
                altText: 'Chocolate Shake'
            }
        ];
        for (const item of beverages) {
            await prisma.item.create({ data: { ...item, categoryId: beveragesCategory.id } });
        }
    }

    if (dessertsCategory) {
        const desserts = [
            {
                name: 'Choco Lava Cake',
                description: 'Warm, gooey chocolate cake with a molten center.',
                price: 99,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1563729768640-d65d19a33227?w=800&q=80',
                slug: 'choco-lava-cake',
                seoTitle: 'Choco Lava Cake | Molten Chocolate Cake',
                seoDescription: 'Warm Choco Lava Cake with a molten chocolate center. A perfect dessert.',
                altText: 'Choco Lava Cake'
            },
            {
                name: 'Brownie with Ice Cream',
                description: 'Fudgy brownie served with vanilla ice cream.',
                price: 129,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&q=80',
                slug: 'brownie-with-ice-cream',
                seoTitle: 'Brownie with Ice Cream | Fudgy Brownie Dessert',
                seoDescription: 'Fudgy Brownie served with vanilla ice cream. A classic dessert combination.',
                altText: 'Brownie with Ice Cream'
            }
        ];
        for (const item of desserts) {
            await prisma.item.create({ data: { ...item, categoryId: dessertsCategory.id } });
        }
    }

    if (pastaCategory) {
        const pastas = [
            {
                name: 'White Sauce Pasta',
                description: 'Creamy pasta tossed with fresh vegetables and herbs.',
                price: 199,
                isVeg: true,
                isBestSeller: true,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
                slug: 'white-sauce-pasta',
                seoTitle: 'White Sauce Pasta | Creamy Veg Pasta',
                seoDescription: 'Creamy White Sauce Pasta tossed with fresh vegetables and herbs. A rich and flavorful dish.',
                altText: 'White Sauce Pasta'
            },
            {
                name: 'Red Sauce Pasta',
                description: 'Tangy tomato-based pasta with exotic veggies.',
                price: 199,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
                slug: 'red-sauce-pasta',
                seoTitle: 'Red Sauce Pasta | Tangy Tomato Pasta',
                seoDescription: 'Tangy Red Sauce Pasta with exotic veggies. A classic Italian dish.',
                altText: 'Red Sauce Pasta'
            }
        ];
        for (const item of pastas) {
            await prisma.item.create({ data: { ...item, categoryId: pastaCategory.id } });
        }
    }

    if (newCategory) {
        const newItems = [
            {
                name: 'Paneer Tikka Wrap',
                description: 'Spicy paneer tikka wrapped in a soft tortilla.',
                price: 149,
                isVeg: true,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=800&q=80',
                slug: 'paneer-tikka-wrap',
                seoTitle: 'Paneer Tikka Wrap | Spicy Paneer Roll',
                seoDescription: 'Spicy Paneer Tikka Wrap. Paneer tikka wrapped in a soft tortilla. A perfect snack.',
                altText: 'Paneer Tikka Wrap'
            },
            {
                name: 'Chicken Keema Garlic Bread',
                description: 'Garlic bread topped with spicy chicken keema and cheese.',
                price: 179,
                isVeg: false,
                isBestSeller: false,
                image: 'https://images.unsplash.com/photo-1573140247632-f84660f67627?w=800&q=80',
                slug: 'chicken-keema-garlic-bread',
                seoTitle: 'Chicken Keema Garlic Bread | Spicy Chicken Side',
                seoDescription: 'Garlic bread topped with spicy chicken keema and cheese. A delicious non-veg side.',
                altText: 'Chicken Keema Garlic Bread'
            }
        ];
        for (const item of newItems) {
            await prisma.item.create({ data: { ...item, categoryId: newCategory.id } });
        }
    }

    console.log('Menu items created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
