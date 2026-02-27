package GreenSwap.GreenSwap.service;

import GreenSwap.GreenSwap.model.Category;
import java.util.List;

public interface CategoryService {
  List<Category> getAllCategories();
  void createCategory(Category category);

}
