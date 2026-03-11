import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { ShoppingCart, User, Menu as MenuIcon } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { user } = useAuth();
  const { cartCount } = useCart();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <MenuIcon color="#333" size={24} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>Hey {user?.name?.split(' ')[0] || 'Pizza Lover'}!</Text>
            <Text style={styles.subGreeting}>Craving something cheesy?</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartIconContainer}>
            <ShoppingCart color="#333" size={24} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>NEW ARRIVAL</Text>
            <Text style={styles.bannerTitle}>Cheese Volcano Pizza 🌋</Text>
            <Text style={styles.bannerSubtitle}>Exploding with molten cheese in the center.</Text>
            <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.bannerButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop' }} 
            style={styles.bannerImage}
          />
        </View>

        {/* Categories Shortlist */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Menu</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Pizzas', 'Burgers', 'Sides', 'Drinks', 'Desserts']}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryCard} onPress={() => navigation.navigate('Menu', { category: item })}>
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />

        {/* Featured Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bestsellers</Text>
        </View>
        
        <View style={styles.featuredContainer}>
          {[
            { id: 1, name: 'Farmhouse Special', price: '₹499', img: 'https://images.unsplash.com/photo-1574129624952-04ce1992981f?q=80&w=1974&auto=format&fit=crop' },
            { id: 2, name: 'Pepperoni Feast', price: '₹549', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=2070&auto=format&fit=crop' }
          ].map(item => (
            <TouchableOpacity key={item.id} style={styles.foodCard}>
               <Image source={{ uri: item.img }} style={styles.foodImage} />
               <View style={styles.foodInfo}>
                 <Text style={styles.foodName}>{item.name}</Text>
                 <Text style={styles.foodPrice}>{item.price}</Text>
               </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryTextContainer}>
            <Text style={styles.deliveryTitle}>Fresh, Affordable Veg Pizzas Delivered Across Meerut</Text>
            <Text style={styles.deliverySub}>Order delicious pizzas, burgers, sandwiches, and snacks from The Pizza Box — rated 4.8★ by 40+ customers on Google.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 15,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  cartIconContainer: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#FF6F00',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  banner: {
    marginHorizontal: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    overflow: 'hidden',
    height: 200,
    flexDirection: 'row',
    marginTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTag: {
    color: '#FF6F00',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#BBB',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  bannerButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bannerImage: {
    width: 140,
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#FF6F00',
    fontWeight: '700',
    fontSize: 14,
  },
  categoryCard: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  featuredContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  foodCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    padding: 8,
  },
  foodImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },
  foodInfo: {
    padding: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  foodPrice: {
    color: '#FF6F00',
    fontWeight: '800',
    fontSize: 15,
    marginTop: 4,
  },
  deliveryInfo: {
    backgroundColor: '#1E1B2E',
    margin: 20,
    borderRadius: 20,
    padding: 24,
  },
  deliveryTextContainer: {
    flex: 1,
  },
  deliveryTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  deliverySub: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  }
});

export default HomeScreen;
