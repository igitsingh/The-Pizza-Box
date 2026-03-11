import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Image, ActivityIndicator, Clipboard } from 'react-native';
import api from '../../api/pizzaBoxApi';
import { Gift, Share2, Copy, Users, Wallet, ChevronRight, Award } from 'lucide-react-native';

const ReferralScreen = () => {
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReferralData = async () => {
    try {
      const response = await api.get('/referral/my-code');
      setReferralData(response.data);
    } catch (error) {
      console.error('Failed to fetch referral:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hey! Use my code ${referralData?.code} to get a special discount on your first pizza from The Pizza Box! 🍕 Download here: https://thepizzabox.com/app`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(referralData?.code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Premium Gradient-like Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Refer & Earn 🍕</Text>
          <Text style={styles.headerSubtitle}>Give your friends a treat and get ₹50 for every referral!</Text>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1571066811602-7104be66a504?q=80&w=2000&auto=format&fit=crop' }} 
            style={styles.headerIllustration}
          />
        </View>
      </View>

      {/* Referral Code Box */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>YOUR UNIQUE CODE</Text>
        <TouchableOpacity style={styles.codeBox} onPress={copyToClipboard}>
          <Text style={styles.codeText}>{referralData?.code || 'PIZZA50'}</Text>
          <View style={styles.copyBadge}>
             <Copy size={16} color="#FF6F00" />
             <Text style={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={onShare}>
          <Share2 size={20} color="#FFF" />
          <Text style={styles.shareButtonText}>Share Now</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Users size={24} color="#FF6F00" />
          <Text style={styles.statValue}>{referralData?.totalReferrals || 0}</Text>
          <Text style={styles.statLabel}>Friends Joined</Text>
        </View>
        <View style={styles.statCard}>
          <Wallet size={24} color="#4CAF50" />
          <Text style={styles.statValue}>₹{referralData?.referralReward || 0}</Text>
          <Text style={styles.statLabel}>Reward Balance</Text>
        </View>
      </View>

      {/* How it Works */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How it works</Text>
        
        <View style={styles.stepRow}>
          <View style={styles.stepNumber}><Text style={styles.stepText}>1</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Invite Friends</Text>
            <Text style={styles.stepDesc}>Share your unique code with your pizza-loving friends.</Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={styles.stepNumber}><Text style={styles.stepText}>2</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Friend Orders</Text>
            <Text style={styles.stepDesc}>When they place their first order using your code.</Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <View style={styles.stepNumber}><Text style={styles.stepText}>3</Text></View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>You Earn ₹50</Text>
            <Text style={styles.stepDesc}>Get ₹50 rewards directly in your wallet for the next order.</Text>
          </View>
        </View>
      </View>

      {/* Membership Perk */}
      <TouchableOpacity style={styles.perkCard}>
        <Award size={24} color="#FFD700" />
        <View style={styles.perkTextContainer}>
          <Text style={styles.perkTitle}>Elite Membership Tier</Text>
          <Text style={styles.perkSubtitle}>You are currently a {referralData?.membershipTier || 'Bronze'} Member</Text>
        </View>
        <ChevronRight size={20} color="#CCC" />
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
    backgroundColor: '#1A1A1A',
    paddingTop: 80,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  headerIllustration: {
    width: 250,
    height: 120,
    marginTop: 30,
    borderRadius: 20,
    opacity: 0.8,
  },
  codeContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 30,
    marginTop: -30,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#999',
    letterSpacing: 2,
    marginBottom: 15,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FF6F00',
    borderStyle: 'dashed',
    width: '100%',
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF6F00',
    letterSpacing: 1,
  },
  copyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginLeft: 6,
  },
  shareButton: {
    backgroundColor: '#FF6F00',
    flexDirection: 'row',
    width: '100%',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    marginTop: 30,
  },
  statCard: {
    backgroundColor: '#FFF',
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  infoSection: {
    padding: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  stepDesc: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  perkCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 20,
    marginBottom: 60,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  perkTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  perkTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  perkSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  }
});

export default ReferralScreen;
