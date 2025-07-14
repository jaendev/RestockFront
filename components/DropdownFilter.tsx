import { Check, ChevronDown, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useThemeColors } from "@/context/ThemeContext";

interface FilterOption {
  label: string;
  value: string;
}

interface DropdownFilterProps {
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function DropdownFilter({
  selectedValue,
  onSelect,
  placeholder = "Filtros",
}: DropdownFilterProps) {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const buttonRef = useRef<React.ComponentRef<typeof TouchableOpacity>>(null);
  const styles = createStyles(colors);

  const filterOptions: FilterOption[] = [
    { label: "Todos los productos", value: "all" },
    { label: "Productos bajos en stock", value: "low_stock" },
    { label: "Productos activos", value: "active" },
    { label: "Productos inactivos", value: "inactive" },
    { label: "Sin stock", value: "out_of_stock" },
  ];

  const selectedOption = filterOptions.find(
    (opt) => opt.value === selectedValue,
  );

  const handleButtonPress = () => {
    buttonRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setButtonLayout({ x: pageX, y: pageY, width, height });
      setIsOpen(true);
    });
  };

  const handleOptionSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const cleanFilter = () => {
    onSelect("all");
    setIsOpen(false);
  };

  return (
    <>
      {/* Button dropdown */}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.dropdownButton}
        onPress={handleButtonPress}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedOption?.label || placeholder}
        </Text>
        {selectedOption?.value === "all" ? (
          <ChevronDown
            size={16}
            color={colors.icon}
            style={[styles.chevron, isOpen && styles.chevronRotated]}
          />
        ) : (
          <X size={16} color={colors.icon} onPress={() => cleanFilter()} />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.dropdownList,
                  {
                    top: buttonLayout.y + buttonLayout.height + 8,
                    left: buttonLayout.x,
                    width: buttonLayout.width,
                  },
                ]}
              >
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownOption,
                      selectedValue === option.value && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionSelect(option.value)}
                  >
                    <View style={styles.optionContent}>
                      {selectedValue === option.value && (
                        <Check
                          size={16}
                          color={colors.primary}
                          style={styles.checkIcon}
                        />
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          selectedValue === option.value &&
                          styles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

// Dynamic styles based on theme colors
const createStyles = (colors: any) => StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 120,
  },
  dropdownButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
    transform: [{ rotate: "0deg" }],
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dropdownList: {
    position: "absolute",
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 250,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginRight: 12,
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "400",
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "500",
  },
  cross: {},
});
