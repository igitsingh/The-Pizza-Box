import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import api from '../../api/pizzaBoxApi';
import { ChevronLeft, Package, ChefHat, Bike, CheckCircle2, Clock, Phone, MapPin } from 'lucide-react-native';
import NotificationService from '../../services/NotificationService';

const LiveTrackingScreen = ({ route, navigation }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const statusList = [
    { key: 'PENDING', label: 'Order Placed', icon: <Clock size={24} />, desc: 'Waiting for restaurant coffee confirmation' },
    { key: 'ACCEPTED', label: 'Order Accepted', icon: <CheckCircle2 size={24} />, desc: 'The kitchen has seen your order' },
    { key: 'PREPARING', label: 'Preparing', icon: <ChefHat size={24} />, desc: 'Our chefs are tossing the dough' },
    { key: 'BAKING', label: 'In the Oven', icon: <Package size={24} />, desc: 'Getting that perfect cheese melt' },
    { key: 'OUT_FOR_DELIVERY', label: 'On its Way', icon: <Bike size={24} />, desc: 'Our rider is zooming to you' },
    { key: 'DELIVERED', label: 'Enjoy Your Pizza!', icon: <CheckCircle2 size={24} />, desc: 'Delivered at your doorstep' }
  ];

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (order && order.status !== response.data.status) {
        // Status changed!
        NotificationService.localNotification({
          title: `Order Status: ${response.data.status}`,
          message: `Your pizza order #${response.data.orderNumber} is now ${response.data.status.toLowerCase().replace(/_/g, ' ')}! 🍕`
        });
      }
      setOrder(response.data);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    } catch (error) {
      console.error('Failed to fetch tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [orderId]);

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    const index = statusList.findIndex(s => s.key === order.status);
    return index === -1 ? 0 : index;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  const currentIndex = getCurrentStatusIndex();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.orderNumber}>#{order?.orderNumber}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Animated Progress Tracker */}
        <Animated.View style={[styles.trackingSection, { opacity: fadeAnim }]}>
          {statusList.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isLast = index === statusList.length - 1;

            return (
              <View key={status.key} style={styles.statusItem}>
                <View style={styles.connectorContainer}>
                  <View style={[
                    styles.circle, 
                    isCompleted && styles.completedCircle,
                    isCurrent && styles.currentCircle
                  ]}>
                    {React.cloneElement(status.icon as any, { 
                      color: isCompleted || isCurrent ? '#FFF' : '#CCC',
                      size: 16 
                    })}
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.line, 
                      isCompleted && styles.completedLine
                    ]} />
                  )}
                </View>
                
                <View style={styles.statusInfo}>
                  <Text style={[
                    styles.statusLabel, 
                    (isCompleted || isCurrent) && styles.activeStatusLabel
                  ]}>
                    {status.label}
                  </Text>
                  <Text style={styles.statusDesc}>{status.desc}</Text>
                  {isCurrent && (
                    <View style={styles.liveBadge}>
                      <View style={styles.dot} />
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Order Details Brief */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MapPin size={18} color="#FF6F00" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Delivering To</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{order?.Address?.street || 'Home'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <View style={styles.avatarMini}>
              <ChefHat size={16} color="#FF6F00" />
            </View>
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>The Pizza Box · Meerut</Text>
              <Text style={styles.detailValue}>Quality checked & hygiene certified</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Phone size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  orderNumber: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  backButton: {
    padding: 8,
  },
  trackingSection: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 24,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statusItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  connectorContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  completedCircle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  currentCircle: {
    backgroundColor: '#FF6F00',
    borderColor: '#FF6F00',
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: -2,
    zIndex: 1,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  statusInfo: {
    flex: 1,
    paddingBottom: 25,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CCC',
  },
  activeStatusLabel: {
    color: '#333',
  },
  statusDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    lineHeight: 18,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6F00',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  detailsCard: {
    backgroundColor: '#1E1B2E',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
    marginLeft: 15,
  },
  detailLabel: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF15',
    marginVertical: 15,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: '#FF6F00',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LiveTrackingScreen;
