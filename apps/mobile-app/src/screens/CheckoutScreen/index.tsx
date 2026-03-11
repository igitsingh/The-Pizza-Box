import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/pizzaBoxApi';
import { MapPin, Plus, ChevronRight, CreditCard, Banknote, CheckCircle2 } from 'lucide-react-native';

const CheckoutScreen = ({ navigation }: any) => {
  const { cart, cartTotal, clearCart, couponCode, discount, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: 'Meerut', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    try {
      setValidatingCoupon(true);
      const response = await api.post('/coupons/validate', { 
        code: couponInput,
        cartTotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      });
      applyCoupon(couponInput, response.data.discount);
      Alert.alert('Success', `Coupon applied! You saved ₹${response.data.discount}`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/addresses');
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.zip) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/users/addresses', newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedAddress(response.data.id);
      setShowAddAddress(false);
      setNewAddress({ street: '', city: 'Meerut', zip: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    try {
      setOrderLoading(true);
      const orderData = {
        addressId: selectedAddress,
        paymentMethod: paymentMethod,
        total: cartTotal,
        couponCode: couponCode,
        items: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        }))
      };

      const response = await api.post('/orders', orderData);
      
      Alert.alert(
        'Order Placed! 🎉',
        `Your order #${response.data.orderNumber} has been placed successfully.`,
        [{ text: 'Great!', onPress: () => {
          clearCart();
          navigation.navigate('Orders');
        }}]
      );
    } catch (error: any) {
      console.error('Failed to place order:', error);
      const serverMessage = error.response?.data?.message;
      Alert.alert('Error', serverMessage || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
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
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Address Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity onPress={() => setShowAddAddress(!showAddAddress)}>
            <Text style={styles.addText}>{showAddAddress ? 'Cancel' : '+ Add New'}</Text>
          </TouchableOpacity>
        </View>

        {showAddAddress ? (
          <View style={styles.addressForm}>
            <TextInput
              style={styles.input}
              placeholder="House No, Street, Landmark"
              value={newAddress.street}
              onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              keyboardType="numeric"
              value={newAddress.zip}
              onChangeText={(text) => setNewAddress({ ...newAddress, zip: text })}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddAddress}>
              <Text style={styles.saveButtonText}>Save & Use Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {addresses.length === 0 ? (
              <Text style={styles.noAddressText}>No addresses found. Please add one.</Text>
            ) : (
              addresses.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.addressCard, selectedAddress === item.id && styles.selectedCard]}
                  onPress={() => setSelectedAddress(item.id)}
                >
                  <MapPin size={20} color={selectedAddress === item.id ? '#FF6F00' : '#666'} />
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressStreet}>{item.street}</Text>
                    <Text style={styles.addressCity}>{item.city}, {item.zip}</Text>
                  </View>
                  {selectedAddress === item.id && <CheckCircle2 size={20} color="#FF6F00" />}
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>

      {/* Payment Method Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity 
          style={[styles.paymentCard, paymentMethod === 'COD' && styles.selectedCard]}
          onPress={() => setPaymentMethod('COD')}
        >
          <Banknote size={24} color={paymentMethod === 'COD' ? '#FF6F00' : '#666'} />
          <Text style={styles.paymentText}>Cash on Delivery</Text>
          {paymentMethod === 'COD' && <CheckCircle2 size={20} color="#FF6F00" />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentCard, paymentMethod === 'UPI' && styles.selectedCard]}
          onPress={() => setPaymentMethod('UPI')}
        >
          <CreditCard size={24} color={paymentMethod === 'UPI' ? '#FF6F00' : '#666'} />
          <Text style={styles.paymentText}>Pay via UPI (GPay, PhonePe)</Text>
          {paymentMethod === 'UPI' && <CheckCircle2 size={20} color="#FF6F00" />}
        </TouchableOpacity>
      </View>

      {/* Coupon Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apply Coupon</Text>
        <View style={styles.couponContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Enter coupon code"
            value={couponInput}
            onChangeText={setCouponInput}
            autoCapitalize="characters"
            editable={!couponCode}
          />
          {couponCode ? (
            <TouchableOpacity style={styles.removeCouponButton} onPress={removeCoupon}>
              <Text style={styles.removeCouponText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.applyButton, !couponInput && styles.disabledApplyButton]} 
              onPress={handleApplyCoupon}
              disabled={!couponInput || validatingCoupon}
            >
              {validatingCoupon ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.applyButtonText}>Apply</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{cart.reduce((total, item) => total + (item.price * item.quantity), 0)}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#4CAF50' }]}>Coupon Discount ({couponCode})</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>-₹{discount}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{cartTotal}</Text>
          </View>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity 
        style={[styles.orderButton, (!selectedAddress || orderLoading) && styles.disabledButton]} 
        onPress={handlePlaceOrder}
        disabled={!selectedAddress || orderLoading}
      >
        {orderLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Text style={styles.orderButtonText}>Place Order · ₹{cartTotal}</Text>
            <ChevronRight color="#FFF" size={20} />
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  addText: {
    color: '#FF6F00',
    fontWeight: 'bold',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  selectedCard: {
    borderColor: '#FF6F00',
    backgroundColor: '#FFF9F5',
  },
  addressInfo: {
    flex: 1,
    marginLeft: 15,
  },
  addressStreet: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  addressCity: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  applyButton: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledApplyButton: {
    backgroundColor: '#CCC',
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  removeCouponButton: {
    paddingHorizontal: 15,
    height: 48,
    justifyContent: 'center',
  },
  removeCouponText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  addressForm: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  input: {
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  saveButton: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noAddressText: {
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  paymentText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  summaryBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 14,
  },
  summaryValue: {
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  orderButton: {
    backgroundColor: '#FF6F00',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 30,
    elevation: 4,
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#CCC',
    elevation: 0,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default CheckoutScreen;
