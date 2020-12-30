import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
//  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = []
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  pageSize: number = 5;
  totalElements: number = 0;
  pageNumber = 1;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => { 
      this.listProducts()
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts()
    }else{
      this.handleListProducts()
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );

  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
        this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }else{
      this.currentCategoryId = 1;
    }
    //
    //Check if we have a different category than the previous 
    //Note: Angular will reuse a component if it is currently being viewed
    //

    //If we have a different category id than the previous 
    //then set the pageNumber back to 1
    if (this.currentCategoryId != this.previousCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);


    this.productService.getProductListPaginate(this.pageNumber - 1, 
                                                this.pageSize, 
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }

  processResult() {

    return data => {
      this.products = data._embedded.products;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
      this.pageNumber = data.page.number + 1;

    }

  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber=1;
    this.listProducts();
  }

  addToCart(product: Product) {

    console.log(`Adding new product to cart: ${product.name}, ${product.unitPrice}`);

    let newCartItem: CartItem = new CartItem(product);

    this.cartService.addToCart(newCartItem);

  }

}