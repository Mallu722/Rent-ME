import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { paymentService } from '../services/payment.service';
import { bookingService } from '../services/booking.service';

type PaymentRouteProp = RouteProp<{ params: { bookingId: string } }, 'params'>;

const PaymentScreen = () => {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation();
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('wallet');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingResponse, walletResponse] = await Promise.all([
        bookingService.getBookingById(bookingId),
        paymentService.getWallet(),
      ]);

      if (bookingResponse.success) {
        setBooking(bookingResponse.data.booking);
      }
      if (walletResponse.success) {
        setWallet(walletResponse.data.wallet);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load payment information');
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    setLoading(true);
    try {
      if (paymentMethod === 'wallet') {
        if (wallet.balance < booking.pricing.total) {
          Alert.alert('Insufficient Balance', 'Please top up your wallet');
          return;
        }

        const response = await paymentService.payWithWallet(bookingId);
        if (response.success) {
          Alert.alert('Success', 'Payment completed', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        }
      } else {
        // Stripe payment
        const response = await paymentService.createPaymentIntent(
          bookingId,
          booking.pricing.total,
          booking.pricing.currency.toLowerCase()
        );

        if (response.success) {
          // In a real app, you would use Stripe SDK here
          Alert.alert('Stripe Payment', 'Stripe integration would go here');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payment</Text>

        <View style={styles.bookingSummary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.summaryText}>Activity: {booking.activity}</Text>
          <Text style={styles.summaryText}>
            Date: {new Date(booking.date).toLocaleDateString()}
          </Text>
          <Text style={styles.summaryText}>
            Time: {booking.startTime} - {booking.endTime}
          </Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              ${booking.pricing?.total?.toFixed(2)}
            </Text>
          </View>
        </View>

        {wallet && (
          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>
              ${wallet.balance?.toFixed(2) || '0.00'}
            </Text>
            {wallet.balance < booking.pricing.total && (
              <Text style={styles.insufficientText}>
                Insufficient balance. Top up required.
              </Text>
            )}
          </View>
        )}

        <View style={styles.paymentMethods}>
          <Text style={styles.methodsTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.methodButton,
              paymentMethod === 'wallet' && styles.methodButtonActive,
            ]}
            onPress={() => setPaymentMethod('wallet')}
          >
            <Text
              style={[
                styles.methodText,
                paymentMethod === 'wallet' && styles.methodTextActive,
              ]}
            >
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              paymentMethod === 'stripe' && styles.methodButtonActive,
            ]}
            onPress={() => setPaymentMethod('stripe')}
          >
            <Text
              style={[
                styles.methodText,
                paymentMethod === 'stripe' && styles.methodTextActive,
              ]}
            >
              Credit/Debit Card (Stripe)
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay $${booking.pricing?.total?.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  bookingSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  summaryText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  walletInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  insufficientText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 10,
  },
  paymentMethods: {
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#000',
  },
  methodButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  methodButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  methodText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  methodTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PaymentScreen;
