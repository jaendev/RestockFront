import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useCategories } from "@/hooks/useCategories";
import {
  X,
  Package,
  Hash,
  AlertTriangle,
  FolderOpen,
  Ruler,
} from "lucide-react-native";
import { CreateProductDto, Product, UpdateProductDto } from "@/types/product";
import { useUnitTypes } from "@/hooks/useUnitTypes";

interface ProductFormProps {
  visible: boolean;
  onClose: () => void;
  currentCategoryId?: number;
  editProduct?: Product | null;
  onSubmit: (product: CreateProductDto) => Promise<void>;
  onUpdate?: (productId: number, product: UpdateProductDto) => Promise<void>;
}

export function ProductForm({
  visible,
  onClose,
  currentCategoryId,
  editProduct,
  onSubmit,
  onUpdate,
}: ProductFormProps) {
  const { categories } = useCategories();
  const { unitTypes } = useUnitTypes();

  const isEditMode = !!editProduct;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    currentStock: 0,
    minimumStock: 0,
    unitId: 1,
    price: 0,
    categoryId: currentCategoryId || 1,
    imageUrl: null,
    isActive: true, // Default to active for new products
  });

  useEffect(() => {
    if (visible) {
      if (isEditMode && editProduct) {
        // Modo edición: poblar con datos existentes
        const targetCategory = categories?.find(
          (cat) => cat.id === editProduct.categoryId,
        );
        const targetUnit = unitTypes?.find(
          (unit) => unit.id === editProduct.unitId,
        );

        setFormData({
          name: editProduct.name,
          description: editProduct.description || "",
          currentStock: editProduct.currentStock,
          minimumStock: editProduct.minimumStock,
          unitId: editProduct.unitId,
          price: editProduct.price || 0,
          categoryId: editProduct.categoryId,
          imageUrl: editProduct.imageUrl || null,
          isActive: editProduct.isActive, // Include isActive from existing product
        });

        setSelectedCategory(targetCategory?.name || "");
        setSelectedUnit(`${targetUnit?.name} (${targetUnit?.symbol})` || "");

        console.log("📝 Modo edición: datos cargados", editProduct);
      } else {
        // Modo creación: valores por defecto
        const firstUnit = unitTypes[0];
        const targetCategoryId = currentCategoryId || categories?.[0]?.id || 1;
        const targetCategory = categories?.find(
          (cat) => cat.id === targetCategoryId,
        );

        setFormData({
          name: "",
          description: "",
          currentStock: 0,
          minimumStock: 0,
          unitId: firstUnit?.id || 1,
          price: 0,
          categoryId: targetCategoryId,
          imageUrl: null,
          isActive: true, // Default to active for new products
        });

        setSelectedCategory(targetCategory?.name || "");
        setSelectedUnit(`${firstUnit?.name} (${firstUnit?.symbol})` || "");

        console.log("✨ Modo creación: valores por defecto");
      }

      setErrors({});
    }
  }, [
    visible,
    categories,
    currentCategoryId,
    unitTypes,
    editProduct,
    isEditMode,
  ]);

  const updateField = (
    field: keyof CreateProductDto,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    setSelectedCategory(category?.name || "");
    updateField("categoryId", categoryId);
  };

  const handleUnitSelect = (unitId: number) => {
    const unit = unitTypes.find((u) => u.id === unitId);
    setSelectedUnit(`${unit?.name} (${unit?.symbol})` || "");
    updateField("unitId", unitId);
  };

  // Handle toggle product active status (local state only)
  const handleToggleIsActive = () => {
    updateField("isActive", !formData.isActive);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock = "El stock no puede ser negativo";
    }

    if (formData.minimumStock < 0) {
      newErrors.minimumStock = "El stock mínimo no puede ser negativo";
    }

    if (formData.minimumStock > formData.currentStock) {
      newErrors.minimumStock =
        "El stock mínimo no puede ser mayor al stock actual";
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = "El precio no puede ser negativo";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor corrige los errores en el formulario");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && onUpdate && editProduct) {
        // Mode edit
        await onUpdate(editProduct.id, formData);
        Alert.alert("Éxito", "Producto actualizado correctamente");
      } else {
        // Mode create
        await onSubmit(formData);
        Alert.alert("Éxito", "Producto creado correctamente");
      }

      onClose();
    } catch (error) {
      const errorMessage = isEditMode
        ? "No se pudo actualizar el producto"
        : "No se pudo crear el producto";
      Alert.alert("Error", errorMessage);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? "Editar Producto" : "Nuevo Producto"}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Product Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.productIcon}>
              <Package size={40} color="#2563EB" />
            </View>
            <Text style={styles.iconText}>
              {isEditMode
                ? "Editar producto existente"
                : "Crear nuevo producto"}
            </Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Nombre del producto <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ej: Arroz blanco"
                value={formData.name}
                onChangeText={(text) => updateField("name", text)}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descripción del producto..."
                value={formData.description}
                onChangeText={(text) => updateField("description", text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* Category and Unit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoría y Unidad</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Categoría <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity style={styles.dropdownButton}>
                  <FolderOpen
                    size={18}
                    color="#6B7280"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownText}>
                    {selectedCategory || "Seleccionar categoría"}
                  </Text>
                </TouchableOpacity>
                <ScrollView
                  style={styles.categoriesGrid}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {categories?.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        formData.categoryId === category.id &&
                          styles.categoryChipSelected,
                        { borderColor: category.color },
                      ]}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: category.color },
                        ]}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          formData.categoryId === category.id &&
                            styles.categoryChipTextSelected,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              {errors.categoryId && (
                <Text style={styles.errorText}>{errors.categoryId}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Tipo de Unidad <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Ruler
                    size={18}
                    color="#6B7280"
                    style={styles.dropdownIcon}
                  />
                  <Text style={styles.dropdownText}>
                    {selectedUnit || "Seleccionar unidad"}
                  </Text>
                </TouchableOpacity>
                <View style={styles.unitsGrid}>
                  {unitTypes.map((unit) => (
                    <TouchableOpacity
                      key={unit.id}
                      style={[
                        styles.unitChip,
                        formData.unitId === unit.id && styles.unitChipSelected,
                      ]}
                      onPress={() => handleUnitSelect(unit.id)}
                    >
                      <Text
                        style={[
                          styles.unitSymbol,
                          formData.unitId === unit.id &&
                            styles.unitSymbolSelected,
                        ]}
                      >
                        {unit.symbol}
                      </Text>
                      <Text
                        style={[
                          styles.unitName,
                          formData.unitId === unit.id &&
                            styles.unitNameSelected,
                        ]}
                      >
                        {unit.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Stock Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestión de Stock</Text>

            <View style={styles.rowContainer}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>
                  Stock Inicial <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputWithIcon}>
                  <Hash size={18} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputWithPadding,
                      errors.currentStock && styles.inputError,
                    ]}
                    placeholder="0"
                    value={
                      formData.currentStock === 0
                        ? ""
                        : formData.currentStock.toString()
                    }
                    onChangeText={(text) =>
                      updateField("currentStock", parseFloat(text) || 0)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.currentStock && (
                  <Text style={styles.errorText}>{errors.currentStock}</Text>
                )}
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>
                  Stock Mínimo <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputWithIcon}>
                  <AlertTriangle
                    size={18}
                    color="#F59E0B"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputWithPadding,
                      errors.minimumStock && styles.inputError,
                    ]}
                    placeholder="0"
                    value={
                      formData.minimumStock === 0
                        ? ""
                        : formData.minimumStock.toString()
                    }
                    onChangeText={(text) =>
                      updateField("minimumStock", parseFloat(text) || 0)
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.minimumStock && (
                  <Text style={styles.errorText}>{errors.minimumStock}</Text>
                )}
              </View>
            </View>

            {/* Stock Info */}
            <View style={styles.stockInfo}>
              <Text style={styles.stockInfoText}>
                💡 El stock mínimo sirve para generar alertas automáticas cuando
                el inventario está bajo
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estado del Producto</Text>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Producto Activo</Text>
                <Text style={styles.toggleDescription}>
                  {formData.isActive ? "El producto está disponible en el inventario" : "El producto está deshabilitado"}
                </Text>
              </View>
              <Switch
                value={formData.isActive || false}
                onValueChange={handleToggleIsActive}
                trackColor={{ false: "#E5E7EB", true: "#DBEAFE" }}
                thumbColor={formData.isActive ? "#2563EB" : "#FFFFFF"}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precio</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Precio por unidad</Text>
              <View style={styles.inputWithIcon}>
                <Text style={styles.currencySymbol}>€</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputWithCurrency,
                    errors.price && styles.inputError,
                  ]}
                  placeholder="0.00"
                  value={formData.price === 0 ? "" : formData.price?.toString()}
                  onChangeText={(text) =>
                    updateField("price", parseFloat(text) || 0)
                  }
                  keyboardType="decimal-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}
            </View>
          </View>

          {/* Optional Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>URL de Imagen (opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl ?? ""}
                onChangeText={(text) => updateField("imageUrl", text)}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Preview */}
          {formData.name && (
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>Vista Previa</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewIcon}>
                    <Package size={20} color="#2563EB" />
                  </View>
                  <View style={styles.previewInfo}>
                    <Text style={styles.previewName}>{formData.name}</Text>
                    <Text style={styles.previewCategory}>
                      {selectedCategory}
                    </Text>
                  </View>
                  <View style={styles.previewPrice}>
                    <Text style={styles.previewPriceText}>
                      €{formData.price?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </View>
                <View style={styles.previewDetails}>
                  <View style={styles.previewDetailItem}>
                    <Text style={styles.previewDetailLabel}>Stock</Text>
                    <Text style={styles.previewDetailValue}>
                      {formData.currentStock}{" "}
                      {unitTypes.find((u) => u.id === formData.unitId)?.symbol}
                    </Text>
                  </View>
                  <View style={styles.previewDetailItem}>
                    <Text style={styles.previewDetailLabel}>Mín</Text>
                    <Text style={styles.previewDetailValue}>
                      {formData.minimumStock}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? isEditMode
                  ? "Actualizando..."
                  : "Creando..."
                : isEditMode
                  ? "Actualizar Producto"
                  : "Crear Producto"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    top: 14,
    zIndex: 1,
  },
  inputWithPadding: {
    paddingLeft: 44,
  },
  currencySymbol: {
    position: "absolute",
    left: 16,
    top: 14,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
    zIndex: 1,
  },
  inputWithCurrency: {
    paddingLeft: 36,
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownIcon: {
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  categoriesGrid: {
    flexDirection: "row",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: "#F0F9FF",
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#2563EB",
    fontWeight: "600",
  },
  unitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  unitChip: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    minWidth: 70,
  },
  unitChipSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#F0F9FF",
  },
  unitSymbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },
  unitSymbolSelected: {
    color: "#2563EB",
  },
  unitName: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  unitNameSelected: {
    color: "#2563EB",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  stockInfo: {
    backgroundColor: "#F0F9FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  stockInfoText: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  previewCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  previewPrice: {
    alignItems: "flex-end",
  },
  previewPriceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  previewDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  previewDetailItem: {
    alignItems: "center",
  },
  previewDetailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  previewDetailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
