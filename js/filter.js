(function(global) {
	var tempFragment = document.createDocumentFragment();
	
	var allProducts = getProducts();
	var tempProducts = allProducts;
	var filterList = [];
	var conditionList = [];
	
	allProducts = sortElem(allProducts);
	insertProductList(allProducts);
	
	var Filter = {};
	Filter.getProductsFromParam = getProductsFromParam;
	Filter.insertProducts = insertProductList;
	Filter.addButton = addButtonToFilter;
	Filter.addCondition = addConditionToFilter;

	global.Filter = Filter;
	
	function addConditionToFilter(elem, field, condition) {
		var self = {};
		self.value = undefined;
		self.elem = elem;
		
		self.change = function(value) {
			this.value = value;
			tempProducts = filterProducts();
			tempProducts = filterProductsToConditions();
			
			toDocumentFragment();	
			insertProductList(tempProducts);
		}
		
		conditionList.push(self);
		elem.setAttribute("data-filter-type", field);
		elem.setAttribute("data-filter-condition", condition);
		
		return self;
	}
	
	function filterProductsToConditions() {
		for (var i = 0; i < conditionList.length; i++) {
			var elem = conditionList[i];
			if (elem.value == undefined) continue;
			var field = elem.elem.getAttribute("data-filter-type");
			var condition = elem.elem.getAttribute("data-filter-condition");

			tempProducts = getProductsFromCondition(field, condition, elem.value, tempProducts);
		}
		
		return tempProducts;
	}
	
	function getProductsFromCondition(field, condition, value, productList) {
		if (productList == undefined) {
			var productList = allProducts;
			toDocumentFragment();
		}

		var _products = productList.filter(function(elem) {
			if (condition == "less" && elem[field] <= value) 
				return true;
			else if (condition == "more" && elem[field] >= value) 
				return true;
			else return false;
		});
		
		return sortElem(_products);
	}
	
	function addButtonToFilter(button, type) {
		filterList.push(button);
		button.setAttribute("data-filter", "");
		button.setAttribute("data-filter-type", type);
		
		button.addEventListener("click", function(event) {
			event = event || window.event;
			event.preventDefault();
			var target = event.target || event.srcElement;
			if (target.tagName != "A") return;
			
			var oldParam = button.getAttribute("data-filter");
			var li = button.getElementsByClassName('selection_content')[0].getElementsByTagName("LI")[0];
			
			if (oldParam == "") {
				li.style.display = "block";
			}

			var param = target.getAttribute("data-filter");
			button.setAttribute("data-filter", param);
			tempProducts = filterProducts();
			tempProducts = filterProductsToConditions();
			toDocumentFragment();
			
			if (param == "") {
				param = button.getAttribute("data-filter-default");
				li.style.display = "none";
			}
			var header = button.getElementsByClassName('selection_header')[0];
			header.innerHTML = param;
			
			insertProductList(tempProducts);
		});
	}
	
	function filterProducts() {
		var tempProducts = allProducts;
		
		for (var i = 0; i < filterList.length; i++) {
			var elem = filterList[i];
			var field = elem.getAttribute("data-filter-type");
			var param = elem.getAttribute("data-filter");

			if (param != "") {
				tempProducts = getProductsFromParam(field, param, tempProducts);
			}
		}
		
		return tempProducts;
	}
	
	function toDocumentFragment() {	
		for (var i = 0; i < allProducts.length; i++) {
			tempFragment.appendChild(allProducts[i].elem);
		}
	}
	
	function getProductsFromParam(field, param, productList) {
		if (productList == undefined) {
			var productList = allProducts;
			toDocumentFragment();
		}
		param = param.toLocaleLowerCase();
		var _products = productList.filter(function(elem) {
			if (elem[field].toLocaleLowerCase() == param) {
				return true;
			} else {
				return false;
			}
		});
		
		return sortElem(_products);
	}
	
	function getProducts() {
		var parent = document.getElementById('products');
		var tempProducts = parent.getElementsByClassName('product');
		var products = [];

		for(var i = 0; i < tempProducts.length; i++) {
			var elem = tempProducts[i];
			if (elem.classList.contains('product_col-0')) continue;
			var infoBlock = elem.getElementsByClassName('filter_block')[0];

			var capacity = elem.classList.contains('product_col-2') ? 2 : 1;
			var product = {
				elem: elem,
				capacity: capacity
			};
			
			var filter = infoBlock.getElementsByTagName('DIV');
			
			for (var j = 0; j < filter.length; j++) {
				var className = filter[j].className;
				var value = filter[j].textContent;
				
				product[className] = value;
			}

			products.push(product);
		}
		
		return products;
	}
	
	function insertProductList(list) {
		var error = document.getElementById('products_error');
		var parent = document.getElementById('products');
		if (list.length == 0) {
			list = allProducts;
			error.style.display = "block";
		} else error.style.display = "none";
		for (var i = 0; i < list.length; i++) {
			parent.appendChild(list[i].elem);
		}
		global.ProductAdder.resize();
	}
	
	function sortElem(products) {	
		var errors = 0;
		var _products = [];
		var totalCapacity = 0;
		var doubleProductInARow = 0;
		var countSimple = 3;

		while (products.length > 0) {
			var elem = products[0];
			if ((elem.capacity == 2) && (countSimple >= 3) && ((elem.capacity + totalCapacity - 1) % 3 != 0) || (elem.capacity == 1)) {
				if (elem.capacity == 1) { 
					doubleProductInARow = 0;
					countSimple++;
				} else countSimple = 0;
				_products.push(elem);
				products.splice(0, 1);
				totalCapacity += elem.capacity;
			} else {
				doubleProductInARow++;
				
				var elem = products.splice(0, 1)[0];
				products.splice(doubleProductInARow, 0, elem);
				
				errors++;
				
				if (errors == 100) {
					if (checkLastProducts(products)) {
						_products = _products.concat(products);
						products = [];
					} else errors = 0;
				} 
			}
		}
		return _products;
	}
	
	function checkLastProducts(products) {
		return products.every(function(elem) {
			return elem.capacity == 2 ? true : false;
		});
	}
	
})(this);