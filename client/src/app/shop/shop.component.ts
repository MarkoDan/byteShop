import { Component } from '@angular/core';
import { Product } from '../shared/models/product';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Category } from '../shared/models/category';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent {
  products : Product[] = [];
  brands : Brand[] = [];
  categories : Category[] = [];
  shopParams = new ShopParams();
  sortOptions = [

    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDesc'},
  ];
  totalCount = 0;
  

  constructor(private shopService: ShopService) {}
  
  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getCategories();
  }


  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: response => this.brands = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  getCategories() {
    this.shopService.getCategories().subscribe({
      next: response => this.categories = [{id: 0, name: 'All'}, ...response],
      error: error => console.log(error)
    })
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onCategorySelected(categoryId: number) {
    this.shopParams.categoryId = categoryId;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page)
    {
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }
  }

} 
