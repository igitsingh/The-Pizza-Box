import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Home, ShoppingBag, User, MapPin, History, Gift } from 'lucide-react-native';

const CustomDrawerContent = (props: any) => {
  const { user, signOut } = useAuth();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Drawer Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'pizzalover@example.com'}</Text>
      </View>

      <View style={styles.divider} />

      {/* Drawer Items */}
      <View style={styles.itemsList}>
        <DrawerItemList {...props} />
        
        <DrawerItem
          label="My Cart"
          onPress={() => props.navigation.navigate('Main', { screen: 'Cart' })}
          icon={({ color, size }) => <ShoppingBag color={color} size={size} />}
          labelStyle={styles.drawerLabel}
        />

        <DrawerItem
          label="Refer & Earn 🎁"
          onPress={() => props.navigation.navigate('Main', { screen: 'Referral' })}
          icon={({ color, size }) => <Gift color={color} size={size} />}
          labelStyle={[styles.drawerLabel, { color: '#FF6F00' }]}
        />
        
        <DrawerItem
          label="My Orders"
          onPress={() => props.navigation.navigate('Main', { screen: 'Orders' })}
          icon={({ color, size }) => <History color={color} size={size} />}
          labelStyle={styles.drawerLabel}
        />
        
        <DrawerItem
          label="My Addresses"
          onPress={() => props.navigation.navigate('Main', { screen: 'Profile' })}
          icon={({ color, size }) => <MapPin color={color} size={size} />}
          labelStyle={styles.drawerLabel}
        />
      </View>

      {/* Logout at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <LogOut color="#FF6F00" size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF6F00',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  itemsList: {
    flex: 1,
    marginTop: 10,
  },
  drawerLabel: {
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
});

export default CustomDrawerContent;
