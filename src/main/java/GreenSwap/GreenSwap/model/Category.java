package GreenSwap.GreenSwap.model;

public class Category {
  private Long categoryId;

  public Long getCategoryId() {
    return categoryId;
  }

  public Category(Long categoryId, String categoryName) {
    this.categoryId = categoryId;
    this.categoryName = categoryName;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  private String categoryName;

}
