
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';

type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface Order {
  id: string;
  customerName: string;
  items: string;
  material: string;
  printTime: string;
  total: number;
  status: OrderStatus;
  date: string;
  notes?: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'John Smith',
    items: 'Custom Phone Case',
    material: 'PLA',
    printTime: '2h 30m',
    total: 25.99,
    status: 'pending',
    date: '2024-01-15',
    notes: 'Blue color preferred',
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    items: 'Miniature Figurine Set (5 pieces)',
    material: 'Resin',
    printTime: '8h 15m',
    total: 89.99,
    status: 'in-progress',
    date: '2024-01-14',
  },
  {
    id: '3',
    customerName: 'Mike Davis',
    items: 'Replacement Part - Gear Assembly',
    material: 'ABS',
    printTime: '4h 45m',
    total: 45.50,
    status: 'completed',
    date: '2024-01-13',
  },
];

export default function OrdersScreen() {
  const { setScrollY } = useTabBarVisibility();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'in-progress':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return colors.primary;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'clock.fill';
      case 'in-progress':
        return 'gearshape.fill';
      case 'completed':
        return 'checkmark.circle.fill';
      case 'cancelled':
        return 'xmark.circle.fill';
      default:
        return 'circle.fill';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const openOrderDetails = (order: Order) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    setScrollY(currentScrollY);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Pressable style={styles.addButton}>
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {orders.map((order) => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() => openOrderDetails(order)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.customerName}>{order.customerName}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status) + '20' },
                ]}
              >
                <IconSymbol
                  name={getStatusIcon(order.status)}
                  size={16}
                  color={getStatusColor(order.status)}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status) },
                  ]}
                >
                  {order.status.replace('-', ' ')}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.detailRow}>
                <IconSymbol name="cube.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{order.items}</Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol name="circle.grid.3x3.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{order.material}</Text>
              </View>
              <View style={styles.detailRow}>
                <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.detailText}>{order.printTime}</Text>
              </View>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Order Details</Text>
                  <Pressable onPress={() => setModalVisible(false)}>
                    <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                  </Pressable>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalCustomerName}>{selectedOrder.customerName}</Text>
                  <Text style={styles.modalOrderId}>Order #{selectedOrder.id}</Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Items</Text>
                    <Text style={styles.modalSectionText}>{selectedOrder.items}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Material</Text>
                    <Text style={styles.modalSectionText}>{selectedOrder.material}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Print Time</Text>
                    <Text style={styles.modalSectionText}>{selectedOrder.printTime}</Text>
                  </View>

                  {selectedOrder.notes && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Notes</Text>
                      <Text style={styles.modalSectionText}>{selectedOrder.notes}</Text>
                    </View>
                  )}

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Status</Text>
                    <View style={styles.statusButtons}>
                      {(['pending', 'in-progress', 'completed', 'cancelled'] as OrderStatus[]).map((status) => (
                        <Pressable
                          key={status}
                          style={[
                            styles.statusButton,
                            selectedOrder.status === status && {
                              backgroundColor: getStatusColor(status),
                            },
                          ]}
                          onPress={() => {
                            updateOrderStatus(selectedOrder.id, status);
                            setSelectedOrder({ ...selectedOrder, status });
                          }}
                        >
                          <Text
                            style={[
                              styles.statusButtonText,
                              selectedOrder.status === status && styles.statusButtonTextActive,
                            ]}
                          >
                            {status.replace('-', ' ')}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalTotal}>
                    <Text style={styles.modalTotalLabel}>Total Amount</Text>
                    <Text style={styles.modalTotalAmount}>${selectedOrder.total.toFixed(2)}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    paddingHorizontal: 20,
  },
  modalCustomerName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  modalOrderId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalSectionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalTotalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
});
