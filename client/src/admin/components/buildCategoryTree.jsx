export const buildCategoryTree = (categories, parentId = null) => {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id)
    }));
};  