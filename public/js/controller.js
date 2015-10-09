'use strict';

var refresh = function() {
	this.$set('stocks', []);
	this.$set('httpLoading', true); // should be handled globally, on http?
	this.$http.get('/stocks', function (stocks /*, status, request*/) {
		this.$set('stocks', stocks);
		this.$set('httpLoading', false);
	}).error(function (/*data, status, request*/) {
		// handle error
		this.$set('httpLoading', false);
	});

};

new Vue({
	el: '#app',
	data: {
		stocks: [],
		httpLoading: false
	},
	methods: {
		refresh: refresh,
	},
	ready: refresh
});
