(function(global) {
	
	/*
	 * Модуль, который добавляет недостающие товары
	 */
	
	addEmptyBlock();
	resize();
	
	// Добавление пустых блоков для "двойных" товаров
	function addEmptyBlock() {
		var products = document.getElementsByClassName('product_col-2');
		Array.prototype.forEach.call(products, function(elem) {
			var newNode = document.createElement('div');
			newNode.classList.add('product');
			newNode.classList.add('product_col-0');
			newNode.classList.add('product_active');
			elem.parentElement.insertBefore(newNode, elem);
		});
	}
	
	// Обработчик на изменение размеров экрана для учёта количества товаров в сетке
	window.addEventListener('resize', resize);
	
	// Функция удаления пустых товаров
	function removeEmptyProducts() {
		var products = document.getElementsByClassName('product_col-0');
		if (products.length == 0) return;
		
		while(products.length > 0)
			products[0].parentElement.removeChild(products[0]);
	}
	
	// Функция добавления пустых последних товаров
	function addEmptyProducts(count) {
		removeEmptyProducts();
		addEmptyBlock();
		
		var products = document.getElementsByClassName('product');
		var length = products.length;
		if (length <= 0) return;
		var parent = products[0].parentElement;
		
		while (length % count != 0) {
			var newNode = document.createElement('div');
			newNode.classList.add('product');
			newNode.classList.add('product_col-0');
			newNode.classList.add('product_last');
			newNode.classList.add('product_active');
			parent.insertBefore(newNode, null);
			length++;
		}
	}
	
	function resize() {
		var width = document.documentElement.clientWidth;
		
		if (width > 1024) {
			addEmptyProducts(4);
		} else if (width <= 1024 && width > 768) {
			addEmptyProducts(3);
		} else if (width <= 768 && width > 421) {
			addEmptyProducts(2);
		}  else if (width <= 421) {
			addEmptyProducts(1);
		}
	}
	
	var ProductAdder = {};
	
	ProductAdder.resize = resize;
	ProductAdder.removeEmptyProducts = removeEmptyProducts;
	
	global.ProductAdder = ProductAdder;
	
})(this);