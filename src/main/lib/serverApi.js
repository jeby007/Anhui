var http = require('http');
var https = require("https"); 
var request = require('request');
var querystring = require('querystring');

const serverApi = {

	/*
		get请求
	*/
	get: function(url, success, error) {
		http.get(url, (res) => {
			if (res.statusCode == 200) {
				let data = '';
				res.on('data', (chunk) => { 
					data += chunk;
				});

				res.on('end', function() {
					let _data = JSON.parse(data);
					success(_data);
				});
			} else {
				error(res.statusCode);
			}		
		}).on('error', e => {
			error(e);
		});
	}, 

	/*
		gets请求
	*/
	gets: function(url, success, error) {
		https.get(url, (res) => {
			if (res.statusCode == 200) {
				let data = '';
				res.on('data', (chunk) => { 
					data += chunk;
				});
				res.on('end', function() {
					let _data = JSON.parse(data);
					success(_data);
				});
			} else {
				error(res.statusCode);
			}
		}).on('error', e => {
			error(e);
		});
	},

	/*
		HTTPS.POST请求
	*/
	post: function(url, params, success, error) {
		if (!error) {
			error = function(err) {
				logger.info("----------Http请求异常, error: ", err);
			}
		}
		request({
	        url: url,
	        method: "POST",
	        json: true,
	        headers: {
	            "content-type": "application/json",
	        },
	        body: params
	    }, function(err, response, body) {
	        if (!err && response.statusCode == 200) {
	            success(body);
	        } else {
	        	error(err);
	        }
	    });
	}
}

export default serverApi	