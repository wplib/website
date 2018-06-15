$(function() {
	$('a:not([data-method="true"])').on('click', function(event) {
		event.preventDefault();
		return false;
	});
});