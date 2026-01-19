// components/CategoryPicker.tsx
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Category } from "../types/Category";

interface Props {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategoryPicker({ categories, selectedCategoryId, onSelectCategory }: Props) {
  return (
    <Picker
      selectedValue={selectedCategoryId}
      onValueChange={onSelectCategory}
    >
      <Picker.Item label="-- Chọn danh mục --" value={null} />
      {categories.map(cat => (
        <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
      ))}
    </Picker>
  );
}
