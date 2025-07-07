import { ViewSelector } from "@/constants/ViewSelector"
import { useAlert } from "@/hooks/useAlert"
import { X } from "lucide-react-native"
import React from "react"
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AlertItem from "./AlertItem"
import ProductItem from "./ProductItem"

interface ShowFullInfoProps {
  label: string
  showFullInfo: boolean
  title: string
  type: number
  showFullInfoVoid: () => void
}

export default function ShowFullInfo({ label, showFullInfo, showFullInfoVoid, title, type = 0 }: ShowFullInfoProps) {
  const { alerts } = useAlert()
  const { ProductType } = ViewSelector

  return (
    <>
      <TouchableOpacity style={styles.viewMoreBtn} onPress={() => showFullInfoVoid()}>
        <Text style={styles.viewMoreText}>{label}</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showFullInfo}
        onRequestClose={() => showFullInfoVoid()}
      >

        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => showFullInfoVoid()}>
                <Text style={{ fontSize: 24, color: '#6B7280' }}>
                  <X />
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={true}
            >
              {alerts?.map((alert) => (
                type === ProductType ?
                  <ProductItem key={alert.id} alert={alert} /> :
                  <AlertItem key={alert.id} alert={alert} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  viewMoreBtn: {
    marginTop: 5,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    height: '60%',
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
  },

  closeButton: {
    padding: 4,
  },

})