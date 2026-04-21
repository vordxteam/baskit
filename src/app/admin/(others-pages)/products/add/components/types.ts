export const statusOptions = ["ACTIVE", "INACTIVE"] as const;

export const colorOptions = {
  ribbon: ["#FF0000", "#FFD700", "#8B5CF6", "#EC4899", "#F97316", "#111827"],
  net: ["#FFFFFF", "#F3F4F6", "#F9FAFB", "#E5E7EB", "#FDE68A"],
  product_color: ["#FF0000", "#FFFFFF", "#FFD700", "#FFC0CB", "#8B5CF6", "#10B981"],
} as const;

export type ProductTypeOption = {
  id: string;
  name: string;
};

export type ProductStyleOption = {
  id: string;
  name: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type SizeTemplateOption = {
  id: string;
  product_type_id: string;
  product_type_name: string;
  size_code: string;
  label: string;
  is_active: boolean;
  min_items: number | null;
  max_items: number | null;
};

export type MediaFormItem = {
  file: File;
  previewUrl: string;
  alt_text: string;
  is_primary: boolean;
};

export type SizeItemForm = {
  catalog_item_id: string;
  quantity: string;
};

export type SizeForm = {
  size_template_id: string;
  items: SizeItemForm[];
  colors: {
    ribbon: string[];
    net: string[];
    product_color: string[];
  };
  fillers: string[];
};

export type ProductForm = {
  product_type_id: string;
  product_style_ids: string[];
  category_ids: string[];
  name: string;
  short_description: string;
  description: string;
  status: (typeof statusOptions)[number];
  media: MediaFormItem[];
  sizes: SizeForm[];
};

export type FormErrors = {
  product_type_id?: string;
  product_style_ids?: string;
  category_ids?: string;
  name?: string;
  short_description?: string;
  description?: string;
  media?: string;
  sizes?: string;
};

export type SizeErrors = Record<string, string>;

export const initialForm: ProductForm = {
  product_type_id: "",
  product_style_ids: [],
  category_ids: [],
  name: "",
  short_description: "",
  description: "",
  status: "ACTIVE",
  media: [],
  sizes: [],
};

export const createEmptySizeForm = (sizeTemplateId: string): SizeForm => ({
  size_template_id: sizeTemplateId,
  items: [{ catalog_item_id: "", quantity: "" }],
  colors: {
    ribbon: [],
    net: [],
    product_color: [],
  },
  fillers: [""],
});

