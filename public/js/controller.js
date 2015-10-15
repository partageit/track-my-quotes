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
		httpLoading: false,
		sortField: 'purchase.date',
		sortOrder: '',
		orderFilters: [
			{label: 'Purchase date', field: 'purchase.date', order: ''},
			{label: 'Variation since purchase', field: 'variations.sincePurchase', order: 'reverse'},
			{label: 'Name', field: 'name', order: ''}
		]
	},
	methods: {
		refresh: refresh,
		percent: function(a, b) {
			return ((a / b) * 100) - 100;
		},
		enableSimulation: function(stock) {
			if (!stock.backupDayPrice) {
				stock.backupDayPrice = stock.day.price;
			}
			stock.$set('simulate', true);
			this.toggleDetail(stock, true);
		},
		disableSimulation: function(stock) {
			stock.day.price = stock.backupDayPrice;
			stock.$set('simulate', false);
		},
		toggleDetail: function(stock, show) {
			if (show === undefined) {
				show = !stock.showDetail;
			}
			stock.$set('showDetail', show);
		},
		changeOrder: function(orderFilter) {
			this.$set('sortField', orderFilter.field);
			this.$set('sortOrder', orderFilter.order);
		}
	},
	ready: refresh
});
