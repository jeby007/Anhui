var phantom = require('phantom');

const transformPdf = {

	htmlToPdf: function() {
		phantom.create().then(function(ph) {
		    ph.createPage().then(function(page) {
		        page.open("https://tech.meituan.com/2018/01/19/mybatis-cache.html").then(function(status) {
		            page.property('viewportSize',{width: 1000, height: 500});
		            page.render('D:/oracle10000.pdf').then(function(){
		                ph.exit();
		            }); 
		        });
		    });
		});
	}
}
export default transformPdf
