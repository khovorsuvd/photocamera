(function() {
	
	/*
	 * Модуль, который добавляет обработку события нажатия клавиши на input'ы,
	 * которые имеют аттрибут data-type-price (содержимое аттрибута не учитывается);
	 * Шаблон наложения XXX XXX ... XXX, где X - цифра.
	 */
	
	var inputs = document.getElementsByTagName('input');
	
	Array.prototype.forEach.call(inputs, function(elem) {
		if (!elem.hasAttribute('data-type-price')) return;
		
		elem.addEventListener("keydown", function(event) {
			
			// Добавлено ассинхронное поведение, чтобы у элемента вставилась цифра/буква
			// и сразу же после этого действия можно было обрабатывать новую строку
			setTimeout(function(elem) {
				var line = elem.value.replace(/[^\d]/g, '');
				line = line.replace(/^0+/, '');
				if (line == 0) line = "";
				var digArray = [];
				
				for (var i = line.length - 3; i > 0; i -= 3) {
					digArray.unshift(line.substr(i, 3));
				}
				
				digArray.unshift(line.substr(0, i + 3));
				
				line = digArray.join(' ').trim();
				elem.value = line;
			}, 0, this);
		});
	});
	
})();