var utils = {

		addClass: function(selector,addclass) {
			$(selector).each(function() {
				$(this).attr('class',$(this).attr('class')+' '+addclass);
			});
		},

		removeClass: function(selector,rmclass) {
			$(selector).each(function() {
				var previous = $(this).attr('class');
				if (previous)
					$(this).attr('class',previous.replace(' '+rmclass,''));
				
			});
		},

		getUniqueId: function() {
			if (!('uniqueId' in this))
				this.uniqueId = 0;
			
			this.uniqueId++;
			return this.uniqueId;
		}

};

SVGElement.prototype.addClass = function (className) {
  if (!this.hasClass(className)) {
    this.setAttribute('class', this.getAttribute('class') + ' ' + className);
  }
};