import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import api from '../../api/pizzaBoxApi';
import { ShoppingBag, ChevronRight, Clock, MapPin } from 'lucide-react-native';

const OrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'CANCELLED': return '#F44336';
      default: return '#2196F3';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#EEE" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>Your tasty pizza orders will show up here!</Text>
          <TouchableOpacity 
            style={styles.browseButton} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Explore Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
                  <View style={styles.dateRow}>
                    <Clock size={12} color="#999" />
                    <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.orderBody}>
                {item.items?.map((product: any, idx: number) => (
                  <Text key={idx} style={styles.productText}>
                    {product.quantity}x {product.name}
                  </Text>
                ))}
                <View style={styles.addressRow}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.addressText} numberOfLines={1}>
                    {item.address?.street || 'Pick up'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total Paid</Text>
                  <Text style={styles.totalValue}>₹{item.total}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.trackButton} 
                  onPress={() => navigation.navigate('LiveTracking', { orderId: item.id })}
                >
                  <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  browseButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 30,
  },
  browseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 15,
  },
  orderBody: {
    marginBottom: 5,
  },
  productText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: '#999',
  },
  totalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  trackButton: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#FF6F00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  trackButtonText: {
    color: '#FF6F00',
    fontWeight: 'bold',
    fontSize: 13,
  }
});

export default OrdersScreen;
