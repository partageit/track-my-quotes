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
		percent: function(a, b) {
			return ((a / b) * 100) - 100;
		},
		enableSimulation(stock) {
			if (!stock.backupDayPrice) {
				stock.backupDayPrice = stock.day.price;
			}
			stock.$set('simulate', true);
			console.log(this);
			this.toggleDetail(stock, true);
		},
		disableSimulation(stock) {
			stock.day.price = stock.backupDayPrice;
			stock.$set('simulate', false);
		},
		toggleDetail(stock, show) {
			if (show === undefined) {
				show = !stock.showDetail;
			}
			stock.$set('showDetail', show);
		}
	},
	ready: refresh
});
