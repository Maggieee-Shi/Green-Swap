package GreenSwap.GreenSwap.Controller;

import GreenSwap.GreenSwap.model.Category;
import GreenSwap.GreenSwap.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class CategoryController {

  @Autowired
  private CategoryService categoryService;

  @GetMapping("/api/public/categories")
  public ResponseEntity<List<Category>> getAllCategories() {
    List<Category> categories = categoryService.getAllCategories();
    return new ResponseEntity<>(categories,HttpStatus.OK);
  }

  @PostMapping("/api/public/categories")
  public ResponseEntity<String> createCategory(@RequestBody Category category) {
    categoryService.createCategory(category);
    return ResponseEntity.ok("Category created successfully");
  }
  @DeleteMapping("/api/public/categories/{categoryId}")
  public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
    try{
    String status = categoryService.deleteCategory(categoryId);
    return new ResponseEntity<>(status, HttpStatus.OK);
  } catch (ResponseStatusException e) {
    return new ResponseEntity<>(e.getReason(),e.getStatusCode());
  }
  }

  @PutMapping("/api/public/categories/{categoryId}")
  public ResponseEntity<String> updateCategory(@RequestBody Category category,
                                                @PathVariable Long categoryId) {
    try {
      Category savedCategory = categoryService.updateCategory(category,categoryId);
      return new ResponseEntity<>("Category with CategoryId " + savedCategory.getCategoryId() + " updated successfully", HttpStatus.OK);
    } catch (ResponseStatusException e) {
      return new ResponseEntity<>(e.getReason(), e.getStatusCode());
    }
  }
}
