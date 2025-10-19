
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

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Order {
  id: string;
  customerName: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
  notes?: string;
}

const INITIAL_ORDERS: Order[] = [
  {
    id: '001',
    customerName: 'John Smith',
    items: '2x Coffee, 1x Sandwich',
    total: 15.50,
    status: 'pending',
    date: new Date().toLocaleDateString(),
  },
  {
    id: '002',
    customerName: 'Sarah Johnson',
    items: '1x Salad, 1x Juice',
    total: 12.00,
    status: 'processing',
    date: new Date().toLocaleDateString(),
  },
  {
    id: '003',
    customerName: 'Mike Davis',
    items: '3x Pizza Slice, 2x Soda',
    total: 22.50,
    status: 'completed',
    date: new Date().toLocaleDateString(),
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'processing':
        return colors.secondary;
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'clock.fill';
      case 'processing':
        return 'arrow.clockwise';
      case 'completed':
        return 'checkmark.circle.fill';
      case 'cancelled':
        return 'xmark.circle.fill';
      default:
        return 'circle.fill';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const openOrderDetails = (order: Order) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Management</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOrders.length} {filterStatus === 'all' ? 'total' : filterStatus} orders
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {(['all', 'pending', 'processing', 'completed', 'cancelled'] as const).map(status => (
          <Pressable
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              setFilterStatus(status);
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.ordersList}
        contentContainerStyle={styles.ordersListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map(order => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() => openOrderDetails(order)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdContainer}>
                <Text style={styles.orderId}>#{order.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) + '20' },
                  ]}
                >
                  <IconSymbol
                    name={getStatusIcon(order.status)}
                    size={14}
                    color={getStatusColor(order.status)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>

            <View style={styles.orderBody}>
              <View style={styles.customerInfo}>
                <IconSymbol name="person.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.customerName}>{order.customerName}</Text>
              </View>
              <Text style={styles.orderItems}>{order.items}</Text>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </View>
          </Pressable>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="tray.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No {filterStatus} orders</Text>
          </View>
        )}
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
                  <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <IconSymbol name="xmark" size={24} color={colors.text} />
                  </Pressable>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Customer</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customerName}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Items</Text>
                    <Text style={styles.detailValue}>{selectedOrder.items}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={styles.detailValue}>${selectedOrder.total.toFixed(2)}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{selectedOrder.date}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Current Status</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(selectedOrder.status) + '20' },
                      ]}
                    >
                      <IconSymbol
                        name={getStatusIcon(selectedOrder.status)}
                        size={16}
                        color={getStatusColor(selectedOrder.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(selectedOrder.status) },
                        ]}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusActions}>
                    <Text style={styles.statusActionsTitle}>Update Status</Text>
                    <View style={styles.statusButtonsGrid}>
                      {(['pending', 'processing', 'completed', 'cancelled'] as OrderStatus[]).map(
                        status => (
                          <Pressable
                            key={status}
                            style={[
                              styles.statusActionButton,
                              selectedOrder.status === status && styles.statusActionButtonDisabled,
                            ]}
                            onPress={() => updateOrderStatus(selectedOrder.id, status)}
                            disabled={selectedOrder.status === status}
                          >
                            <IconSymbol
                              name={getStatusIcon(status)}
                              size={20}
                              color={
                                selectedOrder.status === status
                                  ? colors.textSecondary
                                  : getStatusColor(status)
                              }
                            />
                            <Text
                              style={[
                                styles.statusActionButtonText,
                                selectedOrder.status === status &&
                                  styles.statusActionButtonTextDisabled,
                              ]}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                          </Pressable>
                        )
                      )}
                    </View>
                  </View>
                </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.highlight,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 100,
  },
  orderCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderBody: {
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderItems: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  statusActions: {
    marginTop: 12,
  },
  statusActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusActionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.highlight,
  },
  statusActionButtonDisabled: {
    opacity: 0.5,
    borderColor: colors.textSecondary,
  },
  statusActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statusActionButtonTextDisabled: {
    color: colors.textSecondary,
  },
});
