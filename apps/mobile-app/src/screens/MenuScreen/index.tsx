import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../../api/pizzaBoxApi';
import { Plus, Check, ShoppingCart, ChevronLeft } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';

const MenuScreen = ({ navigation }: any) => {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart, cart, cartCount } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (item: any) => {
    addToCart(item);
    setAddedItems({ ...addedItems, [item.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        setMenu(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const currentItems = menu.find(cat => cat.id === selectedCategory)?.items || [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft color="#333" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Our Menu</Text>
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

      {/* Category Tabs */}
      <View style={{ height: 60 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={menu}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.categoryTab, selectedCategory === item.id && styles.activeTab]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={[styles.categoryTabText, selectedCategory === item.id && styles.activeTabText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Items List */}
      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard}>
            <Image 
              source={{ uri: item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop' }} 
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <TouchableOpacity 
                style={[styles.addButton, addedItems[item.id] && styles.addedButton]} 
                onPress={() => handleAddToCart(item)}
              >
                {addedItems[item.id] ? (
                  <Check color="#FFF" size={16} />
                ) : (
                  <Plus color="#FFF" size={16} />
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#FF6F00',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  itemCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 120,
  },
  itemInfo: {
    padding: 10,
    position: 'relative',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF6F00',
    marginTop: 5,
    fontWeight: '700',
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#FF6F00',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: '#4CAF50',
  }
});

export default MenuScreen;
