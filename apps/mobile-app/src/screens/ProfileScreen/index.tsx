import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { User, MapPin, History, Settings, ChevronRight, LogOut, Phone, Mail } from 'lucide-react-native';

const ProfileScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { title: 'My Addresses', icon: <MapPin size={22} color="#666" />, subtitle: 'Manage your delivery locations' },
    { title: 'Order History', icon: <History size={22} color="#666" />, subtitle: 'Check your past cravings' },
    { title: 'Account Settings', icon: <Settings size={22} color="#666" />, subtitle: 'Update email, phone, security' },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronRight size={24} color="#333" style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || 'Pizza Lover'}</Text>
        <View style={styles.contactRow}>
          <Mail size={14} color="#666" />
          <Text style={styles.contactText}>{user?.email || 'admin@thepizzabox.com'}</Text>
        </View>
        <View style={[styles.contactRow, { marginTop: 4 }]}>
          <Phone size={14} color="#666" />
          <Text style={styles.contactText}>+91 {user?.phone || '1234567890'}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuIcon}>{item.icon}</View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={20} color="#CCC" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={signOut}>
          <View style={[styles.menuIcon, { backgroundColor: '#FFF5F0' }]}>
            <LogOut size={22} color="#FF6F00" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: '#FF6F00' }]}>Logout</Text>
            <Text style={styles.menuSubtitle}>Sign out of your account</Text>
          </View>
          <ChevronRight size={20} color="#CCC" />
        </TouchableOpacity>
      </View>

      {/* App Version Info */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>The Pizza Box App v1.0.0</Text>
        <Text style={styles.madeWithText}>Made with ❤️ in Meerut</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF6F00',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: '#FFF',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  versionText: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
  },
  madeWithText: {
    color: '#DDD',
    fontSize: 11,
    marginTop: 4,
  }
});

export default ProfileScreen;
